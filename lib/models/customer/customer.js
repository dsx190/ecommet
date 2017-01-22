'use strict';

const Model = require('../core/model');

module.exports = class Customer extends Model {

	constructor(data) {
		super(data);

		var customer = new Customer();
	}

	static get collectionName() {
		return 'customers';
	}
}