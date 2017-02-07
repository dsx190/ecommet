'use strict';

const Attribute = require('../../models/catalog/attribute'),
	AttributeSet = require('../../models/catalog/attribute-set'),
	Product = require('../../models/catalog/product'),
	page = require('../../util/page'),
	async = require('async'),
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
		var id = req.params.id;
		Attribute.validateSystem(id).then(() => {
			// Retrieve the attribute to get the code
			Attribute.find(id).then(attribute => {
				// Retrieve the related attribute set IDs
				var setIds = [],
					objIds = [],
					code = attribute.get('code');
				AttributeSet.where({'attributes': code}).then(cursor => {
					cursor.project({'_id': 1}).forEach(set => {
						setIds.push(set._id.toString());
						objIds.push(set._id);
					}, err => {
						async.parallel([
							(cb) => { // Unset the attribute code from products
								Product.update({'attributeSetId': {'$in': setIds}},
									{'$unset': {[code]: ''}}, true).then(
									res => cb(null, res), cb);
							},
							(cb) => { // Delete super products with this attribute
								Product.delete({'superAttribute': code}, true).then(
									count => cb(null, count), cb);
							},
							(cb) => { // Pull the attribute from the attribute sets
								AttributeSet.update({'_id': {'$in': objIds}},
									{'$pull': {'attributes': code}}, true).then(
									res => cb(null, res), cb);
							},
							(cb) => { // Delete the attribute
								Attribute.delete(id).then(count => cb(null, count), cb);
							}
						], (err, results) => {
							if (err) {
								req.flash('error', 'An error happened');
								return res.redirect('back');
							}
							req.flash('success', 'Deleted successfully!');
							res.redirect('/admin/catalog/attributes');								
						});
					});
				});
			});
		}, err => {
			req.flash('error', 'Cannot delete system attributes.');
			res.redirect('/admin/catalog/attributes');
		});
	}
}