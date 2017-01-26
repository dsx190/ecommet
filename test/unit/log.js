'use strict';

const log = require('../../lib/util/log');

describe('Log', () => {

	it('should log info', () => {
		log.info('dummy');
	});

	it('should log a debug entry', () => {
		log.debug('something');
	});

	it('should log a warning', () => {
		log.warn('warning');
	});

	it('should log an error', () => {
		log.error('error!');
	});
});