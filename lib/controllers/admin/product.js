'use strict';

const Product = require('../../models/catalog/product'),
	AttributeSet = require('../../models/catalog/attribute-set'),
	Attribute = require('../../models/catalog/attribute'),
	Category = require('../../models/catalog/category'),
	files = require('../../util/files'),
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
		var type = req.params.type,
			attributeSetId = req.params.attributeSetId;
		AttributeSet.find(attributeSetId).then(set => {
			Attribute.where({'code': {'$in': set.get('attributes')}}).then(cursor => {
				cursor.toArray().then(attributes => {
					Category.getTree().then(tree => {
						res.render('admin/catalog/product/form', 
							{doc: {}, type, attributes, tree, attributeSetId});
					});
				});
			});
		});
	}

	/**
	 * Store a new product.
	 */
	static store(req, res) {
		var type = req.params.type,
			attributeSetId = req.params.attributeSetId,
			errCb = (msg) => {
				req.flash('error', msg);
				return res.redirect('back');
			};
		// Retrieve the AttributeSet to get all the values
		AttributeSet.find(attributeSetId).then(set => {
			let keys = _.concat(set.get('attributes'), ['stock', 'categories']),
				data = _.pick(req.body, keys);
			// Transform data
			data.type = type;
			data.attributeSetId = attributeSetId;
			data.enabled = (data.enabled === 'true');
			data.price = parseFloat(data.price);
			data.categories = data.categories || [];
			// Validate the value of unique attributes
			Attribute.matchUnique(set, data).then(attrs => {
				Product.with(attrs).then(products => {
					if (products.length) {
						var msg = _.map(attrs, a => _.keys(a)).join(', ');
						return errCb(`These attributes must be unique: ${msg}`);
					}
					// Set the stock. For super products, each child has diff. stock
					if (type === 'super') {
						data.superAttribute = req.body.superAttribute;
						data.children = {};
						let superStock = 0;
						// Set a superAttribute => stock children obj.
						_.forEach(req.body.children, child => {
							data.children[child.super] = parseInt(child.stock);
							superStock += data.children[child.super];
						});
						data.isInStock = (superStock > 0);
					} else {
						data.stock = parseInt(data.stock);
						data.isInStock = (data.stock > 0);
					}
					// Add images to the product
					data.gallery = files.getGallery(req, 'gallery');
					
					Product.create(data).then(product => {
						req.flash('success', 'Created successfully!');
						res.redirect('/admin/catalog/products');
					}, errCb);
				}, errCb);
			}, errCb);
		});
	}

	/**
	 * Render the form for editing an existing product.
	 */
	static edit(req, res) {
		Product.find(req.params.id).then(product => {
			AttributeSet.find(product.get('attributeSetId')).then(set => {
				Attribute.where({'code': {'$in': set.get('attributes')}}).then(cursor => {
					cursor.toArray().then(attributes => {
						Category.getTree().then(tree => {
							res.render('admin/catalog/product/form', 
								{doc: product.data, attributes, tree});
						});
					});
				});
			});
		});
	}

	/**
	 * Update an existing product.
	 */
	static update(req, res) {
		let id = req.params.id,
			errCb = (msg) => {
				req.flash('error', msg);
				return res.redirect('back');
			};
		Product.find(id).then(product => {
			// Retrieve the AttributeSet to get all the values
			AttributeSet.find(product.get('attributeSetId')).then(set => {
				// Validate the value of unique attributes before setting data to the product
				Attribute.matchUnique(set, req.body, product).then(attrs => {
					Product.with(attrs).then(products => {
						if (products.length) {
							var msg = _.map(attrs, a => _.keys(a)).join(', ');
							return errCb(`These attributes must be unique: ${msg}`);
						}
						let keys = _.concat(set.get('attributes'), ['categories']);
						// Omit the super attribute if this is a super product
						if (product.get('type') === 'super') {
							_.pull(keys, product.get('superAttribute'));
						}
						// Omit gallery fields
						_.pull(keys, 'gallery');
						keys.forEach(key => { // Set all data
							product.set(key, req.body[key]);
						});
						// Set special properties
						product.set('enabled', (req.body.enabled === 'true'));
						product.set('price', parseFloat(req.body.price));
						product.set('categories', req.body.categories || []);
						if (product.get('type') === 'super') { // Update children data.
							var children = req.body.children || [],
								superStock = 0;
							product.set('children', {}); // Empty children
							children.forEach(child => { // Set each child
								let stock = parseInt(child.stock);
								product.set(`children.${child.super}`, stock);
								superStock += stock;
							});
							product.set('isInStock', (superStock > 0));
						} else {
							var stock = parseInt(req.body.stock);
							product.set('stock', stock);
							product.set('isInStock', (stock > 0));
						}
						// Manage images
						let gallery = files.getGallery(req, 'gallery', product.get('gallery'));
						product.set('gallery', gallery);

						product.save().then(id => {
							req.flash('success', 'Updated successfully!');
							res.redirect('/admin/catalog/products');
						});
					}, errCb);
				}, errCb);
			}, errCb);
		}, errCb);
	}

	/**
	 * Delete a product.
	 */
	static delete(req, res) {
		Product.delete(req.params.id).then(
			count => {
				req.flash('success', 'Deleted successfully!');
				res.redirect('/admin/catalog/products');
			},
			err => {
				req.flash('error', 'An error happened');
				res.redirect('back');
			});
	}
}