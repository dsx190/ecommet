'use strict';

const Db = require('../../lib/models/core/db'),
	expect = require('chai').expect;

describe('Db', () => {

	it('should connect to the Database', (done) => {
		Db.connect().then(db => {
			expect(db).to.be.an('object');
			db.close();
			done();
		});
	});

	it('should insert one doc', (done) => {
		Db.insertOne('tests', {'dummy': 'test'}).then(res => {
			expect(res.insertedCount).to.equal(1);
			done();
		});
	});

	it('should insert many docs', (done) => {
		Db.insertMany('tests', [
			{'one': '1'},
			{'two': '2'}
		]).then(res => {
			expect(res.insertedCount).to.equal(2);
			done();
		});
	});

	it('should find one doc', (done) => {
		Db.findOne('tests', {'dummy': 'test'}).then(doc => {
			expect(doc).to.be.an('object');
			expect(doc.dummy).to.equal('test');
			done();
		});
	});

	it('should find docs', (done) => {
		Db.find('tests', {'dummy': 'test'}).then(docs => {
			expect(docs[0]).to.be.an('object');
			expect(docs[0].dummy).to.equal('test');
			done();
		});
	});

	it('should update a doc', (done) => {
		Db.updateOne('tests', {'dummy': 'test'}, 
			{'$set': {'new': 'prop'}}).then(res => {
				expect(res.modifiedCount).to.equal(1);
				done();
			});
	});

	it('should update many docs', (done) => {
		Db.updateMany('tests', {'$or': [
			{'one': '1'},
			{'two': '2'}
		]}, {'$set': {'new': 'prop'}}).then(res => {
			expect(res.modifiedCount).to.equal(2);
			done();
		});
	});

	it('should delete one doc', (done) => {
		Db.deleteOne('tests', {'dummy': 'test'}).then(res => {
			expect(res.deletedCount).to.equal(1);
			done();
		});
	});

	it('should delete many docs', (done) => {
		Db.deleteMany('tests', {}).then(res => {
			expect(res.result.ok).to.equal(1);
			done();
		});
	});
});