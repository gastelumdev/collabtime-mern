import { AxiosError } from 'axios';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { TParticipant } from '../types/participant';
import { createParticipant, deleteParticipant, getParticipant, getParticipants, updateParticipant, updateParticipantForm } from './participantsAPI';
import { isConstructorDeclaration } from 'typescript';
import { selectIsAuthenticated } from '../auth/authSlice';

interface TParticipantState {
    participants: [TParticipant] | [];
    createdParticipant: TParticipant | {};
    participant: TParticipant,
    status: 'idle' | 'loading' | 'failed'; 
    err: string | null;
}

const initialState: TParticipantState = {
    participants: [],
    createdParticipant: {},
    participant: {name: '', email: ''},
    status: 'idle',
    err: null,
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
    async (participant: TParticipant, {rejectWithValue}) => {
        console.log(participant)
        try {
            participant.status = "Pending";
            const response = await createParticipant(participant);
            return response.data;
        } catch (err) {
            const errors = err as Error | AxiosError;
            console.log("Create participant: ", errors);
            return rejectWithValue({message: "Already exists."});
        }
    }
)

export const getParticipantAsync = createAsyncThunk(
    'participants/getOne',
    async (id: string) => {
        
        console.log("ParticipantId:",id)
        try {
            const response = await getParticipant(id);
            console.log(response.data._id)
            localStorage.setItem("eventId", response.data.event);
            localStorage.setItem("participantId", response.data._id);
            return response.data;
        } catch (err) {
            const errors = err as Error | AxiosError;
            console.log("Get participant:", errors);
        }
    }
)

export const updateParticipantAsync = createAsyncThunk(
    'participants/update',
    async (participant: TParticipant) => {
        console.log(participant);
        try {
            const response = await updateParticipant(participant);
            return response.data;
        }  catch (err) {
            const errors = err as Error | AxiosError;
            console.log("Update participant: ", errors);
        }
    }
)

export const deleteParticipantAsync = createAsyncThunk(
    'participants/delete',
    async (id: string) => {
        try {
            console.log(id)
            const response = await deleteParticipant(id);
            return response.data;
        } catch (err) {
            const errors = err as Error | AxiosError;
            console.log("Delete participant: ", errors);
        }
    }
)

export const updateParticipantFormAsync = createAsyncThunk(
    'participants/updateForm',
    async (participant: TParticipant, {rejectWithValue}) => {
        
        console.log(localStorage.getItem("token"))

        if (localStorage.getItem("token")) {
            participant.status = "Verified";
        } else {
            participant.status = "Submitted";
            localStorage.clear();
        }

        console.log(participant);
        try {
            const response = await updateParticipantForm(participant);
            return response.data;
        }  catch (err) {
            const errors = err as Error | AxiosError;
            console.log("Update participant: ", errors);
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
            console.log(action.payload);
            state.createdParticipant = action.payload;
            
        })
        .addCase(createParticipantAsync.rejected, (state, action) => {
            state.status = 'failed';
            console.log(action.payload);
            state.err = "Already exists";
        })
        .addCase(getParticipantAsync.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(getParticipantAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.participant = action.payload;
        })
        .addCase(getParticipantAsync.rejected, (state) => {
            state.status = 'failed';
        })
    }
})

export const selectParticipants = (state: RootState) => state.participants.participants;
export const selectCreatedParticipant = (state: RootState) => state.participants.createdParticipant;
export const selectParticipant = (state: RootState) => state.participants.participant;
export const selectStatus = (state: RootState) => state.participants.status;
export const selectError = (state: RootState) => state.participants.err;

export default participantsSlice.reducer;