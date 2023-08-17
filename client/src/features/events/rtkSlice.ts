import { apiSlice } from '../api/apiSlice';

const api = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getEvents: builder.query({
            query: () => "/events"
        }),
    }),
    overrideExisting: false,
});

export const { useGetEventsQuery } = api;