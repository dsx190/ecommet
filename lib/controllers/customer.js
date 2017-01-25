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

	register(req, res) {
		Customer.create({
			'email': req.body.email,
			'password': req.body.password
		}).then(
			customer => {
				req.login(customer, err => {
					if (err) {
						res.redirect('/customer/signup');
					} else {
						res.redirect('/customer/account');
					}
				});
			},
			err => res.redirect('/customer/signup')
		);
	}

	account(req, res) {
		console.log(req);
		super.render(res, 'customer/account');
	}

	logout(req, res) {
		req.logout();
		res.redirect('/customer/login');
	}
}