'use strict';

const express = require('express'),
	router = express.Router(),
	access = require('./middleware').access,
	controller = require('../../lib/controllers/admin/permission');

router.get('/', access, controller.index);
router.get('/edit/:id?', access, controller.edit);
router.post('/save/:id?', access, controller.save);
router.get('/delete/:id', access, controller.delete);

module.exports = router;