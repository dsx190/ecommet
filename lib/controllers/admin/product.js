'use strict';

const Product = require('../../models/catalog/product'),
	AttributeSet = require('../../models/catalog/attribute-set'),
	Attribute = require('../../models/catalog/attribute'),
	Category = require('../../models/catalog/category'),
	page = require('../../util/page'),
	_ = require('lodash');

module.exports = class ProductController {

	/**
	 * Display a list of products.
	 ¨*/
	static index(req, res) {
		page(Product, req).then(data => {
			res.render('admin/catalog/product/index', data);
		});
	}

	/**
	 * Step 1 for creating a new product.
	 * Render the form for selecting the product type and attribute set.
	 */
	static new(req, res) {
		// Retrieve the attribute sets available
		AttributeSet.where({}).then(cursor => {
			var attributeSets = {};
			// Send an obj. of {attributeSetId: name}
			cursor.project({'name': 1}).sort({'name': 1}).forEach(doc => {
				attributeSets[doc._id] = doc.name;
			}, err => {
				res.render('admin/catalog/product/new-form', {
					doc: {},
					attributeSets
				});
			});
		});
	}

	/**
	 * Step 2 for creating a new product.
	 * Render the form for submitting attribute values, stock and more.
	 */
	static create(req, res) {
		var view = 'admin/catalog/product/form',
			type = req.body.type,
			attributeSetId = req.body.attributeSetId;
		AttributeSet.find(attributeSetId).then(set => {
			Attribute.where({'code': {'$in': set.get('attributes')}}).then(cursor => {
				cursor.toArray().then(attributes => {
					Category.getTree().then(tree => {
						res.render(view, {doc: {}, type, attributes, tree, attributeSetId});
					});
				});
			});
		});
	}

	/**
	 * Store a new product.
	 */
	static store(req, res) {
		let type = req.params.type;
		if (type === 'simple') {
			// Retrieve the AttributeSet to get all the values
			AttributeSet.find(req.body.attributeSetId).then(set => {
				let keys = _.concat(set.get('attributes'), ['stock', 'categories']),
					data = _.pick(req.body, keys);
					data.type = req.params.type;
					data.attributeSetId = req.params.attributeSetId;
				Product.create(data).then(product => {
					req.flash('success', 'Created successfully!');
					res.redirect('/admin/catalog/products');
				});
			});
		}
	}

	/**
	 * Render the form for editing an existing product.
	 */
	static edit(req, res) {

	}

	/**
	 * Update an existing product.
	 */
	static update(req, res) {

	}

	/**
	 * Delete a product.
	 */
	static delete(req, res) {

	}
}