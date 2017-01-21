'use strict';

const express = require('express'),
	router = express.Router(),
	CmsController = require('../lib/controllers/cms'),
	controller = new CmsController();

router.get('/', controller.home);

module.exports = router;