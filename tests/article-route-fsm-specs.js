import QUnit from "qunit"
import { fsmContracts } from "kingly"
import { commands, events, FAVORITE_PROFILE_PAGE, loadingStates, routes, USER_PROFILE_PAGE } from "../src/constants"
import { randomUserProfileFixture, userFixture, } from "./fixtures/user"
import { runUserStories } from "./common"
import { articlesErrorFixture, articlesFixture, articlesPage1Fixture } from "./fixtures/articles"
import {
  favoritedSlugFixture, unfavoritedSlugFixture, updatedLikedArticleFixture, updatedLikedArticlesFixture
} from "./fixtures/slugs"

QUnit.module("Testing article route fsm", {});

// TODO: rewrite tests for new machine!
// TODO: update the docs too!

const {
  ROUTE_CHANGED,
  AUTH_CHECKED,
  TOGGLED_FAVORITE,
  TOGGLE_FOLLOW_OK,
  TOGGLE_FOLLOW_NOK,
  FAVORITE_NOK,
  FAVORITE_OK,
  UNFAVORITE_NOK,
  UNFAVORITE_OK,
  TOGGLED_FOLLOW,
  FETCHED_ARTICLE,
  UPDATED_COMMENT,
  FETCH_COMMENTS_OK,
  DELETE_COMMENTS_OK,
  POST_COMMENTS_OK,
  DELETE_ARTICLE_OK,
  API_REQUEST_FAILED,
  CLICKED_CREATE_COMMENT,
  CLICKED_DELETE_COMMENT,
  CLICKED_DELETE_ARTICLE
} = events;
const {
  RENDER_ARTICLE,
  FETCH_AUTHENTICATION,
  REDIRECT,
  FAVORITE_ARTICLE,
  UNFAVORITE_ARTICLE,
  FOLLOW_PROFILE,
  UNFOLLOW_PROFILE,
} = commands;

const { signUp, article } = routes;
const profileError = new Error(`profile error`);
const articlesError = new Error(`articles error`);
const userProfileFixture = {
  username: 'sanders',
  bio: `bioinformatics`,
  image: null,
  following: false
};
const pendingUserProfileFixture= {
  username: 'sanders',
  bio: `bioinformatics`,
  image: null,
  following: false,
  pending: true
};
const followedProfileFixture = {
  username: 'sanders',
  bio: `bioinformatics`,
  image: null,
  following: true
};
const pendingFollowedProfileFixture= {
  username: 'sanders',
  bio: `bioinformatics`,
  image: null,
  following: true,
  pending: true
};
const OWN_PROFILE_MY_ARTICLES = `/@` + userFixture.username;
const PROFILE_MY_ARTICLES = `/@` + userProfileFixture.username;
const OWN_PROFILE_FAVORITED_ARTICLES = OWN_PROFILE_MY_ARTICLES + '/favorites';
const PROFILE_FAVORITED_ARTICLES = PROFILE_MY_ARTICLES + '/favorites';
const ownUserProfileFixture = {
  username: userFixture.username,
  bio: userFixture.bio,
  image: userFixture.image,
  following: false
};
const UNAUTH_USER = null;
const [TAGS_ARE_LOADING, ARTICLES_ARE_LOADING] = loadingStates;
const unfollowedUnlikedArticleFixture={
  "slug": "how-to-train-your-dragon",
  "title": "How to train your dragon",
  "description": "Ever wonder how?",
  "body": "# Chapter \nIt takes a Jacobian",
  "tagList": ["dragons", "training"],
  "createdAt": "2019-02-18T03:22:56.637Z",
  "updatedAt": "2019-02-18T03:48:35.824Z",
  "favorited": false,
  "favoritesCount": 0,
  "author": {
    "username": "jake",
    "bio": "I work at statefarm",
    "image": "https://i.stack.imgur.com/xHWG8.jpg",
    "following": false
  }
};
const unlikedSlugFixture=unfollowedUnlikedArticleFixture.slug;
const articleRouteFixture = `/article/${unlikedSlugFixture}`
const unfollowedAuthorNotUser = {
  "username": "shake",
  "bio": "I work at statefarm",
  "image": "https://static.productionready.io/images/smiley-cyrus.jpg",
  "following": false
};
const commentByUnfollowedUser = {
  "id": 1,
  "createdAt": "2019-02-18T03:22:56.637Z",
  "updatedAt": "2019-02-18T03:22:56.637Z",
  "body": "It takes a Jacobian",
  "author": {
    "username": userFixture.username,
    "bio": userFixture.bio,
    "image": userFixture.image,
    "following": false
  }
};
const commentByUnfollowedAuthorNotUser = {
  "id": 2,
  "createdAt": "2019-03-18T03:22:56.637Z",
  "updatedAt": "2019-03-18T03:22:56.637Z",
  "body": "Can't agree with that",
  "author": unfollowedAuthorNotUser
};
const commentsFixture=  [
  commentByUnfollowedUser,
  commentByUnfollowedAuthorNotUser,
];
const updatedCommentFixture = 'something';

