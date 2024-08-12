const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const imageSchema = new mongoose.Schema({
	filename: { type: String },
	contentType: { type: String },
	data: { type: Buffer },
});

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		isAdmin: { type: Boolean, default: false },
		profilePic: imageSchema,
	},
	{
		Timestamp: true,
	}
);

userSchema.methods.matchPassword = async function (enterdPassword) {
	return await bcrypt.compare(enterdPassword, this.password);
};

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
