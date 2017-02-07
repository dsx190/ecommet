'use strict';

const Model = require('../core/model'),
	collectionName = 'users',
	hash = require('../../util/hash');

module.exports = class User extends Model {

	constructor(data) {
		super(data, collectionName);
	}

	static get collectionName() {
		return collectionName;
	}

	static get keys() {
		return [
			'email',
			'name'
		];
	}

	/**
	 * Override to the save function to handle passwords.
	 *
	 * @param {Object} data
	 * @param {mixed} id
	 * @returns {Promise}
	 */
	static save(data, id) {
		// Create a reference for super
		var saveFunc = (data, id, successCb, errCb) => {
			super.save(data, id).then(successCb, errCb);
		};
		return new Promise((resolve, reject) => {
			if (data.password) {
				hash(data.password).then(hash => {
					data.password = hash;
					saveFunc(data, id, resolve, reject);
				}, reject);
			} else {
				delete data.password;
				saveFunc(data, id, resolve, reject);
			}
		});
	}
}