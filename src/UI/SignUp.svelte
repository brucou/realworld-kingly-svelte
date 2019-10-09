<script>
  import { routes, events } from "../constants";
  import ListErrors from "./ListErrors.svelte";

  export let dispatch;
  export let inProgress;
  export let errors;

  const [
    ROUTE_CHANGED,
    TAGS_FETCHED_OK,
    TAGS_FETCHED_NOK,
    ARTICLES_FETCHED_OK,
    ARTICLES_FETCHED_NOK,
    AUTH_CHECKED,
    CLICKED_TAG,
    CLICKED_PAGE,
    CLICKED_USER_FEED,
    CLICKED_GLOBAL_FEED,
    TOGGLED_FAVORITE,
    FAVORITE_OK,
    FAVORITE_NOK,
    UNFAVORITE_OK,
    UNFAVORITE_NOK,
    CLICKED_SIGNUP
  ] = events;
  const { home, signUp, logIn } = routes;
  const onSubmit = ev => {
    ev.preventDefault();
    const formData = new FormData(ev.target);
    const email = formData.get("email");
    const username = formData.get("username");
    const password = formData.get("password");
    dispatch({ [CLICKED_SIGNUP]: { email, username, password } });
  };
</script>

<div class="auth-page">
  <div class="container page">
    <div class="row">
      <div class="col-md-6 offset-md-3 col-xs-12">
        <h1 class="text-xs-center">Sign Up</h1>
        <p class="text-xs-center">
          <a href={logIn}>Have an account?</a>
        </p>

        <ListErrors {errors} />

        <form on:submit={onSubmit}>
          <fieldset>
            <fieldset class="form-group">
              <input
                name="username"
                class="form-control form-control-lg"
                type="text"
                placeholder="Username"
                value="" />
            </fieldset>

            <fieldset class="form-group">
              <input
                name="email"
                class="form-control form-control-lg"
                type="email"
                placeholder="Email"
                value="" />
            </fieldset>

            <fieldset class="form-group">
              <input
                name="password"
                class="form-control form-control-lg"
                type="password"
                placeholder="Password"
                value="" />
            </fieldset>

            <button
              class="btn btn-lg btn-primary pull-xs-right"
              type="submit"
              disabled={inProgress}>
              Sign up
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  </div>
</div>
