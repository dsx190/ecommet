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

		let schema = [
		'code', // string (camelCase)
		'label', // string
		'inputType', // 'text', 'textarea', 'date', 'select', 'multiselect', 'yes/no', 'price', 'gallery'
		'options', // obj of options available ***
		'defaultValue', // string or null
		'isRequired', // true or false
		'isUnique', // true or false
		'isUsedForPromo', // true or false,
		'isFilter', // true or false ***
		'isSorter', // true or false ***
		'isSuper', // true or false (used for creating super products) ***
		'isSystem' // true or false (system attributes cannot be deleted)
		];
		// *** Equals false if input_type is not select nor multiselect

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

	static collectionName() {
		return collectionName;
	}
}