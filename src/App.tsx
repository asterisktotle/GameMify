import {
	Navigate,
	Route,
	BrowserRouter as Router,
	Routes,
} from 'react-router-dom';
import './App.css';
import BlogsPage from './pages/BlogsPage';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { checkAuth } from './store/authSlice';

import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ViewBlog from './pages/ViewBlog';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

function App() {
	const dispatch = useAppDispatch();
	const { isAuthenticated } = useAppSelector((state) => state.auth);

	useEffect(() => {
		dispatch(checkAuth());
	}, [dispatch]);

	console.log('Current auth state:', isAuthenticated); // Debug log

	return (
		<>
			<Router basename="/GameMify">
				<main className="main-content">
					<Routes>
						{/* Public Routes */}
						<Route
							path="/signin"
							element={
								<PublicRoute>
									<SignInPage />
								</PublicRoute>
							}
						/>
						<Route
							path="/signup"
							element={
								<PublicRoute>
									<SignUpPage />
								</PublicRoute>
							}
						/>

						{/* Protected Routes */}
						<Route
							path="/blogs"
							element={
								<ProtectedRoute>
									<BlogsPage />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/blogs/edit/:id"
							element={
								<ProtectedRoute>
									<EditBlog />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/blogs/create"
							element={
								<ProtectedRoute>
									<CreateBlog />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/blogs/:id"
							element={
								<ProtectedRoute>
									<ViewBlog />
								</ProtectedRoute>
							}
						/>

						{/* Default redirect */}
						<Route
							path="/"
							element={
								<ProtectedRoute>
									<Navigate to="/blogs" replace />
								</ProtectedRoute>
							}
						/>

						{/* 404 - Must be last */}
						<Route path="*" element={<Navigate to="/signin" replace />} />
					</Routes>
				</main>
			</Router>
		</>
	);
}

export default App;
