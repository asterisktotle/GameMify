import {
	createSlice,
	createAsyncThunk,
	type PayloadAction,
} from '@reduxjs/toolkit';
import { supabase } from '../supabase-client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import type {
	AuthState,
	SignInCredentials,
	SignUpCredentials,
} from '../types/Interfaces';

export const signUp = createAsyncThunk(
	'auth/signUp',
	async (credentials: SignUpCredentials, { rejectWithValue }) => {
		try {
			if (credentials.password.trim() !== credentials.confirmPassword.trim()) {
				return rejectWithValue('Password do not match');
			}

			const { data, error } = await supabase.auth.signUp({
				email: credentials.email,
				password: credentials.password.trim(),
				options: {
					data: {
						username: credentials.username.trim(),
					},
				},
			});

			if (
				error?.message ===
				'Password should contain at least one character of each: abcdefghijklmnopqrstuvwxyz, ABCDEFGHIJKLMNOPQRSTUVWXYZ, 0123456789, !@#$%^&*()_+-=[]{};\':"|<>?,./`~.'
			) {
				return rejectWithValue(
					'Use symbols, and at least one uppercase, lowercase letter and number'
				);
			}

			if (error) {
				return rejectWithValue(error.message);
			}

			return {
				user: data.user,
			};
		} catch (error) {
			return rejectWithValue('Sign Up Failed');
		}
	}
);

export const signIn = createAsyncThunk(
	'auth/SignIn',
	async (credentials: SignInCredentials, { rejectWithValue }) => {
		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email: credentials.email,
				password: credentials.password.trim(),
			});

			if (error) {
				return rejectWithValue(error.message);
			}
			return {
				user: data.user,
			};
		} catch (error) {
			return rejectWithValue(`Sign in failed: ${error}`);
		}
	}
);

export const signOut = createAsyncThunk(
	'auth/signOut',
	async (_, { rejectWithValue }) => {
		try {
			const { error } = await supabase.auth.signOut();

			if (error) {
				return rejectWithValue(error.message);
			}

			return {};
		} catch (error) {
			rejectWithValue(`Signing out failed: ${error}`);
		}
	}
);

// check if user is authenticated already

export const checkAuth = createAsyncThunk(
	'auth/checkAuth',
	async (_, { rejectWithValue }) => {
		try {
			// Use getUser() for initial auth check (more secure)
			const {
				data: { user },
				error: userError,
			} = await supabase.auth.getUser();

			if (userError) {
				return rejectWithValue(userError.message);
			}

			// If user exists, get the session safely
			// let session = null;
			if (user) {
				const {
					// data: { session: currentSession },
					error: sessionError,
				} = await supabase.auth.getSession();
				if (!sessionError) {
					// session = currentSession;
				}
			}

			return {
				user: user,
				// session: session,
			};
		} catch (error) {
			return rejectWithValue(`Auth check failed : ${error}`);
		}
	}
);

//refresh session
export const refreshSession = createAsyncThunk(
	'auth/refreshSession',
	async (_, { rejectWithValue }) => {
		try {
			const { data, error } = await supabase.auth.refreshSession();

			if (error) {
				return rejectWithValue(error.message);
			}

			return {
				user: data.user,
			};
		} catch (error) {
			return rejectWithValue(`Session refresh failed: ${error}`);
		}
	}
);

// verifying user
export const verifyUser = createAsyncThunk(
	'auth/verifyUser',
	async (_, { rejectWithValue }) => {
		try {
			// Always use getUser() for verification as it validates the JWT
			const {
				data: { user },
				error,
			} = await supabase.auth.getUser();

			if (error) {
				return rejectWithValue(error.message);
			}

			return {
				user: user,
			};
		} catch (error) {
			return rejectWithValue('User verification failed');
		}
	}
);

const initialState: AuthState = {
	user: null,
	isInitialized: false,
	isLoading: false,
	error: null,
	isAuthenticated: false,
};

//SLICE

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		clearError: (state) => {
			state.error = null;
		},
		setAuthData: (
			state,
			action: PayloadAction<{
				user: SupabaseUser | null;
				// session: Session | null;
			}>
		) => {
			state.user = action.payload.user;
			// state.session = action.payload.session;
			state.isAuthenticated = !!action.payload.user;
		},
		clearAuth: (state) => {
			state.user = null;
			// state.session = null;
			state.isAuthenticated = false;
		},
	},
	extraReducers: (builder) => {
		//Handle sign in
		builder
			.addCase(signIn.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(signIn.fulfilled, (state, action) => {
				state.isLoading = false;
				state.user = action.payload?.user ?? null;
				// state.session = action.payload?.session ?? null;
				state.isAuthenticated = true;
			})
			.addCase(signIn.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			});

		//Handle Sign Up

		builder
			.addCase(signUp.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(signUp.fulfilled, (state, action) => {
				state.error = null;
				state.isLoading = false;
				state.user = action.payload.user;
				state.isAuthenticated = true;
			})
			.addCase(signUp.rejected, (state, action) => {
				state.error = action.payload as string;
				state.isLoading = false;
			});

		builder
			.addCase(signOut.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(signOut.fulfilled, (state) => {
				state.isLoading = false;
				state.user = null;
				state.isAuthenticated = false;
				// state.session = null;
			})
			.addCase(signOut.rejected, (state, action) => {
				state.error = action.payload as string;
				state.isLoading = false;
			});

		// Check Authentication
		builder
			.addCase(checkAuth.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(checkAuth.fulfilled, (state, action) => {
				state.isLoading = false;
				state.user = action.payload.user;
				// state.session = action.payload.session;
				state.isAuthenticated = true;
			})
			.addCase(checkAuth.rejected, (state) => {
				state.isLoading = false;
				state.user = null;
				// state.session = null;
				state.isAuthenticated = false;
			});

		// Refresh Session
		builder
			.addCase(refreshSession.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(refreshSession.fulfilled, (state, action) => {
				state.isLoading = false;
				state.user = action.payload.user;
				// state.session = action.payload.session;
				state.isAuthenticated = true;
			})
			.addCase(refreshSession.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			});

		builder
			.addCase(verifyUser.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(verifyUser.fulfilled, (state, action) => {
				state.isLoading = false;
				// Only update user, keep existing session
				if (action.payload) {
					state.user = action.payload.user;
					state.isAuthenticated = true;
				} else {
					// If no user returned, clear auth state
					state.user = null;

					state.isAuthenticated = false;
				}
			})
			.addCase(verifyUser.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
				// Clear auth state on verification failure
				state.user = null;
				state.isAuthenticated = false;
			});
	},
});

export const { clearAuth, clearError, setAuthData } = authSlice.actions;
export default authSlice.reducer;
