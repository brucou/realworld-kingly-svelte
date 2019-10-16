<script>
  import Banner from "./Banner.svelte";
  import Header from "./Header.svelte";
  import Home from "./Home.svelte";
  import SignUp from "./SignUp.svelte";
  import SignIn from "./SignIn.svelte";
  import Editor from "./Editor.svelte";
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
  // Sign up, sign in, editor common props
  export let inProgress;
  export let errors;
  // Editor props
  export let title;
  export let description;
  export let body;
  export let currentTag;
  export let tagList;

  const { home, signUp, signIn, editor } = routes;

  // Component which will be displayed depending on the route
  const componentRoutes= {
    [home]: Home,
    [signUp]: SignUp,
    [signIn]: SignIn,
    [editor]: Editor
  };
  // Props for the component which will be displayed
  $: componentRoutesProps={
    [home]: {user, tags, articles, page, activeFeed, selectedTag, favoriteStatus},
    [signUp]: {inProgress, errors},
    [signIn]: {inProgress, errors},
    [editor]: {inProgress, errors, title, description, body, tagList, currentTag},
  };

  $: component = componentRoutes[route]
  $: componentProps = componentRoutesProps[route]
  $: console.info(`Realworld`, component.name, componentProps, {tags, articles, page, activeFeed, selectedTag, favoriteStatus})
</script>

<div>
  <Header {user} />
  <svelte:component this="{component}" {...componentProps}  {dispatch} />
</div>
