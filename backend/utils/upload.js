const multer = require("multer");
const path = require("path");

const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fieldSize: 5 * 1024 * 1024,
	},
});

module.exports = upload;
