'use strict';

const Model = require('../core/model'),
	collectionName = 'attributes';

module.exports = class Attribute extends Model {

	constructor(data) {
		super(data, collectionName);

		// System attributes: (Default attribute set)
		let systemAttributes = [
		'cost', // price
		'shortDescription', // textarea
		'longDescription', // textarea
		'gallery', // gallery
		'isFeatured?', // yes/no *** Pending
		'metaDescription', // textarea
		'metaKeywords', // text
		'metaRobots', // select
		'metaTitle', // text
		'name', // text
		'newFrom', // date
		'newTo', // date
		'price', // price
		'sku', // text
		'specialPrice', // price **** Pending
		'specialFrom', // date **** Pending
		'specialTo', // date **** Pending
		'enabled', // yes/no
		'url_key' // text
		];

		// Example attribute
		let manufacturer = {
			'code': 'manufacturer',
			'label': 'Manufacturer',
			'input_type': 'select',
			'options': ['ON', 'Alpha'],
			'defaultValue': 'ON',
			'isRequired': true,
			'isUnique': false,
			'isUsedForPromo': true,
			'isFilter': true,
			'isSorter': false,
			'isSuper': false,
			'isSystem': false
		};
	}

	static get collectionName() {
		return collectionName;
	}

	static get keys() {
		return [
			'code', // string (camelCase)
			'label', // string
			'inputType', // 'text', 'textarea', 'date', 'select', 'multiselect', 'yes/no', 'price', 'gallery'
			'options', // obj of options available ***
			'defaultValue', // string or null
			'isRequired', // bool
			'isUnique', // bool
			'isUsedForPromo', // bool
			'isFilter', // bool ***
			'isSorter', // bool ***
			'isSuper', // bool (used for creating super products) ***
			'isSystem' // bool (system attributes cannot be deleted)
		];
		// *** Equals false if input_type != select nor multiselect
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
}