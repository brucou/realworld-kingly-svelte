import QUnit from "qunit"
import { fsmContracts } from "kingly"
import { articleError, commands, events, routes, } from "../src/constants"
import { userFixture, } from "./fixtures/user"
import { runUserStories } from "./common"

QUnit.module("Testing article route fsm", {});

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
  DELETE_COMMENT_OK,
  POST_COMMENT_OK,
  DELETE_ARTICLE_OK,
  API_REQUEST_FAILED,
  CLICKED_CREATE_COMMENT,
  CLICKED_DELETE_COMMENT,
  CLICKED_DELETE_ARTICLE,
  FAILED_FETCH_ARTICLE
} = events;
const {
  RENDER_ARTICLE,
  RENDER_HOME,
  FETCH_AUTHENTICATION,
  REDIRECT,
  FETCH_ARTICLE,
  FETCH_COMMENTS,
  FAVORITE_ARTICLE,
  UNFAVORITE_ARTICLE,
  FOLLOW_PROFILE,
  UNFOLLOW_PROFILE,
  POST_COMMENT,
  DELETE_COMMENT,
  DELETE_ARTICLE
} = commands;

const { article, home, signUp } = routes;
const articlesError = new Error(`articles error`);
const userProfileFixture = {
  username: 'sanders',
  bio: `bioinformatics`,
  image: null,
  following: false,
  token: "jwt.token.there",
};
const ownUserProfileFixture = {
  username: userFixture.username,
  bio: userFixture.bio,
  image: userFixture.image,
  following: false
};
const ownUserProfileFollowedFixture = {
  username: userFixture.username,
  bio: userFixture.bio,
  image: userFixture.image,
  following: true
};
const UNAUTH_USER = null;
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
  "author": ownUserProfileFixture
};
const followedUnlikedArticleFixture={
  "slug": "how-to-train-your-dragon",
  "title": "How to train your dragon",
  "description": "Ever wonder how?",
  "body": "# Chapter \nIt takes a Jacobian",
  "tagList": ["dragons", "training"],
  "createdAt": "2019-02-18T03:22:56.637Z",
  "updatedAt": "2019-02-18T03:48:35.824Z",
  "favorited": false,
  "favoritesCount": 0,
  "author": ownUserProfileFollowedFixture
};
const unfollowedLikedArticleFixture={
  "slug": "how-to-train-your-dragon",
  "title": "How to train your dragon",
  "description": "Ever wonder how?",
  "body": "# Chapter \nIt takes a Jacobian",
  "tagList": ["dragons", "training"],
  "createdAt": "2019-02-18T03:22:56.637Z",
  "updatedAt": "2019-02-18T03:48:35.824Z",
  "favorited": true,
  "favoritesCount": 0,
  "author": ownUserProfileFixture
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
const createdCommentFixture = {
  "id": 3,
  "createdAt": "2019-04-18T03:22:56.637Z",
  "updatedAt": "2019-04-18T03:22:56.637Z",
  "body": "first I was afraid",
  "author": userProfileFixture
};
const updatedCommentsFixture= [
  commentsFixture,
  createdCommentFixture
].flat();
const deletedCommentsFixture= [
  commentByUnfollowedAuthorNotUser,
];

// Test plan

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
        "following": null
      } },
    { [FETCH_ARTICLE]: unlikedSlugFixture },
    { [FETCH_COMMENTS]: unlikedSlugFixture },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": UNAUTH_USER,
        "article": unfollowedUnlikedArticleFixture,
        "comments": [],
        "commentText": "",
        "favoriteStatus": unfollowedUnlikedArticleFixture.favorited,
        "following": unfollowedUnlikedArticleFixture.author.following
      } },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": UNAUTH_USER,
        "article": unfollowedUnlikedArticleFixture,
        "comments": commentsFixture,
        "commentText": "",
        "favoriteStatus": unfollowedUnlikedArticleFixture.favorited,
        "following": unfollowedUnlikedArticleFixture.author.following
      } },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": UNAUTH_USER,
        "article": unfollowedUnlikedArticleFixture,
        "comments": commentsFixture,
        "commentText": updatedCommentFixture,
        "favoriteStatus": unfollowedUnlikedArticleFixture.favorited,
        "following": unfollowedUnlikedArticleFixture.author.following
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
        "following": null
      } },
    { [FETCH_ARTICLE]: unfollowedUnlikedArticleFixture.slug },
    { [FETCH_COMMENTS]: unfollowedUnlikedArticleFixture.slug},
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": UNAUTH_USER,
        "article": unfollowedUnlikedArticleFixture,
        "comments": [],
        "commentText": "",
        "favoriteStatus": unfollowedUnlikedArticleFixture.favorited,
        "following": unfollowedUnlikedArticleFixture.author.following
      } },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": UNAUTH_USER,
        "article": unfollowedUnlikedArticleFixture,
        "comments": commentsFixture,
        "commentText": "",
        "favoriteStatus": unfollowedUnlikedArticleFixture.favorited,
        "following": unfollowedUnlikedArticleFixture.author.following
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

