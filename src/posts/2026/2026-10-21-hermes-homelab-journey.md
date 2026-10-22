---
title: I Built a Team of AI Agents in My Homelab. Then I Gave Them a Manager.
description: How my Hermes setup evolved from individual bots into a Git-managed fleet with kitchens, a task board, and a chief of staff.
date: '2026-10-21'
tags:
  - thoughts
  - ai
---

I started with a fairly simple idea: what if I could run a few useful AI agents on my own machines?

That turned into a fleet of bots, a management hierarchy, a deployment pipeline, a task board, and a desktop view I call the Village. It's still a work in progress. Here's the path I took, and enough of the architecture that another Hermes user could hand this to their own bot and start building something similar.

## 1. One bot is easy. Keeping several consistent is not.

[Hermes](https://github.com/NousResearch/hermes-agent) gave me a way to run agents locally. But once I had bots on multiple machines, the hard part wasn't prompting. It was answering basic questions: Which bot lives where? Which version of its skills is installed? Is it working on anything? What happens if I update a profile?

I have Pro and Elite machines. I wanted each machine to be useful, but I didn't want a pile of hand-edited configurations that I couldn't reproduce.

## 2. I separated the bots from the machines.

That was the first important design choice.

In [hermes-agents](https://github.com/jacebenson/hermes-agents), I keep agent identities, skills, tests, and a roster. In [homelab](https://github.com/jacebenson/homelab), I keep infrastructure concerns: host placement, provisioning, services, and deployment.

A bot's identity shouldn't need to know which physical computer runs it. And replacing a machine shouldn't mean rewriting the bot.

The roster tells the system what should exist. The infrastructure makes it exist.

## 3. I organized the work into kitchens.

Rather than ask one giant agent to do everything, I started using Head Chefs to coordinate specialists. A kitchen is a group of bots with a defined place in the fleet. Specialists can focus on things like Rails work, video production, or thumbnails.

That also introduced a problem: delegation isn't completion. A bot saying “done” doesn't prove an artifact exists, a test passed, or the change made it into Git.

So I started putting more emphasis on explicit assignments, durable task records, verifiable outputs, and a review step before deployment.

## 4. Then I gave the fleet a chief of staff.

I call her **Holly Folly**. Holly helps coordinate work across the kitchens rather than becoming another specialist who does every task herself.

I connected ChatGPT to Holly through a small MCP bridge. That means I can ask for a task to be submitted, get a task ID, and check its status. The bridge records the request; Holly's dispatcher picks it up. Those are different steps, and I don't treat “queued” as “finished.”

There's a Kanban board behind the work, too. This is where the system started feeling less like a collection of chat windows and more like an actual operation.

## 5. I wanted to see the whole thing.

I built [omarchy.jace.fleet](https://github.com/jacebenson/omarchy.jace.fleet), a desktop plugin for my Omarchy setup. Its Village view is intended to show machines, kitchens, bots, and their tasks.

It's useful, but not magical. A task board can say something is running while the live machine-level picture is incomplete. I'm still improving how status, freshness, and actual execution get reconciled.

## 6. Deployment was harder than I expected.

At first, updating bot definitions meant proposing a version bump in the infrastructure repo. That created a lot of pull requests for what might be a tiny skill edit.

The newer approach uses a dedicated runner and a roster-sync tool to stage and apply bot definitions. A test on Pro-3 exposed a subtle bug: the old update command fetched a profile from its recorded source instead of installing the staged files. We fixed the path and proved a temporary skill marker appeared in the live profile, then disappeared after restoring the canonical version.

That's the kind of test I trust more than a green CI check alone.

We're still sorting out which updates should flow through roster sync and which require a reviewed infrastructure deployment. A skill edit should not casually restart a gateway—especially Holly's.

## If you're running Hermes, here's the part to steal.

You don't need my hardware, my bot names, or my desktop plugin. Start with the boundaries:

1. Put bot identities and skills in Git, separate from host-specific configuration.
2. Declare a roster: which profiles belong on which machines, and what they can do.
3. Build a **dry-run-first** sync command. Test it on one noncritical bot before enabling wider applies.
4. Give delegated work durable task IDs, states, and evidence of completion.
5. Put a coordinator in front of the specialists, but keep human approval for merges and production changes.
6. Add a read-only fleet view after the underlying status data is trustworthy.

A useful starter request for your own Hermes bot:

> Review my current Hermes profiles and machines. Propose a Git-backed separation between agent definitions and infrastructure, a declarative roster, a dry-run sync command, and a durable task ledger. Start with one canary bot. Do not change live profiles, credentials, gateways, or deployment automation until I review the plan. Include tests, rollback, and a clear list of what is still manual.

The goal isn't to have AI agents making changes without supervision. It's to stop being the person who has to remember every command, machine, and pending task.

And yes, I'm still figuring parts of it out.
