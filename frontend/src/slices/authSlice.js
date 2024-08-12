import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
	userInfo: JSON.parse(localStorage.getItem("userInfo")) || null,
	adminInfo: JSON.parse(localStorage.getItem("adminInfo")) || null,
	loading: false,
	error: null,
};

export const login = createAsyncThunk(
	"user/login",
	async (userdata, { rejectWithValue }) => {
		try {
			const { data } = await axios.post(
				"http://localhost:5000/api/user/login",
				userdata
			);
			localStorage.setItem("userInfo", JSON.stringify(data));
			return data;
		} catch (error) {
			return rejectWithValue(error.response.data.messsage);
		}
	}
);

export const register = createAsyncThunk(
	"user/register",
	async (userdata, { rejectWithValue }) => {
		try {
			const { data } = await axios.post(
				"http://localhost:5000/api/user/register",
				userdata
			);
			localStorage.setItem("userInfo", JSON.stringify(data));
			return data;
		} catch (error) {
			return rejectWithValue(error.response.data.message);
		}
	}
);

export const logout = createAsyncThunk("user/logout", async () => {
	localStorage.removeItem("userInfo");
});

export const adminLogin = createAsyncThunk(
	"admin/adminLogin",
	async (adminData, { rejectWithValue }) => {
		try {
			const { data } = await axios.post(
				"http://localhost:5000/api/admin/login",
				adminData
			);
			localStorage.setItem("adminInfo", JSON.stringify(data));
			return data;
		} catch (error) {
			return rejectWithValue(error.response.data.message);
		}
	}
);

export const adminLogout = createAsyncThunk("admin/adminLogout", async () => {
	localStorage.removeItem("adminInfo");
	return null;
});

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(login.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(login.fulfilled, (state, { payload }) => {
				state.loading = false;
				state.userInfo = payload;
			})
			.addCase(login.rejected, (state, { payload }) => {
				state.loading = false;
				state.error = payload;
			})
			.addCase(register.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(register.fulfilled, (state, { payload }) => {
				state.loading = false;
				state.userInfo = payload;
			})
			.addCase(register.rejected, (state, { payload }) => {
				state.loading = false;
				state.error = payload;
			})
			.addCase(logout.fulfilled, (state) => {
				state.userInfo = null;
			})
			.addCase(adminLogin.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(adminLogin.fulfilled, (state, { payload }) => {
				state.loading = false;
				state.adminInfo = payload;
			})
			.addCase(adminLogin.rejected, (state, { payload }) => {
				state.loading = false;
				state.error = payload;
			})

			.addCase(adminLogout.fulfilled, (state) => {
				state.adminInfo = null;
			});
	},
});

export default authSlice.reducer;