// .Authenticated user
// |authenticated, like/unlike article| fetched article, like article, like successful|
const AUTH_USER_LIKES_ARTICLE = `Authenticated user views an article, and likes it`
const AUTH_USER_LIKES_ARTICLE_INPUTS = [
  { [ROUTE_CHANGED]: { hash: articleRouteFixture } },
  { [AUTH_CHECKED]: userProfileFixture},
  { [FETCHED_ARTICLE]: unfollowedUnlikedArticleFixture },
  { [FETCH_COMMENTS_OK]: commentsFixture },
  { [TOGGLED_FAVORITE]: {slug: unlikedSlugFixture, isFavorited: false} },
  { [AUTH_CHECKED]: userProfileFixture },
  { [FAVORITE_OK]: {article: unfollowedLikedArticleFixture, slug:unlikedSlugFixture} },
];
const AUTH_USER_LIKES_ARTICLE_COMMANDS = [
  [
    { [FETCH_AUTHENTICATION]: void 0 },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": null,
        "comments": [],
        "commentText": "",
        "favoriteStatus": null,
        "following": null
      } },
    { [FETCH_ARTICLE]: unfollowedUnlikedArticleFixture.slug },
    { [FETCH_COMMENTS]: unfollowedUnlikedArticleFixture.slug},
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": unfollowedUnlikedArticleFixture,
        "comments": [],
        "commentText": "",
        "favoriteStatus": unfollowedUnlikedArticleFixture.favorited,
        "following": unfollowedUnlikedArticleFixture.author.following
      } },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": unfollowedUnlikedArticleFixture,
        "comments": commentsFixture,
        "commentText": "",
        "favoriteStatus": unfollowedUnlikedArticleFixture.favorited,
        "following": unfollowedUnlikedArticleFixture.author.following
      } },
  ],
  [
    { [FETCH_AUTHENTICATION]: void 0 },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": unfollowedUnlikedArticleFixture,
        "comments": commentsFixture,
        "commentText": "",
        "favoriteStatus": null,
        "following": unfollowedUnlikedArticleFixture.author.following
      } },
    {[FAVORITE_ARTICLE]: {slug: unlikedSlugFixture}}
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": unfollowedLikedArticleFixture,
        "comments": commentsFixture,
        "commentText": "",
        "favoriteStatus": unfollowedLikedArticleFixture.favorited,
        "following": unfollowedUnlikedArticleFixture.author.following
      } },
  ],
];

// |authenticated, like/unlike article| fetched article, unlike article, unlike successful|
const AUTH_USER_UNLIKES_ARTICLE = `Authenticated user views an article, and unlikes it`
const AUTH_USER_UNLIKES_ARTICLE_INPUTS = [
  { [ROUTE_CHANGED]: { hash: articleRouteFixture } },
  { [AUTH_CHECKED]: userProfileFixture},
  { [FETCHED_ARTICLE]: unfollowedLikedArticleFixture },
  { [FETCH_COMMENTS_OK]: commentsFixture },
  { [TOGGLED_FAVORITE]: {slug: unlikedSlugFixture, isFavorited: true} },
  { [AUTH_CHECKED]: userProfileFixture },
  { [UNFAVORITE_OK]: {article: unfollowedUnlikedArticleFixture, slug:unlikedSlugFixture} },
];
const AUTH_USER_UNLIKES_ARTICLE_COMMANDS = [
  [
    { [FETCH_AUTHENTICATION]: void 0 },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": null,
        "comments": [],
        "commentText": "",
        "favoriteStatus": null,
        "following": null
      } },
    { [FETCH_ARTICLE]: unfollowedLikedArticleFixture.slug },
    { [FETCH_COMMENTS]: unfollowedLikedArticleFixture.slug},
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": unfollowedLikedArticleFixture,
        "comments": [],
        "commentText": "",
        "favoriteStatus": unfollowedLikedArticleFixture.favorited,
        "following": unfollowedLikedArticleFixture.author.following
      } },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": unfollowedLikedArticleFixture,
        "comments": commentsFixture,
        "commentText": "",
        "favoriteStatus": unfollowedLikedArticleFixture.favorited,
        "following": unfollowedLikedArticleFixture.author.following
      } },
  ],
  [
    { [FETCH_AUTHENTICATION]: void 0 },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": unfollowedLikedArticleFixture,
        "comments": commentsFixture,
        "commentText": "",
        "favoriteStatus": null,
        "following": unfollowedLikedArticleFixture.author.following
      } },
    {[UNFAVORITE_ARTICLE]: {slug: unlikedSlugFixture}}
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": unfollowedUnlikedArticleFixture,
        "comments": commentsFixture,
        "commentText": "",
        "favoriteStatus": unfollowedUnlikedArticleFixture.favorited,
        "following": unfollowedLikedArticleFixture.author.following
      } },
  ],
];

