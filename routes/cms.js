'use strict';

const express = require('express'),
	router = express.Router(),
	controller = require('../lib/controllers/cms');

router.get('/', controller.home);

module.exports = router;