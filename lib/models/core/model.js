'use strict';

const _ = require('lodash'),
	Db = require('./db');

module.exports = class Model {

	constructor(data) {
		if (data) {
			_.each(data, (property, value) => {
				this.property = value;
			});
		}
	}

	static deleteOne(filter) {
		return Db.deleteOne(this.collectionName, filter);
	}

	static deleteMany(filter) {
		return Db.deleteMany(this.collectionName, filter);
	}

	static find(query) {
		return Db.find(this.collectionName, query);
	}

	static findOne(query) {
		return Db.findOne(this.collectionName, query);
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