// |authenticated, follow/unfollow profile| fetched article, follow profile, follow successful|
const AUTH_USER_FOLLOWS_PROFILE = `Authenticated user views an article, and follows the article's author`
const AUTH_USER_FOLLOWS_PROFILE_INPUTS = [
  { [ROUTE_CHANGED]: { hash: articleRouteFixture } },
  { [AUTH_CHECKED]: userProfileFixture},
  { [FETCHED_ARTICLE]: unfollowedUnlikedArticleFixture },
  { [FETCH_COMMENTS_OK]: commentsFixture },
  { [TOGGLED_FOLLOW]:  {username: unfollowedUnlikedArticleFixture.author.username} },
  { [AUTH_CHECKED]: userProfileFixture },
  { [TOGGLE_FOLLOW_OK]: followedUnlikedArticleFixture.author },
];
const AUTH_USER_FOLLOWS_PROFILE_COMMANDS = [
  [
    { [FETCH_AUTHENTICATION]: void 0 },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": null,
        "comments": [],
        "commentText": "",
        "favoriteStatus": null,
        "following": null
      } },
    { [FETCH_ARTICLE]: unfollowedUnlikedArticleFixture.slug },
    { [FETCH_COMMENTS]: unfollowedUnlikedArticleFixture.slug},
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": unfollowedUnlikedArticleFixture,
        "comments": [],
        "commentText": "",
        "favoriteStatus": unfollowedUnlikedArticleFixture.favorited,
        "following": unfollowedUnlikedArticleFixture.author.following
      } },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": unfollowedUnlikedArticleFixture,
        "comments": commentsFixture,
        "commentText": "",
        "favoriteStatus": unfollowedUnlikedArticleFixture.favorited,
        "following": unfollowedUnlikedArticleFixture.author.following
      } },
  ],
  [
    { [FETCH_AUTHENTICATION]: void 0 },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": unfollowedUnlikedArticleFixture,
        "comments": commentsFixture,
        "commentText": "",
        "favoriteStatus": unfollowedUnlikedArticleFixture.favorited,
        "following": null
      } },
    {[FOLLOW_PROFILE]: followedUnlikedArticleFixture.author.username}
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": followedUnlikedArticleFixture,
        "comments": commentsFixture,
        "commentText": "",
        "favoriteStatus": unfollowedUnlikedArticleFixture.favorited,
        "following": followedUnlikedArticleFixture.author.following
      } },
  ],
];

// |authenticated, follow/unfollow profile| fetched article, unfollow profile, unfollow successful|
const AUTH_USER_UNFOLLOWS_PROFILE = `Authenticated user views an article, and unfollows the article's author`
const AUTH_USER_UNFOLLOWS_PROFILE_INPUTS = [
  { [ROUTE_CHANGED]: { hash: articleRouteFixture } },
  { [AUTH_CHECKED]: userProfileFixture},
  { [FETCHED_ARTICLE]: followedUnlikedArticleFixture },
  { [FETCH_COMMENTS_OK]: commentsFixture },
  { [TOGGLED_FOLLOW]:  {username: followedUnlikedArticleFixture.author.username} },
  { [AUTH_CHECKED]: userProfileFixture },
  { [TOGGLE_FOLLOW_OK]: unfollowedUnlikedArticleFixture.author },
];
const AUTH_USER_UNFOLLOWS_PROFILE_COMMANDS = [
  [
    { [FETCH_AUTHENTICATION]: void 0 },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": null,
        "comments": [],
        "commentText": "",
        "favoriteStatus": null,
        "following": null
      } },
    { [FETCH_ARTICLE]: followedUnlikedArticleFixture.slug },
    { [FETCH_COMMENTS]: followedUnlikedArticleFixture.slug},
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": followedUnlikedArticleFixture,
        "comments": [],
        "commentText": "",
        "favoriteStatus": followedUnlikedArticleFixture.favorited,
        "following": followedUnlikedArticleFixture.author.following
      } },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": followedUnlikedArticleFixture,
        "comments": commentsFixture,
        "commentText": "",
        "favoriteStatus": followedUnlikedArticleFixture.favorited,
        "following": followedUnlikedArticleFixture.author.following
      } },
  ],
  [
    { [FETCH_AUTHENTICATION]: void 0 },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": followedUnlikedArticleFixture,
        "comments": commentsFixture,
        "commentText": "",
        "favoriteStatus": followedUnlikedArticleFixture.favorited,
        "following": null
      } },
    {[UNFOLLOW_PROFILE]: followedUnlikedArticleFixture.author.username}
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": unfollowedUnlikedArticleFixture,
        "comments": commentsFixture,
        "commentText": "",
        "favoriteStatus": unfollowedUnlikedArticleFixture.favorited,
        "following": unfollowedUnlikedArticleFixture.author.following
      } },
  ],
];

