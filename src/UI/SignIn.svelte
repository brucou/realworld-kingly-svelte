<script>
  import { routes, events } from "../constants";
  import ListErrors from "./ListErrors.svelte";
  import { REGISTER } from "../links";

  export let dispatch;
  export let inProgress;
  export let errors;

  const {    CLICKED_SIGN_IN  } = events;
  const onSubmit = ev => {
    ev.preventDefault();
    const formData = new FormData(ev.target);
    const email = formData.get("email");
    const password = formData.get("password");
    dispatch({ [CLICKED_SIGN_IN]: { email, password } });
  };
</script>

<div class="auth-page">
  <div class="container page">
    <div class="row">
      <div class="col-md-6 offset-md-3 col-xs-12">
        <h1 class="text-xs-center">Sign In</h1>
        <p class="text-xs-center">
          <a href={REGISTER}>Need an account?</a>
        </p>

        <ListErrors {errors} />

        <form on:submit={onSubmit}>
          <fieldset>
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
              Sign in
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  </div>
</div>
