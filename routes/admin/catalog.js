'use strict';

const express = require('express'),
	router = express.Router(),
	attributeCtrl = require('../../lib/controllers/admin/attribute'),
	attributeSetCtrl = require('../../lib/controllers/admin/attributeSet');

router.get('/attributes/', attributeCtrl.index);
router.get('/attributes/edit/:id?', attributeCtrl.edit);
router.post('/attributes/save/:id?', attributeCtrl.save);
router.get('/attributes/delete/:id', attributeCtrl.delete);

/*router.get('/attributeSets/', attributeSetCtrl.index);
router.get('/attributeSets/edit/:id?', attributeSetCtrl.edit);
router.post('/attributeSets/save/:id?', attributeSetCtrl.save);
router.get('/attributeSets/delete/:id', attributeSetCtrl.delete);*/

module.exports = router;