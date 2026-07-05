---
title: 'Meetup Lab: Service Portal Custom Variables'
description: 'Build custom catalog variable widgets in Service Portal using macros, font-awesome icons, and dynamic field attributes. Step-by-step lab from Cody Esmay and Hunter Wolf.'
date: '2019-08-15'
tags:
  - servicenow
  - service-portal
redirectFrom:
  - /meetup-sp-custom-inputs-lab/
  - /p/2019-08-15-sp-custom-inputs-lab/
---This lab walks through building custom Service Portal catalog variable widgets using a macro variable approach. Authors: Cody Esmay, Hunter Wolf. Cody is a local Minnesota ServiceNow expert and the brains behind this pattern.
_This lab originally from the [sndevs meetups repo](https://github.com/sndevs/meetups) and [hosted on GitHub Pages](https://sndevs.github.io/meetups/)._


## What We Will Build

- A Service Portal Widget used as a macro variable on a catalog item
- The variable uses attribute fields to dynamically set up custom-looking checkboxes with font-awesome icons
- Because this doesn't create new UI elements, it still works with client scripts and UI policies

## Getting Started

1. Open Studio and import the scoped app: `https://github.com/sndevs/snServiceCatalogWidget.git`

### App Branches

| Branch | Description |
|--------|-------------|
| Master | Finished example |
| 0.1 | Starting point with widget created |
| 0.4 | Mid-way — one set of checkboxes replaced with font-awesome icons |
| 0.7 | Finished example (same as Master) |

## Lab 1: Set Up the Widget Server Script

1. Open the `ButtonsWidg` widget
2. Review the [server.js](./0.4.server.js.html) pattern
3. Type it out yourself — learn by doing

## Lab 2: Set Up the Client Script

1. Review the [client.js](./0.4.client.js.html) pattern
2. Implement the client controller that handles checkbox interactions

## Lab 3: Set Up the HTML Template

1. Review the [template.html](./0.4.template.html.html) pattern
2. Build the template that renders custom checkboxes using font-awesome icons

## Lab 4: Variable Attributes

By default the variable attribute field isn't listed on the form. The easiest way to get to it for the lab is to add it to a list.

Once added, you'll notice the first set of checkboxes have:

`button_widget=what_do_widget;icon=fa-icon`

These details are parsed by the widget:
- **Grouping** is dictated by `button_widget=value`
- **Icon** is set by `icon=fa-icon`

Update the first macro to use the `ButtonsWidg` widget and recheck the form — the first set of icons should be working.

![Check in](/assets/images/meetups/sp-inputs/0.4.example.form.png)

## Lab 5: Add a Second Set of Variables

To get a feel for how dynamic this is, add attributes to the second set of checkboxes:

`button_widget=another_widget;icon=fa-icon`

Where:
- `another_widget` is the name of a newly created macro (like `what_do_widget`)
- `fa-icon` uses font-awesome 4.7.0 icon names

Reference: [Font Awesome 4.7.0 Icons](https://fontawesome.com/v4.7.0/icons/)

## Final Check

Request the item from the service catalog — the checkboxes retain their values so they work like regular checkboxes, just with custom styling.

![Final example](/assets/images/meetups/sp-inputs/0.7.example.form.png)
