'use strict';

const express = require('express'),
	router = express.Router(),
	controller = require('../../lib/controllers/admin/customer');

router.get('/', controller.index);
router.get('/grid', controller.grid);
router.get('/create', controller.create);
router.get('/edit/:id?', controller.edit);
router.post('/save/:id?', controller.save);
router.delete('/delete/:id', controller.delete);

module.exports = router;