import QUnit from "qunit"
import prettyFormat from 'pretty-format'
import {equals as deepEqual} from "ramda"
import { fsmContracts, NO_OUTPUT } from "kingly"
import { commands, fsmFactory } from "../src/fsm"
import { events, loadingStates, routes, viewModel } from "../src/constants"
import {
  articlesErrorFixture, articlesFilteredErrorFixture, articlesFilteredFixture, articlesFixture, articlesPage1Fixture
} from "./fixtures/articles"
import { tagFixture, tagsFixture } from "./fixtures/tags"
import { userFixture } from "./fixtures/user"
import { formatIndex, processRenderCommands, removeNoOutputs } from "./common"
import {
  favoritedSlugFixture, unfavoritedSlugFixture, updatedLikedArticleFixture, updatedLikedArticlesFixture,
  updatedUnlikedArticleFixture, updatedUnlikedArticlesFixture
} from "./fixtures/slugs"

QUnit.module("Testing home route fsm", {});

const {
  tabs: [USER_FEED, GLOBAL_FEED, TAG_FILTER_FEED],
  fetchStatus: [LOADING, NOK, OK]
} = viewModel;

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
] = events;
const [
  RENDER,
  FETCH_GLOBAL_FEED,
  FETCH_ARTICLES_GLOBAL_FEED,
  FETCH_ARTICLES_USER_FEED,
  FETCH_AUTHENTICATION,
  FETCH_USER_FEED,
  FETCH_FILTERED_FEED,
  FAVORITE_ARTICLE,
  UNFAVORITE_ARTICLE,
  REDIRECT
] = commands;
const { home } = routes;
const [TAGS_ARE_LOADING, ARTICLES_ARE_LOADING] = loadingStates;

// NOTE DOC: for every expected commands, put the whole props for the <App /> as tested in Storybook
const UNAUTH_USER = null;
const UNAUTH_USER_ON_HOME_INPUTS = [
  { [ROUTE_CHANGED]: { hash: home } },
  { [AUTH_CHECKED]: UNAUTH_USER }
];
const AUTH_USER_ON_HOME_INPUTS = [
  { [ROUTE_CHANGED]: { hash: home } },
  { [AUTH_CHECKED]: userFixture }
];

const UNAUTH_USER_ON_HOME_COMMANDS = page => ([
  [{ [FETCH_AUTHENTICATION]: void 0 }],
  [
    {
      [RENDER]: {
        tags: TAGS_ARE_LOADING,
        articles: ARTICLES_ARE_LOADING,
        activeFeed: GLOBAL_FEED,
        user: UNAUTH_USER,
        page: 0,
        selectedTag: null
      }
    },
    { [FETCH_GLOBAL_FEED]: { page } },
  ]
]);
const AUTH_USER_ON_HOME_COMMANDS = page => ([
  [{ [FETCH_AUTHENTICATION]: void 0 }],
  [
    {
      [RENDER]: {
        tags: TAGS_ARE_LOADING,
        articles: ARTICLES_ARE_LOADING,
        activeFeed: USER_FEED,
        user: userFixture,
        page,
        selectedTag: null
      }
    },
    { [FETCH_USER_FEED]: { page  } },
  ]
]);

const UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED = `Unauthenticated user navigates to *Home* page and sees the full global feed`;
const UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_INPUTS = [
  UNAUTH_USER_ON_HOME_INPUTS,
  { [TAGS_FETCHED_OK]: tagsFixture },
  { [ARTICLES_FETCHED_OK]: articlesFixture }
].flat();
const UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_COMMANDS = UNAUTH_USER_ON_HOME_COMMANDS(0).concat([
  [{ [RENDER]: { tags: tagsFixture, articles: ARTICLES_ARE_LOADING, page: 0, user:null, activeFeed: GLOBAL_FEED, selectedTag: null } }],
  [{ [RENDER]: { articles: articlesFixture, tags: tagsFixture, page: 0, user:null, activeFeed: GLOBAL_FEED, selectedTag: null } }],
]);

const UNAUTH_USER_ON_HOME_SEES_PARTIAL_GLOBAL_FEED = `Unauthenticated user navigates to *Home* page and sees partial global feed`;
const UNAUTH_USER_ON_HOME_SEES_PARTIAL_GLOBAL_FEED_INPUTS = [
  UNAUTH_USER_ON_HOME_INPUTS,
  { [TAGS_FETCHED_OK]: tagsFixture },
  { [ARTICLES_FETCHED_NOK]: articlesErrorFixture }
].flat();
const UNAUTH_USER_ON_HOME_SEES_PARTIAL_GLOBAL_FEED_COMMANDS = UNAUTH_USER_ON_HOME_COMMANDS(0).concat([
  [{ [RENDER]: { tags: tagsFixture, articles: ARTICLES_ARE_LOADING, page: 0, user:null, activeFeed: GLOBAL_FEED, selectedTag: null  } }],
  [{ [RENDER]: { articles: articlesErrorFixture, tags: tagsFixture, page: 0, user:null, activeFeed: GLOBAL_FEED, selectedTag: null  } }],
]);

