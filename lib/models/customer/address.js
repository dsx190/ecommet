'use strict';

const Model = require('../core/model'),
	collectionName = 'addresses';

module.exports = class Address extends Model {

	constructor(data) {
		super(data, collectionName);
	}

	static get collectionName() {
		return collectionName;
	}
}