// Test plan
// .Authenticated user
// |authenticated, like/unlike article| fetched article, like article, like successful|
// |authenticated, follow/unfollow profile| fetched article, follow profile, follow successful|
// |authenticated, post comment| fetched article, post comment, post successful|
// |authenticated, delete comment| fetched article, delete comment, delete successful|
// |authenticated, delete article| fetched article, delete article, delete successful, is redirected to *Home* route|
// Edge cases
// |not authenticated, article does not exist| article fetch fails|
// |authenticated, like/unlike article| fetched article, like article, like unsuccessful|
// |authenticated, follow/unfollow profile| fetched article, follow profile, follow unsuccessful|
// |authenticated, post comment| fetched article, post comment, post unsuccessful|
// |authenticated, delete comment| fetched article, delete comment, delete unsuccessful|
// |authenticated, delete article| fetched article, delete article, delete unsuccessful|

// Main cases
// .Unauthenticated user
// |not authenticated, like/unlike article| fetched article, like article, is redirected to sign up|
const UNAUTH_USER_VIEWS_LIKES_ARTICLE = `Unauthenticated user views an article, and likes it`
const UNAUTH_USER_VIEWS_LIKES_ARTICLE_INPUTS = [
  { [ROUTE_CHANGED]: { hash: articleRouteFixture } },
  { [AUTH_CHECKED]: UNAUTH_USER },
  { [FETCHED_ARTICLE]: unfollowedUnlikedArticleFixture },
  { [FETCH_COMMENTS_OK]: commentsFixture },
  { [UPDATED_COMMENT]: updatedCommentFixture},
  { [TOGGLED_FAVORITE]: {slug: unlikedSlugFixture, isFavorited: false} },
  { [AUTH_CHECKED]: UNAUTH_USER },
];
const UNAUTH_USER_VIEWS_LIKES_ARTICLE_COMMANDS = [
  [
    { [FETCH_AUTHENTICATION]: void 0 },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": null,
        "article": UNAUTH_USER,
        "comments": [],
        "commentText": "",
        "favoriteStatus": null,
        "profileStatus": null
      } },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": UNAUTH_USER,
        "article": unfollowedUnlikedArticleFixture,
        "comments": [],
        "commentText": "",
        "favoriteStatus": null,
        "profileStatus": null
      } },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": UNAUTH_USER,
        "article": unfollowedUnlikedArticleFixture,
        "comments": commentsFixture,
        "commentText": "",
        "favoriteStatus": null,
        "profileStatus": null
      } },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": UNAUTH_USER,
        "article": unfollowedUnlikedArticleFixture,
        "comments": commentsFixture,
        "commentText": updatedCommentFixture,
        "favoriteStatus": null,
        "profileStatus": null
      } },
  ],
  [
    { [FETCH_AUTHENTICATION]: void 0 },
  ],
  [
    {[REDIRECT]: signUp},
    {[FETCH_AUTHENTICATION]: void 0},
  ],
];

// |not authenticated, follow/unfollow profile| fetched article, follow profile, is redirected to sign up|
const UNAUTH_USER_VIEWS_FOLLOWS_PROFILE = `Unauthenticated user views an article, and follows its author`
const UNAUTH_USER_VIEWS_FOLLOWS_PROFILE_INPUTS = [
  { [ROUTE_CHANGED]: { hash: articleRouteFixture } },
  { [AUTH_CHECKED]: UNAUTH_USER },
  { [FETCHED_ARTICLE]: unfollowedUnlikedArticleFixture },
  { [FETCH_COMMENTS_OK]: commentsFixture },
  { [TOGGLED_FOLLOW]:  {username: unfollowedUnlikedArticleFixture.author.username} },
  { [AUTH_CHECKED]: UNAUTH_USER },
];
const UNAUTH_USER_VIEWS_FOLLOWS_PROFILE_COMMANDS = [
  [
    { [FETCH_AUTHENTICATION]: void 0 },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": null,
        "article": UNAUTH_USER,
        "comments": [],
        "commentText": "",
        "favoriteStatus": null,
        "profileStatus": null
      } },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": UNAUTH_USER,
        "article": unfollowedUnlikedArticleFixture,
        "comments": [],
        "commentText": "",
        "favoriteStatus": null,
        "profileStatus": null
      } },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": UNAUTH_USER,
        "article": unfollowedUnlikedArticleFixture,
        "comments": commentsFixture,
        "commentText": "",
        "favoriteStatus": null,
        "profileStatus": null
      } },
  ],
  [
    { [FETCH_AUTHENTICATION]: void 0 },
  ],
  [
    {[REDIRECT]: signUp},
    {[FETCH_AUTHENTICATION]: void 0},
  ],
];

const userStories = [
  [
  UNAUTH_USER_VIEWS_LIKES_ARTICLE,
  UNAUTH_USER_VIEWS_LIKES_ARTICLE_INPUTS,
  UNAUTH_USER_VIEWS_LIKES_ARTICLE_COMMANDS
],
  [
    UNAUTH_USER_VIEWS_FOLLOWS_PROFILE,
    UNAUTH_USER_VIEWS_FOLLOWS_PROFILE_INPUTS,
    UNAUTH_USER_VIEWS_FOLLOWS_PROFILE_COMMANDS
  ]
];

const fsmSettings = { debug: { console, checkContracts: fsmContracts } };

runUserStories(userStories, QUnit, fsmSettings);

// TODO: repass the tests for create mew article, I modified the event shape for FETCHED_ARTICLE!!
// and manybe I will also have to review the machine so the machine only keeps the four props it needs e.g. title, description, body, tagList
// TODO: updated comment do the storybook test, I have no handler on the text area
