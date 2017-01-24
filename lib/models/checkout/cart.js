'use strict';

const Model = require('../core/model'),
	collectionName = 'carts';

module.exports = class Cart extends Model {

	constructor(data) {
		super(data, collectionName);
	}

	static get collectionName() {
		return collectionName;
	}
}