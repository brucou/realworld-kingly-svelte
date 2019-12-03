<script>
  import ArticleActions from "./ArticleActions.svelte";
  import CommentContainer from "./CommentContainer.svelte";
  import marked from "marked";
  import { events } from "../constants";
  import { profileLink } from "../links";
  import { formatDate } from "./shared";

  export let dispatch;
  // Article as from [API](https://github.com/gothinkster/realworld/tree/master/api#single-article)
  // The article as returned by the API
  export let article;
  // The comments for the article as returned by the API
  export let comments;
  // The content of the comment text area (controlled field)
  export let commentText;
  // The current user (as returned by the API)
  export let user;
  // Status for favoriting and following requests
  export let favoriteStatus;
  export let profileStatus;

  const {
    CLICKED_DELETE_ARTICLE,
    CLICKED_CREATE_COMMENT,
    CLICKED_DELETE_COMMENT,
    UPDATED_COMMENT,
    TOGGLED_FAVORITE,
    TOGGLED_FOLLOW
  } = events;
  const onDeleteArticle = ev => {
    dispatch({ [CLICKED_DELETE_ARTICLE]: article.slug });
  };
  const onToggleFavorite = ev => {
    dispatch({ [TOGGLED_FAVORITE]: { slug: article.slug, isFavorited: article.favorited } });
  };
  const onToggleFollowAuthor = ev => {
    dispatch({ [TOGGLED_FOLLOW]: { username: article.author.username } });
  };
  const onCreateComment = ev => {
    e.preventDefault();
    dispatch({ [CLICKED_CREATE_COMMENT]: { slug: article.slug, body: commentText } });
  };
  const onDeleteComment = id => ev => {
    dispatch({ [CLICKED_DELETE_COMMENT]: { slug: article.slug, id } });
  };
  const onUpdatedComment = ev => {
    dispatch({ [UPDATED_COMMENT]: ev.target.value });
  };

  $: innerHTML = (article && marked(article.body, { sanitize: true })) || "";
  $: {console.log(`innerHTML`, innerHTML)}
  $: author = (article && article.author) || "";
  $: profileHref =
    (article &&
      article.author &&
      article.author.username &&
      profileLink(article.author.username)) ||
    "";
  $: createdAt = (article && article.createdAt && formatDate(article.createdAt)) || "";
  $: tagList = (article && article.tagList) || [];
  $: slug = (article && article.slug) || "";
</script>

{#if article}
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>{article.title}</h1>
        <div class="article-meta">
          <a href={profileHref}>
            <img src={author.image} />
          </a>

          <div class="info">
            <a href={profileHref} class="author">{author.username || ''}</a>
            <span class="date">{createdAt}</span>
          </div>

          <ArticleActions
            {user}
            {article}
            {profileStatus}
            {favoriteStatus}
            {onToggleFollowAuthor}
            {onToggleFavorite}
            {onDeleteArticle} />
        </div>
      </div>
    </div>

    <div class="container page">
      <div class="row article-content">
        <div class="col-xs-12">
          <div>
            {@html innerHTML}
          </div>
          <ul class="tag-list">
            {#each tagList as tag (tag)}
              <li class="tag-default tag-pill tag-outline">{tag}</li>
            {/each}
          </ul>
        </div>
      </div>

      <hr />

      <div class="article-actions" />

      {#if comments}
        <div class="row">
          <CommentContainer
            {slug}
            {user}
            {author}
            {comments}
            {commentText}
            {onCreateComment}
            {onDeleteComment} />
        </div>
      {/if}
    </div>
  </div>
{/if}
