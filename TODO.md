# TODO
// TODO: in the docs when the scenarios (the first batch) draw a table with highlighted the path through the machine
- write the machine tests left!
- then implement the machine

- README
  - **Use [realworld-starter-kit]()https://github.com/gothinkster/realworld-starter-kit)**

- IMPLE
  - add the favorite click to the machine!!! HOW COULD I FORGET!!
  - write tests for it too!
  - write the handlers for the view
  - write the App.svelte with the command handlers
  - quick test manually
  - then write the properties
- examples of properties:
  - user navigating to a route leads to displaying the corresponding screen
  - user clicking on a page leads to displaying the current tab with the new page 
  - tags are only fetched once in the home route
  - every fetch is matched with a corresponding click event
 - basically this is
   - .*[ROUTE_CHANGED=home].* => ...
 - No I need something more general, this is just repeating the specs i.e. the machine
   - CLICK_PAGE => null | check auth | render (full global feed | filter global feed) with new page
   - CLICK_GLOBAL_FEED => not check auth && (null | render global feed with page 0)
- safety
  - only auth users can see user feed
    - look for index i with render with active feed user feed
    - look back in input backwards from i, find the first CHECK_AUTHENTICATION
    - there MUST be one
    - it must return a user
  - existing users must have been authenticated prior
    - look for any command with user not null
    - backtrack in input to find a CHECK_AUTHENTICATION
- correctness (fixtures hypothesis)
  - if render some articles, with some tags, i.e. some page, must be the right page
    - check tags map to fixtures
    - identify articles query parameters (page, global) or (page, user)
    - backtrack to find in inputs those params in the closest fetch 

- probably a good practice is to start from reality (= commands) and 
  - check that inputs is in set of generating inputs for that command
  - choose tests that are simple and do not involve state (otherwise I am redoing the machine) 
- but probably it is necessary to do it the other way too??

NOTE: this is PBT, not stateful PBT as we seek to avoid state here
NOTE: once the machine confidently works, it cn be used with stateful PBT to test the other implementations!

# Lessons learnt
## Dev cycle
- write the doc after finishing dev and tests
  - I started with a home-route-tag-filter, doc it, and then changed my mind to directly do the whole home-route-complete, so I wrote the doc parts for nothing... hours lost

## Storybook
- I made lots of errors in the tests...
  - this comes in part to the combination of values which are hard to follow
    - write them down before writing the tests?
  - use values which avoids this problem. For instance enums = False | T | Loading | Error
    - that way I have less branches to test
  - component by default should defend against null/undefined/edge cases
- put the branching logic out of the sub-component if it leads to empty component
- keep only the logic specific of the component in the component
  - for instance <Tags tag = > -> put there display nothing if tag is empty.
  - but if activeFeed === TAG that belongs to Tags' parent component
- Actions:
  - storybook display the list of arguments received by the handlers, i.e. an array 

## Bug found in other versions
- if I favorite an article
- log out in another screen
- then unfavorite the article in the first screen, the favorite stays on (no login screen) and an error is logged to the console (promise ... no article on data or something)
```text
Failed to load resource: the server responded with a status of 401 ()
articles.js:79 Uncaught (in promise) TypeError: Cannot read property 'article' of undefined
    at articles.js:79
```
