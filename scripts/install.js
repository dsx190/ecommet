'use strict';

const Attribute = require('../lib/models/catalog/attribute'),
	AttributeSet = require('../lib/models/catalog/attribute-set'),
	Role = require('../lib/models/admin/role'),
	Permission = require('../lib/models/admin/permission'),
	User = require('../lib/models/admin/user'),
	// Installation data
	systemAttributes = require('./data/system-attributes.json'),
	corePermissions = require('./data/core-permissions.json'),
	// Other libraries
	async = require('async'),
	_ = require('lodash');

async.waterfall([
	(cb) => { // System attributes
		systemAttributes.forEach(data => {
			data.isSystem = true;
		});
		Attribute.create(systemAttributes).then(res => cb(null, res), cb);
	},
	(attrs, cb) => { // Default attribute set
		console.log(`Installed ${attrs.length} system attributes`);
		let systemAttributeCodes = _.map(systemAttributes, attr => attr.code);
		AttributeSet.create({
			'name': 'Default',
			'attributes': systemAttributeCodes
		}).then(res => cb(null, res), cb);
	},
	(attrSet, cb) => { // Default permissions
		console.log('Installed the default attribute set');
		Permission.create(corePermissions).then(res => cb(null, res), cb);
	},
	(permissionInstances, cb) => { // Admin role
		console.log(`Installed ${permissionInstances.length} core permissions`);
		let permissions = _.map(corePermissions, p => p.path);
		Role.create({'name': 'Admin', 'permissions': permissions}).then(res => cb(null, res), cb);
	},
	(adminRole, cb) => { // Admin user
		console.log('Installed the admin role');
		User.save({
			'email': 'admin@ecommet.com',
			'name': 'Admin',
			'password': 'admin',
			'role': adminRole.get('_id')
		}).then(id => cb(null, id), cb);
	}
], (err, adminUserId) => {
	if (err) {
		console.log('Installation failed', err);
	} else {
		console.log('Installed the admin user');
		console.log('Installation finished successfully!');
	}
});
