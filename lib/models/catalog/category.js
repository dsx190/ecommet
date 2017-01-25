'use strict';

const Model = require('../core/model'),
	collectionName = 'categories',
	_ = require('lodash');

module.exports = class Category extends Model {

	constructor(data) {
		super(data, collectionName);

		let schema = [
			'_id',
			'parentId',
			'name',
			'key',
			'path',
			'enabled',
			'metaDescription',
			'metaKeywords',
			'metaRobots',
			'metaTitle'
		];
	}

	static get collectionName() {
		return collectionName;
	}

	/**
	 * Get the categories tree. 
	 * Each category will retrieve its data. Also a "leaves" key if it has chldren, i.e.:
	 *	{
			"parent1": {
				Data...
				"leaves": {
					"child11": { Data...}, // No more leaves here
					"child12": {
						Data...
						"leaves": {
							"child121": { Data ...}
						}
					}
			},
			"parent2": {...}
		}
	 *
	 * @returns {Promise} for a the tree object.
	 */
	static getTree() {
		return new Promise((resolve, reject) => {
			Category.where({'enabled': true}).then(cursor => {
				let tree = {},
					regexp = new RegExp('/', 'g');
				cursor.sort({'path': 1}).forEach(doc => {
					if (!doc.parentId) {
						tree[doc._id] = doc;
					} else {
						let path = _.replace(doc.path, regexp, '.leaves.');
						_.set(tree, `${path}.leaves.${doc._id}`, doc);
					}
				}, err => { // Sorting err
					if (err) return reject(err);
					resolve(tree);
				});
			}, err => reject(err)); // Query err
		});
	}
}