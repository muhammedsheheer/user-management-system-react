import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUserProfile, fetchUserProfile } from "../../slices/userSlice";
import { logout } from "../../slices/authSlice";

const UserProfile = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user, loading, error } = useSelector((state) => state.user);
	useEffect(() => {
		dispatch(fetchUserProfile());
	}, [dispatch]);

	const [name, setName] = useState(user?.name || "");
	const [email, setEmail] = useState(user?.email || "");
	const [previewImage, setPreview] = useState(user?.profileImage?.data ?? null);
	const [image, setImage] = useState(null);

	useEffect(() => {
		if (user) {
			setName(user.name);
			setEmail(user.email);
			setPreview(
				`data:${user?.profileImage?.contentType};base64,${user?.profileImage?.data}` ??
					null
			);
		}
	}, [user]);

	const handleLogout = () => {
		dispatch(logout()).then(() => {
			navigate("/");
		});
	};

	const handleUpdateProfile = (e) => {
		e.preventDefault();
		const userData = {
			name,
			email,
		};
		dispatch(updateUserProfile({ userData, image }));
		window.location.reload();
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		console.log(file);
		setImage(file);
		setPreview(null);
	};

	return (
		<div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
			<h1 className="text-3xl font-bold mb-6">User Profile</h1>
			<div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
				<div className="flex flex-col items-center mb-6">
					<img
						src={
							previewImage
								? previewImage
								: image
								? URL.createObjectURL(image)
								: ""
						}
						alt="Profile"
						className="w-32 h-32 rounded-full object-cover mb-4"
					/>
					<input
						type="file"
						className="mb-4"
						accept="image/*"
						onChange={handleFileChange}
					/>
				</div>
				<div className="mb-4">
					<label className="block text-gray-700 mb-2">Name</label>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
					/>
				</div>
				<div className="mb-4">
					<label className="block text-gray-700 mb-2">Email</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
					/>
				</div>
				<button
					onClick={handleUpdateProfile}
					className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
				>
					Update Profile
				</button>
				<button
					onClick={handleLogout}
					className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
				>
					Logout
				</button>
			</div>
		</div>
	);
};

export default UserProfile;
