'use strict';

const Customer = require('../models/customer/customer');

module.exports = class CustomerController {

	static login(req, res) {
		res.render('customer/login');
	}

	static signup(req, res) {
		res.render('customer/signup');
	}

	static register(req, res) {
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

	static account(req, res) {
		res.render('customer/account');
	}

	static logout(req, res) {
		req.logout();
		res.redirect('/customer/login');
	}
}