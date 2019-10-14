<script>
  import Fsm from "./SvelteFsm.svelte";
  import RealWorld from "./UI/RealWorld.svelte";

  export let _fsm;
  export let _shouldRender = false;
  export let route;
  export let page;
  export let tags;
  export let articles;
  export let activeFeed;
  export let user;
  export let selectedTag;
  export let favoriteStatus;
  export let inProgress;
  export let errors;

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
      {errors} />
  {/if}
</Fsm>
