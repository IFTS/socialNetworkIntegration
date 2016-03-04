"use strict";
module.exports = function(app, passport) {

    // ----- Basic Routes

    app.get('/', function(req, res) {
        res.render('index.ejs', {
            title: "Social Network Intergration Search Application"
        }); // load the login.ejs file
    });

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user: req.user
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


    // ----- Facebook Routes

    app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
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
        scope: 'email'
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
