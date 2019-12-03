<script>
  import { editorLink } from "../links";

  export let user;
  // TODO: true (followed), false (not followed), or null (pending) i.e. similar to author.following
  export let profileStatus;
  // TODO: : true (display) or false (pending)
  // DOC: the rule is that we pass UPDATES, so no passing updates deep inside references, we detach the moving part to the top level, and then we renounce using the copy in the original object (or we keep that synchronized)
  export let favoriteStatus;
  export let article;
  export let onToggleFollowAuthor;
  export let onToggleFavorite;
  export let onDeleteArticle;

  $: isNavigatingUserAlsoArticleAuthor = user && user.username === author.username;
  $: followActionMessage = [author.following ? "Unfollow" : "Follow", author.username].join(" ");
  $: followClasses = [
    "btn btn-sm action-btn",
    author && author.following ? "btn-secondary" : "btn-outline-secondary"
  ].join(" ");
  $: favoriteClasses = [
    "btn btn-sm btn-outline-primary",
    article && article.favorited ? "btn-primary" : "btn-outline-primary"
  ].join(" ");
  $: profileButtonDisabled = profileStatus == null;
  $: likeButtonDisabled = Boolean(favoriteStatus);
  $: favoriteCallToAction =
    article && article.favorited ? "Unfavorite article" : "Favorite article";
  $: author = article.author;
</script>

{#if isNavigatingUserAlsoArticleAuthor}
  <span>
    <a href={editorLink(article.slug)} class="btn btn-outline-secondary btn-sm">
      <i class="ion-edit" />
      Edit Article
    </a>

    <button class="btn btn-outline-danger btn-sm" on:click={onDeleteArticle}>
      <i class="ion-trash-a" />
      Delete Article
    </button>
  </span>
{:else}
  <button disabled={profileButtonDisabled} class={followClasses} on:click={onToggleFollowAuthor}>
    <i class="ion-plus-round" />
    &nbsp; {followActionMessage}
  </button>
  <button disabled={likeButtonDisabled} class={favoriteClasses} on:click={onToggleFavorite}>
    <i class="ion-heart" />
    <span>{favoriteCallToAction}</span>
    <span class="counter">({article.favoritesCount})</span>

  </button>
{/if}
