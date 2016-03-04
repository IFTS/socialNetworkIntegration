"use strict";
module.exports = function(app, passport) {

  app.get('/', function(req, res) {
    res.render('index.ejs', {
            title: "Hello There"
        }); // load the login.ejs file
      });

};
