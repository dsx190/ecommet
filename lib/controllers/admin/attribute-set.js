'use strict';

const AttributeSet = require('../../models/catalog/attribute-set'),
	Attribute = require('../../models/catalog/attribute'),
	page = require('../../util/page'),
	_ = require('lodash');

module.exports = class AttributeSetController {

	/**
	 * Display a list of attribute sets.
	 */
	static index(req, res) {
		page(AttributeSet, req).then(data => {
			res.render('admin/catalog/attribute-set/index', data);
		});
	}

	/**
	 * Render the form for editing an attribute set.
	 */
	static edit(req, res) {
		let id = req.params.id,
			view = 'admin/catalog/attribute-set/form';
		Attribute.where({'isSystem': false}).then(cursor => {
			cursor.project({'code': 1, 'label': 1, '_id': 0})
				.toArray().then(attributes => {
				if (id) {
					AttributeSet.find(id).then(set => {
						res.render(view, {doc: set.data, attributes});
					});
				} else {
					res.render(view, {doc: {}, attributes})
				}
			});
		});
	}

	/**
	 * Save an attribute set.
	 */
	static save(req, res) {
		let data = _.pick(req.body, ['name', 'attributes']),
			id = req.params.id;
		AttributeSet.save(data, id).then(
			result => {
				req.flash('success', 'Saved successfully!');
				res.redirect('/admin/catalog/attributeSets');
			},
			err => {
				req.flash('error', 'An error happened');
				res.redirect('back');
			});
	}

	/**
	 * Delete an attribute set.
	 */
	static delete(req, res) {
		let errCb = () => {
			req.flash('error', 'An error happened');
			res.redirect('back');
		};
		AttributeSet.delete(req.params.id).then(
			deleted => {
				if (!deleted) return errCb;
				req.flash('success', 'Deleted successfully!');
				res.redirect('/admin/catalog/attributeSets');
			}, errCb);
	}
}