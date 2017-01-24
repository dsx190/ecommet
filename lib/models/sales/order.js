'use strict';

const Model = require('../core/model'),
	collectionName = 'orders';

module.exports = class Order extends Model {

	constructor(data) {
		super(data, collectionName);
	}

	static get collectionName() {
		return collectionName;
	}
}