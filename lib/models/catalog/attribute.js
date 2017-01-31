'use strict';

const Model = require('../core/model'),
	collectionName = 'attributes';

module.exports = class Attribute extends Model {

	constructor(data) {
		super(data, collectionName);
	}

	static get collectionName() {
		return collectionName;
	}

	static get keys() {
		return [
			'code',           // string (camelCase)
			'label',          // string
			'inputType',      // 'text', 'textarea', 'date', 'select', 'multiselect', 'yesno', 'price', 'gallery'
			'options',        // obj of options available (only for select or multiselect) or null
			'defaultValue',   // string or null
			'isRequired',     // bool
			'isUnique',       // bool
			'isUsedForPromo', // bool
			'isFilter',       // bool *
			'isSorter',       // bool
			'isSuper',        // bool * (used for creating super products)
			'isSystem'        // bool (system attributes cannot be deleted)
		];
		// * Equals false if inputType is not select, multiselect nor price
	}

	/**
	 * Override to transform boolean data and set isSystem to false.
	 *
	 * @param {Object} data
	 * @param {mixed} id
	 * @returns {Promise}
	 */
	static save(data, id) {
		['isRequired', 'isUnique', 'isUsedForPromo', 'isFilter',
		'isSorter', 'isSuper'].forEach(key => {
			data[key] = (data[key] === 'true');
		});
		data.isSystem = false; // No saveable attribute is a system attribute
		return super.save(data, id);
	}

	/**
	 * Validate that an attribute to be modified is not a system attribute.
	 *
	 * @param {mixed} id
	 * @returns {Promise} for the result of the validation.
	 */
	static validateSystem(id) {
		return new Promise((resolve, reject) => {
			if (!id) return resolve(); // No ID provided => resolve.
			this.find(id).then(res => {
				if (res && res.get('isSystem')) return reject();
				resolve();
			}, reject);
		});
	}
}