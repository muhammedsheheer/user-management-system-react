const User = require("../model/userModel");
const {
	generateAccessToken,
	generateRefreshToken,
} = require("../utils/generateToken");

const authAdmin = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (user && (await user.matchPassword(password)) && user.isAdmin) {
			const accessToken = generateAccessToken(user._id);
			const refreshToken = generateRefreshToken(user._id);
			res.json({
				id: user._id,
				name: user.name,
				email: user.email,
				isAdmin: user.isAdmin,
				accessToken,
				refreshToken,
			});
		} else {
			res.status(401).json({ message: "Invalid email or password " });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const logoutAdmin = async (req, res) => {
	try {
		res.json({ message: "Admin logged out" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const createUser = async (req, res) => {
	try {
		const { name, email, password } = req.body;
		const userExist = await User.findOne({ email });

		if (userExist) {
			res.status(400).json({ message: "User already exists" });
			return;
		}
		const user = await User.create({
			name,
			email,
			password,
			profilePic: {
				filename: "",
				contentType: "",
				data: "",
			},
		});
		if (user) {
			res.status(201).json({
				id: user._id,
				name: user.name,
				email: user.email,
			});
		} else {
			res.status(400).json({ message: "Inavalid user data" });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

const getUsers = async (req, res) => {
	try {
		const users = await User.find({ isAdmin: { $ne: true } });
		console.log(users);
		res.json(users);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const updateUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (user) {
			user.name = req.body.name || user.name;
			user.email = req.body.email || user.email;
			const updateUser = await user.save();
			res.json({
				id: updateUser._id,
				name: updateUser.name,
				email: updateUser.email,
			});
		} else {
			res.status(404).json({ message: "User not found " });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const deleteUser = async (req, res) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);
		if (user) {
			res.json({ message: "User deleted" });
		} else {
			res.status(401).json({ message: "User not found" });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	authAdmin,
	logoutAdmin,
	createUser,
	getUsers,
	updateUser,
	deleteUser,
};