const AUTH_USER_ON_HOME_SEES_USER_FEED = `Authenticated user navigates to *Home* page and sees the full user feed`;
const AUTH_USER_ON_HOME_SEES_USER_FEED_INPUTS = [
  AUTH_USER_ON_HOME_INPUTS,
  { [TAGS_FETCHED_OK]: tagsFixture },
  { [ARTICLES_FETCHED_OK]: articlesFixture }
].flat();
const AUTH_USER_ON_HOME_SEES_USER_FEED_COMMANDS = AUTH_USER_ON_HOME_COMMANDS(0).concat([
  [{ [RENDER]: { tags: tagsFixture, articles: ARTICLES_ARE_LOADING, page: 0, user:userFixture, activeFeed: USER_FEED, selectedTag: null  } }],
  [{ [RENDER]: { articles: articlesFixture ,tags: tagsFixture, page: 0, user:userFixture, activeFeed: USER_FEED, selectedTag: null } }],
]);

const AUTH_USER_ON_HOME_SEES_PARTIAL_USER_FEED = `Authenticated user navigates to *Home* page and sees partial user feed`;
const AUTH_USER_ON_HOME_SEES_PARTIAL_USER_FEED_INPUTS = [
  AUTH_USER_ON_HOME_INPUTS,
  { [TAGS_FETCHED_OK]: tagsFixture },
  { [ARTICLES_FETCHED_NOK]: articlesErrorFixture }
].flat();
const AUTH_USER_ON_HOME_SEES_PARTIAL_USER_FEED_COMMANDS = AUTH_USER_ON_HOME_COMMANDS(0).concat([
  [{ [RENDER]: { tags: tagsFixture, articles: ARTICLES_ARE_LOADING, page: 0, user:userFixture, activeFeed: USER_FEED, selectedTag: null  } }],
  [{ [RENDER]: { articles: articlesErrorFixture, tags: tagsFixture, page: 0, user:userFixture, activeFeed: USER_FEED, selectedTag: null  } }],
]);

const UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED = `Unauthenticated user filters the global feed with a tag`;
const UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_INPUTS = [
  UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_INPUTS,
  { [CLICKED_TAG]: tagFixture },
  { [ARTICLES_FETCHED_OK]: articlesFilteredFixture }
].flat();
const UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_COMMANDS = UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_COMMANDS.concat([
  [
    { [RENDER]: { articles: ARTICLES_ARE_LOADING, tags: tagsFixture, page: 0, user:null, activeFeed: TAG_FILTER_FEED, selectedTag: tagFixture } },
    { [FETCH_FILTERED_FEED]: { page: 0, tag: tagFixture } }
  ],
  [{ [RENDER]: { articles: articlesFilteredFixture , tags: tagsFixture, page: 0, user:null, activeFeed: TAG_FILTER_FEED, selectedTag: tagFixture} }],
]);

const UNAUTH_USER_ON_HOME_SEES_PARTIAL_TAG_FILTERED_GLOBAL_FEED = `Unauthenticated user filters the global feed with a tag, sees incomplete feed`;
const UNAUTH_USER_ON_HOME_SEES_PARTIAL_TAG_FILTERED_GLOBAL_FEED_INPUTS = [
  UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_INPUTS,
  { [CLICKED_TAG]: tagFixture },
  { [ARTICLES_FETCHED_NOK]: articlesFilteredErrorFixture }
].flat();
const UNAUTH_USER_ON_HOME_SEES_PARTIAL_TAG_FILTERED_GLOBAL_FEED_COMMANDS = UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_COMMANDS.concat([
  [
    { [RENDER]: { articles: ARTICLES_ARE_LOADING, tags: tagsFixture, page: 0, user:null, activeFeed: TAG_FILTER_FEED,  selectedTag: tagFixture } },
    { [FETCH_FILTERED_FEED]: { page: 0, tag: tagFixture } }
  ],
  [{ [RENDER]: { articles: articlesFilteredErrorFixture , tags: tagsFixture, page: 0, user:null, activeFeed: TAG_FILTER_FEED,  selectedTag: tagFixture } }],
]);

const AUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED = `Authenticated user filters the global feed with a tag`;
const AUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_INPUTS = [
  AUTH_USER_ON_HOME_SEES_USER_FEED_INPUTS,
  { [CLICKED_TAG]: tagFixture },
  { [ARTICLES_FETCHED_OK]: articlesFilteredFixture }
].flat();
const AUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_COMMANDS = AUTH_USER_ON_HOME_SEES_USER_FEED_COMMANDS.concat([
  [
    { [RENDER]: { articles: ARTICLES_ARE_LOADING, tags: tagsFixture, page: 0, user:userFixture, activeFeed: TAG_FILTER_FEED, selectedTag: tagFixture } },
    { [FETCH_FILTERED_FEED]: { page: 0, tag: tagFixture } }
  ],
  [{ [RENDER]: { articles: articlesFilteredFixture, tags: tagsFixture, page: 0, user: userFixture, activeFeed: TAG_FILTER_FEED, selectedTag: tagFixture} }],
]);

const AUTH_USER_ON_HOME_SEES_PARTIAL_TAG_FILTERED_GLOBAL_FEED = `Authenticated user filters the global feed with a tag, sees incomplete feed`;
const AUTH_USER_ON_HOME_SEES_PARTIAL_TAG_FILTERED_GLOBAL_FEED_INPUTS = [
  AUTH_USER_ON_HOME_SEES_USER_FEED_INPUTS,
  { [CLICKED_TAG]: tagFixture},
  { [ARTICLES_FETCHED_NOK]: articlesFilteredErrorFixture }
].flat();
const AUTH_USER_ON_HOME_SEES_PARTIAL_TAG_FILTERED_GLOBAL_FEED_COMMANDS = AUTH_USER_ON_HOME_SEES_USER_FEED_COMMANDS.concat([
  [
    { [RENDER]: { articles: ARTICLES_ARE_LOADING, tags: tagsFixture, page: 0, user:userFixture, activeFeed: TAG_FILTER_FEED, selectedTag: tagFixture } },
    { [FETCH_FILTERED_FEED]: { page: 0, tag: tagFixture } }
  ],
  [{ [RENDER]: { articles: articlesFilteredErrorFixture, tags: tagsFixture, page: 0, user: userFixture, activeFeed: TAG_FILTER_FEED, selectedTag: tagFixture} }],
]);

const UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_CHANGES_PAGE = `Unauthenticated user sees the global feed and updates the page`;
const UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_CHANGES_PAGE_INPUTS = [
  UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_INPUTS,
  { [CLICKED_PAGE]: 1 },
  { [ARTICLES_FETCHED_OK]: articlesPage1Fixture }
].flat();
const UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_CHANGES_PAGE_COMMANDS = UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_COMMANDS.concat([
  [
    { [FETCH_ARTICLES_GLOBAL_FEED]: { page: 1 } },
    { [RENDER]: { articles: ARTICLES_ARE_LOADING, page: 1, activeFeed: GLOBAL_FEED, user: null, tags:tagsFixture, selectedTag: null  } },
  ],
  [{ [RENDER]: { articles: articlesPage1Fixture,  page: 1, activeFeed: GLOBAL_FEED, user: null, tags:tagsFixture, selectedTag: null  } }],
]);

const AUTH_USER_ON_HOME_SEES_USER_FEED_CHANGES_PAGE = `Authenticated user sees the user feed and updates the page`;
const AUTH_USER_ON_HOME_SEES_USER_FEED_CHANGES_PAGE_INPUTS = [
  AUTH_USER_ON_HOME_SEES_USER_FEED_INPUTS,
  { [CLICKED_PAGE]: 1 },
  { [AUTH_CHECKED]: userFixture},
  { [ARTICLES_FETCHED_OK]: articlesPage1Fixture }
].flat();
const AUTH_USER_ON_HOME_SEES_USER_FEED_CHANGES_PAGE_COMMANDS = AUTH_USER_ON_HOME_SEES_USER_FEED_COMMANDS.concat([
  [{ [FETCH_AUTHENTICATION]: void 0 }],
  [
    { [FETCH_ARTICLES_USER_FEED]: { page: 1, username: userFixture.username } },
    { [RENDER]: { articles: ARTICLES_ARE_LOADING, page: 1, activeFeed: USER_FEED, user: userFixture, tags:tagsFixture, selectedTag: null  } },
  ],
  [{ [RENDER]: { articles: articlesPage1Fixture,  page: 1, activeFeed: USER_FEED, user: userFixture, tags:tagsFixture, selectedTag: null  } }],
]);

const UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_CHANGES_PAGE = `Unauthenticated user filters the global feed with a tag and changes page`;
const UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_CHANGES_PAGE_INPUTS = [
  UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_INPUTS,
  { [CLICKED_PAGE]: 1 },
  { [ARTICLES_FETCHED_OK]: articlesPage1Fixture }
].flat();
const UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_CHANGES_PAGE_COMMANDS =
  UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_COMMANDS.concat([
    [
      { [RENDER]: { articles: ARTICLES_ARE_LOADING, tags: tagsFixture, page: 1, user:null, activeFeed: TAG_FILTER_FEED, selectedTag: tagFixture} },
      { [FETCH_FILTERED_FEED]: { page: 1, tag: tagFixture } }
    ],
    [{ [RENDER]: { articles: articlesPage1Fixture, tags: tagsFixture, page: 1, user:null, activeFeed: TAG_FILTER_FEED, selectedTag: tagFixture } }]
  ]);

const UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_TWICE = `Unauthenticated user navigates to *Home* page and sees the full global feed, clicks again on the global feed tab and sees the full global feed`;
const UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_TWICE_INPUTS = [
  UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_INPUTS,
  { [CLICKED_GLOBAL_FEED]: void 0 },
  { [ARTICLES_FETCHED_OK]: articlesPage1Fixture },
].flat();
const UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_TWICE_COMMANDS = UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_COMMANDS.concat([
  [
    { [FETCH_ARTICLES_GLOBAL_FEED]: { page: 0 } },
    { [RENDER]: { tags: tagsFixture, articles: ARTICLES_ARE_LOADING, page: 0, user:null, activeFeed: GLOBAL_FEED, selectedTag: null  } }
  ],
  [{ [RENDER]: { articles: articlesPage1Fixture, tags: tagsFixture, page: 0, user:null, activeFeed: GLOBAL_FEED, selectedTag: null  } }],
]);

const AUTH_USER_ON_HOME_SEES_USER_FEED_TWICE = `Authenticated user navigates to *Home* page and sees the full user feed, , clicks again on the user feed tab and sees the full user feed`;
const AUTH_USER_ON_HOME_SEES_USER_FEED_TWICE_INPUTS = [
  AUTH_USER_ON_HOME_SEES_USER_FEED_INPUTS,
  { [CLICKED_USER_FEED]: void 0 },
  { [AUTH_CHECKED]:  userFixture},
  { [ARTICLES_FETCHED_OK]: articlesPage1Fixture }
].flat();
const AUTH_USER_ON_HOME_SEES_USER_FEED_TWICE_COMMANDS = AUTH_USER_ON_HOME_SEES_USER_FEED_COMMANDS.concat([
  [{ [FETCH_AUTHENTICATION]: void 0 }],
  [
    { [FETCH_ARTICLES_USER_FEED]: { page: 0, username: userFixture.username } },
    { [RENDER]: { tags: tagsFixture, articles: ARTICLES_ARE_LOADING, page: 0, user:userFixture, activeFeed: USER_FEED, selectedTag: null } }
  ],
  [{ [RENDER]: { articles: articlesPage1Fixture, tags: tagsFixture, page: 0, user:userFixture, activeFeed: USER_FEED, selectedTag: null } }],
]);

const UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_THEN_UNFILTERED = `Unauthenticated user filters the global feed with a tag, sees full feed then click on the global feed and sees unfiltered global feed`;
const UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_THEN_UNFILTERED_INPUTS = [
  UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_INPUTS,
  { [CLICKED_GLOBAL_FEED]: void 0 },
  { [ARTICLES_FETCHED_OK]: articlesPage1Fixture },
].flat();
const UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_THEN_UNFILTERED_COMMANDS = UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_COMMANDS.concat([
  [
    { [FETCH_ARTICLES_GLOBAL_FEED]: { page: 0 } },
    { [RENDER]: { tags: tagsFixture, articles: ARTICLES_ARE_LOADING, page: 0, user:null, activeFeed: GLOBAL_FEED, selectedTag: null } }
  ],
  [{ [RENDER]: { articles: articlesPage1Fixture, tags: tagsFixture, page: 0, user:null, activeFeed: GLOBAL_FEED, selectedTag: null } }],
]);

