<script>
  import NavItem from "./NavItem.svelte";
  import { HOME, LOGIN, REGISTER } from "../links";
</script>

<ul class="nav navbar-nav pull-xs-right">
  <NavItem path={HOME}>Home</NavItem>
  <NavItem path={LOGIN}>Sign in</NavItem>
  <NavItem path={REGISTER}>Sign up</NavItem>
</ul>
