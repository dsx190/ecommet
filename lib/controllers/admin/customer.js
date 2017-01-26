'use strict';

const Customer = require('../../models/customer/customer');

module.exports = class CustomerController {

	static index(req, res) {
		res.render('admin/customer/index');
	}

	static create(req, res) {

	}

	static edit(req, res) {

	}

	static save(req, res) {

	}

	static delete(req, res) {
		let id = req.params.id,
			url = '/admin/customers';
		Customer.delete(id).then(result => {
			if (result) {
				// Success
			}
			res.redirect(url);
		}, err => res.redirect(url));
	}
}