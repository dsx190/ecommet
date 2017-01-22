'use strict';

const _ = require('lodash'),
	Config = require('../../../config'),
	Db = require('./db');

module.exports = class Model {

	/**
	 * Constructor. Assigns data if any.
	 *
	 * @param {Object} Data to initialize the obj with.
	 */
	constructor(data) {
		data = data || {};
		this.data = data;
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
	 * Saves the instance in the DB.
	 *
	 * @returns {Promise}
	 */
	save() {
		if (this.data._id) {
			return Db.updateOne(this.collectionName, {'_id': this.data._id}, this.data);
		} else {
			return new Promise((resolve, reject) => {
				Db.insertOne(this.collectionName, this.data).then(res => {
					// Assign the _id property to the instance
					this.data._id = res.insertedId;
					resolve(this.data._id);
				}, err => reject(err));
			});
		}
	}

	static deleteOne(filter) {
		return Db.deleteOne(this.collectionName, filter);
	}

	static deleteMany(filter) {
		return Db.deleteMany(this.collectionName, filter);
	}

	/**
	 * Find models in the DB.
	 *
	 * @param {Object} query
	 * @returns {Promise} for an array of instances of the class
	 */
	static find(query) {
		return new Promise((resolve, reject) => {
			Db.find(this.collectionName, query).then(docs => {
				// Return instances of the used class
				let classPath = Config.get(`models.${this.collectionName}`),
					instances = _.map(docs, (doc) => {
						if (classPath) {
							var Class = require(classPath);
							return new Class(doc);
						} else {
							return new Model(doc);
						}
					});
				resolve(instances);
			}, err => reject(err));
		});
		return Db.find(this.collectionName, query);
	}

	/**
	 * Find a model in the DB.
	 *
	 * @param {Object} query
	 * @returns {Promise} for an instance of the class
	 */
	static findOne(query) {
		return new Promise((resolve, reject) => {
			Db.findOne(this.collectionName, query).then(doc => {
				// Return an instance of the used class
				let classPath = Config.get(`models.${this.collectionName}`);
				if (classPath) {
					var Class = require(classPath),
						instance = new Class(doc);
				} else {
					var instance = new Model(doc);
				}
				resolve(instance);
			}, err => reject(err));
		});
	}

	/**
	 * Used for retrieving the collection name when using static methods
	 *
	 * @return {string}
	 */
	static get collectionName() {
		return 'tests';
	}

	static insertOne(doc) {
		return Db.insertOne(this.collectionName, doc);
	}

	static insertMany(docs) {
		return Db.insertMany(this.collectionName, docs);
	}

	static updateOne(filter, update) {
		return Db.updateOne(this.collectionName, filter, update);
	}

	static updateMany(filter, update) {
		return Db.updateMany(this.collectionName, filter, update);
	}
}