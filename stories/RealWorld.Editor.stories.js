import { storiesOf } from '@storybook/svelte';
import { action } from '@storybook/addon-actions';
import RealWorld from '../src/UI/RealWorld.svelte';
import { routes } from "../src/constants"

const dispatch = action('EditorRouteHandlers');

const { editor } = routes;

const editorErrorsFixture = {
  title: ["can't be blank", "too short (minimum is 1 character)"],
  body: ["can't be blank"],
  description: ["can't be blank", "too short (minimum is 1 character)"]
};
const tagListFixture = ["tag1", "tag2"];

storiesOf('Editor route', module)
  .add('inProgress = false, no errors, empty form', () => ({
    Component: RealWorld,
    props: { route: editor, dispatch, inProgress: false, errors: null, title: "", body:"", description: "", tagList: void 0, currentTag: "" },
    on: { },
  }))
  .add('inProgress = false, no errors, filled form', () => ({
    Component: RealWorld,
    props: { route: editor, dispatch, inProgress: false, errors: null, title: "title fixture", body:"body fixture", description: "desc. fixture", tagList: tagListFixture, currentTag: "parti" },
    on: { },
  }))
  .add('inProgress = true, no errors, filled form', () => ({
    Component: RealWorld,
    props: { route: editor, dispatch, inProgress: true, errors: null, title: "title fixture", body:"body fixture", description: "desc. fixture", tagList: tagListFixture, currentTag: "parti" },
    on: { },
  }))
  .add('inProgress = false, errors, filled form', () => ({
    Component: RealWorld,
    props: { route: editor, dispatch, inProgress: true, errors: editorErrorsFixture, title: "title fixture", body:"body fixture", description: "desc. fixture", tagList: tagListFixture, currentTag: "parti" },
    on: { },
  }))

