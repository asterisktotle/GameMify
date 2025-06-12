import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../types/hookType';
import { verifyUser } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
const PublicRoute = ({ children }) => {
	const { isAuthenticated, isLoading, user } = useAppSelector(
		(state) => state.auth
	);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(verifyUser());
	}, [dispatch]);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	if (isAuthenticated && !isLoading) {
		navigate('/');
	}
	console.log('User: ', user);

	return children;
};

export default PublicRoute;
