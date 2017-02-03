'use strict';

const express = require('express'),
	router = express.Router(),
	path = require('path'),
	multer = require('multer'),
	_ = require('lodash'),
	storage = multer.diskStorage({
		destination(req, file, cb) {
			let filesPath = path.join(__dirname, '../../public/img/catalog');
			cb(null, filesPath);
		},
		filename(req, file, cb) {
			let random = _.random(10000000000);
			cb(null, `${Date.now()}-${random}.${file.mimetype.split('/')[1]}`);
		}
	}),
	upload = multer({
		storage,
		fileFilter(req, file, cb) {
			let allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
			cb(null, (allowedTypes.indexOf(file.mimetype) != -1));
		}
	}),
	attributeCtrl = require('../../lib/controllers/admin/attribute'),
	attributeSetCtrl = require('../../lib/controllers/admin/attribute-set'),
	categoryCtrl = require('../../lib/controllers/admin/category'),
	productCtrl = require('../../lib/controllers/admin/product');

router.get('/attributes/', attributeCtrl.index);
router.get('/attributes/edit/:id?', attributeCtrl.edit);
router.post('/attributes/save/:id?', attributeCtrl.save);
router.get('/attributes/delete/:id', attributeCtrl.delete);

router.get('/attributeSets/', attributeSetCtrl.index);
router.get('/attributeSets/edit/:id?', attributeSetCtrl.edit);
router.post('/attributeSets/save/:id?', attributeSetCtrl.save);
router.get('/attributeSets/delete/:id', attributeSetCtrl.delete);

router.get('/categories/', categoryCtrl.index);
router.get('/categories/create/:parentId?', categoryCtrl.create);
router.post('/categories/store/:parentId?', categoryCtrl.store);
router.get('/categories/edit/:id', categoryCtrl.edit);
router.post('/categories/update/:id?', categoryCtrl.update);
router.get('/categories/delete/:id', categoryCtrl.delete);

router.get('/products/', productCtrl.index);
router.get('/products/new', productCtrl.new);
router.get('/products/create/:type/:attributeSetId', productCtrl.create);
router.post('/products/store/:type/:attributeSetId', upload.array('gallery'), productCtrl.store);
router.get('/products/edit/:id', productCtrl.edit);
router.post('/products/update/:id', upload.array('gallery'), productCtrl.update);
router.get('/products/delete/:id', productCtrl.delete);

module.exports = router;