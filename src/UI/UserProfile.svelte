<script>
  import ArticleList from "./ArticleList.svelte";
  import Tabs from "./Tabs.svelte";
  import { routes, events } from "../constants";
  import { SETTINGS} from "../links";
  import { computeFetchStatus } from "./shared";

  export let dispatch;
  export let profileTab;
  // Authenticated user
  export let user;
  // Profile navigated to
  // profile.following is Boolean | null (null iff pending a follow/unfollow request)
  export let profile;
  export let articles;
  // Actually that is the slug of the article - should change the name really
  export let favoriteStatus;
  export let page;

  const { CLICKED_PAGE, TOGGLED_FAVORITE, TOGGLED_FOLLOW } = events;
  const onClickPage = page => {
    dispatch({ [CLICKED_PAGE]: page });
  };
  const onClickFavorite = ({ slug, article }) => {
    dispatch({ [TOGGLED_FAVORITE]: { slug } });
  };
  const handleClick = ev => {
    dispatch({ [TOGGLED_FOLLOW]: {username: profile.username }});
  };

  $: classes =
    "btn btn-sm action-btn" + (profile && profile.following ? " btn-secondary" : " btn-outline-secondary");
  $: isUser = profile && Boolean(user && user.username === profile.username);
  $: articleList = typeof articles === "object" ? articles && articles.articles : void 0;
  $: articlesCount = typeof articles === "object" ? articles && articles.articlesCount : 0;
  $: articlesFetchStatus = articles && computeFetchStatus(articles);
  $: disabled = Boolean(profile && profile.pending)
  $: following = profile && profile.following
  $: username = profile && profile.username
  $: image = profile && profile.image
  $: bio = profile && profile.bio || ""
</script>

  {#if username}
<div class="profile-page" key={'profile-' + profileTab}>
    <div>
      <div class="user-info">
        <div class="container">
          <div class="row">
            <div class="col-xs-12 col-md-10 offset-md-1">
             {#if image}
              <img class="user-img" src={image} alt={username} />
              {:else}
              <img class="user-img" />
              {/if}
              <h4>{username}</h4>
              <p>{bio}</p>

              {#if isUser}
                <a href={SETTINGS} class="btn btn-sm btn-outline-secondary action-btn">
                  <i class="ion-gear-a" />
                  Edit Profile Settings
                </a>
              {:else}
                <button {disabled} class={classes} on:click={handleClick}>
                  <i class="ion-plus-round" />
                  &nbsp; {following ? 'Unfollow' : 'Follow'} {username}
                </button>
              {/if}

            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <div class="articles-toggle">
              <Tabs {profile} type="{profileTab}" />
            </div>

            <ArticleList
              articles = {articleList}
              {articlesCount}
              currentPage = {page}
              fetchStatus={articlesFetchStatus}
              {onClickPage}
              {onClickFavorite}
              {favoriteStatus} />
          </div>
        </div>
      </div>
    </div>
</div>
  {/if}
