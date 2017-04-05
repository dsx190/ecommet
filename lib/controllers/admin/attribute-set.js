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
	 * Save an attribute set.
	 */
	static save(req, res) {
		let data = _.pick(req.body, ['name', 'attributes']),
			id = req.params.id,
			errFunc = () => {
				req.flash('error', 'An error happened');
				res.redirect('back');
			};
		if (!data.attributes) { // No custom attributes were specified.
			data.attributes = [];
		} else if (typeof data.attributes === 'string') { // Only one was specified.
			data.attributes = [data.attributes];
		}
		// Get the system attribute codes and add them to the data obj.
		Attribute.where({'isSystem': true}).then(cursor => {
			cursor.project({'code': 1}).forEach(attribute => {
				data.attributes.push(attribute.code);
			}, err => {
				if (err) return errFunc();
				AttributeSet.save(data, id).then(
					result => {
						req.flash('success', 'Saved successfully!');
						res.redirect('/admin/catalog/attributeSets');
					},
					errFunc);
			})
		}, errFunc);
	}

	/**
	 * Delete an attribute set.
	 */
	static delete(req, res) {
		var id = req.params.id;
		async.parallel([
			(cb) => { // Delete all products of this set
				Product.delete({'attributeSetId': id}).then(
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