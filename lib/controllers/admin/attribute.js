'use strict';

const Attribute = require('../../models/catalog/attribute'),
	page = require('../../util/page'),
	_ = require('lodash');

module.exports = class AttributeController {

	/**
	 * Display a list of attributes.
	 */
	static index(req, res) {
		page(Attribute, req).then(data => {
			res.render('admin/catalog/attribute/index', data);
		});
	}

	/**
	 * Render the form for editing an attribute.
	 */
	static edit(req, res) {
		let id = req.params.id,
			view = 'admin/catalog/attribute/form';
		if (id) {
			Attribute.find(id).then(attribute => {
				res.render(view, {doc: attribute.data});
			});
		} else {
			res.render(view, {doc: {}});
		}
	}

	/**
	 * Create or save an attribute.
	 */
	static save(req, res) {
		Attribute.validateSystem(req.params.id).then(() => {
			let data = _.pick(req.body, Attribute.keys);
			Attribute.save(data, req.params.id).then(
				result => {
					req.flash('success', 'Saved successfully!');
					res.redirect('/admin/catalog/attributes');
				},
				err => {
					req.flash('error', 'An error happened');
					res.redirect('back');
				});
		}, err => {
			req.flash('error', 'Cannot modify system attributes.');
			res.redirect('/admin/catalog/attributes');
		});
	}

	/**
	 * Delete an attribute.
	 */
	static delete(req, res) {
		Attribute.validateSystem(req.params.id).then(() => {
			let errCb = (err) => {
				req.flash('error', 'An error happened');
				res.redirect('back');
			};
			Attribute.delete(req.params.id).then(
				deleted => {
					if (!deleted) return errCb();
					req.flash('success', 'Deleted successfully!');
					res.redirect('/admin/catalog/attributes');
				}, errCb);
		}, err => {
			req.flash('error', 'Cannot delete system attributes.');
			res.redirect('/admin/catalog/attributes');
		});
	}

}