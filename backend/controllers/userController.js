const User = require("../model/userModel");
const {
	generateAccessToken,
	generateRefreshToken,
} = require("../utils/generateToken");

const registerUser = async (req, res) => {
	try {
		const { name, email, password } = req.body;
		const userExists = await User.findOne({ email });

		if (userExists) {
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
			const accessToken = generateAccessToken(user._id);
			const refreshToken = generateRefreshToken(user._id);

			res.status(201).json({
				id: user._id,
				name: user.name,
				email: user.email,
				isAdmin: user.isAdmin,
				accessToken,
				refreshToken,
			});
		} else {
			res.status(400).json({ message: "Invalid user data" });
		}
	} catch (error) {
		console.log("error");
		res.status(500).json({ message: error.message });
	}
};

const authUser = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (user && (await user.matchPassword(password))) {
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
			console.log("invalid");
			res.status(401).json({ message: "Invalid email or password" });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const logoutUser = async (req, res) => {
	try {
		res.json({ message: "User logged out" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getUserProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		if (user) {
			res.json({
				id: user._id,
				name: user.name,
				email: user.email,
				profileImage: user.profilePic.data
					? {
							filename: user.profilePic.filename,
							contentType: user.profilePic.contentType,
							data: user.profilePic.data.toString("base64"),
					  }
					: null,
				isAdmin: user.isAdmin,
			});
		} else {
			res.status(404).json({ message: "User not found" });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const updateUserProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		if (user) {
			const userData = JSON.parse(req.body.userData);
			user.name = userData.name;
			user.email = userData.email;
			if (req.file) {
				user.profilePic.filename = req.file.originalname;
				user.profilePic.contentType = req.file.mimetype;
				user.profilePic.data = req.file.buffer;
			}
			const updatedUser = await user.save();

			const accessToken = generateAccessToken(updatedUser._id);
			const refreshToken = generateRefreshToken(updatedUser._id);

			res.json({
				_id: updatedUser._id,
				name: updatedUser.name,
				email: updatedUser.email,
				isAdmin: updatedUser.isAdmin,
				accessToken,
				refreshToken,
			});
		} else {
			res.status(404).json({ message: "User not found" });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	authUser,
	registerUser,
	logoutUser,
	getUserProfile,
	updateUserProfile,
};
