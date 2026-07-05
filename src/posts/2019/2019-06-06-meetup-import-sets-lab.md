---
title: 'Meetup Lab: Integrate Repeatably Faster with Import Sets'
description: 'Step-by-step lab on using import sets for REST integrations. Flatten JSON, transform data, and build a repeatable integration pattern.'
date: '2019-06-06'
tags:
  - servicenow
  - import-sets
redirectFrom:
  - /meetup-import-sets-lab/
  - /p/2019-06-06-import-sets-lab/
---This lab walks through using import sets to handle complex JSON integrations. Author: Jace Benson.
_This lab originally from the [sndevs meetups repo](https://github.com/sndevs/meetups) and [hosted on GitHub Pages](https://sndevs.github.io/meetups/)._


## Why Import Sets

Integrations are a big part of what we do on the platform. If we follow a few simple steps it can save a lot of time. In the past 6 months my team made integrations to Microsoft Intune, Webex, Solarwinds and Crashplan — because we followed these steps, modifications were simple for all team members.

## Getting Started

1. Open Studio and import the scoped app from: `https://github.com/jacebenson/mn-snug-feb-2019.git`

### App Branches

| Branch | Description |
|--------|-------------|
| Master | Very bare minimum |
| 1 | Includes the Import Set Table |
| 2 | Includes the Script Include to get data and paginate |

## Step 1: Getting the Raw Data

1. Go to [https://randomuser.me/api/](https://randomuser.me/api/) and copy the JSON
2. We need to flatten the object to access each part
3. Go to [https://codebeautify.org/json-to-csv](https://codebeautify.org/json-to-csv) and paste the JSON
4. Download and open in Excel

## What is Flattening?

Before flattening, the nested JSON structure looks complex:

![Flatten before](/assets/images/meetups/import-sets/flatten-pre.PNG)

After flattening, each field becomes a column:

![Flatten after](/assets/images/meetups/import-sets/flatten-post.PNG)

**Checkpoint:** You should have a CSV with flattened columns:

![Checkpoint 1](/assets/images/meetups/import-sets/checkpoint1.png)

## Massaging the CSV

1. Replace `results.0.` with nothing in the column headers
2. Save the file

## Load the Data

Navigate to System Import Sets → Load Data and upload your CSV:

![Import data](/assets/images/meetups/import-sets/import-data.PNG)

**Checkpoint 2:** Verify the import set rows loaded:

![Checkpoint 2](/assets/images/meetups/import-sets/checkpoint2.PNG)

If you don't see the data, switch your branch to `1`.

## Transform That Complex JSON

1. Go to Studio
2. Create Application File → "Table Transform Map"
3. Map Email, First Name, Last Name
4. Coalesce on Email

## Switch to Branch 2

Branch 2 includes a Script Include to flatten objects and paginate results automatically.

## Takeaways

- Following a common import strategy simplifies development for the team
- Allows you to easily massage the data
- Gives your customers visibility into the data you have access to
- REST API integrations can follow this same pattern
- After doing this once, you can easily do it again
