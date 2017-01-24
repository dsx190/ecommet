'use strict';

const express = require('express'),
	router = express.Router(),
	cms = require('./cms'),
	customer = require('./customer');

router.use('/', cms);
router.use('/customer', customer);

module.exports = router;