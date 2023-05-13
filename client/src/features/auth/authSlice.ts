import { AxiosError } from 'axios';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { getSession, login } from './authAPI';
import { TSignin } from '../types/auth';
import { TypedUseSelectorHook } from 'react-redux';
import { ErrorResponse } from '@remix-run/router';

interface TAuthState {
    isAuthenticated: boolean;
    status: 'idle' | 'loading' | 'failed';
    accessToken: string;
    userId: string | null;
}

const initialState: TAuthState = {
    isAuthenticated: false,
    accessToken: "",
    status: 'loading',
    userId: null
}


export const loginAsync = createAsyncThunk(
    'auth/signin', 
    async ({email, password}: TSignin, thunkAPI) => {
        try {
            const response = await login({email, password});
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('userId', response.data.user.id);
            console.log(response.data);
            return response.data;
        } catch (err) {
            const errors = err as Error | AxiosError;
            return thunkAPI.rejectWithValue({error: errors.message});
        }
    }
);

export const getSessionAsync = createAsyncThunk(
    'auth/session',
    async () => {
        try {
            const response = await getSession();
            console.log(response.data);
            return response.data;
        } catch (err) {
            const error = err as Error | AxiosError;
            console.log(error);
            // return thunkAPI.rejectWithValue({error: error.message});
        }
    }
)

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(loginAsync.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(loginAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = action.payload.user.isAuthenticated;
        })
        .addCase(loginAsync.rejected, (state) => {
            state.status = 'failed';
        })
        .addCase(getSessionAsync.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(getSessionAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.isAuthenticated = action.payload;
            console.log(action.payload)
        })
        .addCase(getSessionAsync.rejected, (state) => {
            state.status = 'failed';
            state.isAuthenticated = false;
        })
    }
});

export const selectUserId = (state: RootState) => state.auth.userId;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectStatus = (state: RootState) => state.auth.status;

export default authSlice.reducer;

