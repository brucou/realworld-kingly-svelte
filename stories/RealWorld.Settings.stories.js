import { storiesOf } from '@storybook/svelte';
import { action } from '@storybook/addon-actions';
import RealWorld from '../src/UI/RealWorld.svelte';
import { routes } from "../src/constants"
import { userFixture } from "../tests/fixtures/user"

const dispatch = action('EditorRouteHandlers');

const { settings } = routes;

const settingsErrorsFixture = {
  title: ["can't be blank", "too short (minimum is 1 character)"],
  body: ["can't be blank"],
  description: ["can't be blank", "too short (minimum is 1 character)"]
};
const emptyUserFixture = {
  image: "",
  username:"ss",
  bio:"",
  email:"",
  password:""
};
const filledFormFixture = {
  image: "",
  username:"bricoi",
  bio:"Nice guy",
  email:"a@b.c",
  password:"pwdpwdpwd"
};

storiesOf('Settings route', module)
  .add('inProgress = false, no errors, empty form', () => ({
    Component: RealWorld,
    props: { route: settings, user: emptyUserFixture, dispatch, inProgress: false, errors: null },
    on: { },
  }))
  .add('inProgress = false, no errors, filled form', () => ({
    Component: RealWorld,
    props: { route: settings, user: filledFormFixture, dispatch, inProgress: false, errors: null },
    on: { },
  }))
  .add('inProgress = true, no errors', () => ({
    Component: RealWorld,
    props: { route: settings, user: filledFormFixture, dispatch, inProgress: true, errors: null },
    on: { },
  }))
  .add('inProgress = false, errors', () => ({
    Component: RealWorld,
    props: { route: settings, user: emptyUserFixture,   dispatch, inProgress: false, errors: settingsErrorsFixture },
    on: { },
  }))
