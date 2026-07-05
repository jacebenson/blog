---
title: 'Meetup Lab: Service Portal Killer UX — Build a Notes App'
description: 'Full step-by-step lab building a CRUD notes app in Service Portal. Learn widgets, events, SP instance, and real-time updates.'
date: '2019-09-12'
tags:
  - servicenow
  - service-portal
redirectFrom:
  - /meetup-sp-killer-ux-lab/
  - /p/2019-09-12-sp-killer-ux/
---Build a full CRUD notes application in Service Portal. This lab covers list widgets, body widgets, event broadcasting, inline editing, filters, create, and delete.
_This lab originally from the [sndevs meetups repo](https://github.com/sndevs/meetups) and [hosted on GitHub Pages](https://sndevs.github.io/meetups/)._


## Prep: Install the Update Set

1. Get your PDI at [developer.servicenow.com](https://developer.servicenow.com)
2. Download and install the CreateNotes XML update set
3. Set default value on `x_snc_createnotes_note.user`: `javascript:gs.getUserID();`

## Lab 0: Explore the Notes App

Take a look at the custom Notes application and create some demo data. Make sure notes have all fields set.

## Lab 1: Create Notes List Widget

Create a custom widget that displays the list of notes. Broadcast the `sys_id` of the selected note when clicked.

1. Launch the CreateNotes portal
2. CTRL+Right Click on the Notes List widget box → Widget in Editor
3. Enable HTML Template, Client Script, and Server Script sections

### Server Script

Add code to query the notes table and return data to the client.

![Server script](/assets/images/meetups/sp-ux/L1-4.PNG)

### View $scope.data

Reload the portal. CTRL+Right click on the widget and inspect `$scope.data` to verify the server data is reaching the client.

### HTML Template

Populate the notes onto the page:

![HTML template](/assets/images/meetups/sp-ux/L1-5.PNG)

### Add ng-click

![ng-click](/assets/images/meetups/sp-ux/L1-7.PNG)

### Broadcast Selected Note

Add the client script to broadcast the selected note's ID:

![Broadcast](/assets/images/meetups/sp-ux/L1-8-1.PNG)

![Broadcast cont](/assets/images/meetups/sp-ux/L1-8-2.PNG)

### Verify

Click on notes. You should see "Note ID: SYS_ID" in the console.

![Verify](/assets/images/meetups/sp-ux/L1-9.PNG)

## Lab 2.1: Configure Note Body Widget

Configure the widget that shows the content of the selected note.

1. Change the current widget to the Note Body widget
2. Add event listener for the broadcast:

![Event listener](/assets/images/meetups/sp-ux/L21-2.PNG)

### Get Content from Server

Add client script to call `c.server.get()`:

![Client get](/assets/images/meetups/sp-ux/L21-3.PNG)

### Server Script

Use the input object to get GlideRecord data:

![Server script](/assets/images/meetups/sp-ux/L21-4.PNG)

### HTML Template

Show the data in a panel:

![HTML template](/assets/images/meetups/sp-ux/L21-5.PNG)

### Make it Pretty

![Pretty](/assets/images/meetups/sp-ux/L21-6.PNG)

### Verify

Click a note — it should load on the right:

![Verify](/assets/images/meetups/sp-ux/L21-7.PNG)

## Lab 2.2: Auto-Save on Typing

Configure the body widget to auto-update notes as you type.

### HTML Attributes

Add trigger attributes to input and textarea fields:

![HTML input](/assets/images/meetups/sp-ux/L21-8.PNG)

### Client Script

Add function to run when fields change:

![Client script](/assets/images/meetups/sp-ux/L22-2.PNG)

### Server Script

Write changes back to the server:

![Server script](/assets/images/meetups/sp-ux/L22-3.PNG)

### Verify

Change a title, wait a few seconds, refresh. The title should persist.

## Lab 3.1: Real-Time Title Updates

Edit both widgets so changing the title in the body updates the list widget without a refresh.

### Body Widget Server Script

Return the updated title back to the client:

![Server return](/assets/images/meetups/sp-ux/L31-2.PNG)

### Body Widget Client Script

Broadcast the updated title:

![Broadcast title](/assets/images/meetups/sp-ux/L31-3.PNG)

### List Widget Client Script

Listen for the broadcast and update the title:

![Listen](/assets/images/meetups/sp-ux/L31-4.PNG)

Fix the note ID reference:

![Fix note ID](/assets/images/meetups/sp-ux/L31-5.PNG)

## Lab 3.2: Add Filter

Add an input box to filter the notes list.

### List Widget HTML Template

![Filter HTML](/assets/images/meetups/sp-ux/L32-2.PNG)

### Verify

Typing in the filter field should filter the notes list.

## Lab 4.1: Add New Note Button

Add a button that creates a new note.

### List Widget HTML

![New button HTML](/assets/images/meetups/sp-ux/L41-2.PNG)

### CSS

![CSS](/assets/images/meetups/sp-ux/L41-3.PNG)

### Client Script

Call server side to create:

![Client create](/assets/images/meetups/sp-ux/L41-4.PNG)

### Server Script

Create the new note record:

![Server create](/assets/images/meetups/sp-ux/L41-5.PNG)

### Verify

Click the New button. A new note should appear in the list and be available for editing.

## Lab 4.2: Delete Note

Add a delete button to the note editor.

### Body Widget HTML

![Delete HTML](/assets/images/meetups/sp-ux/L42-2.PNG)

### Body Widget Client Script

![Delete client](/assets/images/meetups/sp-ux/L42-3.PNG)

### Body Widget Server Script

![Delete server](/assets/images/meetups/sp-ux/L42-4.PNG)

### List Widget Client Script

Remove the note from the list:

![Remove from list](/assets/images/meetups/sp-ux/L42-5.PNG)

### Verify

Click a note, click delete. It should disappear from the screen and the list.
