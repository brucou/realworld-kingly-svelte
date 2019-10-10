# TODO
- DOC: link user scenarios and paths in the machine
- write the machine tests left!
- then implement the machine

- README
  - **Use [realworld-starter-kit]()https://github.com/gothinkster/realworld-starter-kit)**

- IMPLE
  - the routing guards must be fulfilled otherwise it stays there forever
    - define a catchall guard which redirects to an existing default screen or a 404 screen 
      - with links to get back to home?? 
- write the properties
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

## Maintainability
- changing view props (added route) => changing commands, potentially everywhere
  - if we couple props and commands... but that is the best to not make mistakes writing the test
  - otherwise we leave the machine as is, and then test the adapter machine render prop to component render prop...
  - mmm not sure which is the best approach
  - for instance we could have put homeProps in the component and leave the machine, and doing the conversion in the App.svelte adapter
- changing view props also means changing all the tests!! as we MUST always use all props in the tests (if we use merge props in App.svelte)
  - assuming a change of route resets the other route states, that would help to automatize test changes but sucks anyways
- refactoring state => refactoring all the update commands
  - should use lenses from the get go? instead of direct destructuring
  - maybe some helpers would be good? hyperapp does this in a nice way
  - maybe updateState that accepts lenses instead of the one I have would have better?
    - you don't want to pass lenses in the commands, it couples to the machine state? but maybe that is logical
- I was able to do search and replace so that may indicates the space for tooling to solve the problem automatically
  - could be const piecesState = view(route, [props], extendedState), with pieceState with normal destructuring, view a kind of lens?
  - have individual lenses for each prop and combine that: that would define view. The individual lenses may be automatically generated?

## Integration tests
- still necessary
  - mistake in the `href` of links, issues with the trailing `/` which cannot be found through unit testing alone
  - also issue with back button not working! have to add event handler to detect popState? but not pushState ?
  
## Bug found in other versions
- open a window, log in there
- duplicate the window
- favorite an article in the first window
- log out in second window
- then unfavorite the article in the first window, the favorite stays on (no login screen) and an error is logged to the console (promise ... no article on data or something)
```text
Failed to load resource: the server responded with a status of 401 ()
articles.js:79 Uncaught (in promise) TypeError: Cannot read property 'article' of undefined
    at articles.js:79
```

- also register in demo app redirects to home
  - not with hyperapp: open register in one tab, log in in another tab, close it, then go back and refresh: no redirect 

- also, maybe bugs here but I did not check
// TODO: update graph to add fetch auth another time, check with demo app, what happens if
// I sign in before submitting the form, then submit the form
// could be a bug of demo app, but do it right myself
// safety properties: cannot sign up if already sign in!!
// check with hyperapp and conclude; this is one advantage of state machine modelling

- errors with demo app backend
  - empty form signup gives username both too short and too long!!
    - username can't be blank
      username is too short (minimum is 1 character)
      username is too long (maximum is 20 characters) !!! 

- Demo app bug
  - if I log in, duplicate tab, then log out in second tab, then I still can see the user profile!

