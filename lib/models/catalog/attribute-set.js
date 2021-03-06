'use strict';

const Model = require('../core/model'),
	collectionName = 'attributeSets';

module.exports = class AttributeSet extends Model {

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