'use strict';

const Model = require('../core/model'),
	collectionName = 'categories';

module.exports = class Category extends Model {

	constructor(data) {
		super(data, collectionName);
	}

	static get collectionName() {
		return collectionName;
	}
}