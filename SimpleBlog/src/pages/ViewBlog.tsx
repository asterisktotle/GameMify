import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import type { BlogTypes } from '../types/Interfaces';
import { supabase } from '../supabase-client';
import { FaArrowLeft, FaRegEdit } from 'react-icons/fa';
import { MdDeleteOutline } from 'react-icons/md';
const ViewBlog: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const location = useLocation();
	const navigate = useNavigate();

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const [currentBlog, setCurrentBlog] = useState<BlogTypes | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);

	const handleDelete = async (id: number) => {
		const { error } = await supabase.from('Blogs').delete().eq('id', id);

		if (error) {
			console.log('cannot delete: ', error.message);
		} else {
			console.log('Deleted successfully');
			setTimeout(() => navigate('/'), 3000);
		}
	};

	const [isAuthenticated, setIsAuthenticated] = useState(true);

	useEffect(() => {
		const loadBlogContent = async () => {
			try {
				const blogContent = location.state?.currentBlog;

				if (blogContent && blogContent.id == id) {
					setCurrentBlog(blogContent);
					setIsLoading(false);
					console.log('View location triggered: ', location.state);
					return;
				}

				if (id) {
					const { data: blogData, error: fetchError } = await supabase
						.from('Blogs')
						.select('*')
						.eq('id', id)
						.single();

					if (fetchError) {
						console.error('Error fetching blogs: ', fetchError.message);
						setIsError(true);
						return;
					} else {
						setCurrentBlog(blogData);
					}
				}
			} catch (error) {
				console.error('Unexpected error fetching: ', error);
				setIsError(true);
			} finally {
				setIsLoading(false);
			}
		};

		loadBlogContent();
	}, [id, location.state]);

	return (
		<div className="px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
				{/* Navigation */}
				<nav className="my-3">
					<Link
						to="/"
						className="inline-flex items-center text-md font-medium text-gray-500 hover:text-gray-700 gap-2.5"
					>
						<FaArrowLeft />
						Back to all blogs
					</Link>
				</nav>

				{/* Blog Header */}
				<header className="mb-8">
					<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
						{currentBlog?.title}
					</h1>

					<div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-gray-200">
						<div className="flex items-center space-x-4">
							<div className="flex-shrink-0">
								<div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
									<span className="text-sm font-medium text-gray-700">
										{currentBlog?.author.charAt(0).toUpperCase()}
									</span>
								</div>
							</div>
							<div>
								<p className="text-sm font-medium text-gray-900">
									{currentBlog?.author}
								</p>
								<div className="flex items-center text-sm text-gray-500 space-x-4">
									<time dateTime={currentBlog?.created_at}>
										Published {formatDate(currentBlog?.created_at)}
									</time>
									{currentBlog?.updated_at !== currentBlog?.created_at && (
										<time dateTime={currentBlog?.updated_at}>
											Updated {formatDate(currentBlog?.updated_at)}
										</time>
									)}
								</div>
							</div>
						</div>

						{/* Action buttons for authenticated users */}
						{isAuthenticated && (
							<div className="flex items-center space-x-3">
								<Link
									to={`/blogs/edit/${currentBlog?.id}`}
									state={{ currentBlog }}
									className="inline-flex gap-1 items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
								>
									<FaRegEdit />
									Edit
								</Link>
								<button
									onClick={() => handleDelete}
									className="inline-flex items-center gap-1 px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
								>
									<MdDeleteOutline />
									Delete
								</button>
							</div>
						)}
					</div>
				</header>

				{/* Blog Content */}
				<article className="prose prose-lg max-w-none">
					{/* Excerpt */}
					<div className="text-xl text-gray-600 font-medium mb-8 pb-8 border-b border-gray-200 italic">
						{currentBlog?.excerpt}
					</div>

					{/* Main Content */}
					<div className="text-gray-900 leading-relaxed whitespace-pre-wrap">
						{currentBlog?.content}
					</div>
				</article>

				{/* Related Actions */}
				{/* <div className="mt-8 bg-gray-50 rounded-lg p-6">
					<h3 className="text-lg font-medium text-gray-900 mb-4">
						What's next?
					</h3>
					<div className="flex flex-wrap gap-4">
						<Link
							to="/"
							className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
						>
							Browse more posts
						</Link>
						{isAuthenticated && (
							<Link
								to="/create"
								className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
							>
								Write a new post
							</Link>
						)}
					</div>
				</div> */}
			</div>
		</div>
	);
};

export default ViewBlog;