// |authenticated, post comment| fetched article, post comment, post successful|
const AUTH_USER_POSTS_COMMENT = `Authenticated user views an article, and posts a comment`;
const AUTH_USER_POSTS_COMMENT_INPUTS = [
  { [ROUTE_CHANGED]: { hash: articleRouteFixture } },
  { [AUTH_CHECKED]: userProfileFixture},
  { [FETCHED_ARTICLE]: unfollowedUnlikedArticleFixture },
  { [FETCH_COMMENTS_OK]: commentsFixture },
  { [UPDATED_COMMENT]:  updatedCommentFixture},
  { [CLICKED_CREATE_COMMENT]:  {slug: unfollowedUnlikedArticleFixture.slug, body: updatedCommentFixture} },
  { [AUTH_CHECKED]: userProfileFixture },
  { [POST_COMMENT_OK]: createdCommentFixture },
];
const AUTH_USER_POSTS_COMMENT_COMMANDS = [
  [
    { [FETCH_AUTHENTICATION]: void 0 },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": null,
        "comments": [],
        "commentText": "",
        "favoriteStatus": null,
        "following": null
      } },
    { [FETCH_ARTICLE]: unfollowedUnlikedArticleFixture.slug },
    { [FETCH_COMMENTS]: unfollowedUnlikedArticleFixture.slug},
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": unfollowedUnlikedArticleFixture,
        "comments": [],
        "commentText": "",
        "favoriteStatus": unfollowedUnlikedArticleFixture.favorited,
        "following": unfollowedUnlikedArticleFixture.author.following
      } },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": unfollowedUnlikedArticleFixture,
        "comments": commentsFixture,
        "commentText": "",
        "favoriteStatus": unfollowedUnlikedArticleFixture.favorited,
        "following": unfollowedUnlikedArticleFixture.author.following
      } },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": unfollowedUnlikedArticleFixture,
        "comments": commentsFixture,
        "commentText": updatedCommentFixture,
        "favoriteStatus": unfollowedUnlikedArticleFixture.favorited,
        "following": unfollowedUnlikedArticleFixture.author.following,
      } },
  ],
  [
    { [FETCH_AUTHENTICATION]: void 0 },
  ],
  [
    {[POST_COMMENT]: {slug: unfollowedUnlikedArticleFixture.slug, comment: updatedCommentFixture}}
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": unfollowedUnlikedArticleFixture,
        "comments": updatedCommentsFixture,
        "commentText": "",
        "favoriteStatus": unfollowedUnlikedArticleFixture.favorited,
        "following": unfollowedUnlikedArticleFixture.author.following
      } },
  ],
];

// |authenticated, delete comment| fetched article, delete comment, delete successful|
const AUTH_USER_DELETES_COMMENT = `Authenticated user views an article, and delete one of his comment`;
const AUTH_USER_DELETES_COMMENT_INPUTS = [
  { [ROUTE_CHANGED]: { hash: articleRouteFixture } },
  { [AUTH_CHECKED]: userFixture},
  { [FETCHED_ARTICLE]: unfollowedUnlikedArticleFixture },
  { [FETCH_COMMENTS_OK]: commentsFixture },
  { [CLICKED_DELETE_COMMENT]:  {slug: unfollowedUnlikedArticleFixture.slug, id: commentByUnfollowedUser.id } },
  { [AUTH_CHECKED]: userFixture},
  { [DELETE_COMMENT_OK]: commentByUnfollowedUser.id },
];
const AUTH_USER_DELETES_COMMENT_COMMANDS = [
  [
    { [FETCH_AUTHENTICATION]: void 0 },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userFixture,
        "article": null,
        "comments": [],
        "commentText": "",
        "favoriteStatus": null,
        "following": null
      } },
    { [FETCH_ARTICLE]: unfollowedUnlikedArticleFixture.slug },
    { [FETCH_COMMENTS]: unfollowedUnlikedArticleFixture.slug},
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userFixture,
        "article": unfollowedUnlikedArticleFixture,
        "comments": [],
        "commentText": "",
        "favoriteStatus": unfollowedUnlikedArticleFixture.favorited,
        "following": unfollowedUnlikedArticleFixture.author.following
      } },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userFixture,
        "article": unfollowedUnlikedArticleFixture,
        "comments": commentsFixture,
        "commentText": "",
        "favoriteStatus": unfollowedUnlikedArticleFixture.favorited,
        "following": unfollowedUnlikedArticleFixture.author.following
      } },
  ],
  [
    { [FETCH_AUTHENTICATION]: void 0 },
  ],
  [
    {[DELETE_COMMENT]: {slug: unfollowedUnlikedArticleFixture.slug, id: commentByUnfollowedUser.id}}
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userFixture,
        "article": unfollowedUnlikedArticleFixture,
        "comments": deletedCommentsFixture,
        "commentText": "",
        "favoriteStatus": unfollowedUnlikedArticleFixture.favorited,
        "following": unfollowedUnlikedArticleFixture.author.following
      } },
  ],
];

