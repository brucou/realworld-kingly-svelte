<script>
  import { events } from "../constants";
  import ListErrors from "./ListErrors.svelte";

  export let dispatch;
  export let inProgress;
  export let errors;
  export let title;
  export let description;
  export let body;
  export let currentTag;
  export let tagList;

  const { CLICKED_PUBLISH, ADDED_TAG, REMOVED_TAG, EDITED_TAG } = events;

  const watchForEnter = ev => {
    if (ev.keyCode === 13) {
      ev.preventDefault();
      const formData = new FormData(ev.target.closest("form"));
      const tag = formData.get("tag");
      dispatch({ [ADDED_TAG]: tag });
    }
  };
  const updateCurrentTag = ev => {
    dispatch({ [EDITED_TAG]: ev.target.value });
  };
  const removeTag = tag => ev => dispatch({ [REMOVED_TAG]: tag });
  const onSubmit = ev => {
    const formData = new FormData(ev.target.closest("form"));
    const title = formData.get("title");
    const description = formData.get("description");
    const body = formData.get("body");
    dispatch({ [CLICKED_PUBLISH]: { title, description, body, tagList } });
  };
</script>

<div class="editor-page">
  <div class="container page">
    <div class="row">
      <div class="col-md-10 offset-md-1 col-xs-12">
        <ListErrors {errors} />

        <form>
          <fieldset>
            <fieldset class="form-group">
              <input
                name="title"
                class="form-control form-control-lg"
                type="text"
                placeholder="Article Title"
                value={title} />
            </fieldset>

            <fieldset class="form-group">
              <input
                name="description"
                class="form-control"
                type="text"
                placeholder="What's this article about?"
                value={description} />
            </fieldset>

            <fieldset class="form-group">
              <textarea
                name="body"
                class="form-control"
                rows="8"
                placeholder="Write your article (in markdown)"
                value={body} />
            </fieldset>

            <fieldset class="form-group">
              <input
                name="tag"
                class="form-control"
                type="text"
                placeholder="Enter tags"
                on:input={updateCurrentTag}
                value={currentTag}
                on:keyup={watchForEnter} />

              <div class="tag-list">
                {#if tagList}
                  {#each tagList as tag (tag)}
                    <span class="tag-default tag-pill">
                      <i class="ion-close-round" on:click={removeTag(tag)} />
                      {tag}
                    </span>
                  {/each}
                {/if}
              </div>
            </fieldset>

            <button
              class="btn btn-lg pull-xs-right btn-primary"
              type="button"
              disabled={inProgress}
              on:click={onSubmit}>
              Publish Article
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  </div>
</div>
