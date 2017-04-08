'use strict';

const AttributeSet = require('../../models/catalog/attribute-set'),
	Attribute = require('../../models/catalog/attribute'),
	Product = require('../../models/catalog/product'),
	page = require('../../util/page'),
	async = require('async'),
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
			let attributes = {};
			cursor.project({'code': 1, 'label': 1}).forEach(doc => {
				attributes[doc.code] = doc.label;
			}, err => {
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
	 * Create a new attribute set.
	 */
	static store(req, res) {
		let data = _.pick(req.body, ['name', 'attributes']),
			errCb = () => {
				req.flash('error', 'An error happened');
				res.redirect('back');
			};
		if (!data.attributes) { // No custom attributes were specified.
			data.attributes = [];
		} else if (typeof data.attributes === 'string') { // Only one was specified.
			data.attributes = [data.attributes];
		}
		// Get the system attribute codes and add them to the data obj.
		Attribute.getSystem().then(attrs => {
			attrs.forEach(attr => {
				data.attributes.push(attr.get('code'));
			});
			AttributeSet.create(data).then(result => {
				req.flash('success', 'Saved successfully!');
				res.redirect('/admin/catalog/attributeSets');
			}, errCb);
		}, errCb);
	}

	/**
	 * Create a new attribute set.
	 */
	static update(req, res) {
		let data = _.pick(req.body, ['name', 'attributes']),
			id = req.params.id,
			errCb = (msg) => {
				req.flash('error', 'An error happened');
				res.redirect('back');
			};
		if (!data.attributes) { // No custom attributes were specified.
			data.attributes = [];
		} else if (typeof data.attributes === 'string') { // Only one was specified.
			data.attributes = [data.attributes];
		}
		// Get the system attribute codes and add them to the data obj.
		Attribute.getSystem().then(attrs => {
			attrs.forEach(attr => {
				data.attributes.push(attr.get('code'));
			});
			AttributeSet.find(id).then(attrSet => { // Retrieve the current set
				// Determine the added and deleted attributes
				var added = _.difference(data.attributes, attrSet.get('attributes')),
					deleted = _.difference(attrSet.get('attributes'), data.attributes),
					unset = {}, set = {};
				async.parallel([
					(cb) => { // Set new attributes to products
						if (!added.length) return cb(null);
						// Retrieve the default values for each attr.
						Attribute.where({'code': {'$in': added}}).then(cursor => {
							cursor.forEach(doc => {
								set[doc.code] = doc.defaultValue || ''; // Set default values
							}, err => {
								if (err) return cb(err);
								Product.update({'attributeSetId': id}, // Update the products
									{'$set': set}, true).then(
									res => cb(null, res), cb);
							});
						});
					},
					(cb) => { // Unset deleted attributes from products
						if (!deleted.length) return cb(null);
						deleted.forEach(del => {
							unset[del] = '';
						});
						Product.update({'attributeSetId': id},
							{'$unset': unset}, true).then(
							res => cb(null, res), cb);
					},
					(cb) => { // Delete products with now deleted super attributes
						Product.delete({
							'attributeSetId': id,
							'superAttribute': {'$in': deleted}
						}, true).then(count => cb(null, count), cb);
					},
					(cb) => { // Update the attribute set
						AttributeSet.update(id, data).then(
							res => cb(null, res), cb);
					}
				], (err, results) => {
					if (err) return errCb(err);
					req.flash('success', 'Saved successfully!');
					res.redirect('/admin/catalog/attributeSets');
				});
			});
		});
	}

	/**
	 * Delete an attribute set.
	 */
	static delete(req, res) {
		var id = req.params.id;
		async.parallel([
			(cb) => { // Delete all products of this set
				Product.delete({'attributeSetId': id}, true).then(
					count => cb(null, count), cb);
			},
			(cb) => { // Delete the set
				AttributeSet.delete(req.params.id).then(
					count => cb(null, count), cb);
			}
		], (err, results) => {
			if (err) {
				req.flash('error', 'An error happened');
				return res.redirect('back');
			}
			req.flash('success', 'Deleted successfully!');
			res.redirect('/admin/catalog/attributeSets');
		})
	}
}