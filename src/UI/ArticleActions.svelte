<script>
  import { editorLink } from "../links";

  export let user;
  export let following;
  // DOC: we have one local copy of the remote data (in article) returned by the API
  // then we have a local `favoriteStatus` which is temporary desynchronized from remote
  // -- it is UI state. So we need a separate `favoriteStatus` field to keep track of UI state.
  export let favoriteStatus;
  export let article;
  export let onToggleFollowAuthor;
  export let onToggleFavorite;
  export let onDeleteArticle;

  $: author = article.author;
  $: isNavigatingUserAlsoArticleAuthor = user && user.username === author.username;
  $: followActionMessage = [following ? "Unfollow" : "Follow", author.username].join(" ");
  $: followClasses = [
    "btn btn-sm action-btn",
    author && author.following ? "btn-secondary" : "btn-outline-secondary"
  ].join(" ");
  $: favoriteClasses = [
    "btn btn-sm btn-outline-primary",
    article && article.favorited ? "btn-primary" : "btn-outline-primary"
  ].join(" ");
  $: profileButtonDisabled = following == null;
  $: likeButtonDisabled = favoriteStatus == null;
  $: favoriteCallToAction =
    article && article.favorited ? "Unfavorite article" : "Favorite article";
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
