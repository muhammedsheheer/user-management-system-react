import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import userReducer from "../slices/userSlice";
import authMiddleware from "../../middleware/authMiddleware";

const store = configureStore({
	reducer: {
		auth: authReducer,
		user: userReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(authMiddleware),
});

export default store;
