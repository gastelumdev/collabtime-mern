import { AxiosError } from 'axios';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { TParticipant } from '../types/participant';
import { createParticipant, deleteParticipant, getParticipants, updateParticipant } from './participantsAPI';

interface TParticipantState {
    participants: [TParticipant] | [];
    createdParticipant: TParticipant | {};
    status: 'idle' | 'loading' | 'failed'; 
}

const initialState: TParticipantState = {
    participants: [],
    createdParticipant: {},
    status: 'loading',
}

export const getParticipantsAsync = createAsyncThunk(
    'participants/get',
    async (eventId: string | null) => {
        try {
            const response = await getParticipants(eventId);
            console.log(response.data)
            return response.data;
        } catch (err) {
            const errors = err as Error | AxiosError;
            console.log("getParticipants Error: ", errors);
        }
        
    }
)

export const createParticipantAsync = createAsyncThunk(
    'participants/create',
    async (participant: TParticipant) => {
        try {
            const response = await createParticipant(participant);
            return response.data;
        } catch (err) {
            const errors = err as Error | AxiosError;
            console.log("Create participant: ", errors);
        }
    }
)


export const participantsSlice = createSlice({
    name: 'participants',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getParticipantsAsync.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(getParticipantsAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.participants = action.payload;
        })
        .addCase(getParticipantsAsync.rejected, (state) => {
            state.status = 'failed';
        })
        builder
        .addCase(createParticipantAsync.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(createParticipantAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.createdParticipant = action.payload;
        })
        .addCase(createParticipantAsync.rejected, (state) => {
            state.status = 'failed';
        })
    }
})

export const selectParticipants = (state: RootState) => state.participants.participants;
export const selectCreatedParticipant = (state: RootState) => state.participants.createdParticipant;

export default participantsSlice.reducer;