'use strict';

const Customer = require('../lib/models/customer/customer'),
	flash = require('../lib/util/flash'),
	Config = require('../config');

/**
 * Set common locals to the response.
 */
exports.setLocals = (req, res, next) => {
	res.locals.url = Config.get('server.url');
	res.locals.messages = () => {
		return req.flash();
	};
	next();
};

/**
 * Redirect to login if the customer is not authenticated.
 */
exports.auth = (req, res, next) => {
	if (!req.user || !req.user instanceof Customer) {
		return res.redirect('/customer/login');
	}
	next();
};
