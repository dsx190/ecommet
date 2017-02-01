'use strict';

const Model = require('../core/model'),
	collectionName = 'products';

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
			'stock',
			'enabled'
		];
	}
}