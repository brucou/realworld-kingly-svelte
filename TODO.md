# TODO
- TEEMP: no icons? icons are there in dev, just not in storybook
- TEEMP: publishing does not work in the editor route? check the API call is correct and review tests
- DO THE COMMANDS FIRST THEN THE VIEW??
  - the commands give me the parameters I need to pass in the view event handlers!
- publish integration with vue, react, svelte, lit first
  - then do ember and angular! 
- DOC: find a nomenclatur for events, should refer to the UI domain, 
  - i.e. CLICKED_LOG_OUT, more than LOG_OUT (command) or LOGGED_OUT (it is not logged out yet...)
  - note that this may require having to change the events I have now, but that is easy now
- DOC: link user scenarios and paths in the machine
- DOC: the merge of props... hidden stuff here. 
  - The route must be configured and updated!!
  - the first render should pass the route parameter, then the rest do not need as it does not change
    - pb. is that the first render may vary if the design vary, so good practice is to put a fake render in some init transitions
      that will always be taken (like if the logic is enclosed in a compound state)

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
- Issues with controlled components: if using additive props, pass the controlled props as in React
- Issues with stale props: pick up a source of truth (value returned from the database stored in state) rather than prop.
// - this happened to me because ?? I am not sure really, but the props passed was stale. Probably because we did a deep update in an object,
//   that object is scattered through components, and probably one reference was the same and did not trigger redraw.
//   so to avoid dependency between view and machine, just use always the source of truth not linked to the view if I have one

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
- the view concern spills into the machine... Controlled field require listening to keyup. This impacts the machine!

## Ordering
- start with commands before UI! maybe before the events!! It helps figure out the event data for the events
  - then that becomes a point of coupling which makes separation of UI and logic not full
  - so if given to different team, they still have to communicate somewhat
  - unless one team does only Ui, no event handling, and the logic team makes the event handling and pass it as props
  - SO POSSIBILITY, pass the handler as props with currying: evH:: dispatch => event => {...dispatch(...)...}
    - that way the view does no logic, has no dependency with the commands/events of the machine, or the fsm, but logic dependency wih event data

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

## Productivity gains
- be able to navigate better between chart and code
- specially when having a factored machine like the form machine
  - we have double indirection, harder to navigate
  - if you made a mistake in the abstracted machine, even harder

## Bug
Integration tests justification:
- also issue with back button not working! have to add event handler to detect popState? but not pushState ?
- [x] hash change event handler gives the wrong hash!! while in tests I pass the good one!
  - integration tests? hash change handler wrong format 
- [x] Svelte does not update input field with `value`
  - editor route, tag field is not reset when clicking enter to add tag
  - **EXPLAIN CONTROLLED FIELDS**: needs to add an event to handle keyup
  - this bug was integration test: it is a bug about svelte behaviour, well not really a bug but still integration level
- [x] Bug with index in {#each}
  - adding three, and removing first three times gives the wrong index and removes the wrong or nothing
  - NOT USING INDEX! use a key!!!! the key here was the tag itself
  - also integration level bug
- [x] issue with 401 on some http requests
  - auth problem, should I use mergeDeepWith from ramdda like hyperapp?
  - integration level bug
- [-] I NEED A RENDER MAIN TO UPDATE USER AT TOP Level app!! or have header in each component? means passing user to every component too!
  - NOOOO works for editor. If I pass a user props, it is passed to RealWorld, which selects props for the chosen component so good!! pass user in render route that works fine, the render route is for merging props right (and picking main component but hearder alaways runs)
  - EXPLAIN THAT, AS IT IS A CONFUSION FOR ME, IMAGINE THE REST!!!!!
  - PUT USER = NULL in renderForm in sing in and sign up and repass tests!!

- UI tests
  - I often forget to check that button clicks work correctly
    - resulting in not detecting that the form submit did not work

## Try to find these bugs with PBT
- editor route displays sign up sign in and not new article!
- find the bug that I cannot concurrently like several articles (typical concurrency stuff like search-as-you-type inputs )
  - there will be problems to generate the input sequences though, unless I improve my testing library?
  - actually the way I modelized I cannot concurrently like several articles through code but user can try!! 
  - Concurrency bug, would be nice if the PBT could find it
- use the home like/unlike succession not working scenarios bug to find it with automatically generated tests!
  - take the home version from the last commit of the home route. Or take the last commit of the editor route
- what else?

## When something does not work
- can be UI tests wrong
- can be machine tests wrong
- can be commands wrong
  - happened with wrong return from promise not {errors} but errors
- can be integration wrong, i.e. the rest of the app interfaces (routing etc.) 

## Default of state machine impl.
See what applies from there: https://kentcdodds.com/blog/when-to-break-up-a-component-into-multiple-components
- the part about modification same machine by several engineers??

## ...
incredible bug with synchronous event emission...
render null -> fetch auth -> render sth. Bcause sync., render sth run first, then render null. So out of seq!
think about microtask / macro? which? 