const AUTH_USER_ON_HOME_SEES_USER_FEED_THEN_GLOBAL_FEED = `Authenticated user navigates to *Home* page and sees the full user feed, , clicks on the global feed tab and sees the full global feed`;
const AUTH_USER_ON_HOME_SEES_USER_FEED_THEN_GLOBAL_FEED_INPUTS = [
  AUTH_USER_ON_HOME_SEES_USER_FEED_INPUTS,
  { [CLICKED_GLOBAL_FEED]: void 0 },
  { [ARTICLES_FETCHED_OK]: articlesPage1Fixture },
].flat();
const AUTH_USER_ON_HOME_SEES_USER_FEED_THEN_GLOBAL_FEED_COMMANDS = AUTH_USER_ON_HOME_SEES_USER_FEED_COMMANDS.concat([
  [
    { [FETCH_ARTICLES_GLOBAL_FEED]: { page: 0 } },
    { [RENDER]: { tags: tagsFixture, articles: ARTICLES_ARE_LOADING, page: 0, user:userFixture, activeFeed: GLOBAL_FEED, selectedTag: null } }
  ],
  [{ [RENDER]: { articles: articlesPage1Fixture, tags: tagsFixture, page: 0, user:userFixture, activeFeed: GLOBAL_FEED, selectedTag: null } }],
]);

const UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_AND_NAVIGATES_HOME = `Unauthenticated user navigates to *Home* page and sees the full global feed, then navigates back to the *home* route`;
const UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_AND_NAVIGATES_HOME_INPUTS = [
  UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_INPUTS,
  UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_INPUTS,
].flat();
const UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_AND_NAVIGATES_HOME_COMMANDS = UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_COMMANDS.concat(UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_COMMANDS)

const UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_LIKES_ARTICLE = `Unauthenticated user navigates to *Home* page, sees the full global feed, likes one article and is redirected`;
const UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_LIKES_ARTICLE_INPUTS = [
  UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_INPUTS,
  { [TOGGLED_FAVORITE]: {slug: unfavoritedSlugFixture, isFavorited: false} },
  { [AUTH_CHECKED]: UNAUTH_USER },
].flat();
const UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_LIKES_ARTICLE_COMMANDS = UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_COMMANDS.concat([
  [{ [FETCH_AUTHENTICATION]: void 0 }],
  [{[REDIRECT]: "/register" }]
]);

const AUTH_USER_ON_HOME_SEES_USER_FEED_LIKES_ARTICLE = `Authenticated user navigates to *Home* page, sees the full user feed and likes article`;
const AUTH_USER_ON_HOME_SEES_USER_FEED_LIKES_ARTICLE_INPUTS= [
  AUTH_USER_ON_HOME_SEES_USER_FEED_INPUTS ,
  { [TOGGLED_FAVORITE]: {slug: unfavoritedSlugFixture, isFavorited: false} },
  { [AUTH_CHECKED]: userFixture },
  { [FAVORITE_OK]: {article: updatedLikedArticleFixture, slug: unfavoritedSlugFixture} },
].flat();
const AUTH_USER_ON_HOME_SEES_USER_FEED_LIKES_ARTICLE_COMMANDS= AUTH_USER_ON_HOME_SEES_USER_FEED_COMMANDS.concat([
  [{ [FETCH_AUTHENTICATION]: void 0 }],
  [
    { [FAVORITE_ARTICLE]: { slug: unfavoritedSlugFixture} },
    { [RENDER]: { articles: articlesFixture ,tags: tagsFixture, page: 0, user:userFixture, activeFeed: USER_FEED, selectedTag: null, favoriteStatus: unfavoritedSlugFixture} }
    ],
  [{ [RENDER]: { articles: updatedLikedArticlesFixture, tags: tagsFixture, page: 0, user:userFixture, activeFeed: USER_FEED, selectedTag: null, favoriteStatus: null} }],
]);

const AUTH_USER_ON_HOME_SEES_USER_FEED_LIKES_ARTICLE_FAILS = `Authenticated user navigates to *Home* page, sees the full user feed and likes article but request fails`;
const AUTH_USER_ON_HOME_SEES_USER_FEED_LIKES_ARTICLE_FAILS_INPUTS= [
  AUTH_USER_ON_HOME_SEES_USER_FEED_INPUTS ,
  { [TOGGLED_FAVORITE]: {slug: unfavoritedSlugFixture, isFavorited: false} },
  { [AUTH_CHECKED]: userFixture },
  { [FAVORITE_NOK]: {err: new Error(AUTH_USER_ON_HOME_SEES_USER_FEED_LIKES_ARTICLE_FAILS), slug: unfavoritedSlugFixture} },
].flat();
const AUTH_USER_ON_HOME_SEES_USER_FEED_LIKES_ARTICLE_FAILS_COMMANDS= AUTH_USER_ON_HOME_SEES_USER_FEED_COMMANDS.concat([
  [{ [FETCH_AUTHENTICATION]: void 0 }],
  [
    { [FAVORITE_ARTICLE]: { slug: unfavoritedSlugFixture} },
    { [RENDER]: { articles: articlesFixture ,tags: tagsFixture, page: 0, user:userFixture, activeFeed: USER_FEED, selectedTag: null, favoriteStatus: unfavoritedSlugFixture} }
  ],
  [{ [RENDER]: { articles: articlesFixture, tags: tagsFixture, page: 0, user:userFixture, activeFeed: USER_FEED, selectedTag: null, favoriteStatus: null} }],
]);

