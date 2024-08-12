const express = require("express");
const {
	authAdmin,
	createUser,
	getUsers,
	updateUser,
	deleteUser,
	logoutAdmin,
} = require("../controllers/adminController");
const { admin, protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", authAdmin);
router.post("/logout", logoutAdmin);
router
	.route("/users")
	.get(protect, admin, getUsers)
	.post(protect, admin, createUser);
router
	.route("/users/:id")
	.delete(protect, admin, deleteUser)
	.put(protect, admin, updateUser);

module.exports = router;
