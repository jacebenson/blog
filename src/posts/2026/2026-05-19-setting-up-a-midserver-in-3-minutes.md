---
title: "Setting Up a ServiceNow MID Server in 3 Minutes (No Docker Hub Required)"
description: >-
  Build a ServiceNow MID Server container from the official version-matched recipe instead of pulling a third-party MID image. The script checks network access, reads mid.version, builds the image, and starts it with Docker Compose.
tags:
  - servicenow
date: '2026-05-19'
---
# Building a ServiceNow MID Server container from the official recipe

You can build a MID Server container from the recipe published by ServiceNow instead of pulling a third-party MID image. The instance's `mid.version` property tells you which recipe to download.

This works for both `service-now.com` and `servicenowservices.com` instances. The Docker host must be able to reach the instance and ServiceNow's download host. The downloaded recipe may also use a base image that requires access to a container registry, so inspect its `Dockerfile` before building.

## Before you start

Install Docker with Compose, `curl`, `unzip`, and Python 3 on the Linux host. You also need a ServiceNow account that can read `mid.version` and authenticate the MID Server.

The Docker host must reach these endpoints over HTTPS:

- Your ServiceNow instance
- `install.service-now.com`
- Any container registry required by the downloaded recipe's `Dockerfile`

The database or other target system must also be reachable from the MID container on its actual listener port.

### Test the network from the Docker host

If you use Ubuntu in WSL2 behind a corporate VPN, do not assume a successful Windows browser or PowerShell test means Ubuntu can connect. Test from Ubuntu first:

```bash
getent hosts example.service-now.com
curl -v --connect-timeout 10 https://example.service-now.com/
getent hosts install.service-now.com
curl -v --connect-timeout 10 https://install.service-now.com/
```

An HTTP redirect or login page proves the HTTPS connection works. A DNS failure or TCP timeout does not. Replace the example hostname with your own.

If Windows works on the VPN but Ubuntu times out, fix the WSL and VPN routing or policy with your network team, or use an approved host that has access. Reinstalling Docker, disabling the firewall, or changing this script will not fix a blocked network path.

## Set up the instance and credentials

Create `.env` in the same directory as `mid.sh`. In that directory, run `umask 077`, then open the file in an editor:

```bash
umask 077
nano .env
```

Put these assignments in the file. Replace the placeholders with your instance and MID account:

```bash
servicenow_instance="example.service-now.com"
mid_username="your-mid-user"
mid_password="your-password"
```

For a `servicenowservices.com` instance, use `example.servicenowservices.com`. A short name such as `example` also works and expands to `example.service-now.com`.

Because `mid.sh` sources `.env`, use valid Bash assignments with no spaces around `=`. Quote passwords that contain shell-special characters. Do not run `.env` by itself.

Then run:

```bash
chmod 600 .env
chmod +x mid.sh
./mid.sh
```

Add `.env` to `.gitignore`. Do not commit it or post its contents in logs or tickets. Compose substitutes the credentials at startup, so they are not written as literal values in the generated YAML. They are still available to Docker and users with Docker access. Use an approved secret-management approach for production deployments.

Rerun `mid.sh` rather than running `docker compose up` separately. The script exports the values Compose needs for that invocation.

## The script

Save this as `mid.sh` alongside `.env`. Run it from an account allowed to use Docker.

