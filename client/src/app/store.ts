import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import eventsReducer from '../features/events/slice';
import participantReducer from '../features/participants/participantSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        events: eventsReducer,
        participants: participantReducer,
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;