<script>
  import Fsm from "./SvelteFsm.svelte";
  import RealWorld from "./UI/RealWorld.svelte";

  export let _fsm;
  export let _shouldRender = false;

  //// Props
  /// Common props
  export let user;
  export let route;
  /// Home route props
  export let tags;
  export let articles;
  export let page;
  export let activeFeed;
  export let selectedTag;
  export let favoriteStatus;
  /// Sign up, sign in, editor common props
  export let inProgress;
  export let errors;
  /// Editor props
  export let title;
  export let description;
  export let body;
  export let currentTag;
  export let tagList;
  /// Settings props
  /// Profile props
  export let profile;
  export let profileTab;
  /// Article props
  export let article;
  // The comments for the article as returned by the API
  export let comments;
  // The content of the comment text area (controlled field)
  export let commentText;
  // Status for profile following requests
  export let following;

  const { fsmFactory, env, eventBus, commandHandlers, effectHandlers, initEvent } = _fsm;

  const next = eventBus.next.bind(eventBus);
</script>

<Fsm {fsmFactory} {env} {eventBus} {commandHandlers} {effectHandlers} {initEvent}>
  {#if _shouldRender}
    <RealWorld
      dispatch={next}
      {route}
      {tags}
      {articles}
      {page}
      {activeFeed}
      {user}
      {selectedTag}
      {favoriteStatus}
      {inProgress}
      {errors}
      {title}
      {description}
      {body}
      {currentTag}
      {tagList}
      {profile}
      {profileTab}
      {article}
      {comments}
      {commentText}
      {following} />
  {/if}
</Fsm>
