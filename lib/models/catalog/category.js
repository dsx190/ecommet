'use strict';

const Model = require('../core/model'),
	collectionName = 'categories',
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
}