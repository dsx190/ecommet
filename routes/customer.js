'use strict';

const express = require('express'),
	router = express.Router(),
	controller = require('../lib/controllers/customer'),
	ensureAuthenticated = require('connect-ensure-login').ensureAuthenticated,
	passport = require('passport');

router.get('/login', controller.login);

router.post('/login', passport.authenticate('local', {failureRedirect: 'customer/login'}), (req, res) => res.redirect('/customer/account'));

router.get('/logout', controller.logout);

router.get('/signup', controller.signup);

router.post('/signup', controller.register);

router.get('/account', ensureAuthenticated('/customer/login'), controller.account);

module.exports = router;