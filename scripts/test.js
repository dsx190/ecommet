'use strict';

const Customer = require('../lib/models/customer/customer'),
	_ = require('lodash'),
	chars = ['0', '1', '2', '3', '4', '5', '6', '7',
		'8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
		'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
		's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

var randomString = (length) => {
	return _.join(_.times(length, i => {
		return chars[_.random(chars.length - 1)];
	}), '');
};

_.times(100, i => {
	Customer.create({
		'email': `${randomString(5)}@${randomString(5)}.com`,
		'firstName': randomString(10),
		'lastName': randomString(10),
		'dob': randomString(8),
		'gender': _.random(1) ? 'M' : 'F'
	});
});
