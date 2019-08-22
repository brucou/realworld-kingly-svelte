import { storiesOf } from '@storybook/svelte';
import { action } from '@storybook/addon-actions';

import Header from '../src/UI/Header.svelte';

const userFixture = {
  "email": "jake@jake.jake",
  "token": "jwt.token.here",
  "username": "jake",
  "bio": "I work at statefarm",
  "image": null
};

storiesOf('Header', module)
  .add('unauthenticated', () => ({
    Component: Header,
    props: { user: null },
    on: { },
  }))
  .add('authenticated', () => ({
    Component: Header,
    props: { user: userFixture },
    on: { },
  }))
