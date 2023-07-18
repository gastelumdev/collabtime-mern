import { AxiosError } from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { TData } from './types';
import { createData, deleteData, getData, updateData } from './api';
import config from './config';

interface TDataState {
    data: [TData] | [];
    createdData: TData | {};
    status: 'idle' | 'loading' | 'failed';
}

const initialState: TDataState = {
    data: [],
    createdData: {},
    status: 'loading',
}

export const getDataAsync = createAsyncThunk(
    `${config.name}/get`,
    async () => {
        try {
            const response = await getData();
            return response.data;
        } catch (err) {
            const errors = err as Error | AxiosError;
            console.log("GET", config.name, "error:", errors);
        }
        
    }
)

export const createDataAsync = createAsyncThunk(
    `${config.name}/create`,
    async (data: TData) => {
        try {
            console.log(data)
            const response = await createData(data);
            return response.data;
        } catch (err) {
            const errors = err as Error | AxiosError;
            console.log("CREATE", config.name, "error:", errors);
        }
    }
)

export const updateDataAsync = createAsyncThunk(
    `${config.name}/update`,
    async (data: TData) => {
        try {
            const response = await updateData(data);
            return response.data;
        }  catch (err) {
            const errors = err as Error | AxiosError;
            console.log("UPDATE", config.name, "error:", errors);
        }
    }
)

export const deleteDataAsync = createAsyncThunk(
    `${config.name}/delete`,
    async (id: string) => {
        try {
            const response = await deleteData(id);
            return response.data;
        } catch (err) {
            const errors = err as Error | AxiosError;
            console.log("DELETE", config.name, "error:", errors);
        }
    }
)

export const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getDataAsync.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(getDataAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.data = action.payload;
        })
        .addCase(getDataAsync.rejected, (state) => {
            state.status = 'failed';
        })
        builder
        .addCase(createDataAsync.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(createDataAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.createdData = action.payload;
        })
        .addCase(createDataAsync.rejected, (state) => {
            state.status = 'failed';
        })
    }
});

// This section is not generic and needs to match the RootState configuration
export const selectData = (state: RootState) => state.events.data;
export const selectCreatedData = (state: RootState) => state.events.createdData;

export default eventsSlice.reducer;