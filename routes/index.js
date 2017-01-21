'use strict';

const express = require('express'),
	router = express.Router(),
	cms = require('./cms');

router.use('/', cms);

module.exports = router;