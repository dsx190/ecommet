'use strict';

const Category = require('../../models/catalog/category'),
	_ = require('lodash');

module.exports = class CategoryController {

	/**
	 * Display a list of categories.
	 */
	static index(req, res) {
		Category.getTree().then(tree => {
			tree = _.isEmpty(tree) ? false : tree;
			res.render('admin/catalog/category/index', {tree});
		});
	}

	/**
	 * Create a new category.
	 */
	static create(req, res) {
		let parentId = req.params.parentId,
			view = 'admin/catalog/category/form';
		if (parentId) {
			Category.find(parentId).then(parent => {
				res.render(view, {
					doc: {},
					parent: parent.data
				});
			});
		} else {
			// No parent, root category
			res.render(view, {doc: {}});
		}
	}

	/**
	 * Render the form for editing a category.
	 */
	static edit(req, res) {
		let id = req.params.id;
		Category.find(id).then(category => {
			res.render('admin/catalog/category/form', {
				doc: category.data});
		});
	}

	/**
	 * Store a new category.
	 */
	static store(req, res) {
		let data = _.pick(req.body, Category.keys),
			parentId = req.params.parentId || null,
			successCb = () => {
				req.flash('success', 'Created successfully!');
				res.redirect('/admin/catalog/categories');
			},
			errCb = () => {
				req.flash('error', 'An error happened');
				res.redirect('back');
			};
		data.parentId = parentId;
		data.enabled = (data.enabled === 'true'); // Transform to bool
		data.path = ''; // Root category by default
		Category.create(data).then(category => {
			if (!parentId) return successCb();
			// Update the path if there is a parent category with the new ID
			Category.find(parentId).then(parent => {
				let path = parent.get('path');
				if (path) {
					path += `/${parentId}`; // Mongo ObjectID to string
				} else {
					path = parentId;
				}
				category.set('path', path).save().then(successCb, errCb);
			}, errCb);
		}, errCb);
	}

	/**
	 * Update an existing category.
	 */
	static update(req, res) {
		let data = _.pick(req.body, Category.keys);
		data.enabled = (data.enabled === 'true'); // Transform to bool
		Category.update(req.params.id, data).then(result => {
			req.flash('success', 'Updated successfully!');
			res.redirect('/admin/catalog/category');
		}, err => {
			req.flash('error', 'An error happened');
			res.redirect('back');
		});
	}

	/**
	 * Delete a category.
	 */
	static delete(req, res) {
		let errCb = () => {
			req.flash('error', 'An error happened');
			res.redirect('back');
		};
		Category.delete(req.params.id).then(
			deleted => {
				if (!deleted) return errCb();
				req.flash('success', 'Deleted successfully!');
				res.redirect('/admin/catalog/categories');
			}, errCb);
	}
}