<script>
  import { routes, events } from "../constants";
  import ListErrors from "./ListErrors.svelte";
  import { LOGIN } from "../links";

  export let dispatch;
  export let inProgress;
  export let errors;

  const { CLICKED_SIGNUP } = events;
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
          <a href={LOGIN}>Have an account?</a>
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
