'use strict';

const express = require('express'),
	router = express.Router(),
	sets = require('../../lib/controllers/admin/attributeSet');

router.get('/attributeSets', sets.index);

module.exports = router;