import { storiesOf } from '@storybook/svelte';
import {articlesErrorFixture, articlesFixture, articlesEmptyFixture} from "../tests/fixtures/articles"
import {tagsFixture, tagsErrorFixture} from "../tests/fixtures/tags"
import RealWorld from '../src/UI/RealWorld.svelte';
import { viewModel } from "../src/constants"

const {
  fetchStatus: [LOADING, NOK, OK]
} = viewModel;

const tagsLoadingFixture = LOADING;
const articlesLoadingFixture = LOADING;

storiesOf('RealWorld - not authenticated', module)
  .add('RealWorld - page 0, loading tags, loading articles', () => ({
    Component: RealWorld,
    props: { articles: articlesLoadingFixture, tags:tagsLoadingFixture, page: 0 },
    on: { },
  }))
  .add('RealWorld - page 0, fetched tags, loading articles', () => ({
    Component: RealWorld,
    props: { articles: articlesLoadingFixture, tags:tagsFixture, page: 0 },
    on: { },
  }))
  .add('RealWorld - page 0, fetched tags, fetched articles', () => ({
    Component: RealWorld,
    props: { articles: articlesFixture, tags:tagsFixture, page: 0 },
    on: { },
  }))
  .add('RealWorld - page 1, fetched tags, fetched articles', () => ({
    Component: RealWorld,
    props: { articles: articlesFixture, tags:tagsFixture, page: 1},
    on: { },
  }))
  .add('RealWorld - page 1, fetched tags, failed fetched articles', () => ({
    Component: RealWorld,
    props: { articles: articlesErrorFixture, tags:tagsFixture, page: 1  },
    on: { },
  }))
  .add('RealWorld - page 0, failed fetched tags, fetched articles', () => ({
    Component: RealWorld,
    props: { articles: articlesFixture, tags:tagsErrorFixture, page: 0 },
    on: { },
  }))
  .add('RealWorld - page 0, failed fetched tags, failed fetched articles', () => ({
    Component: RealWorld,
    props: { articles: articlesErrorFixture, tags:tagsErrorFixture, page: 0 },
    on: { },
  }))

storiesOf('RealWorld - no articles', module)
  .add('RealWorld - GLOBAL_FEED, page 0, fetched tags, no articles', () => ({
    Component: RealWorld,
    props: { articles: articlesEmptyFixture, tags:tagsFixture, page: 0  },
    on: { },
  }))
