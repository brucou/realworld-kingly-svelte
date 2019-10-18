<script>
  import { events } from "../constants";
  import ListErrors from "./ListErrors.svelte";

  export let dispatch;
  export let inProgress;
  export let errors;
  // Initial value for the form fields
  // All fields are uncontrolled here
  export let image;
  export let username;
  export let bio;
  export let email;
  export let password;

  const { CLICKED_LOG_OUT, CLICKED_UPDATE_SETTINGS } = events;

  const updateSettings = ev => {
    // We need to read the value from the DOM as
    // it is not replicated in the props (uncontrolled fields)
    ev.preventDefault();
    const formData = new FormData(ev.target.closest("form"));
    const image = formData.get("image");
    const username = formData.get("username");
    const bio = formData.get("bio");
    const email = formData.get("email");
    const password = formData.get("password");
    dispatch({ [CLICKED_UPDATE_SETTINGS]: { image, username, bio, email, password } });
  };

  const logout = ev => {
    dispatch({[CLICKED_LOG_OUT]: void 0})
  };
</script>

<div class="settings-page">
  <div class="container page">
    <div class="row">
      <div class="col-md-6 offset-md-3 col-xs-12">
        <h1 class="text-xs-center">Your Settings</h1>

        <ListErrors {errors} />

        <form onsubmit={updateSettings}>
          <fieldset>
            <fieldset class="form-group">
              <input
                name="image"
                class="form-control"
                type="text"
                placeholder="URL of profile picture"
                value={image} />
            </fieldset>

            <fieldset class="form-group">
              <input
                name="username"
                class="form-control form-control-lg"
                type="text"
                placeholder="Username"
                value={username} />
            </fieldset>

            <fieldset class="form-group">
              <textarea
                name="bio"
                class="form-control form-control-lg"
                rows="8"
                placeholder="Short bio about you"
                value={bio} />
            </fieldset>

            <fieldset class="form-group">
              <input
                name="email"
                class="form-control form-control-lg"
                type="email"
                placeholder="Email"
                value={email} />
            </fieldset>

            <fieldset class="form-group">
              <input
                name="password"
                class="form-control form-control-lg"
                type="password"
                placeholder="New Password"
                value={password} />
            </fieldset>

            <button
              class="btn btn-lg btn-primary pull-xs-right"
              type="submit"
              disabled={inProgress}>
              Update Settings
            </button>
          </fieldset>
        </form>

        <hr />

        <button class="btn btn-outline-danger" onclick={logout}>Or click here to logout.</button>
      </div>
    </div>
  </div>
</div>
