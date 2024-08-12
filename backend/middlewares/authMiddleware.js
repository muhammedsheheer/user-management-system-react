const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const protect = async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			token = req.headers.authorization.split(" ")[1];
			const decode = jwt.verify(token, process.env.JWT_SECRET);
			req.user = await User.findById(decode.id).select("-password");
			next();
		} catch (error) {
			res.status(401);
			throw new Error("Not authorised ,token faild");
		}
	}

	if (!token) {
		res.status(401);
		throw new Error("Not authorised ,no token ");
	}
};

const admin = async (req, res, next) => {
	if (req.user && req.user.isAdmin) {
		next();
	} else {
		req.status(401);
		throw new Error("Not authorised as an admin");
	}
};

module.exports = { protect, admin };
