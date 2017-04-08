'use strict';

const Role = require('../../models/admin/role'),
	Permission = require('../../models/admin/permission'),
	page = require('../../util/page'),
	_ = require('lodash');

module.exports = class RoleController {

	/**
	 * Display a list of roles.
	 */
	static index(req, res) {
		page(Role, req).then(data => {
			res.render('admin/role/index', data);
		});
	}

	/**
	 * Render the form for editing a role.
	 */
	static edit(req, res) {
		let id = req.params.id,
			view = 'admin/role/form';
		Permission.where({}).then(cursor => {
			let permissions = {};
			cursor.forEach(doc => {
				permissions[doc.path] = doc.name;
			}, err => {
				if (id) {
					Role.find(id).then(role => {
						res.render(view, {doc: role.data, permissions});
					});
				} else {
					res.render(view, {doc: {}, permissions})
				}
			});
		});
	}

	/**
	 * Save a role model.
	 */
	static save(req, res) {
		let data = _.pick(req.body, ['name', 'permissions']);
		if (!data.permissions) { // No permissions were specified.
			data.permissions = [];
		} else if (typeof data.permissions === 'string') { // Only one was specified.
			data.permissions = [data.permissions];
		}
		Role.save(data, req.params.id).then(
			result => {
				req.flash('success', 'Saved successfully!');
				res.redirect('/admin/roles');
			},
			err => {
				req.flash('error', 'An error happened');
				req.flash('old', data);
				res.redirect('back');
			});
	}

	/**
	 * Delete a role.
	 */
	static delete(req, res) {
		Role.delete(req.params.id).then(
			count => {
				req.flash('success', 'Deleted successfully!');
				res.redirect('/admin/roles');
			}, 
			err => {
				req.flash('error', 'An error happened');
				res.redirect('back');
			});
	}
}