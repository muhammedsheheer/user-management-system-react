import axios from "axios";

const authMiddleware = (store) => (next) => (action) => {
	const state = store.getState();
	const token = state.auth.userInfo?.token;

	if (token) {
		axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	} else {
		delete axios.defaults.headers.common["Authorization"];
	}

	return next(action);
};

export default authMiddleware;
