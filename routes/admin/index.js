'use strict';

const express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	controller = require('../../lib/controllers/admin/index'),
	// Middleware
	identify = require('./middleware').identify,
	auth = require('./middleware').auth,
	// Admin routers
	sales = require('./sales'),
	customer = require('./customer'),
	catalog = require('./catalog');

/**
 * Identify admin requests on passport's local strategy
 */
router.use(identify);

/**
 * Auth and dashboard routes.
 */
router.get('/login', controller.login);
router.post('/login', passport.authenticate('local', {
	failureRedirect: '/admin/login',
	successRedirect: '/admin/dashboard'
}));
router.get('/dashboard', auth, controller.dashboard);

/**
 * App specific routes.
 */
router.use('/sales', auth, sales);
router.use('/customers', auth, customer);
router.use('/catalog', auth, catalog);

module.exports = router;