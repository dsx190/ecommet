'use strict';

const Model = require('../core/model'),
	collectionName = 'customers',
	bcrypt = require('bcrypt-nodejs');

module.exports = class Customer extends Model {

	constructor(data) {
		super(data, collectionName);
	}

	static get collectionName() {
		return collectionName;
	}

	static get keys() {
		return ['email', 'firstName', 'lastName', 'dob', 'gender'];
	}

	/**
	 * Override to the save function to handle passwords.
	 *
	 * @param {Object} data
	 * @param {mixed} id
	 * @returns {Promise}
	 */
	static save(data, id) {
		return new Promise((resolve, reject) => {
			if (data.password) {
				bcrypt.genSalt(10, (err, salt) => {
					if (err) return reject();
					bcrypt.hash(data.password, salt, null, (err, hash) => {
						if (err) return reject();
						data.password = hash;
						super.save(data, id).then(resolve, reject);
					});
				});
			} else {
				delete data.password;
				super.save(data, id).then(resolve, reject);
			}
		});
	}
}