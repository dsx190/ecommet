'use strict';

const _ = require('lodash'),
	Config = require('../../../config'),
	Db = require('./db'),
	ObjectID = require('mongodb').ObjectID;

module.exports = class Model {

	/**
	 * Constructor. Assigns data if any.
	 *
	 * @param {Object} data to initialize the obj with.
	 * @param {string} collectionName
	 */
	constructor(data, collectionName) {
		data = data || {};
		this.data = data;
		this.collectionName = collectionName;
	}

	/**
	 * Delete the instance from the DB.
	 * 
	 * @returns {Promise}
	 */
	delete() {
		return new Promise((resolve, reject) => {
			if (!this.data._id) {
				return resolve();
			}
			Db.deleteOne(this.collectionName, {
				'_id': this.data._id
			}).then(res => resolve(res.deletedCount), reject);
		});
	}

	/**
	 * Get a property from the object.
	 *
	 * @param {string} Path to the property to retrieve.
	 * @returns {mixed}
	 */
	get(property) {
		return _.get(this.data, property);
	}

	/**
	 * Shortcut for getting the _id of an object.
	 *
	 * @returns {string}
	 */
	get id() {
		return this.data._id;
	}

	/**
	 * Saves the instance in the DB.
	 *
	 * @returns {Promise}
	 */
	save() {
		let _id = this.data._id;
		return new Promise((resolve, reject) => {
			if (_id) {
				Db.updateOne(this.collectionName, {_id}, this.data).then(
					res => resolve(_id), reject);
			} else {
				Db.insertOne(this.collectionName, this.data).then(res => {
					// Assign the _id property to the instance
					this.data._id = res.insertedId;
					resolve(this.data._id);
				}, reject);
			}
		});
	}

	/**
	 * Set a property or a data obj to the instance.
	 *
	 * @param {string|Object} key
	 * @param {mixed} value
	 */
	set(key, value) {
		if (key === '_id') {
			throw new Error('Cannot assign _id to an object');
		} else if (typeof key === 'object') {
			this.data = key;
		} else {
			this.data[key] = value;
		}
	}

	/**
	 * Create one or more objects and return them.
	 *
	 * @param {Array|Object} params
	 * @returns {Promise} for instance(s) of the inserted docs.
	 */
	static create(params) {
		return new Promise((resolve, reject) => {
			if (_.isArray(params)) {
				Db.insertMany(this.collectionName, params).then(
					res => {
						let results = _.map(res.ops, (doc) => {
							return this.instantiate(doc);
						});
						resolve(results);
					}, reject);
			} else {
				Db.insertOne(this.collectionName, params).then(
					res => resolve(this.instantiate(res.ops[0])),
					reject);
			}
		});
	}

	/**
	 * Delete records in the DB.
	 *
	 * @param {mixed} filter
	 * @param {bool} many - Indicates to use deleteMany
	 * @returns {Promise} for the number of deleted docs.
	 */
	static delete(filter, many) {
		let func = many? 'deleteMany' : 'deleteOne';
		filter = this.standarizeParams(filter);
		return new Promise((resolve, reject) => {
			Db[func](this.collectionName, filter).then(res => {
				resolve(res.deletedCount);
			}, reject);
		});
	}

	/**
	 * Find a model in the DB.
	 *
	 * @param {mixed} query
	 * @returns {Promise} for an instance of the class
	 */
	static find(query) {
		query = this.standarizeParams(query);
		return new Promise((resolve, reject) => {
			Db.findOne(this.collectionName, query).then(doc => {
				if (!doc) { // No doc found (null)
					return resolve();
				}
				resolve(this.instantiate(doc));
			}, reject);
		});
	}

	/**
	 * Used for retrieving the collection name when using static methods.
	¨* Override this function to return the appropriate collectionName.
	 *
	 * @return {null|string}
	 */
	static get collectionName() {
		return 'tests';
	}

	/**
	 * Return an instance of the model depending on its collectionName.
	 *
	 * @param {Object} data - To initialize the instance with
	 * @returns {Object}
	 */
	static instantiate(data) {
		let classPath = Config.get(`models.${this.collectionName}`);
		if (classPath) {
			var Class = require(classPath);
			return new Class(data);
		} else {
			return new Model(data);
		}
	}

	/**
	 * Get a standard query/filter object.
	 *
	 * @param {mixed} params
	 * @returns {Object}
	 */
	static standarizeParams(params) {
		if (_.isString(params)) { // Id string
			params = {'_id': new ObjectID(params)};
		} else if (params instanceof ObjectID) {
			params = {'_id': params}; // Place it into an object
		}
		return params; // Other cases are left as they are.
	}

	/**
	 * Update records in the DB.
	 *
	 * @param {Object} filter
	 * @param {Object} update
	 * @param {bool} many - Indicates to use updateMany
	 * @returns {Promise} for the DB operation results.
	 */
	static update(filter, update, many) {
		let func = many? 'updateMany' : 'updateOne';
		filter = this.standarizeParams(filter);
		update = {'$set': update};
		return Db[func](this.collectionName, filter, update);
	}

	/**
	 * Find models in the DB.
	 *
	 * @param {Object} query
	 * @param {bool} instantiate - True: return an array of instances
	 * @returns {Promise} for an array of instances of the class or cursor
	 */
	static where(query, instantiate) {
		return new Promise((resolve, reject) => {
			Db.find(this.collectionName, query).then(cursor => {
				if (instantiate) {
					// Return an array of instances of the used class
					cursor.toArray((err, docs) => {
						if (err) return reject(err);
						let instances = _.map(docs, doc => {
							return this.instantiate(doc);
						});
						resolve(instances);
					});
				} else { // Return the cursor
					resolve(cursor);
				}
			}, reject);
		});
	}
}