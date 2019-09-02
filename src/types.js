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
