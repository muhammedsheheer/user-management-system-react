import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin } from "../../slices/authSlice";
import { useLocation, useNavigate } from "react-router-dom";

const AdminLogin = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({ email: "", password: "" });
	const dispatch = useDispatch();
	const location = useLocation();
	const { adminInfo, error, loading } = useSelector((state) => state.auth);

	useEffect(() => {
		if (!adminInfo) {
			navigate("/admin/login");
		} else if (adminInfo) {
			const redirectTo = location.state?.from || "/admin/dashboard";
			navigate(redirectTo, { replace: true });
		}
	}, [adminInfo, navigate, location.state?.from]);

	const validate = () => {
		const errors = {};

		const trimmedEmail = email.trim();
		const trimmedPassword = password.trim();

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

	const handleLogin = (e) => {
		e.preventDefault();

		const validationErrors = validate();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
		} else {
			dispatch(adminLogin({ email, password }));
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
			<div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
				<h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
				{error && <p>{error}</p>}
				<form onSubmit={handleLogin}>
					<div className="mb-4">
						<label className="block text-gray-700 mb-2">Email</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className={`w-full p-3 border ${
								errors.email ? "border-red-500" : "border-gray-300"
							} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
						/>
						{errors.email && (
							<p className="text-red-500 text-sm mt-1">{errors.email}</p>
						)}
					</div>
					<div className="mb-4">
						<label className="block text-gray-700 mb-2">Password</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className={`w-full p-3 border ${
								errors.password ? "border-red-500" : "border-gray-300"
							} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
						/>
						{errors.password && (
							<p className="text-red-500 text-sm mt-1">{errors.password}</p>
						)}
					</div>
					<button
						type="submit"
						className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
						disabled={loading}
					>
						{loading ? "Loading..." : "Login"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default AdminLogin;
