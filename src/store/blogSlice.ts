import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { BlogTypes } from '../types/Interfaces';
import { supabase } from '../supabase-client';

const initialState = {
	isAuthor: false,
	author: null,
	blogPost: {
		author: null,
		title: null,
		excerpt: null,
		content: null,
		isPublished: false,
		updatedAt: null,
		author_id: null,
	},
};

export const createBlogPost = createAsyncThunk(
	'blog/saveBlog/:id',
	async (blogContent: BlogTypes, { rejectWithValue }) => {
		try {
			const { data, error } = await supabase.from('blogs').insert(blogContent);
			if (error) {
				return rejectWithValue(error.message);
			}
			return data;
		} catch (error) {
			return rejectWithValue(`Saving blog failed: ${error}`);
		}
	}
);

const blogSlice = createSlice({
	name: 'blog',
	initialState,
	reducers: {},
});
