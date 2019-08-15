<script>
  export let article;

  const FAVORITED_CLASS = "btn btn-sm btn-primary pull-xs-right";
  const NOT_FAVORITED_CLASS = "btn btn-sm btn-outline-primary pull-xs-right";

  $: favorited = article.favorited;
  $: favoritesCount = article.favoritesCount;
  $: favoriteButtonClass = favorited ? FAVORITED_CLASS : NOT_FAVORITED_CLASS;
</script>

<button class={favoriteButtonClass}>
  <i class="ion-heart" />
  {favoritesCount}
</button>
