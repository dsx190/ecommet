'use strict';

const Model = require('../core/model');

module.exports = class Customer extends Model {

	constructor(data) {
		super(data);
	}

	static get collectionName() {
		return 'customers';
	}
}