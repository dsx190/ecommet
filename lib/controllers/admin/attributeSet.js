'use strict';

const AttributeSet = require('../../models/catalog/attribute-set'),
	page = require('../../util/page'),
	ObjectID = require('mongodb').ObjectID;

module.exports = class AttributeSetController {

	/**
	 * Display a list of attribute sets.
	 */
	static index(req, res) {
		page(AttributeSet, req, ['name']).then(data => {
			res.render('admin/catalog/attributeSet/index');
		});
	}

	/**
	 * Render the form for editing an attribute set.
	 */
	static edit(req, res) {
		var id = req.params.id,
			view = 'admin/catalog/attributeSets/form';
		AttributeSet.find(id).then(set => {
			set = set || new AttributeSet();
			page(Attribute, req, []).then(data => {
				data.doc = set.data;
				res.render('admin/catalog/attributeSet/form', data);
			});
		});
	}

	/**
	 * Save an attribute set.
	 */
	static save(req, res) {

	}

	/**
	 * Delete an attribute set.
	 */
	static delete(req, res) {

	}
}