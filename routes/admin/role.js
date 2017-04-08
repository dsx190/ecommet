'use strict';

const express = require('express'),
	router = express.Router(),
	access = require('./middleware').access,
	controller = require('../../lib/controllers/admin/role');

router.get('/', access, controller.index);
router.get('/edit/:id?', controller.edit);
router.post('/save/:id?', controller.save);
router.get('/delete/:id', controller.delete);

module.exports = router;