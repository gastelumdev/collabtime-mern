import { AxiosError } from 'axios';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { TData } from './types';
import { createData, deleteData, getData, getOneData, updateData, updateDataForm } from './api';
import { isConstructorDeclaration } from 'typescript';
import { selectIsAuthenticated } from '../auth/authSlice';
import config from './config';

interface TDataState {
    data: [TData] | [];
    createdData: TData | {};
    oneData: TData,
    status: 'idle' | 'loading' | 'failed'; 
    err: string | null;
}

const initialState: TDataState = {
    data: [],
    createdData: {},
    oneData: config.defaultData,
    status: 'idle',
    err: null,
}

export const getDataAsync = createAsyncThunk(
    `${config.name}/get`,
    async (parentId: string | null) => {
        try {
            const response = await getData(parentId);
            return response.data;
        } catch (err) {
            const errors = err as Error | AxiosError;
            console.log(`get${config.name} Error: `, errors);
        }
        
    }
)

export const createDataAsync = createAsyncThunk(
    `${config.name}/create`,
    async (data: TData, {rejectWithValue}) => {
        console.log("createDataAsync:", data)
        try {
            data.status = "Pending";
            const response = await createData(data);
            console.log(response.data)
            return response.data;
        } catch (err) {
            const errors = err as Error | AxiosError;
            console.log(`Create ${config.singularName}: `, errors);
            return rejectWithValue({message: "Already exists."});
        }
    }
)

export const getOneDataAsync = createAsyncThunk(
    `${config.name}/getOne`,
    async (id: string) => {
        
        console.log(`${config.singularName}Id:`,id)
        try {
            const response = await getOneData(id);
            console.log(response.data._id)
            localStorage.setItem(`${config.parentFeature}Id`, response.data[config.parentFeature]);
            localStorage.setItem(`${config.singularName}Id`, response.data._id);
            return response.data;
        } catch (err) {
            const errors = err as Error | AxiosError;
            console.log(`GetOne ${config.name}: `, errors);
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
            console.log(`Update ${config.singularName}: `, errors);
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
            console.log(`Delete ${config.singularName}: `, errors);
        }
    }
)

export const updateDataFormAsync = createAsyncThunk(
    `${config.name}/updateForm`,
    async (data: TData, {rejectWithValue}) => {

        if (localStorage.getItem("token")) {
            data.status = "Verified";
        } else {
            data.status = "Submitted";
            localStorage.clear();
        }
        try {
            const response = await updateDataForm(data);
            return response.data;
        }  catch (err) {
            const errors = err as Error | AxiosError;
            console.log(`Update ${config.singularName}: `, errors);
        }
    }
)


export const slice = createSlice({
    name: 'participants',
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
            state.data.concat(action.payload);
        })
        .addCase(createDataAsync.rejected, (state, action) => {
            state.status = 'failed';
            state.err = "Already exists";
        })
        .addCase(getOneDataAsync.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(getOneDataAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.data = action.payload;
        })
        .addCase(getOneDataAsync.rejected, (state) => {
            state.status = 'failed';
        })
        .addCase(deleteDataAsync.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(deleteDataAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.data = state.data.filter(item => item != action.payload) as [TData];
        })
        .addCase(deleteDataAsync.rejected, (state) => {
            state.status = 'failed';
        })
    }
})

export const selectData = (state: RootState) => state.participants.data;
export const selectCreatedData = (state: RootState) => state.participants.createdData;
export const selectOneData = (state: RootState) => state.participants.oneData;
export const selectStatus = (state: RootState) => state.participants.status;
export const selectError = (state: RootState) => state.participants.err;

export default slice.reducer;