- README
  - **Use [realworld-starter-kit]()https://github.com/gothinkster/realworld-starter-kit)**

- be careful of different data format for view and machine!! to harmonize in App.render
- write the machine tests!
- then implement the machine

# Lessons learnt
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