const AUTH_USER_ON_HOME_SEES_USER_FEED_UNLIKES_ARTICLE = `Authenticated user navigates to *Home* page, sees the full user feed and unlikes article`;
const AUTH_USER_ON_HOME_SEES_USER_FEED_UNLIKES_ARTICLE_INPUTS= [
  AUTH_USER_ON_HOME_SEES_USER_FEED_INPUTS ,
  { [TOGGLED_FAVORITE]: {slug: favoritedSlugFixture, isFavorited: true} },
  { [AUTH_CHECKED]: userFixture },
  { [UNFAVORITE_OK]: {article: updatedUnlikedArticleFixture, slug: favoritedSlugFixture} },
].flat();
const AUTH_USER_ON_HOME_SEES_USER_FEED_UNLIKES_ARTICLE_COMMANDS= AUTH_USER_ON_HOME_SEES_USER_FEED_COMMANDS.concat([
  [{ [FETCH_AUTHENTICATION]: void 0 }],
  [
    { [UNFAVORITE_ARTICLE]: { slug: favoritedSlugFixture} },
    { [RENDER]: { articles: articlesFixture ,tags: tagsFixture, page: 0, user:userFixture, activeFeed: USER_FEED, selectedTag: null, favoriteStatus: favoritedSlugFixture} }
  ],
  [{ [RENDER]: { articles: updatedUnlikedArticlesFixture, tags: tagsFixture, page: 0, user:userFixture, activeFeed: USER_FEED, selectedTag: null, favoriteStatus: null} }],
]);

const AUTH_USER_ON_HOME_SEES_USER_FEED_UNLIKES_ARTICLE_FAILS = `Authenticated user navigates to *Home* page, sees the full user feed and unlikes article but request fails`;
const AUTH_USER_ON_HOME_SEES_USER_FEED_UNLIKES_ARTICLE_FAILS_INPUTS= [
  AUTH_USER_ON_HOME_SEES_USER_FEED_INPUTS ,
  { [TOGGLED_FAVORITE]: {slug: favoritedSlugFixture, isFavorited: true} },
  { [AUTH_CHECKED]: userFixture },
  { [UNFAVORITE_NOK]: {err: new Error(AUTH_USER_ON_HOME_SEES_USER_FEED_UNLIKES_ARTICLE_FAILS), slug: favoritedSlugFixture} },
].flat();
const AUTH_USER_ON_HOME_SEES_USER_FEED_UNLIKES_ARTICLE_FAILS_COMMANDS= AUTH_USER_ON_HOME_SEES_USER_FEED_COMMANDS.concat([
  [{ [FETCH_AUTHENTICATION]: void 0 }],
  [
    { [UNFAVORITE_ARTICLE]: { slug: favoritedSlugFixture} },
    { [RENDER]: { articles: articlesFixture ,tags: tagsFixture, page: 0, user:userFixture, activeFeed: USER_FEED, selectedTag: null, favoriteStatus: favoritedSlugFixture} }
  ],
  [{ [RENDER]: { articles: articlesFixture, tags: tagsFixture, page: 0, user:userFixture, activeFeed: USER_FEED, selectedTag: null, favoriteStatus: null} }],
]);


