<script>
  import { FAVORITE_PROFILE_PAGE, USER_PROFILE_PAGE } from "../constants";
  import { userArticlesLink, favoritedArticlesLink } from "../links";

  export let profile;
  export let type;
</script>

<ul class="nav nav-pills outline-active">
  <li class="nav-item">
    <a
      class={type === USER_PROFILE_PAGE ? 'nav-link active' : 'nav-link'}
      href={userArticlesLink(profile.username)}>
      My Articles
    </a>
  </li>

  <li class="nav-item">
    <a
      class={type === FAVORITE_PROFILE_PAGE ? 'nav-link active' : 'nav-link'}
      href={favoritedArticlesLink(profile.username)}>
      Favorited Articles
    </a>
  </li>
</ul>
