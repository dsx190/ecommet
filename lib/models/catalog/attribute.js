'use strict';

const Model = require('../core/model'),
	collectionName = 'attributes',
	_ = require('lodash');

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
	 * Retrieve all system attributes.
	 *
	 * @returns {Promise} for the array of attributes.
	 */
	static getSystem() {
		return new Promise((resolve, reject) => {
			this.where({'isSystem': true}, true).then(resolve, reject);
		});
	}

	/**
	 * Retrieve an array of objects {uniqueAttrCode: currentValue}
	 *
	 * @param {AttributeSet} set
	 * @param {Object} data - attributes' values retrieved from a form
	 * @param {Product|undefined} product
	 * @returns {Promise} for the attributes that match.
	 */
	static matchUnique(set, data, product) {
		return new Promise((resolve, reject) => {
			Attribute.where({ // Retrieve all unique attributes
				'code': {'$in': set.get('attributes')},
				'isUnique': true
			}, true).then(attrs => {
				var filters = [];
				attrs.forEach(attr => {
					var code = attr.get('code');
					// No product -> creating, product -> compare new data
					if (!product || product.get(code) !== data[code]) {
						filters.push({[code]: data[code]});
					}
				});
				resolve(filters);
			}, reject);
		});
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
	 * Shortcut for validating an attribute when saving it.
	 *
	 * @param {mixed} id
	 * @param {string} code
	 * @returns {Promise} for the result of the validation.
	 */
	static validate(id, code) {
		return new Promise((resolve, reject) => {
			this.validateSystem(id).then(() => {
				this.validateCode(code).then(resolve, reject);
			}, reject);
		});
	}

	/**
	 * Validate that an attribute has a unique code.
	 *
	 * @param {string} code
	 * @returns {Promise} for the result of the validation.
	 */
	static validateCode(code) {
		return new Promise((resolve, reject) => {
			this.where({'code': code}).then(cursor => {
				cursor.count().then(count => {
					if (count === 0) return resolve();
					reject('The attribute code must be unique');
				}, reject);
			}, reject);
		});
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
				if (res && res.get('isSystem')) return reject('Cannot modify system attributes');
				resolve();
			}, reject);
		});
	}
}