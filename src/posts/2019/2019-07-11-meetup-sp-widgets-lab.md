---
title: 'Meetup Lab: Service Portal Advanced Widget Development'
description: 'Five labs covering option schemas, SP instance, empty states, embedded widgets, and directives. Full step-by-step from the ServiceNow Developer Meetup.'
date: '2019-07-11'
tags:
  - servicenow
  - service-portal
redirectFrom:
  - /meetup-sp-widgets-lab/
  - /p/2019-07-11-sp-widgets-lab/
---This lab covers advanced Service Portal widget development across 5 labs. Originally from CreatorCon (CCW1088).
_This lab originally from the [sndevs meetups repo](https://github.com/sndevs/meetups) and [hosted on GitHub Pages](https://sndevs.github.io/meetups/)._


Scoped app import: `https://github.com/sndevs/CCW3956.git`

## Lab 1: Getting Started

Import the scoped app into Studio, then open the Service Portal designer at `/$spd.do`.

![Select app](/assets/images/meetups/sp-widgets/select-app.png)

## Lab 2: Using the Option Schema

Create a Card List Widget:
- Name: `Card List Simple`
- ID: `card_list_simple`

Open the widget editor, click the hamburger menu, then "Edit option schema". Add:

| Label | Name | Type | Hint |
|-------|------|------|------|
| Title | title | string | The title for the card list |
| Table | table | string | The table for the query |
| Filter | filter | string | The filter query string |
| Fields | fields | string | Comma separated list of fields |

### Server Script

Type out [server.js](./simple.list.server.js.txt) yourself:

![Server script](/assets/images/meetups/sp-widgets/simple.list.server.js.png)

### CSS

Add [style.css](./simple.list.scss.txt):

![Style](/assets/images/meetups/sp-widgets/simple.list.scss.png)

### Client Script

Add [client.js](./simple.list.client.js.txt):

![Client controller](/assets/images/meetups/sp-widgets/simple.list.client.js.png)

### HTML Template

Add [template.html](./simple.list.html.txt):

![HTML template](/assets/images/meetups/sp-widgets/simple.list.html.png)

### Add to Playground

1. Open `/$spd.do` and find the Playground page
2. Add a container with a 3,9 split grid
3. Place the Simple List Widget in the left side

### Configure Instance Options

| Field | Value |
|-------|-------|
| Title | Active Incidents |
| Table | incident |
| Filter | active=true |
| Fields | assigned_to, impact, incident_state, priority |

![Check in](/assets/images/meetups/sp-widgets/simple.list.check.in.png)

## Lab 3: Using SP Instance

Create an `sp_instance` extension table for more configurability.

### Create a Table

| Field | Value |
|-------|-------|
| Label | Card List Instance |
| Extends table | Instance with Table |

Add a column (advanced view):
- Type: Reference
- Label: View
- Name: view
- Reference: UI View
- Reference qualifier: `javascript:"sys_idIN" + new x_snc_reusable_wid.ListViewHelper().getViewsForList(current.table)`

### Create Script Include

Type out [ListViewHelper.js](./ListViewHelper.js.txt):

![ListViewHelper](/assets/images/meetups/sp-widgets/ListViewHelper.js.png)

### Clone Widget

Clone "Card List Simple" → name it "Card List", then open in platform view. Set:
- Data Table: `Card List Instance`
- Fields: `Title, Table, View, Filter, Display Field`

### New Widget Templates

Type out the [HTML template](./list.html.txt), [server script](./list.server.js.txt), and [client script](./list.client.js.txt):

![List HTML](/assets/images/meetups/sp-widgets/list.html.png) ![List server](/assets/images/meetups/sp-widgets/list.server.js.png)

### Create a Service Portal Page

1. In Studio, create Application File → Service Portal Page
2. Page title: `Incident Workspace`, Page ID: `iw`
3. Add a [3 \| 9] layout
4. Drag Card List to the left column
5. Configure: Table=`Incident`, Filter=`active=true`, Display field=`Short Description`, Title=`Active Incidents`, View=`Mobile`

## Lab 4: Handling the Empty State

Widgets should provide an empty state that tips users off about configuration.

### Show a Default Title

Add this to the client script:

![Default title](/assets/images/meetups/sp-widgets/default.title.png)

Then use it to set an example:

![Replace title](/assets/images/meetups/sp-widgets/default.title.replace.png)

![Replace with](/assets/images/meetups/sp-widgets/default.title.replace.with.png)

### Richer UX

Replace your client script with [rich.client.js.txt](./rich.client.js.txt). Then in the designer, delete the Card List widget and drag a fresh instance — you'll see a much better preview:

![Rich UX](/assets/images/meetups/sp-widgets/rich.ux.png)

## Lab 5: Embedded Widgets and Directives

As widgets grow complex, break them into smaller components.

Create an Angular Provider:
1. Open Card List in the platform at `/sp_widget_list.do`
2. Find Angular Providers related list
3. Click New
4. Type: Directive, Name: `workspaceCard`, Script: [directive.js](directive.js.txt)

**Pros:** Keeps template close to directive code, reusable, passable scope parameters
**Cons:** Template isn't cached, directive can get large
