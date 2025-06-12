import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks.ts';

interface ProtectedRouteProps {
	children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
	const { isAuthenticated } = useAppSelector((state) => state.auth);

	if (!isAuthenticated) {
		return <Navigate to="/signin" replace />;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
