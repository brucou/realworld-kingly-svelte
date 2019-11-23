import QUnit from "qunit"
import { fsmContracts } from "kingly"
import { commands, events, loadingStates, routes, USER_PROFILE_PAGE } from "../src/constants"
import { userFixture, } from "./fixtures/user"
import { runUserStories } from "./common"
import { articlesFixture, articlesPage1Fixture } from "./fixtures/articles"
import { unfavoritedSlugFixture, updatedLikedArticleFixture, updatedLikedArticlesFixture } from "./fixtures/slugs"

QUnit.module("Testing user profile route fsm", {});

const {
  ROUTE_CHANGED,
  AUTH_CHECKED,
  CLICKED_PAGE,
  ARTICLES_FETCHED_OK,
  ARTICLES_FETCHED_NOK,
  TOGGLED_FAVORITE,
  FETCHED_PROFILE,
  FETCH_PROFILE_NOK,
  FOLLOW_OK,
  FOLLOW_NOK,
  UNFOLLOW_OK,
  UNFOLLOW_NOK,
  FAVORITE_NOK,
  FAVORITE_OK,
  UNFAVORITE_NOK,
  UNFAVORITE_OK,
} = events;
const {
  RENDER_PROFILE,
  FETCH_AUTHENTICATION,
  REDIRECT,
  FETCH_ARTICLE,
  FAVORITE_ARTICLE,
  UNFAVORITE_ARTICLE,
  FETCH_PROFILE,
  FETCH_AUTHOR_FEED,
  FOLLOW_PROFILE,
  UNFOLLOW_PROFILE,
} = commands;

const { home, profile } = routes;
const OWN_PROFILE_MY_ARTICLES = `/@` + userFixture.username;
const OWN_PROFILE_FAVORITED_ARTICLES = OWN_PROFILE_MY_ARTICLES + '/favorites';
const ownUserProfileFixture = {
  username: userFixture.username,
  bio: userFixture.bio,
  image: userFixture.image,
  following: false
};
const UNAUTH_USER = null;
const [TAGS_ARE_LOADING, ARTICLES_ARE_LOADING] = loadingStates;

// TODO
// |(own profile, favorite articles)| like article, unlike article, change page|
// |(≠ profile, my articles)| follow user, unfollow user|
// |(≠ profile, favorite articles)| like article, unlike article, change page|

