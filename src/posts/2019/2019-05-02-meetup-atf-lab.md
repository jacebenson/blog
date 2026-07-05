---
title: 'Meetup Lab: Automated Test Framework — Test Smarter, Not Harder'
description: 'Full step-by-step ATF lab from the May 2019 ServiceNow Developer Meetup. Create tests, test suites, and validate configurations.'
date: '2019-05-02'
tags:
  - servicenow
redirectFrom:
  - /meetup-atf-lab/
  - /p/2019-05-02-atf-lab/
---This lab from the May 2019 ServiceNow Developer Meetup walks through setting up Automated Test Framework tests for Incident Management requirements. Authors: Mike Hedlund, Scott Halverson.
_This lab originally from the [sndevs meetups repo](https://github.com/sndevs/meetups) and [hosted on GitHub Pages](https://sndevs.github.io/meetups/)._


## Lab Setup

Import the [ATF Demo Update Set](./ATF%20Demo%20Update%20Set.xml) into your instance before starting.

## Create a Test for IM_001

Requirement: The 'ATF is Great' field shall be 'read-only' to all users.

1. Under 'Automated Test Framework' select the 'Test' module and click 'New'
2. Name: `(ATF) IM_001`, Description: *The 'ATF is Great' field shall be 'read-only' to all users.*
3. Add Test Step → Server → **Impersonate** — User: `ITIL User`
4. Add Test Step → Form → **Open a New Form** — Table: `Incident`
5. Add Test Step → Form → **Field State Validation** — Read only: `ATF is Great`
6. Select 'Run Test' and confirm all steps pass

## Create a Test for IM_002

Requirement: The 'ATF Demo Notes' field shall only be visible when the Category field has a value of 'ATF Demo'.

1. Create new Test: `(ATF) IM_002`
2. Add Test Step → Server → **Impersonate** — User: `ITIL User`
3. Add Test Step → Form → **Open a New Form** — Table: `Incident`
4. Add Test Step → Form → **Set Field Values** — Short description: `Test`, Caller: `ITIL User`, Category: `Software`
5. Add Test Step → Form → **Submit a Form** — Assert type: 'Form submitted to server'
6. Add Test Step → Form → **Open an Existing Record** — Reference the record submitted in step 4
7. Add Test Step → Form → **Field State Validation** — Not visible: `ATF demo notes`
8. Add Test Step → Form → **Set Field Values** — Category: `ATF Demo`

![Variable reference](/assets/images/meetups/atf/variables.png)

9. Add Test Step → Form → **Field State Validation** — Visible: `ATF demo notes`
10. Run Test and confirm all steps pass

## Create a Test for IM_003

Requirement: The 'ATF Demo' button shall only be visible to Users with the 'atf_demo' role.

1. Create new Test: `(ATF) IM_003`
2. Add Test Step → Server → **Impersonate** — User: `ITIL User`
3. Add Test Step → Form → **UI Action Visibility** — Not visible: `ATF Demo`
4. Add Test Step → Server → **Impersonate** — User: `Auto Test`
5. Add Test Step → Form → **Open a New Form** — Table: `Incident`
6. Add Test Step → Form → **UI Action Visibility** — Visible: `ATF Demo`
7. Run Test and confirm all steps pass

## Create a Test for IM_004

Requirement: A new section shall be added to the Incident form named 'ATF Demo' with the 'ATF is Great' and 'ATF demo notes' fields.

1. Create new Test: `(ATF) IM_004`
2. Add Test Step → Server → **Record Query** — Table: `sys_ui_section`, Caption: `ATF Demo`
3. Add Test Step → Server → **Record Query** — Table: `sys_ui_element`, Element: `u_atf_is_great`, Sys UI Section.table: `incident`, Sys UI Section: `ATF Demo`
4. Repeat step 3 with Element: `u_atf_demo_notes`
5. Run Test

## Create a Test for IM_005

Requirement: A notification shall be sent to the 'Caller' when an Incident record is created.

1. Create new Test: `(ATF) IM_005`
2. Impersonate User: `ITIL User`
3. Open a new Incident form
4. Set Field Values: Short description: `Test`, Caller: `Auto Test`
5. Submit the form
6. Select custom test config 'Notification Check'
7. Notification: `Incident opened for me`, Document: record from step 4, Recipients: `auto.test@example.com`
8. Run Test

## Create and Run the IM Test Suite

1. Under 'Automated Test Framework' select 'Suites' and click 'New'
2. Name: `IM Test Suite`, Description: `ATF Demo`
3. Add each of the 5 individual Tests to the suite
4. Select 'Run Test Suite' and confirm all pass

![Run tests](/assets/images/meetups/atf/run-tests.png)
