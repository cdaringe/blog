---
title: "JS // Managing bulk async events with Promises"
slug: "/js-keep-sync-flow-going-while-asynchronously-fetching-data-promises"
date: "2014-04-12T04:47:14.000Z"
featured: false
draft: false
tags: []
---

Javascript `callbacks()` can get messy. When performing many async operations,
is there a simple way to state 'when all these things are done' do `this()` or
`that()`? Sure is. Enter the saving grace of `Promise.all()`.

See the demo over
at [http://jsfiddle.net/cdaringe/MBEy8/2/](http://jsfiddle.net/cdaringe/MBEy8/4/ "http://jsfiddle.net/cdaringe/MBEy8/4/")
