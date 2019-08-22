<script>
  import LoggedInView from "./LoggedInView.svelte";
  import LoggedOutView from "./LoggedOutView.svelte";
  import { HOME } from "../links";

  export let user;
</script>

<nav class="navbar navbar-light">
  <div class="container">
    <a class="navbar-brand" href={HOME}>conduit</a>
    {#if user}
      <LoggedInView {user} />
    {:else}
      <LoggedOutView />
    {/if}
  </div>
</nav>
