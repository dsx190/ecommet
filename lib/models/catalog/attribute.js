'use strict';

const Model = require('../core/model'),
	collectionName = 'attributes',
	Product = require('./product');

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
		if (!data.defaultValue) data.defaultValue = null; // Transform tu null
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

	/**
	 * Validate unique values on attributes.
	 *
	 * @param {AttributeSet} set
	 * @param {Object} data - attributes data retrieved from a form
	 * @param {Product} product - to compare its new data (updates only)
	 * @returns {Promise} for the result of the validation
	 */
	static validateUnique(set, data, product) {
		return new Promise((resolve, reject) => {
			// Retrieve the used attributes which have isUnique: true
			Attribute.where({
				'code': {'$in': set.get('attributes')},
				'isUnique': true
			}).then(cursor => {
				var filters = [], // Search filters for products
					uniqueCodes = [];
				cursor.forEach(doc => {
					// Avoid filtering if the form data equals the product data
					if (!product || product.get(doc.code) !== data[doc.code]) {
						// Push an obj attrCode => current value
						filters.push({[doc.code]: data[doc.code]});
						uniqueCodes.push(doc.code);
					}
				}, err => {
					if (err) return reject();
					if (!filters.length) return resolve(); // Nothing to query
					var query = (filters.length == 1) ? filters[0] : {'$or': filters};
					// Check if there are products that match the query
					Product.where(query).then(cursor => {
						cursor.count().then(count => {
							if (count === 0) return resolve();
							reject(`The following attributes must be unique: ${uniqueCodes.join(', ')}`);
						}, reject);
					}, reject);
				});
			}, reject);
		});
	}
}