import { storiesOf } from '@storybook/svelte';
import { action } from '@storybook/addon-actions';
import RealWorld from '../src/UI/RealWorld.svelte';
import { viewModel, routes } from "../src/constants"

const dispatch = action('SignUpRouteHandlers');

const { home, signUp } = routes;

const signUpErrorsFixture = {
  password: ["is bad", "is too short anyways"],
  email: ["is just wrong"],
}

storiesOf('Sign up route', module)
storiesOf('Sign up route', module)
  .add('inProgress = false, no errors', () => ({
    Component: RealWorld,
    props: { route: signUp, dispatch, inProgress: false, errors: null },
    on: { },
  }))
  .add('inProgress = true, no errors', () => ({
    Component: RealWorld,
    props: { route: signUp, dispatch, inProgress: true, errors: null },
    on: { },
  }))
storiesOf('Sign up route', module)
  .add('inProgress = false, errors', () => ({
    Component: RealWorld,
    props: { route: signUp, dispatch, inProgress: false, errors: signUpErrorsFixture },
    on: { },
  }))
