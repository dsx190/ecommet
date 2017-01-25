'use strict';

const Model = require('../core/model'),
	collectionName = 'categories';

module.exports = class Category extends Model {

	constructor(data) {
		super(data, collectionName);

		let schema = [
			'_id',
			'parentId',
			'name',
			'key',
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
	 * Get the categories tree
	 *
	 * @returns {Promise} for an object.
	 */
	static getTree() {

		let tree = {
			"parent1": {
				"somedata": ...
				"child1": null
			},
			"parent2": {
				"child21": null,
				"child22": null
			},
			"parent3": {
				"somedata": ...
				"child31": {
					"somedata": ...,
					"grandchild": null
				},
				"child32": null
			}
		};
		let tree = {};
		return new Promise((resolve, reject) => {
			Category.where({'enabled': true}, {'sort': {'path': 1}}).then(categories => {
				_.forEach(categories, (category) => {
					let data = _.merge(category.data, {'children': null});
					if (!category.get('parentId')) {
						tree[category.get('_id')] = data;
					} else {
						let path = 
						tree[category.get('path')] = data;
					}
				});
			}, err => reject(err));
		});
	}
}