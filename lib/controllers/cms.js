'use strict';

module.exports = class CmsController {

	static home(req, res) {
		res.render('cms/home');
	}
}