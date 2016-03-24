# WEBRES - Sprint 3 - Social Media Aggregation Application

This repo contains the following information:

1. Our code for the application

# Install

To install the application onto your machine follow the following links:
1. `Git pull` 
2. Create a `.env` file. This file needs to include the following information:
  1. Facebook App ID
  2. Facebook App Secret
  3. Twitter App ID
  4. Twitter App Secret
  5. Twtiter Access Token
  6. Twitter Token Secret
  7. Instagram App ID
  8. Instagram App Secret
  9. Google App ID
  10. Google App Secret
  11. Mongo Database URL (This project used MLab).
3. `npm install`
4. `npm start`

_Using jshint, would recommemd installing the `linter-jshint` package from Atom. `apm install linter-jshint`_

# Build

If you ever update the schema you should run
`npm run update-schema`

# Run

1. `npm start`
2. Go to [localhost:8080/](localhost:8080/) for the home page
3. Log in wither eith Twitter, Facebook, Instagram or Google. Once logged in you are able to link accounts.

# Test

To test the database connection and return data you should run
`npm run db-test`


