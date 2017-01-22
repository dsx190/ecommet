'use strict';

const Model = require('../../lib/models/core/model'),
	Db = require('../../lib/models/core/db'),
	expect = require('chai').expect;

describe('Model', () => {

	let instance;

	beforeEach(() => {
		instance = new Model({'dummy': 'test'});
	});

	afterEach((done) => {
		Db.deleteMany('tests', {}).then(res => done());
	});

	it('should create a new instance', () => {
		expect(instance).to.be.an('object');
		expect(instance.data).to.eql({'dummy': 'test'});
	});

	it('should get a property from the instance', () => {
		expect(instance.get('dummy')).to.equal('test');
	});

	it('should set one property from the instance', () => {
		instance.set('dummy', 'x');
		expect(instance.get('dummy')).to.equal('x');
	});

	it('should set the entire data to the instance', () => {
		instance.set({'a': 1});
		expect(instance.get('a')).to.equal(1);
	});

	it('should fail setting _id to the instance', () => {
		try {
			instance.set('_id', 1);
		} catch (error) {
			expect(error).to.eql(new Error('Cannot assign _id to an object'));
		}
	});

	it('should create a new instance in the db', (done) => {
		instance.collectionName = 'tests';
		instance.save().then(id => {
			expect(id).to.equal(instance.get('_id'));
			done();
		});
	});

	it('should find an instance in the db', (done) => {
		instance.collectionName = 'tests';
		instance.save().then(id => {
			Model.findOne({'_id': id}).then(inst => {
				expect(inst).to.be.an.instanceOf(Model);
				done();
			});
		});
	});

	it('should find instances in the db', (done) => {
		instance.collectionName = 'tests';
		instance.save().then(id => {
			Model.find({'_id': id}).then(arr => {
				expect(arr[0]).to.be.an.instanceOf(Model);
				done();
			});
		});
	});

	it('should update an instance in the db', (done) => {
		instance.collectionName = 'tests';
		instance.save().then(id => {
			instance.set('new', 'property');
			instance.save().then(res => {
				expect(res.modifiedCount).to.equal(1);
				done();
			});
		});
	});

	it('should delete the instance from the db', (done) => {
		instance.collectionName = 'tests';
		instance.save().then(id => {
			instance.delete().then(res => {
				expect(res.deletedCount).to.equal(1);
				done();
			});
		});
	});
});