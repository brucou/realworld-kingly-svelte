<script>
  export let comment;
  export let slug;
  export let deleteComment;
  export let user;

  import { userArticlesLink } from "../links";
  import { formatDate } from "./shared";

  $: isNavigatingUserAlsoCommentAuthor = user && comment.author.username === user.username;
</script>

<div class="card">
  <div class="card-block">
    <p class="card-text">{comment.body}</p>
  </div>
  <div class="card-footer">
    <a href={userArticlesLink(comment.author.username)} class="comment-author">
      <img src={comment.author.image} class="comment-author-img" alt={comment.author.username} />
    </a>
    &nbsp;
    <a href={userArticlesLink(comment.author.username)} class="comment-author">
      {comment.author.username}
    </a>
    <span class="date-posted">{formatDate(comment.createdAt)}</span>

    {#if isNavigatingUserAlsoCommentAuthor}
      <span class="mod-options">
        <i class="ion-trash-a" on:click={deleteComment(comment.id)} />
      </span>
    {/if}
  </div>
</div>
