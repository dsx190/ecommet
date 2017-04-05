'use strict';

const User = require('../../lib/models/admin/user');

/**
 * Identify admin requests by setting isAdmin to true
 */
exports.identify = (req, res, next) => {
	req.isAdmin = true;
	next();
};

/**
 * Redirect to login if the admin is not authenticated.
 */
exports.auth = (req, res, next) => {
	if (!req.user || !req.user instanceof User) {
		return res.redirect('/admin/login');
	}
	next();
}