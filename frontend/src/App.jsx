import { Routes, Route } from "react-router-dom";
import UserLogin from "./pages/User/UserLogin";
import UserRegister from "./pages/User/UserRegister";
import UserProfile from "./pages/User/UserProfile";
import AdminLogin from "./pages/Admin/AdminLogin";
import Dashboard from "./pages/Admin/Dashboard";
import { Provider } from "react-redux";
import store from "./store/store";
import UserRoute from "./UserRoute";
import AdminRoute from "./AdminRoute";
import NotFound from "./pages/User/NotFound";

function App() {
	return (
		<>
			<Provider store={store}>
				<Routes>
					<Route path="/" element={<UserLogin />} />
					<Route path="/register" element={<UserRegister />} />
					<Route element={<UserRoute></UserRoute>}>
						<Route path="/profile" element={<UserProfile />} />
					</Route>
					<Route path="/admin/login" element={<AdminLogin />} />
					<Route element={<AdminRoute></AdminRoute>}>
						<Route path="/admin/dashboard" element={<Dashboard />} />
					</Route>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Provider>
		</>
	);
}

export default App;
