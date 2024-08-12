const mongoose = require("mongoose");

const mongodb = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Database connected");
	} catch (error) {
		console.log(`Error: ${error.message}`);
	}
};

module.exports = mongodb;
