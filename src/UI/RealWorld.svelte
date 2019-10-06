<script>
  import Home from "./Home.svelte"
  import { routes } from "../constants"

  // Props
  // Common props
  export let dispatch;
  export let user;
  export let route;
  // Home route props
  export let tags;
  export let articles;
  export let page;
  export let activeFeed;
  export let selectedTag;
  export let favoriteStatus;

  const { home, signUp } = routes;

  // Component which will be displayed depending on the route
  const componentRoutes= {
    [home]: Home,
    // [signUp]: Signup
  };
  // Props for the component which will be displayed
  const componentRoutesProps={
    [home]: () => ({tags, articles, page, activeFeed, selectedTag, favoriteStatus})
  };

  $: component = componentRoutes[route]
  $: componentProps = componentRoutesProps[route]()
  $: commonProps = {dispatch, user, route}
</script>

<svelte:component this="{component}" {...componentProps} {...commonProps} />
