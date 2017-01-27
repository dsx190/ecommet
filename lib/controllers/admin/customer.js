'use strict';

const Customer = require('../../models/customer/customer'),
	page = require('../../util/page');

module.exports = class CustomerController {

	/**
	 * Display a list of customers.
	 */
	static index(req, res) {
		page(Customer, req, [
			'email', 'firstName',
			'lastName', 'dob', 'gender'
			]).then(data => {
				res.render('admin/customer/index', data);
		}, err => console.log(err));
	}

	/**
	 * Create a customer.
	 */
	static create(req, res) {
		res.redirect('/admin/customers/edit');
	}

	/**
	 * Render the form for editing a customer.
	 */
	static edit(req, res) {
		var id = req.params.id;
		Customer.find(id).then(customer => {
			customer = customer || new Customer();
			res.render('admin/customer/form', {customer: customer.data});
		});
	}

	/**
	 * Create or save a customer.
	 */
	static save(req, res) {
		var id = req.params.id,
			errCallback = (err) => {
				let url = (id) ? '/${id}' : '';
				res.redirect(`/admin/customers${url}`);
			};
		return res.redirect('/admin/customers');
		Customer.find(id).then(customer => {
			customer = customer || new Customer();
			['email', 'password', 'firstName', 'lastName',
				'dob', 'gender', ].forEach(key => {
					customer.set(key, req.body[key]);
				});
			customer.save().then(
				id => res.redirect('/admin/customers'),
				errCallback);
		}, errCallback);
	}

	/**
	 * Delete a customer.
	 */
	static delete(req, res) {
		let url = '/admin/customers';
		Customer.delete(req.params.id)
			.then(deleted => {
				if (deleted) {
					// Success
				}
				res.redirect(url);
			}, err => res.redirect(url)); // Error
	}
}