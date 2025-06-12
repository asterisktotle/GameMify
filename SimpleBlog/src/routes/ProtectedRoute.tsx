import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../types/hookType';
import { verifyUser } from '../store/authSlice';
import { Navigate } from 'react-router-dom';

// TODO PASS THE USERDATA AND VERIFY IF THE USE HAS THE SAME USER ID TO EDIT ITS OWN BLOG

const ProtectedRoute = ({ children }) => {
	const dispatch = useAppDispatch();
	const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
	const [isVerified, setIsVerified] = useState(false);
	useEffect(() => {
		dispatch(verifyUser()).finally(() => setIsVerified(true));
	}, [dispatch, isAuthenticated]);

	if (isLoading || !isVerified) {
		return (
			<div className="flex justify-center items-center h-screen">
				Loading...
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to={'/signin'} replace />;
	}

	return children;
};

export default ProtectedRoute;
