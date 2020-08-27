module.exports = {
  rootDir: "./queries/",
  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.(gql|graphql)$": "../config/jest/graphqlTransform.js",
  },
  modulePaths: [],
  moduleFileExtensions: ["js"],
  testMatch: ["<rootDir>/**/*.pact.js"],
};
