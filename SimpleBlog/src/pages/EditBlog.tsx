'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { useAppDispatch, useAppSelector } from "../hooks/redux"
// import { fetchBlogById, updateBlog, clearCurrentBlog } from "../store/blogSlice"

const EditBlog: React.FC = () => {
	// const { id } = useParams<{ id: string }>();
	//   const dispatch = useAppDispatch()
	// const navigate = useNavigate();
	//   const { currentBlog, isLoading, error } = useAppSelector((state) => state.blogs)
	// DELETE THIS WHEN REFACTORING
	const [isLoading, setIsLoading] = useState(false);

	const [formData, setFormData] = useState({
		title: '',
		content: '',
		excerpt: '',
		tags: '',
	});

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
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		console.log('Click Submit btn');
		// if (!id) return

		// const blogData = {
		//   id,
		//   ...formData,
		//   tags: formData.tags
		//     .split(",")
		//     .map((tag) => tag.trim())
		//     .filter((tag) => tag),
		// }

		// const result = await dispatch(updateBlog(blogData))
		// if (updateBlog.fulfilled.match(result)) {
		//   navigate("/")
		// }
	};

	if (isLoading) {
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
						<input
							type="text"
							name="title"
							id="title"
							required
							value={formData.title}
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
						<textarea
							name="excerpt"
							id="excerpt"
							rows={3}
							required
							value={formData.excerpt}
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
						<textarea
							name="content"
							id="content"
							rows={12}
							required
							value={formData.content}
							onChange={handleChange}
							className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
							placeholder="Write your blog content here..."
						/>
					</div>

					<div>
						<label
							htmlFor="tags"
							className="block text-sm font-medium text-gray-700"
						>
							Tags
						</label>
						<input
							type="text"
							name="tags"
							id="tags"
							value={formData.tags}
							onChange={handleChange}
							className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
							placeholder="Enter tags separated by commas (e.g., React, JavaScript, Web Development)"
						/>
						<p className="mt-2 text-sm text-gray-500">
							Separate multiple tags with commas
						</p>
					</div>

					<div className="flex justify-end space-x-3">
						<button
							type="button"
							onClick={() => {
								// navigate('/')
								console.log('click next page');
							}}
							className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isLoading}
							className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
						>
							{isLoading ? 'Updating...' : 'Update Blog'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EditBlog;