const userStories = [
  [
    UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED,
    UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_INPUTS,
    UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_COMMANDS
  ],
  [
    UNAUTH_USER_ON_HOME_SEES_PARTIAL_GLOBAL_FEED,
    UNAUTH_USER_ON_HOME_SEES_PARTIAL_GLOBAL_FEED_INPUTS,
    UNAUTH_USER_ON_HOME_SEES_PARTIAL_GLOBAL_FEED_COMMANDS,
  ],
  [
    AUTH_USER_ON_HOME_SEES_USER_FEED,
    AUTH_USER_ON_HOME_SEES_USER_FEED_INPUTS,
    AUTH_USER_ON_HOME_SEES_USER_FEED_COMMANDS
  ],
  [
    AUTH_USER_ON_HOME_SEES_PARTIAL_USER_FEED,
    AUTH_USER_ON_HOME_SEES_PARTIAL_USER_FEED_INPUTS,
    AUTH_USER_ON_HOME_SEES_PARTIAL_USER_FEED_COMMANDS,
  ],
  [
    UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED,
    UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_INPUTS,
    UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_COMMANDS
  ],
  [
    UNAUTH_USER_ON_HOME_SEES_PARTIAL_TAG_FILTERED_GLOBAL_FEED,
    UNAUTH_USER_ON_HOME_SEES_PARTIAL_TAG_FILTERED_GLOBAL_FEED_INPUTS,
    UNAUTH_USER_ON_HOME_SEES_PARTIAL_TAG_FILTERED_GLOBAL_FEED_COMMANDS
  ],
  [
    AUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED,
    AUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_INPUTS,
    AUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_COMMANDS
  ],
  [
    AUTH_USER_ON_HOME_SEES_PARTIAL_TAG_FILTERED_GLOBAL_FEED,
    AUTH_USER_ON_HOME_SEES_PARTIAL_TAG_FILTERED_GLOBAL_FEED_INPUTS,
    AUTH_USER_ON_HOME_SEES_PARTIAL_TAG_FILTERED_GLOBAL_FEED_COMMANDS
  ],
  [
    UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_CHANGES_PAGE,
    UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_CHANGES_PAGE_INPUTS,
    UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_CHANGES_PAGE_COMMANDS
  ],
  [
    AUTH_USER_ON_HOME_SEES_USER_FEED_CHANGES_PAGE,
    AUTH_USER_ON_HOME_SEES_USER_FEED_CHANGES_PAGE_INPUTS,
    AUTH_USER_ON_HOME_SEES_USER_FEED_CHANGES_PAGE_COMMANDS
  ],
  [
    UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_CHANGES_PAGE,
    UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_CHANGES_PAGE_INPUTS,
    UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_CHANGES_PAGE_COMMANDS
  ],
  [
    UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_TWICE,
    UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_TWICE_INPUTS,
    UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_TWICE_COMMANDS
  ],
  [
    AUTH_USER_ON_HOME_SEES_USER_FEED_TWICE,
    AUTH_USER_ON_HOME_SEES_USER_FEED_TWICE_INPUTS,
    AUTH_USER_ON_HOME_SEES_USER_FEED_TWICE_COMMANDS
  ],
  [
    UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_THEN_UNFILTERED,
    UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_THEN_UNFILTERED_INPUTS,
    UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_THEN_UNFILTERED_COMMANDS
  ],
  [
    AUTH_USER_ON_HOME_SEES_USER_FEED_THEN_GLOBAL_FEED,
    AUTH_USER_ON_HOME_SEES_USER_FEED_THEN_GLOBAL_FEED_INPUTS,
    AUTH_USER_ON_HOME_SEES_USER_FEED_THEN_GLOBAL_FEED_COMMANDS
  ],
  [
    UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_AND_NAVIGATES_HOME,
    UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_AND_NAVIGATES_HOME_INPUTS,
    UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_AND_NAVIGATES_HOME_COMMANDS
  ],
  [
    UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_LIKES_ARTICLE,
    UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_LIKES_ARTICLE_INPUTS,
    UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_LIKES_ARTICLE_COMMANDS
  ],
  [
    AUTH_USER_ON_HOME_SEES_USER_FEED_LIKES_ARTICLE,
    AUTH_USER_ON_HOME_SEES_USER_FEED_LIKES_ARTICLE_INPUTS,
    AUTH_USER_ON_HOME_SEES_USER_FEED_LIKES_ARTICLE_COMMANDS
  ],
  [
    AUTH_USER_ON_HOME_SEES_USER_FEED_LIKES_ARTICLE_FAILS,
    AUTH_USER_ON_HOME_SEES_USER_FEED_LIKES_ARTICLE_FAILS_INPUTS,
    AUTH_USER_ON_HOME_SEES_USER_FEED_LIKES_ARTICLE_FAILS_COMMANDS
  ],
//TODO:  click like article liked, click like article unliked (cf. fixtures)
  [
    AUTH_USER_ON_HOME_SEES_USER_FEED_UNLIKES_ARTICLE,
    AUTH_USER_ON_HOME_SEES_USER_FEED_UNLIKES_ARTICLE_INPUTS,
    AUTH_USER_ON_HOME_SEES_USER_FEED_UNLIKES_ARTICLE_COMMANDS
  ],
  [
    AUTH_USER_ON_HOME_SEES_USER_FEED_UNLIKES_ARTICLE_FAILS,
    AUTH_USER_ON_HOME_SEES_USER_FEED_UNLIKES_ARTICLE_FAILS_INPUTS,
    AUTH_USER_ON_HOME_SEES_USER_FEED_UNLIKES_ARTICLE_FAILS_COMMANDS
  ],
  // 4. auth, unliked, ok
  // 5. auth, unliked, nok

];

