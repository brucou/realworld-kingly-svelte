/** @typedef {String} Tag
 */
/** @typedef {String} Slug
 */
/** @typedef {Object} User
 * @property {String} email
 * @property {String} token
 * @property {String} username
 * @property {String} bio
 * @property {null} image
 */
/** @typedef {{command: String, params: *}} Command
 * */
/** @typedef {Null | Array<Command>} MachineOutputs
 * */
/** @typedef {Array<Command>} CleanedMachineOutputs
 * */
/** @typedef {Object} FetchedArticles
 * @property {Array<Article>} articles
 * @property {Number} articlesCount
 */
/** @typedef {Object} Article
 * @property {String} title
 * @property {String} slug
 * @property {String} body
 * @property {String} createdAt
 * @property {String} updatedAt
 * @property {Array} tagList
 * @property {String} description
 * @property {Author} author
 * @property {Boolean} favorited
 * @property {Number} favoritesCount
 */
/** @typedef {Object} FetchedTags
 * @property {Array<Tag>} tags
 */
/** @typedef {String} Tag
 */
/** @typedef {"ROUTE_CHANGED" | "TAGS_FETCHED_OK" | "TAGS_FETCHED_NOK" | "ARTICLES_FETCHED_OK" | "ARTICLES_FETCHED_NOK" | "AUTH_CHECKED" | "CLICKED_TAG" | "CLICKED_PAGE" | "CLICKED_USER_FEED" | "CLICKED_GLOBAL_FEED" | "TOGGLED_FAVORITE" | String} HOME_ROUTE_EVENTS
 */
/** @typedef {"routing" | "home" | "fetch-auth-for-favorite" | "fetching-authentication" | "fetching-global-feed" | "fetching-user-feed" | "fetching-filtered-articles" | "pending-global-feed" | "pending-global-feed-articles" | "pending-user-feed" | "pending-user-feed-articles" | "pending-filtered-articles" | "fetched-filtered-articles" | "failed-fetch-filtered-articles" | String} HOME_ROUTE_STATES
 */
/**
 * @typedef {InconditionalTransition | ConditionalTransition} Transition
 */
/**
 * @typedef {HOME_ROUTE_STATES | String} ControlState
 */
/**
 * @typedef {{from: ControlState, to: ControlState|HistoryState, event: EventLabel, action: ActionFactory}} InconditionalTransition
 *   Inconditional_Transition encodes transition with no guards attached. Every time the specified event occurs, and
 *   the machine is in the specified state, it will transition to the target control state, and invoke the action
 *   returned by the action factory
 */
/**
 * @typedef {{from: ControlState, event: EventLabel, guards: Array<Condition>}} ConditionalTransition Transition for the
 * specified state is contingent to some guards being passed. Those guards are defined as an array.
 */
/**
 * @typedef {{predicate: FSM_Predicate, to: ControlState|HistoryState, action: ActionFactory}} Condition On satisfying the
 * specified predicate, the received event data will trigger the transition to the specified target control state
 * and invoke the action created by the specified action factory, leading to an update of the internal state of the
 * extended state machine and possibly an output to the state machine client.
 */
/**
 * @typedef {function(ExtendedState, EventData, FSM_Settings) : Actions} ActionFactory
 */
/**
 * @typedef {{updates: ExtendedStateUpdate, outputs: Array<MachineOutput>}} Actions The actions
 * to be performed by the state machine in response to a transition. `updates` represents the state update for
 * the variables of the extended state machine. `output` represents the output of the state machine passed to the
 * API caller.
 */
/** @typedef {function (ExtendedState, *, *) : Boolean} FSM_Predicate */
