'use strict';

const express = require('express'),
	router = express.Router(),
	// Middleware
	setLocals = require('./middleware').setLocals,
	// Routers
	admin = require('./admin/index'),
	cms = require('./cms'),
	customer = require('./customer');

/**
 * Set common locals.
 */
router.use(setLocals);

router.use('/', cms);
router.use('/admin', admin);
router.use('/customer', customer);

module.exports = router;