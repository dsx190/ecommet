'use strict';

const Model = require('../core/model'),
	collectionName = 'permissions';

module.exports = class Permission extends Model {

	constructor(data) {
		super(data, collectionName);
	}

	static get collectionName() {
		return collectionName;
	}

	static get keys() {
		return [
			'name',
			'path'
		];
	}
}