<script>
  import { viewModel } from "../constants";
  import { local } from "../shared/events";

  export let tab;
  export let user;
  export let onClickTab;

  const {
    tabs: [USER_FEED]
  } = viewModel;
  const clickHandler = local(e => onClickTab());

  $: isUserFeed = tab === USER_FEED;
</script>

<li class="nav-item">
  <a
    href="/"
    class={isUserFeed ? 'nav-link active' : 'nav-link'}
    on:click={clickHandler}>
    Your Feed
  </a>
</li>
