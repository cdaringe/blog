---
title: "Difficulty Of Managing A Single Bit // AmpersandJS"
slug: "/managing-a-single-bit-view-rendered"
date: "2015-06-21T12:19:00.000Z"
featured: false
draft: false
tags: []
---

## the what.

AmpersandJS forms. Amazing little constructs. But to make them `render` reliably
and consistently--it was a battle! One particular bit, indicating their
`rendered` state, proved to be much more complicated than anticipated.

## forms. give me simple forms.

Let's talk context. @[MRN](MRN.org), we do a lot of assessessments. What's an
assessment. An assessment is a glorified term for _research survey_, in
nuero-speak. What do surveys need? Forms.
@[Henrik Joreteg](https://twitter.com/henrikjoreteg)'s blurb on web
[forms](http://ampersandjs.com/learn/forms) is one of the most refreshing short
bits declaring how forms should really behave. When I first read it, I was very
curious to see if the hype was true. Consider my prior strategies managing form
data:

- use rawjs/jquery. It is a complicated nest of functions and data-structures to
  initialize, refresh, and extract values from a variety of controls on the
  page. Buggy. How about validation? Don't even get me started. I'd cut corners
  properly validating things here all the time. _nightmare_

```js
// does this look familiar?
var form = service.getMyOldFormValues();
var $input = jQuery("#sillyInput");
if (form.input.init !== undefined) $input.val(form.input.init);

// inside some change handler...
if ($input.val() === "bananas") {
  console.warn(
    "how many huge, redundant condition blocks like me will a complicated form have?"
  );
}

// what's great about this?  i get my data in one place, i initialize my control in another, i validate in a third, and hopefully i've got some standard notification mechanism for validation messages and submissions.  abort!
```

- angularjs. Two-way data-binding made updating forms a breeze. Initializing and
  extracting data was simple, albeit I still used native `<form>` constructs to
  send data, vs. opening my eyes and seeing what a `{field: value, ...}` form
  data-summary could really do. Validation? _Still not great_. A few nice
  directives make it somewhat easier. Let's not dig there though. :)

ampersand takes a modern approach:

- ampersand. To build a form, make a simple js form construct and specify some
  fields. Fields are generally not a DOM-level control, but rather a whole micro
  view designed to manage a particular piece of data for you, handling all
  behavior when the user interacts with it. The field constructs then actively
  report their values and validatity to the consuming form. When the form is
  submitted and valid, you get an object containing your full form data to do
  whatever you wish with it. **yes**.

This is a drastic improvement over our existing form handling strategies. Why.
Because we've decoupled ourselves from the formal `<form>` behaviors, and used
the form for it's original purpose--get data from the user, not to
get-the-data-that-may-or-may-not-be-in-the-format-we-need and to immediately
submit said data to some remote page. `<form>` has lots of sugar to make forms
work in a fashion that were helpful when we did all of our web application work
on the server. That time is gone.

## forms. give me a consistent interface for all of my fields.

The API's for many of these &-js form-fields were slightly inconsistent. The
docs? They all had a good start, but were still lacked key details. For example,
between a couple of FieldViews, you may not be sure the fate of an `el` that you
provided to the field. Would the FieldView

- make the `el` its control (e.g. if the provided `el` was an input),
- render itself into the element, or, lastly,
- perhaps just replace the el entirely, using it as a target?

It was challenging. There were more than a couple bugs. In the beginning, I just
needed to get my app to work, so I started tossing in patches n' bugfixes. More
than just bugfixes, however, we wanted a consistent interface to enable the form
itself to perform operations on its member fields. This has been mostly
completed via
[form-view](https://github.com/AmpersandJS/ampersand-form-view/issues/28)
initiatives.

## forms. assessments. are we good to go?

So what does this have to do with the managing a single bit? Again, @MRN, users
consuming our product, [COINS](http://coins.mrn.org/), fill out a variety of
complex forms, often with custom in-house designed controls (cool!). Form
management is our business. Trouble is, the system is **huge** and it's all
written using a flat, procedural, global-esqe data paradigm. Surveys are built
server-side with logic, DOM templates, and data embedded into `{js-objects}`
which in turn encoded into the resultant HTML fetched from the server. It's made
up-keep a bit tricky.

#### seperate the survey's concerns

Ok, let's replace the form templates from the server with more flexible
`ampersand-form-view`s, and simply pipe in data to the form for it to manage.
Unfortunately, the mapping isn't so clean. A survey is really a collection of
forms, paginated. To address this very problem, I built and released
[ampersand-form-manager-view](http://cdaringe.github.io/ampersand-form-manager-view/).
It's a handy little library to take a series of forms, and enable you to get the
state of the set of forms. That is, provide it a series of forms, and it could
tell you that all forms are complete and valid, or not! This is where that
**single bit** came to bite!

#### the elusive bit

The single bit under fire was the `rendered` boolean flag in &-view.
&-form-manager-view cycles through forms. However, when cycling _back_ to a
previously viewed form... nothing would show!

This leads us to rendered **definition 1**: the view is `rendered` if it has an
element. This was the state of &-view when I began. How dishonest! ;) The fault
of this definition is that my views had been cycled in and out, hence removed.
However, the element they were rendered into _still existed!_ Therefore, the
view still believed it was rendered! You might say "just remove the `el` from
the view defintion" on view removal. This doesn't work because often a view will
be initialized with an `el`, but not yet rendered on screen. In that case,
`rendered` would report `true`, when indeed, all we did was initialize, not call
the `render()` function itself.

**definition 2** is that the view is _never_ `rendered`. Remove `rendered` state
from the &-view library. The rendered state of a view shouldn't be managed by
&-view. Instead, let the user manage this piece of state on his/her own. This
drastically cuts down on usability, and bloats &-view defintions.

**definition 3** is that the `rendered` bit gets autoloaded into the state as a
`prop`, and `render()` and `remove()` functions toggle the bit. When the user
overrides one of these functions, a custom getter/setter wraps the user provided
function with logic to set the bit.

Although some implementations of **definition 3** trigger redundant events if
the prototype is `extend`ed, an agreeable solution was found using session-wise
and derived+cached attributes. The solution sets a `session` `_rendered`
attribute to `true` on _every_ call to `render()`. There may be many calls to
various `render()` fns if a View definition is extended multiple times. This
emits many events, but the view is really only rendering once. So, because we
only want to emit one event for the user to actually act on, we exploit the fact
that the derived `rendered` attribute only executes its value handler when the
session value `_rendered` has changed. In this regard, only a single
`change:rendered` event gets emitted, and we can manually trigger a matching
`render` event at the same time, as some folks want to listen for the action vs.
the state.

It was challenging to land on a solution that would honor &-view's contracts for
eventing as well as pre-rendered, rendered, and post-rendered state. You can see
[bits](https://github.com/AmpersandJS/ampersand-view/blob/master/ampersand-view.js#L400)
[and](https://github.com/AmpersandJS/ampersand-view/blob/master/ampersand-view.js#L72)
[pieces](https://github.com/AmpersandJS/ampersand-view/blob/master/ampersand-view.js#L83)
in the
[ampersand-state](https://github.com/AmpersandJS/ampersand-view/blob/master/ampersand-view.js)
source.

## closing thoughts

What a rabbit hole. We visited forms, form-management and composition, jumped
over to views, then finally examined how I ended up making stateful views
honest! There's often a story behind each PR. This was the story
[behind mine](https://github.com/AmpersandJS/ampersand-view/pull/119).
