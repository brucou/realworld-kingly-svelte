# ![RealWorld Example App](logo.png)

> ### [Kingly] codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API.


### [Demo](https://rw-kingly-svelte-bricoi1.vercel.app/#/)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)

This codebase was created to demonstrate a fully fledged fullstack application built with **[Kingly]** including CRUD operations, authentication, routing, pagination, and more.

For more information on how to this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.

# How it works

Kingly is a state machine library that lets developers model the behavior of their application with complete independence from UI frameworks. This implementation picked Svelte to render the UI.

The step-by-step implementation process followed can be found in the [corresponding Kingly tutorial](https://brucou.github.io/documentation/v1/tutorials/real-world.html).

A high-level view of the corresponding state machine is as follows:

![real world modeling](https://brucou.github.io/documentation/graphs/real-world/realworld-routing-article.png)

The high-level view showcases how routing can be handled by a state machine and how individual pages are modeled with compound states.

Zooming in on the Editor route compound control state:

![editor route behavior modelization zoomed in](https://brucou.github.io/documentation/graphs/real-world/realworld-routing-editor-level-1.png)

# Getting started
You can run the application locally:

```
npm run start
```

You can run the tests:

```
npm run test
```

