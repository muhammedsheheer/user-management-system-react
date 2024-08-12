import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const UserRoute = () => {
	const userInfo = useSelector((state) => state.auth.userInfo);
	const location = useLocation();

	if (
		userInfo &&
		userInfo.isAdmin === false &&
		userInfo.accessToken &&
		userInfo.refreshToken
	) {
		return <Outlet />;
	}

	return <Navigate to="/" state={{ from: location }} replace />;
};

export default UserRoute;
