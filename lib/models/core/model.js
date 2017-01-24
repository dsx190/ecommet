'use strict';

const _ = require('lodash'),
	Config = require('../../../config'),
	Db = require('./db');

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
		if (this.data._id) {
			return Db.deleteOne(this.collectionName, {
				'_id': this.data._id
			});
		}
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
	 * Saves the instance in the DB.
	 *
	 * @returns {Promise}
	 */
	save() {
		let id = this.data._id;
		return new Promise((resolve, reject) => {
			if (id) {
				Db.updateOne(this.collectionName, {'_id': id}, this.data).then(
					res => resolve(id),
					err => reject(err));
			} else {
				Db.insertOne(this.collectionName, this.data).then(res => {
					// Assign the _id property to the instance
					this.data._id = res.insertedId;
					resolve(this.data._id);
				}, err => reject(err));
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
					},
					err => reject(err));
			} else {
				Db.insertOne(this.collectionName, params).then(
					res => resolve(this.instantiate(res.ops[0])),
					err => reject(err));
			}
		});
	}

	/**
	 * Delete records in the DB.
	 *
	 * @param {Object} filter
	 * @returns {Promise} for the DB operation results.
	 */
	static delete(filter) {
		return Db.deleteMany(this.collectionName, filter);
	}

	/**
	 * Find a model in the DB.
	 *
	 * @param {mixed} query
	 * @returns {Promise} for an instance of the class
	 */
	static find(query) {
		if (!_.isObject(query)) { // ID
			query = {'_id': query};
		}
		return new Promise((resolve, reject) => {
			Db.findOne(this.collectionName, query).then(doc => {
				if (!doc) { // No doc found (null)
					return resolve();
				}
				resolve(this.instantiate(doc));
			}, err => reject(err));
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
	 * Update records in the DB.
	 *
	 * @param {Object} filter
	 * @param {Object} update
	 * @returns {Promise} for the DB operation results.
	 */
	static update(filter, update) {
		return Db.updateMany(this.collectionName, filter, update);
	}

	/**
	 * Find models in the DB.
	 *
	 * @param {Object} query
	 * @returns {Promise} for an array of instances of the class
	 */
	static where(query) {
		return new Promise((resolve, reject) => {
			Db.find(this.collectionName, query).then(docs => {
				// Return instances of the used class
				let	instances = _.map(docs, (doc) => {
					return this.instantiate(doc);
				});
				resolve(instances);
			}, err => reject(err));
		});
		return Db.find(this.collectionName, query);
	}
}