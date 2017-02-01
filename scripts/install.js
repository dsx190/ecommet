'use strict';

const Attribute = require('../lib/models/catalog/attribute'),
	AttributeSet = require('../lib/models/catalog/attribute-set'),
	systemAttributes = require('./system-attributes.json'),
	_ = require('lodash');

/**
 * Install the system attributes
 */
systemAttributes.forEach(data => {
	data.isSystem = true;
	Attribute.create(data);
});

/**
 * Install the Default Attribute Set
 */

let systemAttributeCodes = _.map(systemAttributes, attr => {
	return attr.code;
});
AttributeSet.create({
	'name': 'Default',
	'attributes': systemAttributeCodes
});