// |authenticated, delete article| fetched article, delete article, delete successful, is redirected to *Home* route|
const AUTH_USER_DELETES_ARTICLE = `Authenticated user views an article, and deletes it`;
const AUTH_USER_DELETES_ARTICLE_INPUTS = [
  { [ROUTE_CHANGED]: { hash: articleRouteFixture } },
  { [AUTH_CHECKED]: userFixture},
  { [FETCHED_ARTICLE]: unfollowedUnlikedArticleFixture },
  { [FETCH_COMMENTS_OK]: commentsFixture },
  { [CLICKED_DELETE_ARTICLE]:  unfollowedUnlikedArticleFixture},
  { [AUTH_CHECKED]: userFixture},
  { [DELETE_ARTICLE_OK]: void 0 },
];
const AUTH_USER_DELETES_ARTICLE_COMMANDS = [
  [
    { [FETCH_AUTHENTICATION]: void 0 },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userFixture,
        "article": null,
        "comments": [],
        "commentText": "",
        "favoriteStatus": null,
        "following": null
      } },
    { [FETCH_ARTICLE]: unfollowedUnlikedArticleFixture.slug },
    { [FETCH_COMMENTS]: unfollowedUnlikedArticleFixture.slug},
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userFixture,
        "article": unfollowedUnlikedArticleFixture,
        "comments": [],
        "commentText": "",
        "favoriteStatus": unfollowedUnlikedArticleFixture.favorited,
        "following": unfollowedUnlikedArticleFixture.author.following
      } },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userFixture,
        "article": unfollowedUnlikedArticleFixture,
        "comments": commentsFixture,
        "commentText": "",
        "favoriteStatus": unfollowedUnlikedArticleFixture.favorited,
        "following": unfollowedUnlikedArticleFixture.author.following
      } },
  ],
  [
    { [FETCH_AUTHENTICATION]: void 0 },
  ],
  [
    {[DELETE_ARTICLE]: unfollowedUnlikedArticleFixture.slug}
  ],
  [
    {[REDIRECT]: home},
    {[FETCH_AUTHENTICATION]: void 0},
    {[RENDER_HOME]: {
        "activeFeed": null,
        "articles": null,
        "favoriteStatus": null,
        "page": 0,
        "route": home,
        "selectedTag": null,
        "tags": null,
        "user": null
      }}
  ],
];

// Edge cases
// |not authenticated, article does not exist| article fetch fails|
const UNAUTH_USER_FAILS_TO_FETCH_ARTICLE = `Unauthenticated user fails to fetch an article`;
const UNAUTH_USER_FAILS_TO_FETCH_ARTICLE_INPUTS = [
  { [ROUTE_CHANGED]: { hash: articleRouteFixture } },
  { [AUTH_CHECKED]: UNAUTH_USER},
  { [FAILED_FETCH_ARTICLE]: articlesError },
];
const UNAUTH_USER_FAILS_TO_FETCH_ARTICLE_COMMANDS = [
  [
    { [FETCH_AUTHENTICATION]: void 0 },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": UNAUTH_USER,
        "article": null,
        "comments": [],
        "commentText": "",
        "favoriteStatus": null,
        "following": null
      } },
    { [FETCH_ARTICLE]: unfollowedUnlikedArticleFixture.slug },
    { [FETCH_COMMENTS]: unfollowedUnlikedArticleFixture.slug},
  ],
[
  { [RENDER_ARTICLE]: {
      "route": article,
      "user": UNAUTH_USER,
    "comments": [],
    "commentText": "",
    "favoriteStatus": null,
    "following": null,
    "article": articleError
    } }
    ],
];

