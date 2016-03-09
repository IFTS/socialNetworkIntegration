"use strict";

//Import all node modules
import express from 'express';
import passport from 'passport';
import flash from 'connect-flash';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import favicon from 'serve-favicon';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fbgraph from 'fbgraph';
import Twitter from 'twitter';
import google from 'googleapis';
import moment from 'moment';
var plus = google.plus('v1');
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(process.env.GoogleAppID, process.env.GoogleAppSecret, './connect/google/callback');

//Load in the Instagram Wrapper.
let ig = require('instagram-node').instagram();

//Load the .env file from root directory.
dotenv.load();
//Puts express onto the application
const app  = express();
//Port which the node server will run on.
const port = process.env.PORT || 8080;
//Connect to the database
let configDB = require('./lib/dbconfig.js');
mongoose.connect(configDB.url);
// load the auth variables
const configAuth = require('./lib/auth');
// load the mongoose User variables
let user = require('./app/models/user');
// pass passport & for configuration
require('./lib/passport')(passport, configAuth, user, ig);
// load Twitter

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
//Setting our Template Engine to EJS
app.set('view engine', 'ejs'); // set up ejs for templating
app.use(express.static(__dirname + '/public'));
//app.use(favicon(__dirname + '/public/favicon.ico'));

// required for passport
app.use(session({ secret: 'bobsyouruncle', cookie: {maxAge: 900000000000000}})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//Passing our Passport Information and Application Information to our routes
require('./app/routes.js')(app, passport, fbgraph, Twitter, ig, moment);

app.listen(port);
console.log('Server connection established');
console.log('Using The Following Port: ' + port);
