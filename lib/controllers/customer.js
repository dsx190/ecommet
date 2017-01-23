'use strict';

const CoreController = require('./core'),
	Customer = require('../models/customer/customer');

module.exports = class CustomerController extends CoreController {

	login(req, res) {
		super.render(res, 'customer/login');
	}

	signup(req, res) {
		super.render(res, 'customer/signup');
	}

	account(req, res) {
		super.render(res, 'customer/account');
	}

	logout(req, res) {
		req.logout();
		res.redirect('customer/login');
	}
}