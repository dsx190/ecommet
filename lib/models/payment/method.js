'use strict';

const Model = require('../core/model'),
	collectionName = 'paymentMethods';

module.exports = class PaymentMethod extends Model {

	constructor(data) {
		super(data, collectionName);
	}

	static get collectionName() {
		return collectionName;
	}
}