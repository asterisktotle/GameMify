import {
	Navigate,
	Route,
	BrowserRouter as Router,
	Routes,
} from 'react-router-dom';
import './App.css';
import BlogsPage from './pages/BlogsPage';

import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ViewBlog from './pages/ViewBlog';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

function App() {
	return (
		<>
			<Router>
				<main className="main-content">
					{/* PUBLIC ROUTES */}
					<Routes>
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

						{/* AUTHENTICATED ROUTES */}

						<Route
							path="/blogs"
							element={
								// ADD <ProtectedRoute>
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

						{/* 404 */}
						<Route path="*" element={<div>404: Page not found </div>} />
					</Routes>
				</main>
			</Router>
		</>
	);
}

export default App;
