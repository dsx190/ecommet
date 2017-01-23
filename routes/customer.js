'use strict';

const express = require('express'),
	router = express.Router(),
	CustomerController = require('../lib/controllers/customer'),
	controller = new CustomerController(),
	ensureAuthenticated = require('connect-ensure-login').ensureAuthenticated,
	passport = require('passport');

router.get('/login', controller.login);

router.post('/login', 
	passport.authenticate('customers-signin', {
		failureRedirect: '/customers/login'
	}),
	(req, res) => res.redirect('customers/account'));

router.get('/logout', controller.logout);

router.get('/signup', controller.signup);

router.post('/signup',
	passport.authenticate('customers-signup', {
		failureRedirect: '/customers/signup'
	}),
	(req, res) => res.redirect('customers/account'));

router.get('/account', ensureAuthenticated('customers/login'), controller.account);

module.exports = router;