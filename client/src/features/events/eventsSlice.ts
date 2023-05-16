import { AxiosError } from 'axios';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { TEvent } from '../types/event';
import { createEvent, deleteEvent, getEvents } from './eventsAPI';

interface TEventState {
    events: [TEvent] | [];
    createdEvent: TEvent | {};
    status: 'idle' | 'loading' | 'failed';
}

const initialState: TEventState = {
    events: [],
    createdEvent: {},
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

export const createEventAsync = createAsyncThunk(
    'events/create',
    async (event: TEvent) => {
        try {
            const response = await createEvent(event);
            return response.data;
        } catch (err) {
            const errors = err as Error | AxiosError;
            console.log("Create event: ", errors);
        }
    }
)

export const deleteEventAsync = createAsyncThunk(
    'events/delete',
    async (id: string) => {
        try {
            console.log(id)
            const response = await deleteEvent(id);
            return response.data;
        } catch (err) {
            const errors = err as Error | AxiosError;
            console.log("Delete event: ", errors);
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
        builder
        .addCase(createEventAsync.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(createEventAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.createdEvent = action.payload;
        })
        .addCase(createEventAsync.rejected, (state) => {
            state.status = 'failed';
        })
    }
})

export const selectEvents = (state: RootState) => state.events.events;
export const selectCreatedEvent = (state: RootState) => state.events.createdEvent;

export default eventsSlice.reducer;