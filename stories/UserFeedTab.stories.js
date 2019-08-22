import { storiesOf } from '@storybook/svelte';
import { action } from '@storybook/addon-actions';

import UserFeedTab from '../src/UI/UserFeedTab.svelte';
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

storiesOf('UserFeedTab', module)
  .add('UserFeedTab tab', () => ({
    Component: UserFeedTab,
    props: { tab: USER_FEED },
    on: { },
  }))
  .add('Not UserFeedTab tab', () => ({
    Component: UserFeedTab,
    props: { tab: GLOBAL_FEED},
    on: { },
  }))
