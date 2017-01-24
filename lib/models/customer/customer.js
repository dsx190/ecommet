'use strict';

const Model = require('../core/model'),
	collectionName = 'customers';

module.exports = class Customer extends Model {

	constructor(data) {
		super(data, collectionName);
	}

	static get collectionName() {
		return collectionName;
	}
}