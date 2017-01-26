'use strict';

const Category = require('../../lib/models/catalog/category'),
	expect = require('chai').expect,
	_ = require('lodash');

describe('Category', () => {

	let parentId, leafId, secondleafId;

	beforeEach(done => {
		// Insert sample categories
		Category.create({
			'parentId': null,
			'name': 'Parent',
			'enabled': true,
			'path': null
		}).then(parent => {
			parentId = parent.id;
			Category.create({
				'parentId': parent.id,
				'name': 'Leaf',
				'enabled': true,
				'path': parent.id.str
			}).then(leaf => {
				leafId = leaf.id;
				Category.create({
					'parentId': leaf.id,
					'name': 'Secondleaf',
					'enabled': true,
					'path': `${parent.id}/${leaf.id}`
				}).then(secondleaf => {
					secondleafId = secondleaf.id;
					done();
				});
			});
		});
	});

	afterEach(done => {
		Category.delete({}).then(res => done());
	});

	it('should retrieve the tree of categories', (done) => {
		Category.getTree().then(tree => {
			expect(tree).to.be.an('object');
			expect(tree[parentId]).to.be.an('object');
			expect(_.get(tree, `${parentId}.leaves.${leafId}`)).to.be.an('object');
			expect(_.get(tree, `${parentId}.leaves.${leafId}.leaves.${secondleafId}`)).to.be.an('object');
			done();
		});
	});
});