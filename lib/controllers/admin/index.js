'use strict';

module.exports = class IndexController {

	/**
	 * Redirect the user to dashboard if it's already logged in
	 * or render the login page.
	 */
	static login(req, res) {
		// Check if the user is already logged in
		if (req.user && req.user.collectionName === 'admins') {
			return res.redirect('/admin/dashboard');
		}
		res.render('admin/core/login');
	}

	/**
	 * Logout and redirect to login.
	 */
	static logout(req, res) {
		req.logout();
		res.redirect('/admin/login');
	}

	/*
	 * Render the dashboard.
	 */
	static dashboard(req, res) {
		res.render('admin/dashboard');
	}
}