// |authenticated, delete article| fetched article, delete article, delete unsuccessful|
const AUTH_USER_FAILS_TO_DELETE_ARTICLE = `Unauthenticated user fails to delete an article`;
const AUTH_USER_FAILS_TO_DELETE_ARTICLE_INPUTS = [
  { [ROUTE_CHANGED]: { hash: articleRouteFixture } },
  { [AUTH_CHECKED]: userFixture},
  { [FETCHED_ARTICLE]: unfollowedUnlikedArticleFixture },
  { [FETCH_COMMENTS_OK]: commentsFixture },
  { [CLICKED_DELETE_ARTICLE]:  unfollowedUnlikedArticleFixture},
  { [AUTH_CHECKED]: userFixture},
  { [API_REQUEST_FAILED]: new Error(`error`) },
];
const AUTH_USER_FAILS_TO_DELETE_ARTICLE_COMMANDS = [
  [
    { [FETCH_AUTHENTICATION]: void 0 },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userFixture,
        "article": null,
        "comments": [],
        "commentText": "",
        "favoriteStatus": null,
        "following": null
      } },
    { [FETCH_ARTICLE]: unfollowedUnlikedArticleFixture.slug },
    { [FETCH_COMMENTS]: unfollowedUnlikedArticleFixture.slug},
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userFixture,
        "article": unfollowedUnlikedArticleFixture,
        "comments": [],
        "commentText": "",
        "favoriteStatus": unfollowedUnlikedArticleFixture.favorited,
        "following": unfollowedUnlikedArticleFixture.author.following
      } },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userFixture,
        "article": unfollowedUnlikedArticleFixture,
        "comments": commentsFixture,
        "commentText": "",
        "favoriteStatus": unfollowedUnlikedArticleFixture.favorited,
        "following": unfollowedUnlikedArticleFixture.author.following
      } },
  ],
  [
    { [FETCH_AUTHENTICATION]: void 0 },
  ],
  [
    {[DELETE_ARTICLE]: unfollowedUnlikedArticleFixture.slug}
  ],
  [
  ],
];

// |authenticated, delete comment| fetched article, delete comment, delete unsuccessful|
const AUTH_USER_FAILS_TO_DELETE_COMMENT = `Unauthenticated user fails to delete a comment`;
const AUTH_USER_FAILS_TO_DELETE_COMMENT_INPUTS = [
  { [ROUTE_CHANGED]: { hash: articleRouteFixture } },
  { [AUTH_CHECKED]: userFixture},
  { [FETCHED_ARTICLE]: unfollowedUnlikedArticleFixture },
  { [FETCH_COMMENTS_OK]: commentsFixture },
  { [CLICKED_DELETE_COMMENT]:  {slug: unfollowedUnlikedArticleFixture.slug, id: commentByUnfollowedUser.id } },
  { [AUTH_CHECKED]: userFixture},
  { [API_REQUEST_FAILED]: new Error(`error`) },
];
const AUTH_USER_FAILS_TO_DELETE_COMMENT_COMMANDS = [
  [
    { [FETCH_AUTHENTICATION]: void 0 },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userFixture,
        "article": null,
        "comments": [],
        "commentText": "",
        "favoriteStatus": null,
        "following": null
      } },
    { [FETCH_ARTICLE]: unfollowedUnlikedArticleFixture.slug },
    { [FETCH_COMMENTS]: unfollowedUnlikedArticleFixture.slug},
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userFixture,
        "article": unfollowedUnlikedArticleFixture,
        "comments": [],
        "commentText": "",
        "favoriteStatus": unfollowedUnlikedArticleFixture.favorited,
        "following": unfollowedUnlikedArticleFixture.author.following
      } },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userFixture,
        "article": unfollowedUnlikedArticleFixture,
        "comments": commentsFixture,
        "commentText": "",
        "favoriteStatus": unfollowedUnlikedArticleFixture.favorited,
        "following": unfollowedUnlikedArticleFixture.author.following
      } },
  ],
  [
    { [FETCH_AUTHENTICATION]: void 0 },
  ],
  [
    {[DELETE_COMMENT]: {slug: unfollowedUnlikedArticleFixture.slug, id: commentByUnfollowedUser.id}}
  ],
  [
  ],
];

// |authenticated, post comment| fetched article, post comment, post unsuccessful|
const AUTH_USER_FAILS_TO_POST_COMMENT = `Authenticated user views an article, and fails to post a comment`;
const AUTH_USER_FAILS_TO_POST_COMMENT_INPUTS = [
  { [ROUTE_CHANGED]: { hash: articleRouteFixture } },
  { [AUTH_CHECKED]: userProfileFixture},
  { [FETCHED_ARTICLE]: unfollowedUnlikedArticleFixture },
  { [FETCH_COMMENTS_OK]: commentsFixture },
  { [UPDATED_COMMENT]:  updatedCommentFixture},
  { [CLICKED_CREATE_COMMENT]:  {slug: unfollowedUnlikedArticleFixture.slug, body: updatedCommentFixture} },
  { [AUTH_CHECKED]: userProfileFixture },
  { [API_REQUEST_FAILED]: new Error(`error`) },
];
const AUTH_USER_FAILS_TO_POST_COMMENT_COMMANDS = [
  [
    { [FETCH_AUTHENTICATION]: void 0 },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": null,
        "comments": [],
        "commentText": "",
        "favoriteStatus": null,
        "following": null
      } },
    { [FETCH_ARTICLE]: unfollowedUnlikedArticleFixture.slug },
    { [FETCH_COMMENTS]: unfollowedUnlikedArticleFixture.slug},
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": unfollowedUnlikedArticleFixture,
        "comments": [],
        "commentText": "",
        "favoriteStatus": unfollowedUnlikedArticleFixture.favorited,
        "following": unfollowedUnlikedArticleFixture.author.following
      } },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": unfollowedUnlikedArticleFixture,
        "comments": commentsFixture,
        "commentText": "",
        "favoriteStatus": unfollowedUnlikedArticleFixture.favorited,
        "following": unfollowedUnlikedArticleFixture.author.following
      } },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": unfollowedUnlikedArticleFixture,
        "comments": commentsFixture,
        "commentText": updatedCommentFixture,
        "favoriteStatus": unfollowedUnlikedArticleFixture.favorited,
        "following": unfollowedUnlikedArticleFixture.author.following,
      } },
  ],
  [
    { [FETCH_AUTHENTICATION]: void 0 },
  ],
  [
    {[POST_COMMENT]: {slug: unfollowedUnlikedArticleFixture.slug, comment: updatedCommentFixture}}
  ],
  [
  ],
];

