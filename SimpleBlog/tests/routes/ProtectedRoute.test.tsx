import React from 'react';
import { render, screen, act } from '@testing-library/react';
import ProtectedRoute from '../routes/ProtectedRoute';
import { useAppDispatch, useAppSelector } from '../store/hookType';
import { verifyUser } from '../store/authSlice';
import { Navigate } from 'react-router-dom';

import 'jest';

jest.mock('../store/hookType');
jest.mock('../store/authSlice');
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	Navigate: jest.fn(() => <div>Redirected</div>),
}));

const mockUseAppDispatch = useAppDispatch as jest.Mock;
const mockUseAppSelector = useAppSelector as jest.Mock;
const mockVerifyUser = verifyUser as jest.Mock;
const mockNavigate = Navigate as jest.Mock;

describe('ProtectedRoute', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockUseAppDispatch.mockReturnValue(jest.fn(() => Promise.resolve()));
		mockVerifyUser.mockReturnValue({ type: 'auth/verifyUser/fulfilled' });
	});

	it('should_render_children_when_user_is_authenticated', async () => {
		mockUseAppSelector.mockImplementation((selector) =>
			selector({ auth: { isAuthenticated: true, isLoading: false } })
		);
		await act(async () => {
			render(
				<ProtectedRoute>
					<div>Protected Content</div>
				</ProtectedRoute>
			);
		});
		expect(screen.getByText('Protected Content')).toBeInTheDocument();
	});

	it('should_show_loading_indicator_while_verifying_authentication', async () => {
		mockUseAppSelector.mockImplementation((selector) =>
			selector({ auth: { isAuthenticated: false, isLoading: true } })
		);
		render(
			<ProtectedRoute>
				<div>Protected Content</div>
			</ProtectedRoute>
		);
		expect(screen.getByText('Loading...')).toBeInTheDocument();
	});

	it('should_redirect_to_signin_when_user_is_not_authenticated', async () => {
		mockUseAppSelector.mockImplementation((selector) =>
			selector({ auth: { isAuthenticated: false, isLoading: false } })
		);
		await act(async () => {
			render(
				<ProtectedRoute>
					<div>Protected Content</div>
				</ProtectedRoute>
			);
		});
		expect(screen.getByText('Redirected')).toBeInTheDocument();
	});

	it('should_redirect_when_verification_fails', async () => {
		mockUseAppSelector.mockImplementation((selector) =>
			selector({ auth: { isAuthenticated: false, isLoading: false } })
		);
		mockUseAppDispatch.mockReturnValue(() =>
			Promise.reject(new Error('Verification failed'))
		);
		await act(async () => {
			render(
				<ProtectedRoute>
					<div>Protected Content</div>
				</ProtectedRoute>
			);
		});
		expect(screen.getByText('Redirected')).toBeInTheDocument();
	});

	it('should_not_render_children_if_loading_never_completes', () => {
		mockUseAppSelector.mockImplementation((selector) =>
			selector({ auth: { isAuthenticated: true, isLoading: true } })
		);
		render(
			<ProtectedRoute>
				<div>Protected Content</div>
			</ProtectedRoute>
		);
		expect(screen.getByText('Loading...')).toBeInTheDocument();
		expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
	});

	it('should_reverify_user_on_authentication_state_change', async () => {
		let isAuthenticated = false;
		mockUseAppSelector.mockImplementation((selector) =>
			selector({ auth: { isAuthenticated, isLoading: false } })
		);
		const dispatchMock = jest.fn(() => Promise.resolve());
		mockUseAppDispatch.mockReturnValue(dispatchMock);

		const { rerender } = render(
			<ProtectedRoute>
				<div>Protected Content</div>
			</ProtectedRoute>
		);

		expect(dispatchMock).toHaveBeenCalledTimes(1);

		isAuthenticated = true;
		await act(async () => {
			rerender(
				<ProtectedRoute>
					<div>Protected Content</div>
				</ProtectedRoute>
			);
		});

		expect(dispatchMock).toHaveBeenCalledTimes(2);
	});
});
