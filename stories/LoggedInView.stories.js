import { storiesOf } from '@storybook/svelte';
import { action } from '@storybook/addon-actions';

import LoggedInView from '../src/UI/LoggedInView.svelte';

const userFixture = {
  "email": "jake@jake.jake",
  "token": "jwt.token.here",
  "username": "jake",
  "bio": "I work at statefarm",
  "image": null
};

storiesOf('LoggedInView', module)
  .add('authenticated', () => ({
    Component: LoggedInView,
    props: { user: userFixture },
    on: { },
  }))
