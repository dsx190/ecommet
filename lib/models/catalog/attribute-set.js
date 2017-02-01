'use strict';

const Model = require('../core/model'),
	collectionName = 'attributeSets',
	Attribute = require('./attribute');

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

	/**
	 * Add all system attributes to the attributes array before saving.
	 *
	 * @param {Object} data
	 * @param {mixed} id
	 * @returns {Promise}
	 */
	static save(data, id) {
		// Keeping a reference to "super" which would be lost ahead
		var saveFunc = (data, id, successCb, errCb) => {
			super.save(data, id).then(successCb, errCb);
		};
		return new Promise((resolve, reject) => {
			if (!data.attributes) { // No custom attributes were specified.
				data.attributes = [];
			} else if (typeof data.attributes === 'string') { // Only one was specified.
				data.attributes = [data.attributes];
			}
			Attribute.where({'isSystem': true}).then(cursor => {
				cursor.project({'code': 1}).toArray().then(docs => {
					// Adding all system attribute codes to the data object
					docs.forEach(doc => {
						data.attributes.push(doc.code);
					});
					saveFunc(data, id, resolve, reject);
				}, reject);
			}, reject);
		});
	}
}