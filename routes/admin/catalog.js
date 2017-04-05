'use strict';

const express = require('express'),
	router = express.Router(),
	files = require('../../lib/util/files'),
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
router.post('/attributeSets/store', attributeSetCtrl.store);
router.post('/attributeSets/update/:id', attributeSetCtrl.update);
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
router.post('/products/store/:type/:attributeSetId', files.upload.array('gallery'), productCtrl.store);
router.get('/products/edit/:id', productCtrl.edit);
router.post('/products/update/:id', files.upload.array('gallery'), productCtrl.update);
router.get('/products/delete/:id', productCtrl.delete);

module.exports = router;