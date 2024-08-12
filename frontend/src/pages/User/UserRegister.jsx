import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";

const UserRegister = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({});

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { userInfo, loading, error } = useSelector((state) => state.auth);

	const validate = () => {
		const errors = {};

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

		if (!trimmedPassword) {
			errors.password = "Password is required";
		} else if (trimmedPassword.length < 6) {
			errors.password = "Password must be at least 6 characters";
		} else if (
			!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}/.test(trimmedPassword)
		) {
			errors.password =
				"Password must include at least one uppercase letter, one lowercase letter, and one number";
		}

		return errors;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const validationErrors = validate();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
		} else {
			dispatch(register({ name, email, password }));
		}
	};

	useEffect(() => {
		if (userInfo) {
			navigate("/");
		}
	});

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
				<h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
				{error && <p>{error}</p>}
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label htmlFor="name" className="block text-gray-700 mb-2">
							Name
						</label>
						<input
							type="text"
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						{errors.name && (
							<p className="text-red-500 text-sm">{errors.name}</p>
						)}
					</div>
					<div className="mb-4">
						<label htmlFor="email" className="block text-gray-700 mb-2">
							Email
						</label>
						<input
							type="email"
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						{errors.email && (
							<p className="text-red-500 text-sm">{errors.email}</p>
						)}
					</div>
					<div className="mb-6">
						<label htmlFor="password" className="block text-gray-700 mb-2">
							Password
						</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						{errors.password && (
							<p className="text-red-500 text-sm">{errors.password}</p>
						)}
					</div>
					<button
						type="submit"
						className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						{loading ? "Loading...." : "Register"}
					</button>
				</form>
				<div className="mt-4 text-center">
					<p className="text-gray-600">
						Already have an account?
						<Link to="/" className="text-blue-500 hover:underline ml-1">
							Login
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default UserRegister;
