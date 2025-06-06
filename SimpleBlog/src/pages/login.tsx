'use client';

import React, { useState } from 'react';

const LoginPage: React.FC = () => {
	const [blogList, setBlogList] = useState([]);
	const [newBlog, setNewBlog] = useState('');

	return (
		<>
			<p>Insert blog</p>
		</>
	);
};

export default LoginPage;
