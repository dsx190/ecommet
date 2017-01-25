'use strict';

const Model = require('../core/model'),
	collectionName = 'admins';

module.exports = class Admin extends Model {

	constructor(data) {
		super(data, collectionName);
	}

	static get collectionName() {
		return collectionName;
	}
}