```bash
#!/usr/bin/env bash
set -euo pipefail

cd -- "$(dirname -- "${BASH_SOURCE[0]}")"

if [[ ! -f ./.env ]]; then
  echo "ERROR: Create .env next to mid.sh with servicenow_instance, mid_username, and mid_password." >&2
  exit 1
fi

# shellcheck disable=SC1091
source ./.env

mid_display_name="${mid_display_name:-my-mid}"
mid_server_name="${mid_server_name:-docker_mid_server}"
servicenow_instance="${servicenow_instance:-}"
mid_username="${mid_username:-}"
mid_password="${mid_password:-}"

if [[ -z "$servicenow_instance" || -z "$mid_username" || -z "$mid_password" ]]; then
  echo "ERROR: Set servicenow_instance, mid_username, and mid_password in .env." >&2
  exit 1
fi

case "$servicenow_instance" in
  https://*) instance_host="${servicenow_instance#https://}" ;;
  http://*|*://*)
    echo "ERROR: Only HTTPS instance URLs are supported." >&2
    exit 1
    ;;
  *) instance_host="$servicenow_instance" ;;
esac

instance_host="${instance_host%/}"
if [[ "$instance_host" != *.* ]]; then
  instance_host="${instance_host}.service-now.com"
fi

if [[ ! "$instance_host" =~ ^[[:alnum:]-]+(\.[[:alnum:]-]+)+$ || "$instance_host" == *..* ]]; then
  echo "ERROR: Provide a short instance name or HTTPS hostname without a path or port." >&2
  exit 1
fi

instance_url="https://${instance_host}"

for command_name in curl unzip docker; do
  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "ERROR: Missing prerequisite: $command_name" >&2
    exit 1
  fi
done

if ! docker info >/dev/null 2>&1; then
  echo "ERROR: Docker is not available to this user." >&2
  exit 1
fi

# Test the network before touching an existing MID container.
if ! curl -sS --connect-timeout 10 --max-time 30 -o /dev/null "${instance_url}/"; then
  echo "ERROR: Cannot reach ${instance_url} from this host. Check DNS, VPN, and TCP 443." >&2
  exit 1
fi

if ! curl -sS --connect-timeout 10 --max-time 30 -o /dev/null "https://install.service-now.com/"; then
  echo "ERROR: Cannot reach install.service-now.com from this host." >&2
  exit 1
fi

echo "Querying ${instance_host} for the MID version..."
api_url="${instance_url}/api/now/table/sys_properties?sysparm_query=name=mid.version&sysparm_fields=value&sysparm_limit=1"

if ! response=$(curl -fsS --connect-timeout 10 --max-time 60 \
  --header 'Accept: application/json' \
  --user "${mid_username}:${mid_password}" "$api_url"); then
  echo "ERROR: MID version lookup failed. Check API access and credentials." >&2
  exit 1
fi

release_name=$(printf '%s' "$response" | cut -d'"' -f6)
if [[ -z "$release_name" ]]; then
  echo "ERROR: No MID version found in the API response." >&2
  exit 1
fi

if [[ ! "$release_name" =~ ^[a-zA-Z0-9._-]+$ ]]; then
  echo "ERROR: Unexpected MID release name." >&2
  exit 1
fi

# The last date in the release name identifies the recipe directory.
build_date=$(printf '%s\n' "$release_name" | grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}|[0-9]{2}-[0-9]{2}-[0-9]{4}' | tail -n 1 || true)
if [[ -z "$build_date" ]]; then
  echo "ERROR: MID release name has no build date." >&2
  exit 1
fi

IFS='-' read -r first second third <<< "$build_date"
if [[ "$first" =~ ^[0-9]{4}$ ]]; then
  rel_year="$first"
  rel_month="$second"
  rel_day="$third"
else
  rel_month="$first"
  rel_day="$second"
  rel_year="$third"
fi

filename="mid-linux-container-recipe.${release_name}.linux.x86-64.zip"
recipe_url="https://install.service-now.com/glide/distribution/builds/package/app-signed/mid-linux-container-recipe/${rel_year}/${rel_month}/${rel_day}/${filename}"
work_dir=$(mktemp -d)
trap 'rm -rf -- "$work_dir"' EXIT

echo "Downloading ${filename}..."
curl -fSL --connect-timeout 10 --max-time 300 "$recipe_url" -o "${work_dir}/${filename}"
unzip -q "${work_dir}/${filename}" -d "${work_dir}/recipe"

image="${mid_server_name}:${release_name}"
docker build --tag "$image" "${work_dir}/recipe"

mkdir -p ./export

# Docker Compose substitutes these values at startup. Do not write passwords into the YAML.
export MID_INSTANCE_URL="${instance_url}/"
export MID_INSTANCE_USERNAME="$mid_username"
export MID_INSTANCE_PASSWORD="$mid_password"
export MID_SERVER_NAME="$mid_display_name"
umask 077

cat > docker-compose.yaml <<EOF
services:
  ${mid_server_name}:
    container_name: ${mid_server_name}
    image: ${image}
    restart: unless-stopped
    volumes:
      - ./export:/opt/snc_mid_server/agent/export
    environment:
      MID_INSTANCE_URL: \${MID_INSTANCE_URL}
      MID_INSTANCE_USERNAME: \${MID_INSTANCE_USERNAME}
      MID_INSTANCE_PASSWORD: \${MID_INSTANCE_PASSWORD}
      MID_SERVER_NAME: \${MID_SERVER_NAME}
EOF

chmod 600 docker-compose.yaml
docker compose up -d

echo "Check the MID Server at ${instance_url}/ecc_agent_list.do"
```

The script builds before asking Compose to replace the existing container. A failed preflight, version lookup, download, or build leaves the current container alone. Container recreation can still cause a short interruption. For critical MID workloads, plan redundancy instead of treating a local rebuild as zero downtime.

## Check the MID's actual network path

The host test checks only the Linux host. After startup:

1. Confirm the MID appears Up in ServiceNow.
2. Check the logs with `docker compose logs --tail=100`.
3. Test name resolution and TCP access from the running container using tools available in the image.
4. Test the database hostname and listener port from both the host and the MID container.

Do not assume utilities such as `nc` are installed in the image. Use the diagnostic tools the image provides, or temporarily run a separate diagnostic container on the same network.

On WSL2, Windows, Ubuntu, and Docker can have different network paths, especially while a VPN is connected. If Windows reaches the instance but Ubuntu cannot, stop and resolve the VPN, WSL routing, or network policy issue. No MID script can grant access the VPN does not provide.

## What this approach does and does not solve

This approach removes the dependency on pulling a third-party MID image from Docker Hub. It does not make the deployment air-gapped. The Docker host still needs access to the ServiceNow instance, `install.service-now.com`, and any registry named by the downloaded recipe's base image.

It also does not replace a secret manager. The credentials are passed to Docker at startup and remain visible to users with sufficient Docker access. That is acceptable for a local test, but production deployments need the secret handling required by your environment.
