"use strict";
module.exports = function(app, passport, fbgraph, Twitter, ig, user) {

    // ----- Basic Routes

    app.get('/', function(req, res) {
        res.render('index.ejs', {
            title: "Social Network Intergration Search Application"
        }); // load the login.ejs file
    });

    app.get('/profile', isLoggedIn, function(req, res) {
      var twitterFeed = [];
      var facebookFeed = [];
      var instaFeed = [];

      if (req.user.twitter) {
        var twitter = new Twitter({
          consumer_key: process.env.TwitterAppID,
          consumer_secret: process.env.TwitterAppSecret,
          access_token_key: req.user.twitter.token,
          access_token_secret: req.user.twitter.tokenSecret
        });
        var twitter = new Promise((resolve, reject) => {
          twitter.get('statuses/home_timeline', function(error, tweets, response){
            if (error) {
              console.error(error);
              resolve();
            }
            else {
              twitterFeed = tweets;
              resolve();
            }
          });
        });
      }

      if (req.user.facebook) {
        var facebook = new Promise((resolve, reject) => {
          fbgraph.setAccessToken(req.user.facebook.token);
          fbgraph.get('/'+req.user.facebook.id+'/', (err, res) => {
            // console.log('ERRR',err);
            // console.log('RESS', res.data);
            resolve();
          });
        });
      }

      if (req.user.instagram) {
        var instagram = new Promise((resolve, reject) => {
          ig.use({
             access_token: req.user.instagram.token
           });
          ig.use({
            client_id: process.env.InstagramAppID,
            client_secret: process.env.InstagramAppSecret
          });
          resolve(); // do IG query here
        });
      }

      Promise.all([twitter, facebook]).then(() => {
        res.render('profile.ejs', {
            user: req.user,
            twitterFeed: twitterFeed
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

    // app.get('/get/facebook/posts',isLoggedIn, (req, res) => {
    //   fbgraph.setAccessToken(req.user.facebook.token);
    //   fbgraph.get(''+req.user.id+'', (err, res) => {
    //     console.log('RES: ',res);
    //   });
    //   res.redirect('/profile');
    // });


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
      twitter.get('statuses/home_timeline', function(error, tweets, response){
        if (error) console.error(error);
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


    // ------ Other Routes
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/');
    }
};
