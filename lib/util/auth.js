'use strict';

const LocalStrategy = require('passport-local').Strategy,
	Customer = require('../models/customer/customer');

/**
 * Configure strategies for passport.
 */
module.exports = function(passport) {
	/**
	 * Configure the strategy for signing up
	 */
	passport.use('customers-signup', new LocalStrategy({
		'usernameField': 'email'
	}, (email, password, done) => {
		console.log('Using customers-signup');
		Customer.findOne({'email': email}).then(customer => {
			console.log(customer);
			if (customer) {
				console.log('Found customer!!');
				return done(new Error('The email already exists.'));
			} else {
				console.log('Creating customer');
				// Create the customer
				let customer = new Customer({
					'email': email,
					'password': password
				}).save().then(id => {
					console.log('Success?');
					done(null, customer); // Success
				}, err => {
					console.log('ERROR');	
					done(new Error('Something went wrong'));
				});
			}
		}, err => done(err)); // Customer find error
	}));

	/**
	 * Configure the strategy for signing in
	 */
	passport.use('customers-signin', new LocalStrategy({
		'usernameField': 'email'
	}, (email, password, done) => {
		Customer.findOne({'email': email}).then(customer => {
			if (!customer) {
				return done(new Error('No customer found.'));
			}
			if (customer.get('password') !== password) {
				return done(new Error('Passwords do not match.'));
			}
			return done(null, customer); // Success
		}, err => done(err)); // Customer find error
	}));

	passport.serializeUser((customer, done) => {
		done(null, customer.get('_id'));
	});

	passport.deserializeUser((id, done) => {
		Customer.findOne({'_id': id}).then(
			customer => done(null, customer),
			err => done(err, null));
	});
};
