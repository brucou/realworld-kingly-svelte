import { storiesOf } from '@storybook/svelte';
import { action } from '@storybook/addon-actions';
import RealWorld from '../src/UI/RealWorld.svelte';
import { routes } from "../src/constants"

const dispatch = action('SignInRouteHandlers');

const { signIn } = routes;

const signInErrorsFixture = {
  password: ["is bad", "is too short anyways"],
  email: ["is just wrong"],
}

storiesOf('Sign in route', module)
storiesOf('Sign in route', module)
  .add('inProgress = false, no errors', () => ({
    Component: RealWorld,
    props: { route: signIn, user: null, dispatch, inProgress: false, errors: null },
    on: { },
  }))
  .add('inProgress = true, no errors', () => ({
    Component: RealWorld,
    props: { route: signIn, user: null, dispatch, inProgress: true, errors: null },
    on: { },
  }))
storiesOf('Sign in route', module)
  .add('inProgress = false, errors', () => ({
    Component: RealWorld,
    props: { route: signIn, user: null, dispatch, inProgress: false, errors: signInErrorsFixture },
    on: { },
  }))
