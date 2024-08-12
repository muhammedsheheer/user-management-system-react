import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const AdminRoute = () => {
	const adminInfo = useSelector((state) => state.auth.adminInfo);
	const location = useLocation();

	if (
		adminInfo &&
		adminInfo.isAdmin &&
		adminInfo.accessToken &&
		adminInfo.refreshToken
	) {
		return <Outlet />;
	}

	return <Navigate to="/admin/login" state={{ from: location }} replace />;
};

export default AdminRoute;
