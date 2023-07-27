import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import API_URL from "./api_url";
import { TSignin } from "../types/auth";

// RTK Test
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({baseUrl: API_URL, prepareHeaders: (headers) => {
        headers.set("Content-type", "application/json");
        headers.set("Authorization", "JWT " + localStorage.getItem("token"));
    }}),
    endpoints: builder => ({
        getEvents: builder.query({
            query: () => "/events"
        }),
        login: builder.query({
            query: ({email, password}: TSignin) => "/login"
        })
    })
});

export const { useGetEventsQuery } = apiSlice;