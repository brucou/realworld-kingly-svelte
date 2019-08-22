<script>
  import { viewModel } from "../constants";
  export let tab;
  export let user;

  const {
    tabs: [USER_FEED]
  } = viewModel;

  $: isUserFeed = tab === USER_FEED;
  $: token = user && user.token;
</script>

{ #if token }
<li class="nav-item">
  <a href="/" class={isUserFeed ? 'nav-link active' : 'nav-link'}>Your Feed</a>
</li>
{ /if }
