import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../store/hookType';
import { verifyUser } from '../store/authSlice';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
	const dispatch = useAppDispatch();
	const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

	useEffect(() => {
		dispatch(verifyUser());
	}, [dispatch, isAuthenticated]);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				Loading...
			</div>
		);
	}

	if (!isAuthenticated && !isLoading) {
		return <Navigate to={'/signin'} replace />;
	}

	return children;
};

export default ProtectedRoute;
