<script>
  export let article;
  export let onClickFavorite;

  const FAVORITED_CLASS = "btn btn-sm btn-primary pull-xs-right";
  const NOT_FAVORITED_CLASS = "btn btn-sm btn-outline-primary pull-xs-right";
  const handleClick = slug => e => onClickFavorite(slug);

  $: favorited = article.favorited;
  $: favoritesCount = article.favoritesCount;
  $: favoriteButtonClass = favorited ? FAVORITED_CLASS : NOT_FAVORITED_CLASS;
  $: slug = article.slug;
</script>

<button class={favoriteButtonClass} on:click={handleClick(slug)}>
  <i class="ion-heart" />
  {favoritesCount}
</button>
