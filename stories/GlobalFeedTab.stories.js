import { storiesOf } from '@storybook/svelte';
import { action } from '@storybook/addon-actions';

import GlobalFeedTab from '../src/UI/GlobalFeedTab.svelte';
import { viewModel } from "../src/constants"

const {
  tabs: [USER_FEED, GLOBAL_FEED]
} = viewModel;

const userFixture = {
  "email": "jake@jake.jake",
  "token": "jwt.token.here",
  "username": "jake",
  "bio": "I work at statefarm",
  "image": null
};

storiesOf('GlobalFeedTab', module)
  .add('GlobalFeed tab', () => ({
    Component: GlobalFeedTab,
    props: { tab: GLOBAL_FEED, onClickTab: action('onClickGlobalFeedTab') },
    on: { },
  }))
  .add('Not GlobalFeed tab', () => ({
    Component: GlobalFeedTab,
    props: { tab: USER_FEED, onClickTab: action('onClickGlobalFeedTab')},
    on: { },
  }))
