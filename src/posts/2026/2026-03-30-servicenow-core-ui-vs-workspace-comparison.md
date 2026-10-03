---
title: 'ServiceNow Core UI vs Workspace: A Proper Comparison'
description: >-
  A side-by-side comparison of configuring ServiceNow Core UI versus Workspace UI Builder. 
  When simple form customizations that took 2 clicks in Core UI now require 30+ steps and 
  100 lines of JavaScript in Workspace, something fundamental has changed about the platform.
tags:
  - servicenow
  - workspaces
  - core-ui
date: '2026-03-30'
---

There's a growing frustration in the ServiceNow community, and it's not just about learning new tools—it's about a fundamental shift in complexity that affects everyone from admins to developers.

Let me put it simply: **Core UI is very simple.**

Want to add a field to a form? Right-click the header, customize the form, drag the field where you want it, save. Done. 30 seconds.

Want to add related data? You have three straightforward options:
- An embedded list (rarely used)
- A related list (the standard)
- A formatter with some Jelly code for custom displays

That's it. The barrier to entry is low. A "mere consultant" or sys admin can handle most form customizations without breaking a sweat.

**Workspace is not simple.**

And this isn't just my opinion. A recent Slack conversation between practitioners (including someone who works at ServiceNow) perfectly captures the gap:

---

## The Conversation That Says It All

**Ste** shared a real-world example that stopped me cold:

> Anyone else frustrated with Workspaces? Things that were simple to configure in core UI are a massive headache to setup in Workspace.
>
> **Example:** On the project form there's this formatter that represents the Phase of the project.
>
> **Core UI steps:**
> 1. Make sure "Process Flow" is present in the form layout
> 2. Make the mapping in table `sys_process_flow`
> 3. Done.
>
> **Workspace steps:** 30 steps including complicated scripting!
>
> Why why why? This whole UI builder feels a step too far—we have lost the essence of simple configuration available for anyone without learning the builder for weeks first.

**Spike** agreed:

> I can only agree with this. I've built a number of experiences recently as well as having to make some tweaks to the Service Operations Workspace. It's really not straightforward at all.

Then **Chris Helming** (who works at ServiceNow) jumped in to help. His response is worth examining closely—not because it proves Workspace is easy, but because it demonstrates just how much complexity we're now dealing with:

> I love workspace 😂
> 
> Biggest pro for me is being able to show data from multiple other records in an easy-to-consume fashion (vs 12 related lists).
> 
> I disagree with the not-straightforward part. It's definitely *different*, but there are fewer parts than it really seems like. Data resource grabs data, components bind to that data. Client scripts if you need to modify the data, client params if you need to temporarily store data...

Then Chris proceeded to show the "simpler" way to recreate that process flow formatter in Workspace. The solution required:

1. Adding `sys_process_flow` to `glide.ui.permitted_tables` (or using a data resource)
2. A "Look Up Multiple Records" data resource
3. **A 50-line client script** to process the steps
4. Two client state parameters
5. A stepper component with script bindings

Or alternatively, you could skip some steps and just bind scripts directly to the component properties:

```javascript
// The "items" binding script (45 lines)
if (!api.data.stepper?.results || !api.data.record?.form?.fields) return [];

const steps = api.data.stepper.results;
const fields = api.data.record.form.fields;

function matchesCondition(conditionStr) {
  const clauses = conditionStr.replace(/\^EQ$/, "").split("^OR");
  return clauses.some((clause) => {
    const match = clause.match(/^(\w+)=(-?\w+)$/);
    if (!match) return false;
    const [, field, value] = match;
    return fields[field] && String(fields[field].value) === value;
  });
}

const sorted = [...steps].sort((a, b) => a.order.value - b.order.value);
const currentIndex = sorted.findIndex((step) => matchesCondition(step.condition.value));

return sorted.map((step, index) => {
  const label = step.label.value;
  let progress;

  if (currentIndex === -1) progress = "none";
  else if (index < currentIndex) progress = "done";
  else if (index === currentIndex) progress = "partial";
  else progress = "none";

  return { id: label, label, progress };
});
```

And a separate script for the "selected item" binding (another 20+ lines).

Chris summarized: "That was a lot of messages 😂"

Ste's response cut to the heart of the issue:

> That's some mega steps there, thanks! 
> 
> But I think this illustrates the point—you have to be DEEP into UI builder to get your head around this. It's clearly no issue for developers who live and breathe it... but for the "mere consultants/sys admins" who just need to get that one thing done, it was understandable and a few clicks before. Now I see 100 lines of script + other configurations. 
> 
> **Was this really the intent and direction SN wants to go?**

