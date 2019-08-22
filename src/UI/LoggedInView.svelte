<script>
  import NavItem from "./NavItem.svelte";
  import { HOME, NEW_EDITOR, SETTINGS, profileLink } from "../links";

  export let user;

  $: image = (user && user.image) || null;
</script>

<ul class="nav navbar-nav pull-xs-right">
  <NavItem path={HOME}>Home</NavItem>
  <NavItem path={NEW_EDITOR}>
    <i class="ion-compose" />
    &nbsp;New Article
  </NavItem>
  <NavItem path={SETTINGS}>
    <i class="ion-gear-a" />
    &nbsp;Settings
  </NavItem>
  <NavItem path={profileLink(user.username)}>
    {#if user.image}
      <img src={user.image} class="user-pic" alt={user.username} />
    {/if}
    {user.username}
  </NavItem>
</ul>
