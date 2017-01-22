'use strict';

const mongo = require('mongodb').MongoClient,
	Config = require('../../../config'),
	host = Config.get('db.host');

module.exports = class Db {

	static connect() {
		return new Promise((resolve) => {
			mongo.connect(host, (err, db) => {
				if (err) {
					throw new Error(err);
				}
				resolve(db);
			});
		});
	}

	static deleteOne(cn, filter) {
		return this.query(cn, 'deleteOne', filter);
	}

	static deleteMany(cn, filter) {
		return this.query(cn, 'deleteMany', filter);
	}

	/**
	 * Find multiple documents in a collection.
	 *
	 * @param {string} cn - Collection name
	 * @param {Object} query
	 */
	static find(cn, query) {
		return new Promise((resolve, reject) => {
			this.connect().then(db => {
				db.collection(cn).find(query).toArray((err, docs) => {
					if (err) return reject(err);
					db.close();
					resolve(docs);
				});
			}, err => reject(err)); // Connection err
		});
	}

	static findOne(cn, query) {
		return this.query(cn, 'findOne', query);
	}

	static insertOne(cn, doc) {
		return this.query(cn, 'insertOne', doc);
	}

	static insertMany(cn, docs) {
		return this.query(cn, 'insertMany', docs);
	}

	/**
	 * Used for findOne, insertOne, insertMany, deleteOne & deleteMany.
	 *
	 * @param {string} cn - Collection name
	 * @param {string} method - Method to use (findOne, insertOne..)
	 * @param {Object} options - Filters, options, or docs to use
	 */
	static query(cn, method, options) {
		return new Promise((resolve, reject) => {
			this.connect().then(db => {
				db.collection(cn)[method](options).then((res) => {
					db.close();
					resolve(res);
				}, err => reject(err)); // Query err
			}, err => reject(err)); // Connection err
		});
	}

	/**
	 * Used for updateOne or updateMany records.
	 *
	 * @param {string} cn - Collection name
	 * @param {string} method - Method to use (updateOne, updateMany)
	 * @param {Object} filter
	 * @param {Object} update
	 */
	static update(cn, method, filter, update) {
		return new Promise((resolve, reject) => {
			this.connect().then(db => {
				db.collection(cn)[method](filter, update).then((res) => {
					db.close();
					resolve(res);
				}, err => reject(err)); // Update err
			}, err => reject(err)); // Connection err
		});
	}

	static updateOne(cn, filter, update) {
		return this.update(cn, 'updateOne', filter, update);
	}

	static updateMany(cn, filter, update) {
		return this.update(cn, 'updateMany', filter, update);
	}
}