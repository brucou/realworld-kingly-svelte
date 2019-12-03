<script>
  import { LOGIN, REGISTER } from "../links";
  import Comment from "./Comment.svelte";

  export let slug;
  export let user;
  export let author;
  export let comments;
  export let commentText;
  export let onCreateComment;
  export let onDeleteComment;
  export let onUpdatedComment;
</script>

<div class="col-xs-12 col-md-8 offset-md-2">
  {#if user}
    <div>
      <form class="card comment-form" on:submit={onCreateComment}>
        <div class="card-block">
          <textarea
            class="form-control"
            placeholder="Write a comment..."
            value={commentText}
            rows="3"
            on:input={onUpdatedComment} />
        </div>
        <div class="card-footer">
          {#if user.image}
            <img src={user.image} class="comment-author-img" alt={user.username} />
          {/if}
          <button class="btn btn-sm btn-primary" type="submit">Post Comment</button>
        </div>
      </form>
    </div>
  {:else}
    <p>
      <a href={LOGIN}>Sign in</a>
      &nbsp;or&nbsp;
      <a href={REGISTER}>sign up</a>
      &nbsp;to add comments on this article.
    </p>
  {/if}

  <div>
    {#each comments as comment (comment.id)}
      <Comment {comment} {slug} {user} deleteComment={onDeleteComment} />
    {/each}
  </div>
</div>
