'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { useAppDispatch, useAppSelector } from "../hooks/redux"
// import { loginUser, clearError } from "../store/authSlice"

const SignInPage: React.FC = () => {
	//   const dispatch = useAppDispatch()
	// const navigate = useNavigate();
	//   const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth)

	//TODO
	// Authentication, isLoading
	// REMOVE THIS FOR REFACTORING
	const [isLoading, setIsLoading] = useState(false);

	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	//   useEffect(() => {
	//     if (isAuthenticated) {
	//       navigate("/")
	//     }
	//   }, [isAuthenticated, navigate])

	//   useEffect(() => {
	//     return () => {
	//       dispatch(clearError())
	//     }
	//   }, [dispatch])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log('clicked handle submit:', e.target);
		// dispatch(loginUser(formData))
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Sign in to your account
					</h2>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					{/* {error && (
						<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
							{error}
						</div>
					)} */}
					<div className="space-y-4">
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700"
							>
								Email Address
							</label>
							<input
								id="email"
								name="email"
								type="email"
								required
								value={formData.email}
								onChange={handleChange}
								className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
								placeholder="Enter your email"
							/>
						</div>
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700"
							>
								Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								required
								value={formData.password}
								onChange={handleChange}
								className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
								placeholder="Enter your password"
							/>
						</div>
					</div>

					<div>
						<button
							type="submit"
							// disabled={isLoading}
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
						>
							{isLoading ? 'Signing in...' : 'Sign in'}
						</button>
					</div>

					<div className="text-center">
						<span className="text-sm text-gray-600">
							Don't have an account? {/* MAKE THIS A LINK */}
							<p
								// to="/register"
								className="font-medium text-blue-600 hover:text-blue-500"
							>
								Sign up
							</p>
						</span>
					</div>
				</form>
			</div>
		</div>
	);
};

export default SignInPage;
