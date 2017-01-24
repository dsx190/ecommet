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
		Customer.insertOne({
			'email': req.body.email,
			'password': req.body.password
		}).then(
			customer => {
				req.login(customer, err => {
					if (err) {
						console.log(err);
						res.redirect('/customers/signup');
					} else {
						res.redirect('/customers/account');
					}
				});
			},
			err => {
				console.log('Error 2', err);
				res.redirect('/customers/signup');
			}
		);
	}

	account(req, res) {
		super.render(res, 'customer/account');
	}

	logout(req, res) {
		req.logout();
		res.redirect('/customers/login');
	}
}