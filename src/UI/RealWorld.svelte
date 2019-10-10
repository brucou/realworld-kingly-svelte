<script>
  import Banner from "./Banner.svelte";
  import Header from "./Header.svelte";
  import Home from "./Home.svelte";
  import SignUp from "./SignUp.svelte";
  import SignIn from "./SignIn.svelte";
  import { routes } from "../constants";

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
  // Sign up and sign in props
  export let inProgress;
  export let errors;

  const { home, signUp, signIn } = routes;

  // Component which will be displayed depending on the route
  /*
  const componentRoutes= {
    [home]: Home,
    // [signUp]: Signup
  };
  Props for the component which will be displayed
  const componentRoutesProps={
    [home]: {tags, articles, page, activeFeed, selectedTag, favoriteStatus}
  };

  $: component = componentRoutes[route]
  $: componentProps = componentRoutesProps[route]
  $: commonProps = {dispatch, user, route}
  $: console.info(`Realworld`, component.name, componentProps, commonProps, {tags, articles, page, activeFeed, selectedTag, favoriteStatus})
*/
</script>

<div>
  <Header {user} />
{#if route === home}
  <Home
    {dispatch}
    {user}
    {tags}
    {articles}
    {page}
    {activeFeed}
    {selectedTag}
    {favoriteStatus} />
{/if}
{#if route === signUp}
  <SignUp {dispatch} {inProgress} {errors} />
{/if}
{#if route === signIn}
  <SignIn {dispatch} {inProgress} {errors} />
{/if}
</div>
