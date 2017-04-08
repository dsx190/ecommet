'use strict';

const User = require('../../lib/models/admin/user'),
	Role = require('../../lib/models/admin/role'),
	_ = require('lodash');

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

/**
 * Check if a user has permission to access a route.
 */
exports.access = (req, res, next) => {
	let route = req.baseUrl + req.route.path;
	// Find the route inside the User's permissions
	/*Role.find(req.user.roleId).then(role => {
		if (_.indexOf(role.permissions, route) === -1) {
			req.flash('error', 'Access denied');
			return res.redirect('back');
		}
	});*/
	next();
};