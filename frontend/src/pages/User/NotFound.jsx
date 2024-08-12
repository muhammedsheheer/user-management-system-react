import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
			<div className="text-center">
				<h1 className="text-9xl font-extrabold text-gray-300">404</h1>
				<p className="text-2xl font-semibold text-gray-800 mt-4">
					Page Not Found
				</p>
				<p className="text-lg text-gray-600 mt-2">
					The page you are looking for doesn't exist or has been moved.
				</p>
				<Link
					to="/"
					className="mt-6 inline-block bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					Go to Homepage
				</Link>
			</div>
		</div>
	);
};

export default NotFound;
