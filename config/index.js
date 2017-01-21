'use strict';

const json = require('./config.json'),
	_ = require('lodash');

module.exports = class Config {

	static get(property) {
		return _.get(json, property);
	}
}