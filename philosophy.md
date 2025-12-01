## My goals for Youtube
- Learning
- Entertainment (high entertainment to time density)
- High quality content
    - Rationale for blocking shorts: they're usually not high quality and are pumped out quickly
- Stop aimless searching
    - Blur search entries except channel?
    - Filter by category
- Be in control of what, when, and how long I watch

## Subscription Criteria
(Doesn't need to meet all criteria, just most)
- Respects me as a viewer, that means no clickbait
- I will retain the information
- Important/relevant to me
- Will make me more aware in general
- Will always enthusiastically watch at regular speed


### Beware:
- Entertainment masquerading as education (eg. game dev channels)
- You can't learn something from a youtube video alone. Therefore, subscriptions with long videos are usually bad. Prefer theory/overview over implementation. 
- MKBHD
- Danny Gonzolez
- Drew Gooden
- Curtis Connor
- Mrwhosetheboss
- Mrbeast

Start watching because they are "entertaining enough" but I always leave dissatisfied

## Watchdog extension
Seperate mini-extension that watch other extensions. If any were disabled, would re-enable.
If any were deleted, would self-desctuct (to discourage me from tampering)

Replaced by just installing 2 copies of the main extension: one locally and one from the web store
to prevent circumvention by code modification. Plus, this will reduce code duplication (`background.js`).

However, in development, I need to make code changes and see their results.
In a non-primary browser, install both. In primary browser, install by policy.
If local extension detected, will activate development protections: mute and blur video
(since I don't actually need to watch the video in development).
This enforcement code will run from the main extension, which is harder to modify.
