'use strict';

/**
 * Sort, filter and paginate a set of docs of the given class.
 *
 * @param {mixed} Model - The class of the docs to retrieve.
 * @param {Object} req - The request object.
 * @returns {Promise} for an array of paginated results.
 */ 
module.exports = (Model, req) => {

	let perPage = 10,
		collectionName = Model.collectionName,
		p = req.session.pagination; // Shortcut
	if (!p || p.collectionName !== collectionName) {
		p = {
			'current': 1,
			'totalPages': 0, // Pending
			'totalDocs': 0, // Pending
			'sortBy': null,
			'sortDir': null,
			'filters': {},
			collectionName
		};
	} else { // Update sorts and filters on the session
		if (req.query.sortBy) {
			p.sortBy = req.query.sortBy;
			p.sortDir = req.query.sortDir;
		}
		/*if (req.query.filterBy) {
			p.filterBy = req.query.filterBy;
			p.filterValue = req.query.filterValue;
		}*/
	}
	req.session.pagination = p; // Updated values
	return new Promise((resolve, reject) => {
		// Filter
		var filter = {};
		/*if (p.filterBy) {
			filter[p.filterBy] = p.filterValue;
		}*/
		Model.where(filter).then(cursor => {
			// Sort
			if (p.sortBy) {
				let sortKey = p.sortBy;
				cursor.sort({sortKey: p.sortDir});
			}
			// Skip
			if (p.current > 1) {
				cursor.skip(perPage * (p.current - 1));
			}
			// Limit
			cursor.limit(perPage);
			// Retrieve
			cursor.toArray().then(resolve, reject);
		});
	});
};
