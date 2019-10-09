<script>
  export let article;
  export let onClickFavorite;
  export let isDisabled;

  const FAVORITED_CLASS = "btn btn-sm btn-primary pull-xs-right";
  const NOT_FAVORITED_CLASS = "btn btn-sm btn-outline-primary pull-xs-right";
  const handleClick = (slug, article) => e =>
    onClickFavorite({ slug, article });

  $: favorited = article.favorited;
  $: favoritesCount = article.favoritesCount;
  $: favoriteButtonClass = [
    favorited ? FAVORITED_CLASS : NOT_FAVORITED_CLASS,
    isDisabled ? "disabled" : ""
  ].join(" ");
  $: slug = article.slug;
</script>

<button class={favoriteButtonClass} on:click={handleClick(slug, article)}>
  <i class="ion-heart" />
  {favoritesCount}
</button>
