export const articleSlugFixture = `implementing-conduit-with-kingly-state-machine-library-n4mhqh`;
export const articleFixture = {
      "title": "test",
      "slug": "test-sdiuuj",
      "body": "### markdown",
      "createdAt": "2018-07-13T17:31:36.374Z",
      "updatedAt": "2018-07-13T17:31:36.374Z",
      "tagList": ["dragons", "sushi"],
      "description": "description",
      "author": {
        "username": "testuser",
        "bio": null,
        "image": "https://static.productionready.io/images/smiley-cyrus.jpg",
        "following": false
      },
      "favorited": false,
      "favoritesCount": 0
};
const  {title, body, description, tagList} = articleFixture;
export const fetchedArticleFixture = {title, body, description, tagList};
export const submitErrorArticleFixture = {
    "title": ["can't be blank", "is too short (minimum is 1 character)"],
    "body": ["can't be blank"],
    "description": ["can't be blank", "is too short (minimum is 1 character)"]
}
export const newArticleFixture = {
  title : 'filledInArticleFixture',
  body: "body",
  description: "description",
  tagList: ['ta']
};
export const createdNewArticleFixture = {
  "title": "filledInArticleFixture",
  "slug": "test-sss",
  "body": "body",
  "createdAt": "2018-07-13T17:31:36.374Z",
  "updatedAt": "2018-07-13T17:31:36.374Z",
  tagList: ['taggy'],
  "description": "description",
  "author": {
    "username": "conduit",
    "bio": null,
    "image": "https://static.productionready.io/images/smiley-cyrus.jpg",
    "following": true
  },
  "favorited": false,
  "favoritesCount": 0
};
