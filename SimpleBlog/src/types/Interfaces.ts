import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

export interface BlogTypes {
	id: number | null;
	title: string;
	content: string;
	excerpt: string;
	author: string;
	author_id: string;
	email: string;
	is_published: boolean;
}

export interface User {
	id: string;
	email: string;
	created_at: string;
}

export interface AuthState {
	user: SupabaseUser | null;
	isInitialized: boolean;
	isLoading: boolean;
	error: string | null;
	isAuthenticated: boolean;
}

export interface SignUpCredentials {
	email: string;
	password: string;
	confirmPassword: string;
	username: string;
}

export interface SignInCredentials {
	email: string;
	password: string;
}
