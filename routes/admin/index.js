'use strict';

const express = require('express'),
	router = express.Router(),
	controller = require('../../lib/controllers/admin/index'),
	ensureAuthenticated = require('connect-ensure-login').ensureAuthenticated,
	passport = require('passport');

/**
 * Identify admin requests on passport's local strategy
 */
router.use((req, res, next) => {
	req.isAdmin = true;
	next();
});

router.get('/login', controller.login);
router.post('/login', passport.authenticate('local', {
	failureRedirect: '/admin/login',
	successRedirect: '/admin/dashboard'
}));
router.get('/dashboard', ensureAuthenticated('/admin/login'), controller.dashboard);

module.exports = router;