'use strict';

const Model = require('../core/model'),
	collectionName = 'roles';

module.exports = class Role extends Model {

	constructor(data) {
		super(data, collectionName);
	}

	static get collectionName() {
		return collectionName;
	}

	static get keys() {
		return [
			'name'
		];
	}
}