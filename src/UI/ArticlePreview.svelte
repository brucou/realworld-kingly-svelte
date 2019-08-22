<script>
  import { articleLink, profileLink } from "../links";
  import { format } from "../shared/date";
  import FavoriteButton from "./FavoriteButton.svelte";

  export let article;

  // NOTE: it seems like Svelte does not currently allows destructuring in reactive statements!
  $: authorUserName = article.author.username;
  $: authorImage = article.author.image;
  $: createdAt = article.createdAt;
  $: slug = article.slug;
  $: description = article.description;
  $: title = article.title;
  $: tagList = article.tagList;
</script>

<div class="article-preview">
  <div class="article-meta">
    <a href={profileLink(authorUserName)}>
      <img src={authorImage} alt="post's author image"/>
    </a>
    <div class="info">
      <a class="author" href={profileLink(authorUserName)}>{authorUserName}</a>
      <span class="date">{format(createdAt)}</span>
    </div>
    <FavoriteButton {article} />
  </div>
  <a href={articleLink(article.slug)} class="preview-link">
    <h1>{title}</h1>
    <p>{description}</p>
    <span>Read more...</span>
    <ul class="tag-list">
      {#each tagList as tag (tag)}
        <li class="tag-default tag-pill tag-outline">{tag}</li>
      {/each}
    </ul>
  </a>
</div>
