import { storiesOf } from '@storybook/svelte';
import { action } from '@storybook/addon-actions';
import {tagsFixture, tagsErrorFixture} from "../tests/fixtures/tags"

import Tags from '../src/UI/Tags.svelte';
import { viewModel } from "../src/constants"

const {
  tabs: [USER_FEED, GLOBAL_FEED],
  fetchStatus: [LOADING, NOK, OK]
} = viewModel;

const userFixture = {
  "email": "jake@jake.jake",
  "token": "jwt.token.here",
  "username": "jake",
  "bio": "I work at statefarm",
  "image": null
};

storiesOf('Tags', module)
  .add('Tag list loading - undefined tags', () => ({
    Component: Tags,
    props: { tags: void 0, fetchStatus: LOADING },
    on: { },
  }))
  .add('Tag list loading - null tags', () => ({
    Component: Tags,
    props: { tags: null, fetchStatus: LOADING },
    on: { },
  }))
  .add('Tag list loading - fetched tags', () => ({
    Component: Tags,
    props: { tags: tagsFixture.tags, fetchStatus: LOADING },
    on: { },
  }))
  .add('Tag list fetched - non empty tag list', () => ({
    Component: Tags,
    props: { tags: tagsFixture.tags, fetchStatus: OK },
    on: { },
  }))
  .add('Tag list fetched - empty tag list', () => ({
    Component: Tags,
    props: { tags: [], fetchStatus: OK },
    on: { },
  }))
  .add('Tag list fetched - undefined tag list', () => ({
    Component: Tags,
    props: { tags: void 0, fetchStatus: OK },
    on: { },
  }))
  .add('Tag list fetch failed ', () => ({
    Component: Tags,
    props: { tags: tagsErrorFixture, fetchStatus: NOK },
    on: { },
  }))
  .add('no tag property!', () => ({
    Component: Tags,
    props: { },
    on: { },
  }))
