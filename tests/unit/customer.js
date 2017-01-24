'use strict';

const Customer = require('../../lib/models/customer/customer'),
	expect = require('chai').expect,
	_ = require('lodash');

describe('Customer', () => {
	it('should return an instance of customer', (done) => {
		let customer = Customer.where({}).then(customers => {
			_.forEach(customers, (customer) => {
				//console.log(customer);
			});
			done();
		});
	});
});