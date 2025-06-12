import { useEffect, useState } from 'react';
import { supabase } from '../supabase-client';
import { Link } from 'react-router-dom';
import type { BlogTypes } from '../types/Interfaces';
import { useAppSelector } from '../types/hookType';
import ReactPaginate from 'react-paginate';

const BlogsPage = () => {
	const [blogs, setBlogs] = useState<BlogTypes[]>([]);
	const [errorMessage, setErrorMessage] = useState('');
	const [toggleDrafts, setToggleDrafts] = useState(false);
	const [itemOffset, setItemOffset] = useState(0);
	const itemsPerPage = 2;

	const userProfile = useAppSelector((state) => state.auth.user);

	const fetchBlogs = async () => {
		const { error, data } = await supabase.from('Blogs').select('*');

		if (error) {
			setErrorMessage(error.message);
			return;
		} else {
			setBlogs(data);
			console.log('blogs :', data);
			return;
		}
	};

	const filteredBlogs = blogs?.filter((post) =>
		toggleDrafts
			? !post.is_published && post.author_id === userProfile?.id
			: post.is_published
	);

	useEffect(() => {
		fetchBlogs();
	}, []);

	console.log('filtered blogs is array: ', Array.isArray(filteredBlogs));

	const handleDelete = async (id: number) => {
		const { error } = await supabase.from('Blogs').delete().eq('id', id);

		if (error) {
			console.log('cannot delete: ', error.message);
		} else {
			setBlogs((prev) => prev.filter((blog) => blog.id !== id));
		}
	};

	const endOffset = itemOffset + itemsPerPage;
	console.log(`Loading items from ${itemOffset} to ${endOffset}`);
	const currentItems = filteredBlogs.slice(itemOffset, endOffset);
	const pageCount = Math.ceil(filteredBlogs.length / itemsPerPage);

	const handlePageClick = (event: { selected: number }) => {
		const newOffset = (event.selected * itemsPerPage) % filteredBlogs.length;
		console.log(
			`User requested page number ${event.selected}, which is offset ${newOffset}`
		);
		setItemOffset(newOffset);
	};

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
					<>
						<div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
							<button
								onClick={() => setToggleDrafts((prev) => !prev)}
								className={`inline-flex mr-2 items-center justify-center rounded-md border border-transparent  px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 ${
									toggleDrafts ? 'bg-gray-600' : 'bg-gray-400'
								} `}
							>
								Drafts
							</button>
							<Link
								to="/blogs/create"
								className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
							>
								Create New Blog
							</Link>
						</div>
					</>
				)}
			</div>

			<div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
				{currentItems.map((post) => (
					<div
						key={post.id}
						className="bg-white overflow-hidden shadow rounded-lg"
					>
						<div
							className={`px-4 py-5 sm:p-6 ${
								toggleDrafts ? 'bg-gray-400' : 'bg-blue-200'
							}`}
						>
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

								<div className="flex space-x-2">
									{userProfile?.id === post.author_id && (
										<>
											<Link
												to={`/blogs/edit/${post.id}`}
												state={{ currentBlog: post }}
												className="text-blue-600 hover:text-blue-900"
											>
												Edit
											</Link>
											<button
												onClick={() => handleDelete(post.id)}
												className="text-red-600 hover:text-red-900"
											>
												Delete
											</button>
										</>
									)}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
			<ReactPaginate
				breakLabel="..."
				nextLabel="next >"
				onPageChange={handlePageClick}
				pageRangeDisplayed={5}
				pageCount={pageCount}
				previousLabel="< previous"
				renderOnZeroPageCount={null}
				containerClassName="flex justify-center items-center space-x-1 mt-4"
				pageClassName="block"
				pageLinkClassName="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 rounded-md"
				previousClassName="block"
				previousLinkClassName="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 rounded-l-md"
				nextClassName="block"
				nextLinkClassName="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 rounded-r-md"
				breakClassName="block"
				breakLinkClassName="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300"
				activeClassName="z-10 bg-blue-50 border-blue-500 text-blue-600"
				disabledClassName="opacity-50 cursor-not-allowed"
			/>
		</div>
	);
};

export default BlogsPage;
