'use strict';

const Customer = require('../../models/customer/customer'),
	Address = require('../../models/customer/address'),
	page = require('../../util/page'),
	_ = require('lodash'),
	ObjectID = require('mongodb').ObjectID;

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
		});
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
		var id = req.params.id,
			view = 'admin/customer/form';
		if (id) {
			Customer.find(id).then(customer => {
				page(Address, req, [
					'name', 'street', 'area', 'city',
					'state', 'country', 'zipCode', 'telephone'
				], {'customerId': customer.id})
				.then(data => {
					data.doc = customer.data;
					res.render(view, data);
				});
			});
		} else {
			res.render(view, {'doc': {}});
		}
	}

	/**
	 * Create or save a customer.
	 */
	static save(req, res) {
		var id = req.params.id,
			data = _.pick(req.body, [
				'email', 'password', 'firstName', 
				'lastName', 'dob', 'gender'
			]);
		if (id) {
			Customer.update(id, data).then(
				results => res.redirect('/admin/customers'));
		} else {
			Customer.create(data).then(
				customer => res.redirect('/admin/customers'));
		}
	}

	/**
	 * Delete a customer.
	 */
	static delete(req, res) {
		Customer.delete(req.params.id).then(
			deleted => res.redirect('/admin/customers'));
	}

	/**
	 * Render the form for editing a customer's address.
	 */
	static editAddress(req, res) {
		let customerId = req.params.customerId,
			view = 'admin/customer/address-form',
			id = req.params.id;
		if (id) {
			Address.find(id).then(address => {
				res.render(view, {
					doc: address.data,
					customerId
				});
			});
		} else {
			res.render(view, {'doc': {}, customerId});
		}
	}

	/**
	 * Create or save a customer's address.
	 */
	static saveAddress(req, res) {
		let customerId = req.params.customerId,
			id = req.params.id,
			url = `/admin/customers/edit/${customerId}`,
			data = _.pick(req.body, [
				'name', 'street', 'area', 'city',
				'state', 'country', 'zipCode', 'telephone'
			]);
		if (id) {
			Address.update(id, data).then(
				results => res.redirect(url));
		} else {
			data.customerId = new ObjectID(customerId);
			Address.create(data).then(
				address => res.redirect(url));
		}
	}

	/**
	 * Delete a customer's address.
	 */
	static deleteAddress(req, res) {
		let id = req.params.id,
			customerId = req.params.customerId;
		Address.delete(id).then(
			deleted => res.redirect(`/admin/customers/edit/${customerId}`));
	}

}