"use strict";

const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = function(passport, configAuth, User, Instagram) {

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  //Passport Facebook Autheication
  passport.use(new FacebookStrategy({
      // pull in our app id and secret from our auth.js file
      clientID: configAuth.facebookAuth.clientID,
      clientSecret: configAuth.facebookAuth.clientSecret,
      callbackURL: configAuth.facebookAuth.callbackURL,
      profileFields: ['id', 'name', 'picture.type(large)', 'emails', 'displayName', 'about', 'gender'],
      passReqToCallback: true
    },

    // facebook will send back the token and profile
    function(req, token, refreshToken, profile, done) {

      // asynchronous
      process.nextTick(function() {

        // check if the user is already logged in
        if (!req.user) {
          // find the user in the database based on their facebook id
          User.findOne({
            'facebook.id': profile.id
          }, function(err, user) {
            // if there is an error, stop everything and return that
            // ie an error connecting to the database
            if (err) {

              return done(err);
            }
            // if the user is found, then log them in
            if (user) {
              // if there is a user id already but no token (user was linked at one point and then removed)
              // just add our token and profile information
              if (!user.facebook.token || user.facebook.token !== token) {
                user.facebook.token = token;
                user.facebook.id = profile.id;
                user.facebook.name = profile.displayName;
                user.facebook.email = profile.emails[0].value;

                user.save(function(err) {
                  if (err) {

                    throw err;
                  }
                  return done(null, user);
                });
              }

              return done(null, user); // user found, return that user

            } else {
              // if there is no user found with that facebook id, create them
              let newUser = new User();
              // set all of the facebook information in our user model
              newUser.facebook.id = profile.id; // set the users facebook id
              newUser.facebook.token = token; // we will save the token that facebook provides to the user
              newUser.facebook.name = profile.displayName; // look at the passport user profile to see how names are returned
              newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
              // save our user to the database
              newUser.save(function(err) {
                if (err) {

                  throw err;
                }
                // if successful, return the new user
                return done(null, newUser);
              });
            }
          });
        } else {
          // user already exists and is logged in, we have to link accounts
          let user = req.user; // pull the user out of the session

          // update the current users facebook credentials
          user.facebook.id = profile.id;
          user.facebook.token = token;
          user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
          user.facebook.email = profile.emails[0].value;

          // save the user
          user.save(function(err) {
            if (err) {

              throw err;
            }
            return done(null, user);
          });
        }
      });
    }));

  //Passport Twitter Autheication
  passport.use(new TwitterStrategy({

      consumerKey: configAuth.twitterAuth.consumerKey,
      consumerSecret: configAuth.twitterAuth.consumerSecret,
      callbackURL: configAuth.twitterAuth.callbackURL,
      passReqToCallback: true

    },
    function(req, token, tokenSecret, profile, done) {

      // make the code asynchronous
      // User.findOne won't fire until we have all our data back from Twitter
      process.nextTick(function() {


        // check if the user is already logged in
        if (!req.user) {

          User.findOne({
            'twitter.id': profile.id
          }, function(err, user) {
            if (err) {

              return done(err);
            }
            // if the user is found then log them in
            if (user) {

              // if there is a user id already but no token (user was linked at one point and then removed)
              // just add our token and profile information
              if (!user.twitter.token || !user.twitter.tokenSecret) {
                user.twitter.token = token;
                user.twitter.tokenSecret = tokenSecret;
                user.twitter.username = profile.username;
                user.twitter.displayName = profile.displayName;

                user.save(function(err) {
                  if (err) {

                    throw err;
                  }
                  return done(null, user);
                });
              }

              return done(null, user); // user found, return that user

            } else {
              // if there is no user, create them
              let newUser = new User();
              // set all of the user data that we need
              newUser.twitter.id = profile.id;
              newUser.twitter.token = token;
              user.twitter.tokenSecret = tokenSecret;
              newUser.twitter.username = profile.username;
              newUser.twitter.displayName = profile.displayName;
              // save our user into the database
              newUser.save(function(err) {
                if (err) {

                  throw err;
                }
                return done(null, newUser);
              });
            }
          });
        } else {
          // user already exists and is logged in, we have to link accounts
          let user = req.user; // pull the user out of the session
          // update the current users twitter credentials
          user.twitter.id = profile.id;
          user.twitter.token = token;
          user.twitter.tokenSecret = tokenSecret;
          user.twitter.username = profile.username;
          user.twitter.displayName = profile.displayName;

          // save the user
          user.save(function(err) {
            if (err) {

              throw err;
            }
            return done(null, user);
          });
        }
      });
    }));

  //Passport Instagram Autheication
  passport.use(new InstagramStrategy({

      clientID: configAuth.instagramAuth.clientID,
      clientSecret: configAuth.instagramAuth.clientSecret,
      callbackURL: configAuth.instagramAuth.callbackURL,
      passReqToCallback: true

    },
    function(req, token, tokenSecret, profile, done) {
      // make the code asynchronous
      process.nextTick(function() {

        // check if the user is already logged in
        if (!req.user) {

          User.findOne({
            'instagram.id': profile.id
          }, function(err, user) {
            if (err) {

              return done(err);
            }
            // if the user is found then log them in
            if (user) {

              // if there is a user id already but no token (user was linked at one point and then removed)
              // just add our token and profile information
              if (!user.instagram.token || user.instagram.token !== token) {
                user.instagram.token = token;
                user.instagram.displayName = profile.displayName;
                user.instagram.username = profile.username;

                user.save(function(err) {
                  if (err) {

                    throw err;
                  }
                  return done(null, user);
                });
              }

              return done(null, user); // user found, return that user

            } else {
              // if there is no user, create them
              let newUser = new User();
              // set all of the user data that we need
              newUser.instagram.id = profile.id;
              newUser.instagram.token = token;
              newUser.instagram.username = profile.username;
              newUser.instagram.displayName = profile.displayName;
              // save our user into the database
              newUser.save(function(err) {
                if (err) {

                  throw err;
                }
                return done(null, newUser);
              });
            }
          });
        } else {
          // user already exists and is logged in, we have to link accounts
          let user = req.user; // pull the user out of the session
          user.instagram.id = profile.id;
          user.instagram.token = token;
          user.instagram.username = profile.username;
          user.instagram.displayName = profile.displayName;
          // save the user
          user.save(function(err) {
            if (err) {

              throw err;
            }
            return done(null, user);
          });
        }
      });

    }));

  //Passport Google Autheication
  passport.use(new GoogleStrategy({

      clientID: configAuth.googleAuth.clientID,
      clientSecret: configAuth.googleAuth.clientSecret,
      callbackURL: configAuth.googleAuth.callbackURL,
      passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },
    function(req, token, refreshToken, profile, done) {
      // asynchronous
      process.nextTick(function() {
        // check if the user is already logged in
        if (!req.user) {

          User.findOne({
            'google.id': profile.id
          }, function(err, user) {
            if (err){
              return done(err);
            }

            if (user) {

              // if there is a user id already but no token (user was linked at one point and then removed)
              if (!user.google.token) {
                user.google.token = token;
                user.google.displayName = profile.displayName;
                user.google.email = profile.emails[0].value; // pull the first email

                user.save(function(err) {
                  if (err){
                    return done(err);
                  }
                  return done(null, user);
                });
              }

              return done(null, user);
            } else {
              var newUser = new User();

              newUser.google.id = profile.id;
              newUser.google.token = token;
              newUser.google.displayName = profile.displayName;
              newUser.google.email = profile.emails[0].value; // pull the first email

              newUser.save(function(err) {
                if (err) {
                  return done(err);
}
                return done(null, newUser);
              });
            }
          });

        } else {
          // user already exists and is logged in, we have to link accounts
          var user = req.user; // pull the user out of the session

          user.google.id = profile.id;
          user.google.token = token;
          user.google.displayName = profile.displayName;
          user.google.email = profile.emails[0].value; // pull the first email

          user.save(function(err) {
            if (err) {
              return done(err);
            }
            return done(null, user);
          });

        }

      });

    }));

};
