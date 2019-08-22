import { storiesOf } from '@storybook/svelte';
import { action } from '@storybook/addon-actions';

import LoggedOutView from '../src/UI/LoggedOutView.svelte';

storiesOf('LoggedOutView', module)
  .add('unauthenticated', () => ({
    Component: LoggedOutView,
    props: {  },
    on: { },
  }))
