import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
	users: [],
	user: null,
	loading: false,
	error: null,
};

export const fetchUsers = createAsyncThunk(
	"admin/fetchUsers",
	async (_, { getState, rejectWithValue }) => {
		try {
			const { auth } = getState();
			const config = {
				headers: {
					Authorization: `Bearer ${auth.adminInfo.accessToken}`,
				},
			};
			const { data } = await axios.get(
				"http://localhost:5000/api/admin/users",
				config
			);
			return data;
		} catch (error) {
			return rejectWithValue(error.response.data.message);
		}
	}
);

export const fetchUserProfile = createAsyncThunk(
	"user/fetchUserProfile",
	async (_, { getState, rejectWithValue }) => {
		try {
			const { auth } = getState();
			const config = {
				headers: {
					Authorization: `Bearer ${auth.userInfo.accessToken}`,
				},
			};
			const { data } = await axios.get(
				"http://localhost:5000/api/user/profile",
				config
			);
			return data;
		} catch (error) {
			return rejectWithValue(error.response.data.message);
		}
	}
);

export const updateUserProfile = createAsyncThunk(
	"user/updateUserProfile",
	async ({ userData, image }, { getState, rejectWithValue }) => {
		try {
			const { auth } = getState();
			console.log(userData);
			const formData = new FormData();
			formData.append("userData", JSON.stringify(userData));
			if (image) {
				formData.append("image", image);
			}
			const config = {
				headers: {
					Authorization: `Bearer ${auth.userInfo.accessToken}`,
				},
			};
			const { data } = await axios.put(
				"http://localhost:5000/api/user/profile",
				formData,
				config
			);
			return data;
		} catch (error) {
			console.log(error);
			return rejectWithValue(error.response.data.message);
		}
	}
);

export const createUser = createAsyncThunk(
	"admin/createUser",
	async (userData, { getState, rejectWithValue }) => {
		try {
			const { auth } = getState();
			const config = {
				headers: {
					Authorization: `Bearer ${auth.adminInfo.accessToken}`,
				},
			};
			const { data } = await axios.post(
				"http://localhost:5000/api/admin/users",
				userData,
				config
			);
			return data;
		} catch (error) {
			return rejectWithValue(error.response.data.error);
		}
	}
);

export const deleteUser = createAsyncThunk(
	"admin/deleteUser",
	async (userId, { getState, rejectWithValue }) => {
		try {
			const { auth } = getState();
			const config = {
				headers: {
					Authorization: `Bearer ${auth.adminInfo.accessToken}`,
				},
			};
			await axios.delete(
				`http://localhost:5000/api/admin/users/${userId}`,
				config
			);
			return userId;
		} catch (error) {
			return rejectWithValue(error.response.data.message);
		}
	}
);

export const updateUser = createAsyncThunk(
	"admin/updateUser",
	async (userData, { getState, rejectWithValue }) => {
		try {
			const { auth } = getState();
			const config = {
				headers: {
					Authorization: `Bearer ${auth.adminInfo.accessToken}`,
				},
			};
			const { data } = await axios.put(
				`http://localhost:5000/api/admin/users/${userData.id}`,
				userData,
				config
			);
			return data;
		} catch (error) {
			return rejectWithValue(error.response.data.message);
		}
	}
);

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUsers.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchUsers.fulfilled, (state, { payload }) => {
				state.loading = false;
				state.users = payload;
			})
			.addCase(fetchUsers.rejected, (state, { payload }) => {
				state.loading = false;
				state.error = payload;
			})
			.addCase(fetchUserProfile.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchUserProfile.fulfilled, (state, { payload }) => {
				state.loading = false;
				state.user = payload;
			})
			.addCase(fetchUserProfile.rejected, (state, { payload }) => {
				state.loading = false;
				state.error = payload;
			})
			.addCase(updateUserProfile.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateUserProfile.fulfilled, (state, { payload }) => {
				state.loading = false;
				state.user = payload;
			})
			.addCase(updateUserProfile.rejected, (state, { payload }) => {
				state.loading = false;
				state.error = payload;
			})
			.addCase(createUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createUser.fulfilled, (state, { payload }) => {
				state.loading = false;
				state.users.push(payload);
			})
			.addCase(createUser.rejected, (state, { payload }) => {
				state.loading = false;
				state.error = payload;
			})
			.addCase(deleteUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(deleteUser.fulfilled, (state, { payload }) => {
				state.loading = false;
				state.users = state.users.filter((user) => user._id !== payload);
			})
			.addCase(deleteUser.rejected, (state, { payload }) => {
				state.loading = false;
				state.error = payload;
			})
			.addCase(updateUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateUser.fulfilled, (state, { payload }) => {
				state.loading = false;
				const index = state.users.findIndex((user) => user._id === payload._id);
				if (index !== -1) {
					state.users[index] = payload;
				}
			})
			.addCase(updateUser.rejected, (state, { payload }) => {
				state.loading = false;
				state.error = payload;
			});
	},
});

export default userSlice.reducer;
