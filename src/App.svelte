<script>
  import Fsm from "./SvelteFsm.svelte";
  import RealWorld from "./UI/RealWorld.svelte";

  export let _fsm;
  export let _shouldRender = false;

    // Props
    // Common props
    export let dispatch;
    export let user;
    export let route;
    // Home route props
    export let tags;
    export let articles;
    export let page;
    export let activeFeed;
    export let selectedTag;
    export let favoriteStatus;
    // Sign up, sign in, editor common props
    export let inProgress;
    export let errors;
    // Editor props
    export let title;
    export let description;
    export let body;
    export let currentTag;
    export let tagList;

  const { fsmFactory, env, eventBus, commandHandlers, effectHandlers, initEvent } = _fsm;

  const next = eventBus.next.bind(eventBus);

  $: {
    console.log(`currentTAg`, currentTag)
  }
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
      />
  {/if}
</Fsm>
