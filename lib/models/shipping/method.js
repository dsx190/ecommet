'use strict';

const Model = require('../core/model'),
	collectionName = 'shippingMethods';

module.exports = class ShippingMethod extends Model {

	constructor(data) {
		super(data, collectionName);
	}

	static get collectionName() {
		return collectionName;
	}
}