// |(own profile, my articles)| like article, unlike article, change page|
const USER_SEES_OWN_PROFILE_AND_ARTICLES_LIKES_UNLIKES_CHANGES_PAGE = `User navigates to the profile route (My articles), sees own profile, own articles, likes and unlikes an article, and change page`;
const USER_SEES_OWN_PROFILE_AND_ARTICLES_LIKES_UNLIKES_CHANGES_PAGE_INPUTS = [
  { [ROUTE_CHANGED]: { hash: OWN_PROFILE_MY_ARTICLES } },
  { [AUTH_CHECKED]: userFixture },
  {[FETCHED_PROFILE]: ownUserProfileFixture},
  {[ARTICLES_FETCHED_OK]: articlesFixture},
  {[TOGGLED_FAVORITE]: {slug: unfavoritedSlugFixture, isFavorited: false}},
  { [AUTH_CHECKED]: userFixture },
  {[FAVORITE_OK]: {article: updatedLikedArticleFixture, slug: unfavoritedSlugFixture}},
  {[TOGGLED_FAVORITE]: {slug: unfavoritedSlugFixture, isFavorited: true}},
  { [AUTH_CHECKED]: userFixture },
  {[UNFAVORITE_OK]: {article: articlesFixture.articles[0], slug: unfavoritedSlugFixture}},
  {[CLICKED_PAGE]: 1},
  { [AUTH_CHECKED]: userFixture },
  {[FETCHED_PROFILE]: ownUserProfileFixture},
  {[ARTICLES_FETCHED_OK]: articlesPage1Fixture},
].flat();
const USER_SEES_OWN_PROFILE_AND_ARTICLES_LIKES_UNLIKES_CHANGES_PAGE_COMMANDS = [
  [
    { [FETCH_AUTHENTICATION]: void 0 },
    { [RENDER_PROFILE]: {
        "articles": null,
        "favoriteStatus": null,
        "page": 0,
        "profile": null,
        "profileTab": null,
        "route": profile,
        "user": null
      } },
  ],
  [
    {[FETCH_PROFILE]: userFixture.username},
    {[FETCH_AUTHOR_FEED]: {username: userFixture.username, page: 0, feedType: USER_PROFILE_PAGE }},
    {[RENDER_PROFILE]: {
      route: profile, profileTab: USER_PROFILE_PAGE, user: userFixture, profile: null, articles: ARTICLES_ARE_LOADING, favoriteStatus: null, page: 0}
      },
    ],
    [
      {[RENDER_PROFILE]: {
        route: profile, profileTab: USER_PROFILE_PAGE, user: userFixture, profile: ownUserProfileFixture, articles: ARTICLES_ARE_LOADING, favoriteStatus: null, page: 0}
    },
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile, profileTab: USER_PROFILE_PAGE, user: userFixture, profile: ownUserProfileFixture, articles: articlesFixture, favoriteStatus: null, page: 0}
    },
  ],
  [
    {[FETCH_AUTHENTICATION]: void 0},
  ],
  [
    {[RENDER_PROFILE]: {
      route: profile,
        profileTab: USER_PROFILE_PAGE,
        user: userFixture,
        profile: ownUserProfileFixture,
        articles: articlesFixture,
        favoriteStatus: unfavoritedSlugFixture,
        page: 0
    }
  },
    {[FAVORITE_ARTICLE]: { slug: unfavoritedSlugFixture}},
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile, profileTab: USER_PROFILE_PAGE, user: userFixture, profile: ownUserProfileFixture, articles: updatedLikedArticlesFixture, favoriteStatus: null, page: 0}
    },
  ],
  [
    {[FETCH_AUTHENTICATION]: void 0},
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile,
        profileTab: USER_PROFILE_PAGE,
        user: userFixture,
        profile: ownUserProfileFixture,
        articles: updatedLikedArticlesFixture,
        favoriteStatus: unfavoritedSlugFixture,
        page: 0
      }
    },
    {[UNFAVORITE_ARTICLE]: { slug: unfavoritedSlugFixture}},
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile, profileTab: USER_PROFILE_PAGE, user: userFixture, profile: ownUserProfileFixture, articles: articlesFixture, favoriteStatus: null, page: 0}
    },
  ],
  [{ [FETCH_AUTHENTICATION]: void 0 },],
  [
    {[FETCH_PROFILE]: userFixture.username},
    {[FETCH_AUTHOR_FEED]: {username: userFixture.username, page: 1, feedType: USER_PROFILE_PAGE }},
    {[RENDER_PROFILE]: {
        route: profile, profileTab: USER_PROFILE_PAGE, user: userFixture, profile: ownUserProfileFixture, articles: ARTICLES_ARE_LOADING, favoriteStatus: null, page: 1}
    },
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile, profileTab: USER_PROFILE_PAGE, user: userFixture, profile: ownUserProfileFixture, articles: ARTICLES_ARE_LOADING, favoriteStatus: null, page: 1}
    },
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile, profileTab: USER_PROFILE_PAGE, user: userFixture, profile: ownUserProfileFixture, articles: articlesPage1Fixture, favoriteStatus: null, page: 1}
    },
  ],
];

const userStories = [
  [
    USER_SEES_OWN_PROFILE_AND_ARTICLES_LIKES_UNLIKES_CHANGES_PAGE,
    USER_SEES_OWN_PROFILE_AND_ARTICLES_LIKES_UNLIKES_CHANGES_PAGE_INPUTS,
    USER_SEES_OWN_PROFILE_AND_ARTICLES_LIKES_UNLIKES_CHANGES_PAGE_COMMANDS
  ],
];

const fsmSettings = { debug: { console, checkContracts: fsmContracts } };

runUserStories(userStories, QUnit, fsmSettings);
