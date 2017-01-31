'use strict';

/**
 * Install the system attributes
 */
const Attribute = require('../lib/models/catalog/attribute'),
	systemAttributes = [
		{
			'code': 'description',
			'label': 'Description',
			'inputType': 'textarea',
			'options': null,
			'defaultValue': null,
			'isRequired': true,
			'isUnique': false,
			'isUsedForPromo': false,
			'isFilter': false,
			'isSorter': false,
			'isSuper': false
		},
		{
			'code': 'gallery',
			'label': 'Gallery',
			'inputType': 'gallery',
			'options': null,
			'defaultValue': null,
			'isRequired': true,
			'isUnique': false,
			'isUsedForPromo': false,
			'isFilter': false,
			'isSorter': false,
			'isSuper':false
		},
		{
			'code': 'metaDescription',
			'label': 'Meta Description',
			'inputType': 'textarea',
			'options': null,
			'defaultValue': null,
			'isRequired': false,
			'isUnique': false,
			'isUsedForPromo': false,
			'isFilter': false,
			'isSorter': false,
			'isSuper': false
		},
		{
			'code': 'metaKeywords',
			'label': 'Meta Keywords',
			'inputType': 'text',
			'options': null,
			'defaultValue': null,
			'isRequired': false,
			'isUnique': false,
			'isUsedForPromo': false,
			'isFilter': false,
			'isSorter': false,
			'isSuper': false
		},
		{
			'code': 'metaRobots',
			'label': 'Meta Robots',
			'inputType': 'text',
			'options': null,
			'defaultValue': null,
			'isRequired': false,
			'isUnique': false,
			'isUsedForPromo': false,
			'isFilter': false,
			'isSorter': false,
			'isSuper': false
		},
		{
			'code': 'metaTitle',
			'label': 'Meta Title',
			'inputType': 'text',
			'options': null,
			'defaultValue': null,
			'isRequired': false,
			'isUnique': false,
			'isUsedForPromo': false,
			'isFilter': false,
			'isSorter': false,
			'isSuper': false
		},
		{
			'code': 'name',
			'label': 'Name',
			'inputType': 'text',
			'options': null,
			'defaultValue': null,
			'isRequired': true,
			'isUnique': false,
			'isUsedForPromo': true,
			'isFilter': false,
			'isSorter': false,
			'isSuper': false
		},
		{
			'code': 'price',
			'label': 'Price',
			'inputType': 'price',
			'options': null,
			'defaultValue': null,
			'isRequired': true,
			'isUnique': false,
			'isUsedForPromo': true,
			'isFilter': true,
			'isSorter': true,
			'isSuper': false
		},
		{
			'code': 'sku',
			'label': 'SKU',
			'inputType': 'text',
			'options': null,
			'defaultValue': null,
			'isRequired': true,
			'isUnique': true,
			'isUsedForPromo': true, 
			'isFilter': false,
			'isSorter': false,
			'isSuper': false
		},
		{
			'code': 'enabled',
			'label': 'Enabled',
			'inputType': 'yesno',
			'options': null,
			'defaultValue': true,
			'isRequired': true,
			'isUnique': false,
			'isUsedForPromo': false,
			'isFilter': false,
			'isSorter': false,
			'isSuper': false
		},
		{
			'code': 'urlKey',
			'label': 'URL Key',
			'inputType': 'text',
			'options': null,
			'defaultValue': null,
			'isRequired': true,
			'isUnique': true,
			'isUsedForPromo': false,
			'isFilter': false,
			'isSorter': false,
			'isSuper': false
		}
	];

systemAttributes.forEach(data => {
	data.isSystem = true;
	Attribute.create(data);
});

