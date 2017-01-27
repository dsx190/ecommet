'use strict';

const perPage = 10;
/**
 * Sort, filter and paginate a set of docs of the given class.
 *
 * @param {mixed} Model - The class of the docs to retrieve.
 * @param {Object} req - The request object.
 * @param {Array} fields - The fields to project.
 * @returns {Promise} for an array of paginated results.
 */ 
module.exports = (Model, req, fields) => {

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
	fields.forEach(field => {
		if (req.query[field]) {
			pag.filters[field] = req.query[field];
		}
	});
	return new Promise((resolve, reject) => {
		Model.where(pag.filters).then(cursor => {
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
			// Limit
			cursor.limit(perPage);
			// Retrieve
			cursor.toArray().then(docs => {
				resolve({docs, pag});
			}, reject);
		});
	});
};
