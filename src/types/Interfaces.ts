import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface BlogTypes {
	id: number;
	title: string;
	content: string;
	excerpt: string;
	author: string;
	author_id: string;
	email: string;
	is_published: boolean;
	created_at: string;
	user_id: string;
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
