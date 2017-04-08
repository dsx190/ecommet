'use strict';

const Permission = require('../../models/admin/permission'),
	Role = require('../../models/admin/role'),
	page = require('../../util/page'),
	async = require('async'),
	_ = require('lodash');

module.exports = class PermissionController {

	/**
	 * Display a list of permissions.
	 */
	static index(req, res) {
		page(Permission, req).then(data => {
			res.render('admin/permission/index', data);
		});
	}

	/**
	 * Render the form for editing a permission.
	 */
	static edit(req, res) {
		let id = req.params.id,
			view = 'admin/permission/form';
		if (id) {
			Permission.find(id).then(permission => {
				res.render(view, {doc: permission.data});
			})
		} else {
			res.render(view, {doc: {}});
		}
	}

	/**
	 * Save a permission model.
	 */
	static save(req, res) {
		let data = _.pick(req.body, Permission.keys);
		Permission.save(data, req.params.id).then(
			result => {
				req.flash('success', 'Saved successfully!');
				res.redirect('/admin/permissions');
			},
			err => {
				req.flash('error', 'An error happened');
				req.flash('old', data);
				res.redirect('back');
			});
	}

	/**
	 * Delete a permission.
	 */
	static delete(req, res) {
		let id = req.params.id;
		async.parallel([
			(cb) => {
				// Pull the permission from related roles.
				Role.update({'permissions': id}, 
					{'$pull': {'permissions': id}}, true).then(
					res => cb(null, res), cb);
			},
			(cb) => {
				Permission.delete(id).then(count => cb(null, count), cb);
			}
		], (err, results) => {
			if (err) {
				req.flash('error', 'An error happened');
				return res.redirect('back');
			}
			req.flash('success', 'Deleted successfully!');
			res.redirect('/admin/permissions');
		});
	}
}