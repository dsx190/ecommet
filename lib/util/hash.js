'use strict';

const bcrypt = require('bcrypt-nodejs'),
	rounds = 10;

/**
 * Returns a new hash of the introduced param.
 *
 * @param {string} param
 * @returns {Promise} for the new hash.
 */
module.exports = (param) => {
	return new Promise((resolve, reject) => {
		bcrypt.genSalt(rounds, (err, salt) => {
			if (err) return reject();
			bcrypt.hash(param, salt, null, (err, hash) => {
				if (err) return reject();
				resolve(hash);
			});
		});
	});
}