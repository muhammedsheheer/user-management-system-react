import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../slices/authSlice";

const UserLogin = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({});

	const dispatch = useDispatch();
	const location = useLocation();
	const { loading, error, userInfo } = useSelector((state) => state.auth);

	useEffect(() => {
		if (!userInfo) {
			navigate("/");
		} else if (userInfo) {
			const redirectTo = location.state?.from || "/profile";
			navigate(redirectTo, { replace: true });
		}
	}, [userInfo, navigate, location.state?.from]);

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

	const handleSubmit = (e) => {
		e.preventDefault();

		const validationErrors = validate();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
		} else {
			dispatch(login({ email, password }));
		}
	};

	return (
		<>
			<div className="min-h-screen flex items-center justify-center bg-gray-100">
				<div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
					<h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
					{error && <p>{error}</p>}
					<form onSubmit={handleSubmit}>
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
							disabled={loading}
						>
							{loading ? "Loading..." : "Login"}
						</button>
					</form>
					<div className="mt-4 text-center">
						<p className="text-gray-600">
							No account?
							<Link
								to="/register"
								className="text-blue-500 hover:underline ml-1"
							>
								Sign up
							</Link>
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default UserLogin;
