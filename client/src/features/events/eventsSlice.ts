import { AxiosError } from 'axios';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { TEvent } from '../types/event';
import { getEvents } from './eventsAPI';

interface TEventState {
    events: [TEvent] | [];
    status: 'idle' | 'loading' | 'failed';
}

const initialState: TEventState = {
    events: [],
    status: 'loading',
}

export const getEventsAsync = createAsyncThunk(
    'events/get',
    async () => {
        try {
            const response = await getEvents();
            return response.data;
        } catch (err) {
            const errors = err as Error | AxiosError;
            console.log("getEvents Error: ", errors);
        }
        
    }
)

export const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getEventsAsync.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(getEventsAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.events = action.payload;
        })
        .addCase(getEventsAsync.rejected, (state) => {
            state.status = 'failed';
        })
    }
})

export const selectEvents = (state: RootState) => state.events.events;

export default eventsSlice.reducer;