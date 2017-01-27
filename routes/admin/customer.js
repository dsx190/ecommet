'use strict';

const express = require('express'),
	router = express.Router(),
	controller = require('../../lib/controllers/admin/customer');

router.get('/', controller.index);
router.get('/create', controller.create);
router.get('/edit/:id?', controller.edit);
router.post('/save/:id?', controller.save);
router.get('/delete/:id', controller.delete);

module.exports = router;