That question deserves an answer.

---

## The Complexity Gap: A Side-by-Side Comparison

Let me show you what we're talking about with concrete examples.

### Adding a Field to a Form

#### Core UI

{% raw %}::video[Adding a field in Core UI]{#video-core-add-field}{% endraw %}

**Steps:**
1. Right-click form header → Configure → Form Layout
2. Drag field from left to right
3. Save

**Time:** ~30 seconds  
**Skill level:** Admin/Consultant  
**Code required:** None

#### Workspace UI Builder

{% raw %}::video[Adding a field in Workspace]{#video-workspace-add-field}{% endraw %}

**Steps:**
1. Open UI Builder
2. Navigate to the page
3. Find the form component
4. Open the component properties
5. Modify the fields array (or use a data resource)
6. If using a data resource: create it, configure the query, bind it
7. Save and publish

**Time:** 5-15 minutes (if you know what you're doing)  
**Skill level:** Developer with UI Builder experience  
**Code required:** Potentially JavaScript for dynamic field binding

---

### Adding a Related List

#### Core UI

{% raw %}::video[Adding a related list in Core UI]{#video-core-related-list}{% endraw %}

**Steps:**
1. Right-click form header → Configure → Related Lists
2. Select the table relationship
3. Configure list layout if needed
4. Save

**Time:** ~1 minute  
**Skill level:** Admin/Consultant  
**Code required:** None

#### Workspace UI Builder

{% raw %}::video[Adding a related list in Workspace]{#video-workspace-related-list}{% endraw %}

**Steps:**
1. Open UI Builder
2. Navigate to the page
3. Add a "Data Grid" or "Related List" component
4. Create a data resource for the related records
5. Configure the table, filter, and fields
6. Bind the data to the component
7. Configure which actions are available
8. Handle empty states
9. Save and publish

**Time:** 15-30 minutes  
**Skill level:** Developer  
**Code required:** Client scripts for interactivity, possibly custom actions

---

### Hiding/Showing Fields Based on Conditions (UI Policies)

#### Core UI

{% raw %}::video[Creating a UI Policy in Core UI]{#video-core-ui-policy}{% endraw %}

**Steps:**
1. Navigate to System UI → UI Policies
2. Create new policy for your table
3. Set conditions (e.g., "State is Closed")
4. Add UI policy action: "Set field mandatory/visible/read-only"
5. Save

**Time:** ~2 minutes  
**Skill level:** Admin  
**Code required:** None (though client scripts are an option for complex logic)

#### Workspace UI Builder

{% raw %}::video[Conditional visibility in Workspace]{#video-workspace-conditional}{% endraw %}

**Steps:**
1. Open UI Builder
2. Select the component you want to conditionally show/hide
3. Open the "Visibility" property
4. Switch to script mode
5. Write JavaScript like:

```javascript
// Hide if state is not closed
return api.data.record.form.fields.state.value !== '3';
```

6. Or create a client state parameter and a client script to manage the visibility state
7. Test in various scenarios
8. Save and publish

**Time:** 10-20 minutes  
**Skill level:** Developer  
**Code required:** JavaScript for every conditional field

---

### Running Client-Side Logic (Client Scripts)

#### Core UI

{% raw %}::video[Client Scripts in Core UI]{#video-core-client-script}{% endraw %}

**Steps:**
1. Navigate to System Definition → Client Scripts
2. Create new script for your table
3. Choose type: onLoad, onChange, onSubmit
4. Write your logic in the script field
5. Save

**Time:** ~5 minutes  
**Skill level:** Developer (but simple scripts are learnable)  
**Code required:** Standard GlideForm API

#### Workspace UI Builder

{% raw %}::video[Client Scripts in Workspace]{#video-workspace-client-script}{% endraw %}

**Steps:**
1. Open UI Builder
2. Navigate to the page
3. Add a "Client Script" (one per page, or multiple with careful management)
4. Or use "Client State Parameters" + component bindings
5. Or use component-specific event handlers
6. Write JavaScript using the UIB-specific APIs (`api.data`, `api.state`, etc.)
7. Wire up the script to trigger on the right events
8. Debug in browser console (different patterns than Core UI)
9. Save and publish

**Time:** 20-45 minutes  
**Skill level:** Developer experienced with UIB patterns  
**Code required:** JavaScript using UIB-specific APIs

---

## The Real Trade-offs

I'm not here to bash Workspace. It has legitimate advantages:

**Workspace Strengths:**
- **Unified experience:** Consistent look and feel across the platform
- **Modern components:** Better visualization options (charts, steppers, custom layouts)
- **Multi-record views:** Show data from multiple records in one view without 12 related lists
- **Responsive design:** Works better on mobile and different screen sizes
- **Declarative actions:** Powerful (though convoluted) action framework

**But let's be honest about the costs:**

### 1. The Learning Cliff

Core UI had a gentle learning curve. You could start as an admin, learn form layout, then gradually pick up client scripts and business rules.

Workspace UI Builder has a **cliff**. You need to understand:
- Data resources and how they fetch data
- Component binding (property binding vs. event binding)
- Client state parameters vs. component properties
- The component hierarchy and event bubbling
- UIB-specific APIs (`api.data`, `api.state`, `api.setState`, etc.)

### 2. The "Simple Things Are Hard" Problem

That process flow example is emblematic. Something that was:
- **2 steps** in Core UI
- **0 lines of code** in Core UI

Became:
- **~10+ steps** in Workspace (at minimum)
- **~70 lines of JavaScript** in Workspace

This isn't an edge case. This is the pattern.

### 3. The Developer Bottleneck

In the Core UI era, admins and "citizen developers" could handle 80% of form customizations. Workspace pushes almost everything to developers who understand JavaScript and the UIB framework.

Ste called them "mere consultants/sys admins"—but these are the people who made ServiceNow what it is. The platform's original value prop was **"configure, don't code."**

Workspace feels like **"code to configure."**

---

## The Uncomfortable Question

Let me return to Ste's question: **Was this really the intent and direction SN wants to go?**

I think the answer is complicated:

**Yes, in some ways:**
- ServiceNow wants to move to a modern, unified UI
- Workspace enables experiences that Core UI simply couldn't (complex dashboards, multi-record views, mobile responsiveness)
- The old Core UI codebase is technical debt that needs addressing

**But also no:**
- The complexity gap wasn't inevitable—it's a design choice
- Other platforms have managed modernization without losing configurability
- The barrier to entry has been raised dramatically, which changes who can effectively use the platform

---

## What Should ServiceNow Do?

I don't have all the answers, but here are some thoughts:

### 1. Acknowledge the Gap

Don't pretend this is just "different." It IS more complex. Own it and explain why the trade-offs are worth it.

### 2. Provide "Easy Mode" Pathways

Give admins a way to do the simple stuff without writing JavaScript:
- A UI Policy equivalent that doesn't require scripting
- Drag-and-drop related list configuration
- Built-in formatters for common patterns (process flow, approval summary, etc.)

### 3. Better Documentation and Learning

The UIB learning resources are... lacking. We need:
- Clear migration guides: "You used to do X in Core UI, here's how to do it in Workspace"
- Recipe book: Common patterns with step-by-step instructions
- Video library showing side-by-side comparisons

### 4. Invest in Developer Experience

The fact that Chris Helming—a ServiceNow employee—needed 20+ messages and custom scripts to solve what was a 2-step Core UI task tells us something about the developer experience. It needs to be simpler.

---

## What Should YOU Do?

If you're a ServiceNow customer or partner facing this reality:

### For Admins/Consultants:
- **Learn the basics of UIB:** Even if you don't build Workspaces, you'll need to understand them
- **Focus on what Workspace does well:** Complex dashboards, mobile-first experiences, unified navigation
- **Know when to push back:** Not every form needs to be a Workspace. Core UI is still supported (for now)

### For Developers:
- **Embrace the complexity:** This is the direction. Learn UIB deeply
- **Create reusable patterns:** Build components and data resources that can be reused across experiences
- **Document everything:** Your admins will thank you

### For Architects:
- **Make strategic decisions:** Don't default to Workspace for everything. Match the UI to the use case
- **Invest in training:** Your team needs time and resources to learn this
- **Consider hybrid approaches:** Core UI for simple forms, Workspace for complex dashboards

---

## The Bottom Line

Workspace is powerful. It enables things Core UI never could. But let's stop pretending it's just "different."

**It's more complex. It requires more code. It has a steeper learning curve.**

And for a platform that built its reputation on "configure, don't code," that's a significant shift.

The community conversation I shared isn't just three people complaining—it's representative of what I'm hearing everywhere. People are frustrated. They feel like something fundamental has been lost in the transition.

ServiceNow needs to hear this. And they need to decide: Is the new direction worth alienating the admins and consultants who built the ecosystem?

Because right now, the answer for many is: **No, not yet.**

---

*What are your experiences with Core UI vs Workspace? Am I being too harsh, or does this resonate? Let me know on [GitHub](https://github.com/jacebenson/jace.pro/issues/new).*
