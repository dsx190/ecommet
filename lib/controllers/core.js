'use strict';

const pug = require('pug');

module.exports = class CoreController {

	render(res, view) {
		res.send(pug.renderFile(`lib/views/${view}.pug`));
	}
}