// |authenticated, like/unlike article| fetched article, like article, like unsuccessful|
const AUTH_USER_FAILS_TO_LIKE_ARTICLE = `Authenticated user views an article, and fails to like it`
const AUTH_USER_FAILS_TO_LIKE_ARTICLE_INPUTS = [
  { [ROUTE_CHANGED]: { hash: articleRouteFixture } },
  { [AUTH_CHECKED]: userProfileFixture},
  { [FETCHED_ARTICLE]: unfollowedUnlikedArticleFixture },
  { [FETCH_COMMENTS_OK]: commentsFixture },
  { [TOGGLED_FAVORITE]: {slug: unlikedSlugFixture, isFavorited: false} },
  { [AUTH_CHECKED]: userProfileFixture },
  { [FAVORITE_NOK]: {err: new Error(`error`), slug:unlikedSlugFixture} },
];
const AUTH_USER_FAILS_TO_LIKE_ARTICLE_COMMANDS = [
  [
    { [FETCH_AUTHENTICATION]: void 0 },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": null,
        "comments": [],
        "commentText": "",
        "favoriteStatus": null,
        "following": null
      } },
    { [FETCH_ARTICLE]: unfollowedUnlikedArticleFixture.slug },
    { [FETCH_COMMENTS]: unfollowedUnlikedArticleFixture.slug},
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": unfollowedUnlikedArticleFixture,
        "comments": [],
        "commentText": "",
        "favoriteStatus": unfollowedUnlikedArticleFixture.favorited,
        "following": unfollowedUnlikedArticleFixture.author.following
      } },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": unfollowedUnlikedArticleFixture,
        "comments": commentsFixture,
        "commentText": "",
        "favoriteStatus": unfollowedUnlikedArticleFixture.favorited,
        "following": unfollowedUnlikedArticleFixture.author.following
      } },
  ],
  [
    { [FETCH_AUTHENTICATION]: void 0 },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": unfollowedUnlikedArticleFixture,
        "comments": commentsFixture,
        "commentText": "",
        "favoriteStatus": null,
        "following": unfollowedUnlikedArticleFixture.author.following
      } },
    {[FAVORITE_ARTICLE]: {slug: unlikedSlugFixture}}
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": unfollowedUnlikedArticleFixture,
        "comments": commentsFixture,
        "commentText": "",
        "favoriteStatus": unfollowedUnlikedArticleFixture.favorited,
        "following": unfollowedUnlikedArticleFixture.author.following
      } },
  ],
];

