import { storiesOf } from '@storybook/svelte';
import { action } from '@storybook/addon-actions';
import RealWorld from '../src/UI/RealWorld.svelte';
import { viewModel, routes } from "../src/constants"

const { article } = routes;
const {
  fetchStatus: [LOADING, NOK, OK]
} = viewModel;

const userFixture = {
  "email": "jake@jake.jake",
  "token": "jwt.token.here",
  "username": "jake",
  "bio": "I work at statefarm",
  "image": "https://i.stack.imgur.com/xHWG8.jpg"
};
const dispatch = action('ArticleRouteHandlers');

const unfollowdAuthorNotUser = {
  "username": "shake",
  "bio": "I work at statefarm",
  "image": "https://static.productionready.io/images/smiley-cyrus.jpg",
  "following": false
};
const articleUnfollowedAuthorNotUser = {
  "slug": "how-to-train-your-dragon",
  "title": "How to train your dragon",
  "description": "Ever wonder how?",
  "body": `# Marked in the browser\n\nRendered by **marked**.`,
  "tagList": ["dragons", "training"],
  "createdAt": "2016-02-18T03:22:56.637Z",
  "updatedAt": "2016-02-18T03:48:35.824Z",
  "favorited": false,
  "favoritesCount": 0,
  "author": unfollowdAuthorNotUser
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
  "author": unfollowdAuthorNotUser
};
const commentsByUnfollowedAuthorAndUnfollowedUser = [commentByUnfollowedUser, commentByUnfollowedAuthorNotUser];
const articleUnfollowedAuthorIsUser = {
  "slug": "how-to-train-your-dragon",
  "title": "How to train your dragon",
  "description": "Ever wonder how?",
  "body": "It takes a Jacobian",
  "tagList": ["dragons", "training"],
  "createdAt": "2016-02-18T03:22:56.637Z",
  "updatedAt": "2016-02-18T03:48:35.824Z",
  "favorited": false,
  "favoritesCount": 0,
  "author": userFixture
};
// Test space
// article [saem author | other author] / comments [empty | 2 comments= 1author + 1other] / commentText [empty | sth] / user [Auth [article author | comment author | author nothing] | No auth ] x [following|not following|pending] x [liking|not liking|pending]
// Leaving us with:

storiesOf('Article route', module)
  .add('all props set to null', () => ({
    Component: RealWorld,
    props: { route: article, dispatch, user: null,  article: null, comments: null, commentText: null, following: null, favoriteStatus: null  },
    on: { },
  }))
  // Article author!=user x 1 comment (1 author) x empty comment txt x user not authed
  .add('user not authenticated, article with 1 comment from the article\'s author, empty comment field', () => ({
    Component: RealWorld,
    props: { route: article, dispatch, user: null,  article: articleUnfollowedAuthorNotUser, comments: [commentByUnfollowedAuthorNotUser], commentText: null, following: articleUnfollowedAuthorNotUser.author.following, favoriteStatus: articleUnfollowedAuthorNotUser.favorited  },
    on: { },
  }))
  // Article author!=user x 2 comments (1 user, 1 author) x empty comment txt x user authed but not author
  .add('user not authenticated, article with 2 comment (article\'s author and current user), empty comment field', () => ({
    Component: RealWorld,
    props: { route: article, dispatch, user: null,  article: articleUnfollowedAuthorNotUser, comments: commentsByUnfollowedAuthorAndUnfollowedUser, commentText: null, following: articleUnfollowedAuthorNotUser.author.following, favoriteStatus: articleUnfollowedAuthorNotUser.favorited  },
    on: { },
  }))
  // Article author=user x no comments x empty comment txt x user=author
  .add('user authenticated, is article\'s author, no comments, empty comment field', () => ({
    Component: RealWorld,
    props: { route: article, dispatch, user: userFixture,  article: articleUnfollowedAuthorIsUser, comments: [], commentText: null, following: articleUnfollowedAuthorNotUser.author.following, favoriteStatus: articleUnfollowedAuthorNotUser.favorited  },
    on: { },
  }))
  // Article author=user x no comments x some comment txt x user=author
  .add('user authenticated, is article\'s author, no comments, non-empty comment field', () => ({
    Component: RealWorld,
    props: { route: article, dispatch, user: userFixture,  article: articleUnfollowedAuthorIsUser, comments: [], commentText: "not empty", following: articleUnfollowedAuthorNotUser.author.following, favoriteStatus: articleUnfollowedAuthorNotUser.favorited  },
    on: { },
  }))
  // Article author!=user x 2 comments (1 user, 1 author) x empty comment txt x user authed but not author x follow pending x like pending
  .add('user authenticated, article with 2 comment (article\'s author and current user), empty comment field, pending follow, pending like', () => ({
    Component: RealWorld,
    props: { route: article, dispatch, user: userFixture,  article: articleUnfollowedAuthorNotUser, comments: commentsByUnfollowedAuthorAndUnfollowedUser, commentText: null, following: null, favoriteStatus: null  },
    on: { },
  }))
