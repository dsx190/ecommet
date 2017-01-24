'use strict';

const LocalStrategy = require('passport-local').Strategy,
	Customer = require('../models/customer/customer');

/**
 * Configure strategies for passport.
 */
module.exports = function(passport) {

	passport.use(new LocalStrategy({
		'usernameField': 'email'
	}, (email, password, done) => {
		Customer.findOne({'email': email}).then(customer => {
			if (!customer) {
				return done(new Error('Customer not found.'));
			}
			if (customer.get('password') !== password) {
				return done(new Error('Passwords do not match.'));
			}
			return done(null, customer); // Success
		}, err => done(err)); // Customer find error
	}));

	passport.serializeUser((customer, done) => {
		console.log(customer);
		done(null, customer.get('_id'));
	});

	passport.deserializeUser((id, done) => {
		Customer.findOne({'_id': id}).then(
			customer => done(null, customer),
			err => done(err, null));
	});
};
