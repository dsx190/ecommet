'use strict';

const Model = require('../../lib/models/core/model'),
	Db = require('../../lib/models/core/db'),
	expect = require('chai').expect;

describe('Model', () => {

	let instance;

	beforeEach(() => {
		instance = new Model({'dummy': 'test'}, 'tests');
	});

	afterEach((done) => {
		Db.deleteMany('tests', {}).then(res => done());
	});

	it('constructor should return a new instance', () => {
		expect(instance).to.be.an('object');
		expect(instance.data).to.eql({'dummy': 'test'});
	});

	it('get should return a property from the instance', () => {
		expect(instance.get('dummy')).to.equal('test');
	});

	it('get id shortcut should return _id', () => {
		expect(instance.id).to.be.undefined;
		instance.data._id = 1;
		expect(instance.id).to.equal(1);
	});

	it('set should establish one property from the instance', () => {
		instance.set('dummy', 'x');
		expect(instance.get('dummy')).to.equal('x');
	});

	it('set should establish the entire data to the instance', () => {
		instance.set({'a': 1});
		expect(instance.get('a')).to.equal(1);
	});

	it('set should fail setting _id to the instance', () => {
		try {
			instance.set('_id', 1);
		} catch (error) {
			expect(error).to.eql(new Error('Cannot assign _id to an object'));
		}
	});

	it('save should create a new instance in the db', (done) => {
		instance.save().then(id => {
			expect(id).to.equal(instance.id);
			done();
		});
	});

	it('find should return an instance', (done) => {
		instance.save().then(id => {
			Model.find(id).then(inst => {
				expect(inst).to.be.an.instanceOf(Model);
				done();
			});
		});
	});

	it('find should return multiple instances', (done) => {
		instance.save().then(id => {
			Model.where({'_id': id}, true).then(arr => {
				expect(arr[0]).to.be.an.instanceOf(Model);
				done();
			});
		});
	});

	it('should update an instance in the db', (done) => {
		instance.save().then(id => {
			instance.set('new', 'property');
			instance.save().then(id => {
				expect(id).to.equal(instance.id);
				expect(instance.get('new')).to.equal('property');
				done();
			});
		});
	});

	it('should delete the instance from the db', (done) => {
		instance.save().then(id => {
			instance.delete().then(res => {
				expect(res.deletedCount).to.equal(1);
				done();
			});
		});
	});

	it('should delete the instance using a static method', (done) => {
		instance.save().then(id => {
			Model.delete({'_id': id}).then(res => {
				expect(res.deletedCount).to.equal(1);
				done();
			});
		});
	});

	it('getCollectionName should return a string', () => {
		expect(Model.collectionName).to.be.a('string');
	});

	it('create should insert one doc and return an instance', (done) => {
		Model.create({
			'dummy': 'test'
		}).then(instance => {
			expect(instance).to.be.an.instanceOf(Model);
			done();
		});
	});

	it('create should insert multiple docs and return an array of instances', (done) => {
		Model.create([
			{'one': 1},
			{'two': 2}
		]).then(instances => {
			expect(instances.length).to.equal(2);
			expect(instances[0]).to.be.an.instanceOf(Model);
			done();
		});
	});
});