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
  .add('default', () => ({
    Component: UserFeedTab,
    props: { tab: USER_FEED, onClickTab: action('onClickUserFeedTab') },
    on: {},
  }))
