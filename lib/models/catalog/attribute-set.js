'use strict';

const Model = require('../core/model'),
	collectionName = 'attributeSets';

module.exports = class AttributeSet extends Model {

	constructor(data) {
		super(data, collectionName);

		/*
			{
			'_id', // string
			'name', // string
			'attributes' // array of attribute codes
			}
		*/
	}

	static get collectionName() {
		return collectionName;
	}
}