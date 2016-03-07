"use strict";
module.exports = function(app, passport, fbgraph, Twitter, ig) {

    // ----- Basic Routes

    app.get('/', function(req, res) {
        res.render('index.ejs', {
            title: "Social Network Intergration Search Application"
        }); // load the login.ejs file
    });

    app.get('/profile', isLoggedIn, function(req, res) {
      console.log(req.user.google);
      var twitterFeed = [];
      //var facebookFeed = [];
      var instaFeed = [];
      var googleFeed = [];
      var twitter, instagram, google;

      if (req.user.twitter) {
        twitter = new Twitter({
          consumer_key: process.env.TwitterAppID,
          consumer_secret: process.env.TwitterAppSecret,
          access_token_key: req.user.twitter.token,
          access_token_secret: req.user.twitter.tokenSecret
        });
         twitter = new Promise((resolve) => {
          twitter.get('statuses/home_timeline', function(error, tweets){
            if (error) {
              console.error(error);
              resolve();
            }
            else {
              twitterFeed = tweets;
                console.log("Twitter Feed" + twitterFeed);
              console.log(twitterFeed);
              resolve();
            }
          });
        });
      }

      if (req.user.instagram) {
        instagram = new Promise((resolve) => {
          console.log("Access Token:" + req.user.instagram.token);
          console.log("Client ID:" + process.env.InstagramAppID);
          console.log("Client Secret:" + process.env.InstagramAppSecret);
          ig.use({
              access_token: req.user.instagram.token,
              client_id: process.env.InstagramAppID,
              client_secret: process.env.InstagramAppSecret
            });
          ig.user_media_recent(req.user.instagram.id, function(err, medias) {
            if (err) {
              console.error(err);
              resolve();
            }
            else {
              instaFeed = medias;
                console.log("Insta Feed" + instaFeed);
              console.log(instaFeed);
              resolve();
            }
            });
        });
      }
      if (req.user.google) {
        google = new Promise((resolve) => {
          googleFeed = req.user.google;
          console.log("Google Feed" + googleFeed);
          resolve();
        });
      }

      Promise.all([twitter, instagram, google]).then(() => {
        console.log(instaFeed);
        res.render('profile.ejs', {
            user: req.user,
            twitterFeed: twitterFeed,
            instaFeed: instaFeed,
            googleFeed: googleFeed,
        });
      });

    });



    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


    // ----- Facebook Routes

    app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email','user_posts'] }));

    //When the facebook route confirms, we handle the re-direct here
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

    app.get('/unlink/facebook', function(req, res) {
        let user = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            if (err) {
                throw err;
            }
            res.redirect('/profile');
        });
    });

    app.get('/connect/facebook', passport.authorize('facebook', {
        scope: ['email', 'user_posts']
    }));

    app.get('/connect/facebook/callback',
        passport.authorize('facebook', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));


    // ----- Twitter Routes

    app.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

    app.get('/unlink/twitter', function(req, res) {
        let user = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
            if (err) {
                throw err;
            }
            res.redirect('/profile');
        });
    });

    app.get('/connect/twitter', passport.authorize('twitter', {
        scope: 'email'
    }));

    app.get('/connect/twitter/callback',
        passport.authorize('twitter', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

    app.get('/get/twitter/timeline', isLoggedIn, (req, res) => {
      var twitter = new Twitter({
        consumer_key: process.env.TwitterAppID,
        consumer_secret: process.env.TwitterAppSecret,
        access_token_key: req.user.twitter.token,
        access_token_secret: req.user.twitter.tokenSecret
      });
      twitter.get('statuses/home_timeline', function(error, tweets){
        if (error){
          console.error(error);
        }
        res.render('profile.ejs', {
            user: req.user,
            twitterFeed: tweets
        });
      });
    });


    // ----- Instagram Routes

    app.get('/auth/instagram', passport.authenticate('instagram'));

    app.get('/auth/instagram/callback',
        passport.authenticate('instagram', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

    app.get('/unlink/instagram', function(req, res) {
        let user = req.user;
        user.instagram.token = undefined;

        user.save(function(err) {
            if (err) {
                throw err;
            }
            res.redirect('/profile');
        });
    });

    app.get('/connect/instagram', passport.authenticate('instagram'));

    app.get('/connect/instagram/callback',
        passport.authorize('instagram', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

    // ------ Google Routes
    app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

    app.get('/auth/google/callback',
        passport.authenticate('google', {
          successRedirect: '/profile',
          failureRedirect: '/'
        }));

        app.get('/unlink/google', function(req, res) {
            let user = req.user;
            user.google.token = undefined;

            user.save(function(err) {
                if (err) {
                    throw err;
                }
                res.redirect('/profile');
            });
        });

        app.get('/connect/google', passport.authenticate('google', {scope: ['profile', 'email']}));

        app.get('/connect/google/callback',
            passport.authorize('google', {
                successRedirect: '/profile',
                failureRedirect: '/'
            }));




    // ------ Other Routes
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/');
    }
};
