<script>
  import { viewModel } from "../constants";
  import { local } from "../shared/events";

  export let tab;
  export let onClickTab;

  const {
    tabs: [USER_FEED, GLOBAL_FEED]
  } = viewModel;
  const clickHandler = local(e => onClickTab());

  $: isGlobalFeed = tab === GLOBAL_FEED;
</script>

<li class="nav-item">
  <a
    href=".."
    class={isGlobalFeed ? 'nav-link active' : 'nav-link'}
    on:click={clickHandler}>
    Global Feed
  </a>
</li>
