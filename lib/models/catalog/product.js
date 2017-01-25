'use strict';

const Model = require('../core/model'),
	collectionName = 'customers';

module.exports = class Product extends Model {

	constructor(data) {
		super(data, collectionName);

		/* {
			'_id':  ObjectId,
			'attributeSetId': ObjectId,
			'type': string ('super', 'child', 'simple' or 'virtual')
			//... key: value for all attributes
			}
		*/
	}

	static get collectionName() {
		return collectionName;
	}
}