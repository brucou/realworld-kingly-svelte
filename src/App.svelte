<script>
  import Fsm from "./SvelteFsm.svelte";
  import RealWorld from "./UI/RealWorld.svelte";

  export let _fsm;
  export let _shouldRender = false;
  export let page;
  export let tags;
  export let articles;
  export let activeFeed;
  export let user;
  export let selectedTag;

  const {
    fsmFactory,
    env,
    eventBus,
    commandHandlers,
    effectHandlers,
    initEvent
  } = _fsm;

  const next = eventBus.next.bind(eventBus);
</script>

<Fsm
  {fsmFactory}
  {env}
  {eventBus}
  {commandHandlers}
  {effectHandlers}
  {initEvent}>
  {#if _shouldRender}
    <RealWorld
      {tags}
      {articles}
      {page}
      {activeFeed}
      {user}
      {selectedTag}
      dispatch={next} />
  {/if}
</Fsm>
