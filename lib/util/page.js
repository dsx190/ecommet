'use strict';

const perPage = 10,
	_ = require('lodash');

/**
 * Sort, filter and paginate a set of docs of the given class.
 *
 * @param {mixed} Model - The class of the docs to retrieve.
 * @param {Object} req - The request object.
 * @param {Array} fields - The fields to project.
 * @param {Object} specialFilters - Mandatory conditions, i.e. {customerId: 1}
 * @returns {Promise} for an object with docs (array) and pagination data (pag, Object)
 */ 
module.exports = (Model, req, fields, specialFilters) => {

	let pag = { // Pagination data
		'currentPage': req.query.p || 1,
		'totalPages': 0, // Pending,
		'totalDocs': 0, // Pending,
		'sortBy': req.query.sortBy,
		'sortDir': req.query.sortDir,
		'filters': {}, // Pending
		'originalUrl': req.originalUrl
	};
	// Filter
	let filters = {};
	fields.forEach(field => {
		if (req.query[field]) {
			pag.filters[field] = req.query[field]; // Sent to the view
			filters[field] = {'$regex': new RegExp(req.query[field], 'i')}; // Db
		}
	});
	if (specialFilters) {
		filters = _.merge(specialFilters, filters);
	}
	return new Promise((resolve, reject) => {
		Model.where(filters).then(cursor => {
			// Project
			let projection = {};
			fields.forEach(field => {
				projection[field] = 1;
			});
			cursor.project(projection);
			// Sort
			if (pag.sortBy) {
				let sortData = {};
				sortData[pag.sortBy] = parseInt(pag.sortDir);
				cursor.sort(sortData);
			}
			// Skip
			if (pag.currentPage > 1) {
				cursor.skip(perPage * (pag.currentPage - 1));
			}
			// Count
			cursor.count().then(count => {
				pag.totalDocs = count;
				pag.totalPages = parseInt(count / perPage) + count % perPage;
				// Limit
				cursor.limit(perPage);
				// Retrieve
				cursor.toArray().then(docs => {
					resolve({docs, pag});
				}, reject);
			}, reject);
		});
	});
};