const fsmSettings = { debug: { console, checkContracts: fsmContracts } };

userStories.forEach(([scenario, inputSeq, outputsSeq]) => {
  if (inputSeq.length !== outputsSeq.length) {
    console.error(`inputSeq`, inputSeq);
    console.error(`outputsSeq`, outputsSeq);
    throw `Error in test scenario ${scenario}! Input sequences and outputs sequences must have the same length! Every input must map to an outputs array. You probably skip a such mapping! Remember that even if the outputs is the empty array (i.e. no outputs) it must still be set in the test scenario data structure. Cf. logs`
  }
  QUnit.test(scenario, function exec_test(assert) {
    const fsm = fsmFactory(fsmSettings);
    const rawOutputsSeq = inputSeq.map(fsm);

    const actualOutputsSeq = processRenderCommands(rawOutputsSeq.map(removeNoOutputs));

    const { isTestPassed, actualOutputsReorderedSeq, expectedOutputsUnfoldedSeq, indexWhenFailed } =
      inputSeq.reduce((acc, input, index) => {
        let { isTestPassed, actualOutputsReorderedSeq, expectedOutputsUnfoldedSeq, indexWhenFailed } = acc;
        // outputs: [obj1, obj2] with objx : {command, params}
        const actualOutputs = actualOutputsSeq[index];
        // expected: [obj1, obj2] with objx only one key {[command]: params}
        const expectedOutputsCollapsed = outputsSeq[index];
        // => Array < {[command]: params} >
        const actualOutputsCollapsed = actualOutputs
          .map(output => {
            const { command, params } = output;
            return { [command]: params }
          })
          .reduce((acc, actualOutputCollapsed) => {
            return Object.assign(acc, actualOutputCollapsed)
          }, {})
        ;
        // => Array < {command, params} >   with same order than expectedOutputsCollapsed
        const actualOutputsReordered = expectedOutputsCollapsed
          .map(expectedOutputCollapsed => {
            const command = Object.keys(expectedOutputCollapsed)[0];
            const params = actualOutputsCollapsed[command];

            return command in actualOutputsCollapsed
              ? { command, params }
              : `expected command ${command} not found in actual outputs!!`
          }).concat(actualOutputs.filter(actualOutput => {
            const { command, params } = actualOutput;

            return expectedOutputsCollapsed
              .map(expectedOutputCollapsed => Object.keys(expectedOutputCollapsed)[0])
              .indexOf(command) === -1
          }));
        // => Array < {command, params} >   with same order than expectedOutputsCollapsed
        const expectedOutputsUnfolded = expectedOutputsCollapsed.map(expectedOutputCollapsed => {
          const command = Object.keys(expectedOutputCollapsed)[0];
          const params = expectedOutputCollapsed[command];

          return { command, params }
        });

        const passed = deepEqual(actualOutputsReordered, expectedOutputsUnfolded);

        return {
          isTestPassed: isTestPassed && passed,
          actualOutputsReorderedSeq: actualOutputsReorderedSeq.concat([actualOutputsReordered]),
          expectedOutputsUnfoldedSeq: expectedOutputsUnfoldedSeq.concat([expectedOutputsUnfolded]),
          // Accumulate failing indices
          indexWhenFailed: !passed ? indexWhenFailed.concat(index) : indexWhenFailed
        }
      }, { isTestPassed: true, actualOutputsReorderedSeq: [], expectedOutputsUnfoldedSeq: [], indexWhenFailed: [] });

    const inputSeqFormatted = inputSeq.map(x => Object.keys(x)[0]).join('|');
    const errorMessage = `For a sequence of ${inputSeq.length} inputs (${inputSeqFormatted}), the actual outputs sequence differ from the expected outputs sequence at the ${formatIndex(indexWhenFailed)} value of the sequence`;
    const okMessage = prettyFormat(inputSeq);
    const message = isTestPassed ? okMessage : errorMessage;

    console.debug(`input sequence`, inputSeq);
    console.debug(`raw outputs sequence`, rawOutputsSeq);
    console.debug(`actual outputs sequence`, actualOutputsSeq);
    console.debug(`expected outputs sequence`, outputsSeq);
    // We have already determined if the test fails or not,
    // We run QUnit to get the nice diffs in case of failure!
    assert.deepEqual(actualOutputsReorderedSeq, expectedOutputsUnfoldedSeq, message);
  });
});