// |authenticated, follow/unfollow profile| fetched article, follow profile, follow unsuccessful|
const AUTH_USER_FAILS_TO_FOLLOW_PROFILE = `Authenticated user views an article, and fails to follow the article's author`
const AUTH_USER_FAILS_TO_FOLLOW_PROFILE_INPUTS = [
  { [ROUTE_CHANGED]: { hash: articleRouteFixture } },
  { [AUTH_CHECKED]: userProfileFixture},
  { [FETCHED_ARTICLE]: unfollowedUnlikedArticleFixture },
  { [FETCH_COMMENTS_OK]: commentsFixture },
  { [TOGGLED_FOLLOW]:  {username: unfollowedUnlikedArticleFixture.author.username} },
  { [AUTH_CHECKED]: userProfileFixture },
  { [TOGGLE_FOLLOW_NOK]: new Error(`errror`)},
];
const AUTH_USER_FAILS_TO_FOLLOW_PROFILE_COMMANDS = [
  [
    { [FETCH_AUTHENTICATION]: void 0 },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": null,
        "comments": [],
        "commentText": "",
        "favoriteStatus": null,
        "following": null
      } },
    { [FETCH_ARTICLE]: unfollowedUnlikedArticleFixture.slug },
    { [FETCH_COMMENTS]: unfollowedUnlikedArticleFixture.slug},
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": unfollowedUnlikedArticleFixture,
        "comments": [],
        "commentText": "",
        "favoriteStatus": unfollowedUnlikedArticleFixture.favorited,
        "following": unfollowedUnlikedArticleFixture.author.following
      } },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": unfollowedUnlikedArticleFixture,
        "comments": commentsFixture,
        "commentText": "",
        "favoriteStatus": unfollowedUnlikedArticleFixture.favorited,
        "following": unfollowedUnlikedArticleFixture.author.following
      } },
  ],
  [
    { [FETCH_AUTHENTICATION]: void 0 },
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": unfollowedUnlikedArticleFixture,
        "comments": commentsFixture,
        "commentText": "",
        "favoriteStatus": unfollowedUnlikedArticleFixture.favorited,
        "following": null
      } },
    {[FOLLOW_PROFILE]: followedUnlikedArticleFixture.author.username}
  ],
  [
    { [RENDER_ARTICLE]: {
        "route": article,
        "user": userProfileFixture,
        "article": unfollowedUnlikedArticleFixture,
        "comments": commentsFixture,
        "commentText": "",
        "favoriteStatus": unfollowedUnlikedArticleFixture.favorited,
        "following": unfollowedUnlikedArticleFixture.author.following
      } },
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
  ],
  [
    AUTH_USER_LIKES_ARTICLE,
    AUTH_USER_LIKES_ARTICLE_INPUTS,
    AUTH_USER_LIKES_ARTICLE_COMMANDS
  ],
  [
    AUTH_USER_UNLIKES_ARTICLE,
    AUTH_USER_UNLIKES_ARTICLE_INPUTS,
    AUTH_USER_UNLIKES_ARTICLE_COMMANDS
  ],
  [
    AUTH_USER_FOLLOWS_PROFILE,
    AUTH_USER_FOLLOWS_PROFILE_INPUTS,
    AUTH_USER_FOLLOWS_PROFILE_COMMANDS
  ],
  [
    AUTH_USER_UNFOLLOWS_PROFILE,
    AUTH_USER_UNFOLLOWS_PROFILE_INPUTS,
    AUTH_USER_UNFOLLOWS_PROFILE_COMMANDS
  ],
  [
    AUTH_USER_POSTS_COMMENT,
    AUTH_USER_POSTS_COMMENT_INPUTS,
    AUTH_USER_POSTS_COMMENT_COMMANDS
  ],
  [
    AUTH_USER_DELETES_COMMENT,
    AUTH_USER_DELETES_COMMENT_INPUTS,
    AUTH_USER_DELETES_COMMENT_COMMANDS
  ],
  [
    AUTH_USER_DELETES_ARTICLE,
    AUTH_USER_DELETES_ARTICLE_INPUTS,
    AUTH_USER_DELETES_ARTICLE_COMMANDS
  ],
  [
    UNAUTH_USER_FAILS_TO_FETCH_ARTICLE,
    UNAUTH_USER_FAILS_TO_FETCH_ARTICLE_INPUTS,
    UNAUTH_USER_FAILS_TO_FETCH_ARTICLE_COMMANDS
  ],
  [
    AUTH_USER_FAILS_TO_DELETE_ARTICLE,
    AUTH_USER_FAILS_TO_DELETE_ARTICLE_INPUTS,
    AUTH_USER_FAILS_TO_DELETE_ARTICLE_COMMANDS
  ],
  [
    AUTH_USER_FAILS_TO_DELETE_COMMENT,
    AUTH_USER_FAILS_TO_DELETE_COMMENT_INPUTS,
    AUTH_USER_FAILS_TO_DELETE_COMMENT_COMMANDS
  ],
  [
    AUTH_USER_FAILS_TO_POST_COMMENT,
    AUTH_USER_FAILS_TO_POST_COMMENT_INPUTS,
    AUTH_USER_FAILS_TO_POST_COMMENT_COMMANDS
  ],
  [
    AUTH_USER_FAILS_TO_LIKE_ARTICLE,
    AUTH_USER_FAILS_TO_LIKE_ARTICLE_INPUTS,
    AUTH_USER_FAILS_TO_LIKE_ARTICLE_COMMANDS
  ],
  [
    AUTH_USER_FAILS_TO_FOLLOW_PROFILE,
    AUTH_USER_FAILS_TO_FOLLOW_PROFILE_INPUTS,
    AUTH_USER_FAILS_TO_FOLLOW_PROFILE_COMMANDS
  ]
];

const fsmSettings = { debug: { console, checkContracts: fsmContracts } };

runUserStories(userStories, QUnit, fsmSettings);
