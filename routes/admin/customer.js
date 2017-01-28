'use strict';

const express = require('express'),
	router = express.Router(),
	controller = require('../../lib/controllers/admin/customer');

router.get('/', controller.index);
router.get('/create', controller.create);
router.get('/edit/:id?', controller.edit);
router.post('/save/:id?', controller.save);
router.get('/delete/:id', controller.delete);
router.get('/:customerId/address/delete/:id', controller.deleteAddress);
router.get('/:customerId/address/:id?', controller.editAddress);
router.post('/:customerId/address/:id?', controller.saveAddress);

module.exports = router;