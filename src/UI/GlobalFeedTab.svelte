<script>
  import { viewModel } from "../constants";
  export let tab;

  const {
    tabs: [USER_FEED, GLOBAL_FEED]
  } = viewModel;

  $: isGlobalFeed = tab === GLOBAL_FEED;
</script>

<li class="nav-item">
  <a href=".." class={isGlobalFeed ? 'nav-link active' : 'nav-link'}>
    Global Feed
  </a>
</li>
