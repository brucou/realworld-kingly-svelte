<script>
  export let path;
</script>

<li class="nav-item">
  <a class={'nav-link'} href={path}>
    <slot />
  </a>
</li>
