import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase-client';
import { Link } from 'react-router-dom';
import type { BlogTypes } from '../types/Interfaces';
import { useAppDispatch, useAppSelector } from '../types/hookType';

const BlogsPage = () => {
	const [blogs, setBlogs] = useState<BlogTypes[]>([]);
	// const [isAuthenticated, setIsAuthenticated] = useState(true);
	// const [userProfile, setUserProfile] = useState({});
	const [errorMessage, setErrorMessage] = useState('');

	const userProfile = useAppSelector((state) => state.auth.user);

	const fetchBlogs = async () => {
		const { error, data } = await supabase.from('Blogs').select('*');

		if (error) {
			setErrorMessage(error.message);
			return;
		} else {
			setBlogs(data);

			return;
		}
	};

	const handleDelete = async (id: number) => {
		const { error } = await supabase.from('Blogs').delete().eq('id', id);

		if (error) {
			console.log('cannot delete: ', error.message);
		} else {
			setBlogs((prev) => prev.filter((blog) => blog.id !== id));
		}
	};

	useEffect(() => {
		fetchBlogs();
		console.log(userProfile);
	}, []);

	return (
		<div className="px-4 sm:px-6 lg:px-8">
			<div className="sm:flex sm:items-center">
				{errorMessage && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
						{errorMessage}
					</div>
				)}
				<div className="sm:flex-auto">
					<h1 className="text-2xl font-semibold text-gray-900">All Blogs</h1>
					<p className="mt-2 text-sm text-gray-700">
						A list of all blog posts including their title, author, and publish
						date.
					</p>
				</div>
				{userProfile?.user_metadata.email_verified && (
					<div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
						<Link
							to="/blogs/create"
							className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
						>
							Create New Blog
						</Link>
					</div>
				)}
			</div>

			<div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
				{blogs.map((post) => (
					<div
						key={post.id}
						className="bg-white overflow-hidden shadow rounded-lg"
					>
						<div className="px-4 py-5 sm:p-6">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-medium text-gray-900 truncate">
									<Link to={`/blogs/${post.id}`} state={{ currentBlog: post }}>
										{post.title}
									</Link>
								</h3>
							</div>
							<p className="mt-2 text-sm text-gray-600 line-clamp-3">
								{post.excerpt}
							</p>

							<div className="mt-4 flex items-center justify-between text-sm text-gray-500">
								<div>
									<p>By {post.author}</p>
									<p>{new Date(post.created_at).toLocaleDateString()}</p>
								</div>
								{userProfile?.user_metadata.email_verified && (
									<div className="flex space-x-2">
										{userProfile.id === post.author_id && (
											<Link
												to={`/blogs/edit/${post.id}`}
												state={{ currentBlog: post }}
												className="text-blue-600 hover:text-blue-900"
											>
												Edit
											</Link>
										)}

										<button
											onClick={() => handleDelete(post.id)}
											className="text-red-600 hover:text-red-900"
										>
											Delete
										</button>
									</div>
								)}
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Pagination */}
			{/* {pagination.totalPages > 1 && (
				<div className="mt-8 flex items-center justify-between">
					<div className="flex-1 flex justify-between sm:hidden">
						<button
							onClick={() => handlePageChange(pagination.currentPage - 1)}
							disabled={pagination.currentPage === 1}
							className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
						>
							Previous
						</button>
						<button
							onClick={() => handlePageChange(pagination.currentPage + 1)}
							disabled={pagination.currentPage === pagination.totalPages}
							className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
						>
							Next
						</button>
					</div>
					<div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
						<div>
							<p className="text-sm text-gray-700">
								Showing{' '}
								<span className="font-medium">
									{(pagination.currentPage - 1) * pagination.limit + 1}
								</span>{' '}
								to{' '}
								<span className="font-medium">
									{Math.min(
										pagination.currentPage * pagination.limit,
										pagination.totalBlogs
									)}
								</span>{' '}
								of <span className="font-medium">{pagination.totalBlogs}</span>{' '}
								results
							</p>
						</div>
						<div>
							<nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
								<button
									onClick={() => handlePageChange(pagination.currentPage - 1)}
									disabled={pagination.currentPage === 1}
									className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
								>
									Previous
								</button>
								{Array.from(
									{ length: pagination.totalPages },
									(_, i) => i + 1
								).map((page) => (
									<button
										key={page}
										onClick={() => handlePageChange(page)}
										className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
											page === pagination.currentPage
												? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
												: 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
										}`}
									>
										{page}
									</button>
								))}
								<button
									onClick={() => handlePageChange(pagination.currentPage + 1)}
									disabled={pagination.currentPage === pagination.totalPages}
									className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
								>
									Next
								</button>
							</nav>
						</div>
					</div>
				</div>
			)} */}
		</div>
	);
};

export default BlogsPage;
