module.exports = {

    'facebookAuth' : {
        'clientID'      : process.env.FacebookAppID,
        'clientSecret'  : process.env.FacebookAppSecret,
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : process.env.TwitterAppID,
        'consumerSecret'    : process.env.TwitterAppSecret,
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'instagramAuth' : {
        'clientID'      : process.env.InstagramAppID,
        'clientSecret'  : process.env.InstagramAppSecret,
        'callbackURL'   : 'http://localhost:8080/auth/instagram/callback'
    }
};
