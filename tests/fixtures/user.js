export const userFixture = {
  "email": "jake@jake.jake",
  "token": "jwt.token.here",
  "username": "jake",
  "bio": "I work at statefarm",
  "image": null
};
export const signUpUserFixture = {
  username: "papa",
  email: "tango@charlie.es",
  password: "123456"
};
export const signedUpUserFixture = {
  "email": "tango@charlie.es",
  "token": "jwt.token.there",
  "username": "papa",
  "bio": "I don't work",
  "image": null
};
export const signUpErrorsFixture = {
  username: ["can't be blank", "too short (minimum is 1 character)", "too long (maximum is 20 characters)"],
  email: ["can't be blank"],
  password: ["can't be blank"],
};
export const signInUserFixture = {
  "email": "manu@dibango.lv",
  password: "123456"
};
export const signedInUserFixture = {
  "email": "manu@dibango.lv",
  "token": "jwt.token.rightthere",
  "username": "cake",
  "bio": "no play no pay",
  "image": null
};
export const signInErrorsFixture = {
  email: ["can't be blank"],
  password: ["can't be blank"],
};
export const randomUserProfileFixture = {
  "email": "first@afraid.petrified",
  "token": "jwt.token.righttherenay",
  username: 'random',
  bio: `psychology`,
  image: null,
  following: false
};
