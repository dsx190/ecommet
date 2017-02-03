'use strict';

const path = require('path'),
	basePath = path.join(__dirname, '../../public'),
	multer = require('multer'),
	_ = require('lodash'),
	fs = require('fs');

class Files {

	/**
	 * Declare a multer uploader, defining its storage properties.
	 *
	 */
	constructor() {
		let storage = multer.diskStorage({
			destination(req, file, cb) {
				let filesPath = path.join(__dirname, '../../public/img/catalog');
				cb(null, filesPath);
			},
			filename(req, file, cb) {
				let random = _.random(10000000000);
				cb(null, `${Date.now()}-${random}.${file.mimetype.split('/')[1]}`);
			}
		});
		this._upload = multer({
			storage,
			fileFilter(req, file, cb) { // Allow only images
				let allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
				cb(null, (allowedTypes.indexOf(file.mimetype) != -1));
			}
		});
	}

	/**
	 * Access the upload object easily
	 */
	get upload() {
		return this._upload;
	}

	/**
	 * Utility for getting the filenames from the request.
	 *
	 * @param {Object} req - The request object
	 * @param {string} key - For the files fieldname
	 * @param {Array} gallery
	 * @returns {Array}
	 */
	getGallery(req, key, gallery) {
		gallery = gallery || [];
		// Add filenames to the gallery array
		_.forEach(req.files, file => {
			if (file.fieldname === key) {
				gallery.push(`/img/catalog/${file.filename}`);
			}
		});
		// Remove filenames from the gallery array and from the filesystem
		if (req.body[key]) {
			req.body[key].forEach(filePath => fs.unlinkSync(`${basePath}${filePath}`));
			_.pullAll(gallery, req.body[key]); // Remove files
		}
		return gallery;
	}
}

module.exports = new Files();