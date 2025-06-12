'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase-client';
import { data, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../types/hookType';

interface BlogFormData {
	title: string;
	content: string;
	excerpt: string;
	is_published: boolean;
	author: string;
	email: string;
}
const CreateBlog = () => {
	const [blogFormData, setBlogFormData] = useState<BlogFormData>({
		title: '',
		content: '',
		excerpt: '',
		is_published: false,
		author: '',
		email: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [published, setPublished] = useState(false);
	const navigate = useNavigate();

	const userProfile = useAppSelector((state) => state.auth.user);

	useEffect(() => {
		if (!userProfile?.user_metadata.email_verified) {
			setErrorMessage('User is not authenticated.');
		}
	}, [userProfile]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		const newBlogData = {
			title: blogFormData.title,
			content: blogFormData.content,
			excerpt: blogFormData.excerpt,
			is_published: published,
			author: userProfile?.user_metadata.username,
			author_id: userProfile?.id,
			email: userProfile?.email,
		};

		const { data, error } = await supabase
			.from('Blogs')
			.insert([newBlogData])
			.select()
			.single();

		if (error) {
			console.error(
				'Error adding new blog post: ',
				error.message,
				error.details
			);
			setErrorMessage('Upload failed:' + error.message);
			setIsLoading(false);
		} else {
			console.log('Blog created successfully', data);
			setBlogFormData({
				title: '',
				content: '',
				excerpt: '',
				is_published: false,
				author: '',
				email: '',
			});
			setErrorMessage('');
		}

		setIsLoading(false);
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setBlogFormData({
			...blogFormData,
			[e.target.name]: e.target.value,
		});
	};
	return (
		<div className="px-4 sm:px-6 lg:px-8">
			<div className="max-w-3xl mx-auto">
				<div className="md:flex md:items-center md:justify-between">
					<div className="flex-1 min-w-0">
						<h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
							Create New Blog Post
						</h2>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="mt-8 space-y-6">
					{errorMessage && (
						<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
							{errorMessage}
						</div>
					)}

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
							value={blogFormData.title}
							onChange={handleChange}
							className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
							placeholder="Enter a blog title"
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
							required
							value={blogFormData.excerpt}
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
							rows={10}
							required
							value={blogFormData.content}
							onChange={handleChange}
							className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
							placeholder="Write your blog content here..."
						/>
					</div>

					<div className="flex justify-end space-x-3">
						<button
							type="button"
							onClick={() => navigate('/')}
							className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						>
							Cancel
						</button>

						<button
							onClick={() => setPublished((prev) => !prev)}
							type="button"
							className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
								published ? 'bg-green-600' : 'bg-gray-500'
							}  hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
						>
							{published ? 'Publish' : 'Draft'}
						</button>
						<button
							type="submit"
							disabled={isLoading}
							className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
						>
							{isLoading ? 'Creating...' : 'Create Blog'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CreateBlog;
