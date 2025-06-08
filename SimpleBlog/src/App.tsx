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

function App() {
	return (
		<>
			<Router>
				<main className="main-content">
					{/* PUBLIC ROUTES */}
					<Routes>
						<Route path="/signin" element={<SignInPage />} />
						<Route path="/signup" element={<SignUpPage />} />

						{/* AUTHENTICATED ROUTES */}
						<Route
							path="/blogs"
							element={
								// ADD <ProtectedRoute>
								<BlogsPage />
							}
						/>
						<Route
							path="/blogs/edit/:id"
							element={
								// ADD <ProtectedRoute>
								<EditBlog />
							}
						/>
						<Route
							path="/blogs/create"
							element={
								// ADD <ProtectedRoute>
								<CreateBlog />
							}
						/>

						{/* Default redirect */}
						<Route path="/" element={<Navigate to="/blogs" replace />} />

						{/* 404 */}
						<Route path="*" element={<div>404: Page not found </div>} />
					</Routes>
				</main>
			</Router>
		</>
	);
}

export default App;
