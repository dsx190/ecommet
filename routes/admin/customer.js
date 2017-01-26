'use strict';

const express = require('express'),
	router = express.Router(),
	controller = require('../../lib/controllers/admin/customer');

router.get('/', controller.index);

module.exports = router;