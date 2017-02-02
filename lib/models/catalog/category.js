'use strict';

const Model = require('../core/model'),
	Product = require('./product'),
	collectionName = 'categories',
	ObjectID = require('mongodb').ObjectID,
	_ = require('lodash');

module.exports = class Category extends Model {

	constructor(data) {
		super(data, collectionName);
	}

	static get collectionName() {
		return collectionName;
	}

	static get keys() {
		return [
			'name',            // string
			'key',             // string, camelCase
			'enabled',         // bool
			'metaDescription', // string|null
			'metaKeywords',    // string|null
			'metaRobots',      // string|null
			'metaTitle'        // string|null
		];
	}

	/**
	 * Get the categories tree. 
	 * Each category will retrieve its data, 
	 * also a "leaves" key if it has children, i.e.:
	 *	{
			"root1": {
				key: values, // of this root1 category
				"leaves": {
					"child11": { key: values}, // No more leaves here
					"child12": {
						key: values,
						"leaves": {
							"child121": {...} // And so on
						}
					}
			},
			"root2": {...}
		}
	 *
	 * @returns {Promise} for a the tree object.
	 */
	static getTree() {
		return new Promise((resolve, reject) => {
			Category.where({}).then(cursor => {
				let tree = {},
					regexp = new RegExp('/', 'g');
				cursor.sort({'path': 1}).forEach(doc => {
					if (!doc.parentId) {
						tree[doc._id] = doc;
					} else {
						let path = _.replace(doc.path, regexp, '.leaves.');
						_.set(tree, `${path}.leaves.${doc._id}`, doc);
					}
				}, err => {
					if (err) return reject(err); // Sorting err
					resolve(tree); // Return the tree
				});
			}, reject); // Query err
		});
	}

	/**
	 * Override to delete subcategories and update
	 * all affected products.
	 *
	 * @param {mixed} filter
	 * @param {bool} many - Indicates to use deleteMany
	 * @returns {Promise} for the number of deleted docs.
	 */
	static delete(filter, many) {
		// Keeping a reference to "super" which would be lost ahead
		var delFunc = (params, many, successCb, errCb) => {
			super.delete(params, many).then(successCb, errCb);
		};
		return new Promise((resolve, reject) => {
			if (!_.isString(filter)) {
				delFunc(filter, many, resolve, reject);
			} else {
				var path = new RegExp(`${filter}`),
					catIds = [filter];
				// Get the children categories
				Category.where({path}).then(cursor => {
					cursor.project({'_id': 1}).forEach(doc => {
						catIds.push(doc._id); // Push the children IDs
					}, err => {
						if (err) return reject();
						Product.update( // Update the products
							{'categories': {'$in': catIds}},
							{'$pull': {'categories': {'$in': catIds}}},
						true).then(res => {
							catIds = _.map(catIds, id => new ObjectID(id));
							delFunc({'_id': {'$in': catIds}}, true, resolve, reject);
						}, reject);
					});
				});
			}
		});
	}
}