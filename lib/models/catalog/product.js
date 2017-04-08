'use strict';

const Model = require('../core/model'),
	collectionName = 'products',
	_ = require('lodash');

module.exports = class Product extends Model {

	constructor(data) {
		super(data, collectionName);
	}

	static get collectionName() {
		return collectionName;
	}

	static get keys() {
		return [
			'type',
			'name',
			'sku',
			'price',
			'isInStock',
			'enabled',
			'attributeSetId'
		];
	}

	/**
	 * Retrieve products with specific attributes.
	 *
	 * @param {Array|Object} attrs - [{attributeCode: value}..]
	 * @return {Promise} for an array of products that match.
	 */
	static with(attrs) {
		return new Promise((resolve, reject) => {
			if (_.isArray(attrs) && attrs.length >= 1) {
				var query = (attrs.length === 1) ? attrs[0] : {'$or': attrs};
			} else if (_.isPlainObject(attrs)) {
				var query = attrs;
			} else {
				return resolve([]);
			}
			this.where(query, true).then(resolve, reject);
		});
	}
}