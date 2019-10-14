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
export const fetchErrorArticleFixture = {
    "title": ["can't be blank", "is too short (minimum is 1 character)"],
    "body": ["can't be blank"],
    "description": ["can't be blank", "is too short (minimum is 1 character)"]
}
