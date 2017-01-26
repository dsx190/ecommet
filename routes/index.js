'use strict';

const express = require('express'),
	router = express.Router(),
	Config = require('../config'),
	admin = require('./admin/index'),
	cms = require('./cms'),
	customer = require('./customer');

/**
 * Set locals data to be used almost everywhere.
 */
router.use((req, res, next) => {
	res.locals.url = Config.get('server.url');
	next();
});

router.use('/', cms);
router.use('/admin', admin);
router.use('/customer', customer);

module.exports = router;