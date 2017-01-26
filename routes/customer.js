'use strict';

const express = require('express'),
	router = express.Router(),
	controller = require('../lib/controllers/customer'),
	auth = require('./middleware').auth,
	passport = require('passport');

router.get('/login', controller.login);

router.post('/login', passport.authenticate('local', {
	failureRedirect: '/customer/login',
	successRedirect: '/customer/account'
}));

router.get('/logout', controller.logout);

router.get('/signup', controller.signup);

router.post('/signup', controller.register);

router.get('/account', auth, controller.account);

module.exports = router;