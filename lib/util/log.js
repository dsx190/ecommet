'use strict';

const winston = require('winston'),
	Config = require('../../config'),
	logger = new (winston.Logger)({
		transports: [
			new (winston.transports.File)({
				filename: Config.get('log.file')
			})
		]
	});

module.exports = logger;