const express = require("express");
const {
	authUser,
	registerUser,
	logoutUser,
	getUserProfile,
	updateUserProfile,
	addImage,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../utils/upload");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", authUser);
router.post("/logout", logoutUser);
router
	.route("/profile")
	.get(protect, getUserProfile)
	.put(protect, upload.single("image"), updateUserProfile);
module.exports = router;
