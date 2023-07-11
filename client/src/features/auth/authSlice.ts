import axios, { AxiosError } from 'axios';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { getSession, login, logout, register } from './authAPI';
import { TSignin, TUser } from '../types/auth';
import { TypedUseSelectorHook } from 'react-redux';
import { ErrorResponse } from '@remix-run/router';

interface TError {
    status: number | null;
    message: string;
}

interface TAuthState {
    isAuthenticated: boolean;
    status: 'idle' | 'loading' | 'failed';
    accessToken: string;
    userId: string | null;
    error: TError;
}

const initialState: TAuthState = {
    isAuthenticated: false,
    accessToken: "",
    status: 'loading',
    userId: null,
    error: {status: null, message: ""},
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
        } catch (err: any) {
            // const errors = err as Error | AxiosError;
            console.log(err.response)
            return thunkAPI.rejectWithValue({status: err.response?.status, message: err.response?.data.message});
        }
    }
);

export const registerAsync = createAsyncThunk(
    'auth/register',
    async (user: TUser, thunkAPI) => {
        try {
            const regResponse: any = await register(user);
            console.log(regResponse)
            if (regResponse.data.successful) {
                const response = await login({email: user.email, password: user.password});
                localStorage.setItem('token', response.data.accessToken);
                localStorage.setItem('userId', response.data.user.id);
                console.log(response.data);
                return response.data;
            }
            
            return {user: {isAuthenticated: false}}
        } catch (err: any) {
            return thunkAPI.rejectWithValue({status: err.response?.status, message: err.response?.data.message});
        }
    }
)

export const getSessionAsync = createAsyncThunk(
    'auth/session',
    async () => {
        try {
            if (localStorage.getItem("token")) {
                const response = await getSession();
                console.log(response.data);
                return response.data;
            }

            return false;
            
        } catch (err) {
            const error = err as Error | AxiosError;
            console.log(error);
            // return thunkAPI.rejectWithValue({error: error.message});
        }
    }
)

export const logoutAsync = createAsyncThunk(
    'auth/logout',
    async () => {
        try {
            const response = await logout();
            
            // localStorage.setItem("token", "");
            // localStorage.setItem("userId", "");
            return response.data;
            
        } catch (err) {
            const error = err as Error | AxiosError;
            console.log(error);
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
            state.error = {status: null, message: ""} as TError;
        })
        .addCase(loginAsync.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload as TError;
        })
        .addCase(registerAsync.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(registerAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            // state.accessToken = action.payload.accessToken;
            state.isAuthenticated = action.payload.user.isAuthenticated;
        })
        .addCase(registerAsync.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload as TError;
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
        .addCase(logoutAsync.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(logoutAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.isAuthenticated = false;
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
        })
        .addCase(logoutAsync.rejected, (state) => {
            state.status = 'failed';
        })
    }
});

export const selectUserId = (state: RootState) => state.auth.userId;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectStatus = (state: RootState) => state.auth.status;
export const selectError = (state: RootState) => state.auth.error;

export default authSlice.reducer;

