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

//Load the .env file from root directory.
dotenv.load();

//Puts express onto the application
const app  = express();
//Port which the node server will run on.
const port = process.env.PORT || 8080;

//Load my SQL connection file
//var connection = require('./config/connection.js');
//Load my SendGrid Connection file
//var sendgridClient = require('./config/emailConnection.js');
//Load my Twilio connection file
//var twilioClient = require('./config/textConnection.js');

//Pass Information to our Passport File for Authentication
//require('./config/passport')(passport, connection); // pass passport & for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

//Setting our Template Engine to EJS
app.set('view engine', 'ejs'); // set up ejs for templating
app.use(express.static(__dirname + '/public'));
//app.use('/vendor', express.static(__dirname + '/bower_components'));
//app.use(favicon(__dirname + '/public/favicon.ico'));

// required for passport
app.use(session({ secret: 'bobsyouruncle', cookie: {maxAge: 900000000000000}})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


//Passing our Passport Information and Application Information to our routes
require('./app/routes.js')(app, passport);

app.listen(port);
console.log('Server connection established');
console.log('Using The Following Port: ' + port);
