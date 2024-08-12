import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	createUser,
	updateUser,
	fetchUsers,
	deleteUser,
} from "../../slices/userSlice";
import { adminLogout } from "../../slices/authSlice";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
	const dispatch = useDispatch();
	const { users, loading, error } = useSelector((state) => state.user);
	const [form, setForm] = useState({ name: "", email: "", password: "" });
	const [editingUser, setEditingUser] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [formErrors, setFormErrors] = useState({});

	const navigate = useNavigate();

	useEffect(() => {
		dispatch(fetchUsers());
	}, [dispatch]);

	const validate = () => {
		const errors = {};
		const { name, email, password } = form;
		const trimmedName = name.trim();
		const trimmedEmail = email.trim();
		const trimmedPassword = password.trim();

		if (!trimmedName) {
			errors.name = "Name is required";
		} else if (trimmedName.length < 2) {
			errors.name = "Name must be at least 2 characters long";
		}

		if (!trimmedEmail) {
			errors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
			errors.email = "Email address is invalid";
		}

		if (!trimmedPassword && !editingUser) {
			errors.password = "Password is required";
		} else if (trimmedPassword.length < 6 && !editingUser) {
			errors.password = "Password must be at least 6 characters";
		} else if (
			trimmedPassword &&
			!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}/.test(trimmedPassword)
		) {
			errors.password =
				"Password must include at least one uppercase letter, one lowercase letter, and one number";
		}

		return errors;
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setForm((prevForm) => ({ ...prevForm, [name]: value }));
	};

	const handleCreateUser = () => {
		const errors = validate();
		if (Object.keys(errors).length === 0) {
			dispatch(createUser(form));
			setForm({ name: "", email: "", password: "" });
			setFormErrors({});
			window.location.reload();
		} else {
			setFormErrors(errors);
		}
	};

	const handleUpdateUser = () => {
		const errors = validate();
		if (Object.keys(errors).length === 0 && editingUser) {
			dispatch(updateUser({ ...form, id: editingUser._id }));
			setEditingUser(null);
			setForm({ name: "", email: "", password: "" });
			setFormErrors({});
			window.location.reload();
		} else {
			setFormErrors(errors);
		}
	};

	const handleEditUser = (user) => {
		setEditingUser(user);
		setForm({ name: user.name, email: user.email, password: "" });
		setFormErrors({});
	};

	const handleDeleteUser = (userId) => {
		dispatch(deleteUser(userId));
	};

	const handleLogout = () => {
		dispatch(adminLogout()).then(() => {
			navigate("/admin/login");
		});
	};

	const filteredUsers = users.filter(
		(user) =>
			user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.email.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
			<h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
			<div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg mb-6">
				<h2 className="text-2xl font-bold mb-4">
					{editingUser ? "Edit User" : "Create User"}
				</h2>
				<div className="mb-4">
					<label className="block text-gray-700 mb-2">Name</label>
					<input
						type="text"
						name="name"
						value={form.name}
						onChange={handleInputChange}
						className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
					{formErrors.name && <p className="text-red-500">{formErrors.name}</p>}
				</div>
				<div className="mb-4">
					<label className="block text-gray-700 mb-2">Email</label>
					<input
						type="email"
						name="email"
						value={form.email}
						onChange={handleInputChange}
						className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
					{formErrors.email && (
						<p className="text-red-500">{formErrors.email}</p>
					)}
				</div>
				{!editingUser && (
					<div className="mb-4">
						<label className="block text-gray-700 mb-2">Password</label>
						<input
							type="password"
							name="password"
							value={form.password}
							onChange={handleInputChange}
							className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
						{formErrors.password && (
							<p className="text-red-500">{formErrors.password}</p>
						)}
					</div>
				)}
				<button
					onClick={editingUser ? handleUpdateUser : handleCreateUser}
					className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					{editingUser ? "Update User" : "Create User"}
				</button>
			</div>
			<div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg mb-6">
				<h2 className="text-2xl font-bold mb-4">User List</h2>
				<div className="mb-4">
					<label className="block text-gray-700 mb-2">Search</label>
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Search by name or email"
					/>
				</div>
				{loading ? (
					<p>Loading...</p>
				) : error ? (
					<p className="text-red-500">{error}</p>
				) : (
					<table className="w-full text-left table-auto">
						<thead>
							<tr>
								<th className="px-4 py-2 border-b">ID</th>
								<th className="px-4 py-2 border-b">Name</th>
								<th className="px-4 py-2 border-b">Email</th>
								<th className="px-4 py-2 border-b">Actions</th>
							</tr>
						</thead>
						<tbody>
							{filteredUsers.length ? (
								filteredUsers.map((user) => (
									<tr key={user._id}>
										<td className="px-4 py-2 border-b">{user._id}</td>
										<td className="px-4 py-2 border-b">{user.name}</td>
										<td className="px-4 py-2 border-b">{user.email}</td>
										<td className="px-4 py-2 border-b">
											<button
												onClick={() => handleEditUser(user)}
												className="bg-yellow-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
											>
												Edit
											</button>
											<button
												onClick={() => handleDeleteUser(user._id)}
												className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
											>
												Delete
											</button>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan="4"
										className="px-4 py-2 border-b text-center text-gray-500"
									>
										No users found
									</td>
								</tr>
							)}
						</tbody>
					</table>
				)}
			</div>
			<button
				onClick={handleLogout}
				className="w-full max-w-md bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
			>
				Logout
			</button>
		</div>
	);
};

export default AdminDashboard;
