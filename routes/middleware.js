'use strict';

const Customer = require('../lib/models/customer/customer'),
	Config = require('../config');

/**
 * Set common locals to the response.
 */
exports.setLocals = (req, res, next) => {
	res.locals.url = Config.get('server.url');
	res.locals.old = req.flash('old')[0];
	res.locals.messages = {
		'info': req.flash('info'),
		'error': req.flash('error'),
		'success': req.flash('success'),
		'warning': req.flash('warning')
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
