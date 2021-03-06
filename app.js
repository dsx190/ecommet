'use strict';

const express = require('express'),
	session = require('express-session'),
	bodyParser = require('body-parser'),
	passport = require('passport'),
	flash = require('connect-flash'),
	auth = require('./lib/util/auth'),
	Config = require('./config'),
	port = Config.get('server.port'),
	routes = require('./routes'),
	app = express();

app.set('views', './lib/views');
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());

// Session
app.use(session(Config.get('session')));

// Passport
auth(passport); // strategies and serializations
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use(routes);

// 404 Errors Handler
app.use((req, res, next) => { res.send('404') });

// 500 Errors Handler
app.use((err, req, res, next) => { 
	console.log(err);
	res.send('500');
});

app.listen(port);

console.log(`App listening on port ${port}`);