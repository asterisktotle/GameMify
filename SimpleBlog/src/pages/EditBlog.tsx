'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabase-client';
// import { useAppDispatch, useAppSelector } from "../hooks/redux"
// import { fetchBlogById, updateBlog, clearCurrentBlog } from "../store/blogSlice"

// import { BlogTypes } from '../types/Interfaces';

const EditBlog: React.FC = () => {
	// const { id } = useParams<{ id: string }>();
	//   const dispatch = useAppDispatch()
	// const navigate = useNavigate();
	//   const { currentBlog, isLoading, error } = useAppSelector((state) => state.blogs)
	// DELETE THIS WHEN REFACTORING

	const [blogForm, setBlogForm] = useState({
		title: '',
		content: '',
		excerpt: '',
	});

	const [isLoading, setIsLoading] = useState(false);
	const [updating, setUpdating] = useState(false);
	const [errorField, setErrorField] = useState({
		title: false,
		content: false,
		excerpt: false,
	});

	const [loading, setLoading] = useState(true);

	const navigate = useNavigate();
	const location = useLocation();
	const { id } = useParams<{ id: string }>(); // get the dynamic parameter

	const fetchBlog = async (id: string) => {
		try {
			const { data: existingBlog, error: fetchError } = await supabase
				.from('Blogs')
				.select('*')
				.eq('id', id)
				.single();

			if (fetchError) {
				console.error('Error fetching blogs: ', fetchError.message);
				return null;
			}

			return existingBlog;
		} catch (error) {
			console.error('Unexpected error: ', error);
			return null;
		}
	};

	useEffect(() => {
		const loadBlogContent = async () => {
			const blogContent = location.state?.blog;

			if (blogContent && blogContent.id === id) {
				setBlogForm({
					title: blogContent.title,
					excerpt: blogContent.excerpt,
					content: blogContent.content,
				});
				setLoading(false);
				return;
			}

			//fallback: fetching data
			if (id) {
				const blogData = await fetchBlog(id);
				if (blogData) {
					setBlogForm({
						title: blogData.title,
						excerpt: blogData.excerpt,
						content: blogData.content,
					});
				}
				setLoading(false);
			}
		};

		loadBlogContent();
	}, [id, location.state]);

	//   useEffect(() => {
	//     if (id) {
	//       dispatch(fetchBlogById(id))
	//     }
	//     return () => {
	//       dispatch(clearCurrentBlog())
	//     }
	//   }, [dispatch, id])

	//   useEffect(() => {
	//     if (currentBlog) {
	//       setFormData({
	//         title: currentBlog.title,
	//         content: currentBlog.content,
	//         excerpt: currentBlog.excerpt,
	//         tags: currentBlog.tags.join(", "),
	//       })
	//     }
	//   }, [currentBlog])

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setBlogForm({
			...blogForm,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		//VALIDATING UPDATED FIELDS
		const { title, content, excerpt } = blogForm;

		if (!title.trim()) {
			setErrorField((prev) => ({ ...prev, title: true }));
			return;
		}
		if (!content.trim()) {
			setErrorField((prev) => ({ ...prev, content: true }));
			return;
		}
		if (!excerpt.trim()) {
			setErrorField((prev) => ({ ...prev, excerpt: true }));
			return;
		}

		try {
			setUpdating(true);
			// CLEANING	ERRORS
			setErrorField({
				title: false,
				content: false,
				excerpt: false,
			});

			const { data, error } = await supabase
				.from('Blogs')
				.update({
					title: blogForm.title.trim(),
					content: blogForm.content.trim(),
					excerpt: blogForm.excerpt.trim(),
					updated_at: new Date().toISOString(),
				})
				.eq('id', id)
				.select();

			if (error) {
				console.error('Error updating blog: ', error.message);
				return;
			}
		} catch (error) {
			console.error('Unexpected error in updating: ', error);
		} finally {
			setUpdating(false);
		}
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	if (updating) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	//   if (error) {
	//     return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
	//   }

	//   if (!currentBlog) {
	//     return (
	//       <div className="text-center">
	//         <p className="text-gray-500">Blog not found</p>
	//       </div>
	//     )
	//   }

	return (
		<div className="px-4 sm:px-6 lg:px-8">
			<div className="max-w-3xl mx-auto">
				<div className="md:flex md:items-center md:justify-between">
					<div className="flex-1 min-w-0">
						<h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
							Edit Blog Post
						</h2>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="mt-8 space-y-6">
					{/* {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>} */}

					<div>
						<label
							htmlFor="title"
							className="block text-sm font-medium text-gray-700"
						>
							Title
						</label>
						{errorField.title && (
							<p className="text-red-400 text-sm">*Enter a title</p>
						)}
						<input
							type="text"
							name="title"
							id="title"
							required
							value={blogForm.title}
							onChange={handleChange}
							className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
							placeholder="Enter blog title"
						/>
					</div>

					<div>
						<label
							htmlFor="excerpt"
							className="block text-sm font-medium text-gray-700"
						>
							Excerpt
						</label>
						{errorField.excerpt && (
							<p className="text-red-400 text-sm">*Enter an excerpt</p>
						)}
						<textarea
							name="excerpt"
							id="excerpt"
							rows={3}
							required
							value={blogForm.excerpt}
							onChange={handleChange}
							className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
							placeholder="Brief description of your blog post"
						/>
					</div>

					<div>
						<label
							htmlFor="content"
							className="block text-sm font-medium text-gray-700"
						>
							Content
						</label>

						{errorField.content && (
							<p className="text-red-400 text-sm">*Enter a content</p>
						)}
						<textarea
							name="content"
							id="content"
							rows={12}
							required
							value={blogForm.content}
							onChange={handleChange}
							className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
							placeholder="Write your blog content here..."
						/>
					</div>

					<div className="flex justify-end space-x-3">
						<button
							type="button"
							onClick={() => {
								navigate('/');
							}}
							className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={updating}
							className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
						>
							{updating ? 'Updating...' : 'Update Blog'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EditBlog;
