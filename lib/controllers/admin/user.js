'use strict';

const User = require('../../models/admin/user'),
	Role = require('../../models/admin/role'),
	page = require('../../util/page'),
	_ = require('lodash');

module.exports = class UserController {

	/**
	 * Display a list of users.
	 */
	static index(req, res) {
		page(User, req).then(data => {
			res.render('admin/user/index', data);
		});
	}

	/**
	 * Render the form for editing a user.
	 */
	static edit(req, res) {
		let id = req.params.id,
			view = 'admin/user/form',
			roles = {'admin': 'Admin'};
		Role.where({}).then(cursor => {
			cursor.project({'name': 1}).forEach(role => {
				roles[role._id] = role.name;
			}, err => {
				if (id) {
					User.find(id).then(user => {
						res.render(view, {doc: user.data, roles});
					});
				} else {
					res.render(view, {doc: {}, roles});
				}
			});
		});
	}

	/**
	 * Save a user.
	 */
	static save(req, res) {
		let data = _.pick(req.body, _.concat(User.keys, 'password'));
		User.save(data, req.params.id).then(
			result => {
				req.flash('success', 'Saved successfully!');
				res.redirect('/admin/users');
			},
			err =>{
				req.flash('error', 'An error happened');
				res.redirect('back');
			});
	}

	/**
	 * Delete a user.
	 */
	static delete(req, res) {
		User.delete(req.params.id).then(
			count => {
				req.flash('success', 'Deleted successfully!');
				res.redirect('/admin/users');
			},
			err => {
				req.flash('error', 'An error happened');
				res.redirect('back');
			});
	}
}