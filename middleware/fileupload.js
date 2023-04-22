const multer = require("multer");
const dotenv = require("dotenv");
dotenv.config();

const avatarStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, __dirname + "/../public/avatar");
	},
	filename: function (req, file, cb) {
        const extension = file.mimetype.split("/")[1];
        req.avatar = process.env.IMAGE_DOMAIN + "/avatar/" + req.user.id + "." + extension;
		cb(null, req.user.id + "." + extension);
	},
});

const upload = multer({
	storage: avatarStorage,
	fileFilter: (req, file, cb) => {
		if (file.mimetype.startsWith("image")) {
			cb(null, true);
		} else {
			cb("Please upload only images.", false);
		}
	},
	limits: {
		fileSize: 1024 * 1024 * 10, // limit file size to 10 MB
	},
});

module.exports = { upload };
