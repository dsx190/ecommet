'use strict';

const CoreController = require('./core');

module.exports = class CmsController extends CoreController {

	home(req, res) {
		super.render(res, 'cms/home');
	}
}