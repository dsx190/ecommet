'use strict';

const LocalStrategy = require('passport-local').Strategy,
	Customer = require('../models/customer/customer'),
	Admin = require('../models/admin/admin');

/**
 * Configure passport.
 */
module.exports = function(passport) {

	/**
	 * Declare the LocalStrategy.
	 */
	passport.use(new LocalStrategy({
		'usernameField': 'email',
		'passReqToCallback': true
	}, (req, email, password, done) => {
		/*
		 * Instantiate a model of class Admin or Customer,
		 * depending on req.isAdmin (set as middleware routes/admin.js)
		 */
		let Class = (req.isAdmin) ? Admin : Customer;
		Class.find({email}).then(user => {
			if (user && user.get('password') === password) {
				return done(null, user); // Success
			}
			return done(null, false); // Error
		}, err => done(err)); // Customer/Admin find error
	}));

	/**
	 * Serialize the ID of the model and its type.
	 */
	passport.serializeUser((user, done) => {
		let data = {id: user.id};
		if (user instanceof Admin) {
			data.type = 'admin';
		} else if (user instanceof Customer) {
			data.type = 'customer';
		}
		done(null, data);
	});

	/**
	 * Deserialize the model from session.
	 */
	passport.deserializeUser((data, done) => {
		if (data.type === 'customer') {
			var Class = Customer;
		} else if (data.type === 'admin') {
			var Class = Admin;
		} else {
			return done('Deserialize error');
		}
		Class.find(data.id).then(
			user => done(null, user),
			err => done(err, null));
	});
};
