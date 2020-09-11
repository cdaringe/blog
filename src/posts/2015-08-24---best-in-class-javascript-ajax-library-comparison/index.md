---
title: "Best-In-Class JavaScript AJAX Library Comparison 2015"
slug: "/best-in-class-javascript-ajax-library-comparison"
date: "2015-08-24T14:05:22.000Z"
featured: false
draft: false
tags: []
---

# Problem Statement

Our team decided that it would be helpful to use the same ajax library on our nodejs servers as we do in the browser. Having a consistent API in both domains should lend some sanity as devs jump between worlds!

# Process

I knew going into this that there are many JS AJAX libraries available. I didn't realize _how many_ there are. Hundreds. To whittle down the list, I decided that competing libs must:

1. work x-env
1. be modern (update in 2015)
1. be in the npm ecosystem, unless a great option exists elsewhere
1. have a sensible payload
1. have a promise API, vs. node-callback style. we want support for async-await / yield syntax
   - we don't need Promise polyfills any longer, although uncaught exceptions is a risk not offered by the browser spec. http://caniuse.com/#search=Promise
1. the package shall be tested

<center><small>csv version of table @bottom of post</small></center>
![](https://cdaringe.com/content/images/2015/08/Screen-Shot-2015-08-23-at-11-55-39-PM.png)

# Conclusion

- axios is a great lib with a sensible & simple interface. it relies on native promises.
- xhr-promise has a high payload due to the bluebird component. peopleBlovin' bluebird, myself included. however, I can get by without it to shave some `kb`s.
- we could roll our own version of browser-request to be thenify compatible, but the extra management is tedious, and, it would be strange seeing a `browser` dependency on the server
- superagent-promise could be a winner, but i'm not a huge fan of the interface. i don't like the multi-chained configuration, vs. the single object configuration pattern
- if we can never truly drop jquery and if it's already in our bundle, there's no use in duplicating its plenty functional features. however, there are bundling strategies to load it on-demand only, which we can exploit.
- it's too bad unirest doesn't offer a browser compatible interface. the x-env support they offer is killer already!
- note: i did not test xhr-promise OR superagent-promise if 400s/500s trigger `.catch` block execution, or if they must manually be inspected from the response. `axios` assumes HTTP 400s/500s are a failure mode, and bump you into `catch`, which I think is a valid and acceptable practice.

I am a fan of axios, at current time. It comes with all the fixins at a reasonable file size. Give it a whirl!

| package                               | browser | node | promise          | size (minified) |
| ------------------------------------- | ------- | ---- | ---------------- | --------------- |
| jquery                                | yes     | yes  | kinda _grumbles_ | 84kb            |
| request                               | no      | yes  | no               | ?               |
| browser-request                       | yes     | yes  | kinda _grumbles_ | 9.1k            |
| xhr                                   | yes     | yes  | no               | 6.5k            |
| axios                                 | yes     | yes  | yes              | 31kb            |
| xhr-promise                           | yes     | yes  | yes              | 113kb           |
| unirest                               | no      | yes  | yes              | ?               |
| ajax / component-ajax (ForbeLindesay) | yes     | yes  | no               | 7.8k            |
| superagent                            | yes     | yes  | no               | 12k             |
| superagent-promise                    | yes     | yes  | yes              | 14k             |

<small>sizes not listed for non-browserified packages</small>
