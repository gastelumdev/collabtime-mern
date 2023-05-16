import React from "react";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import axios from "axios";
import API_URL from "../api/api_url";
import { logoutAsync } from "../auth/authSlice";
import { getEventsAsync, selectEvents } from "./eventsSlice";

console.log(API_URL);

interface TEvent {
    _id?: any | null;
    name: String;
    description: String;
}

const Events = () => {
    const events = useAppSelector(selectEvents);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getEventsAsync());
    }, [dispatch]);

    const createEvent = async () => {
        const event = { name: "New Event", description: "New Event Desc" };
        const createEvent = await axios.post(API_URL + "/create_event", event);
        const data = createEvent;
        console.log(event);
    };

    const logout = async () => {
        dispatch(logoutAsync());
    };

    return (
        <div>
            {" "}
            {events.map((event: TEvent, index: any) => (
                <div key={index}>
                    <span>{event.name}</span>
                    <span>{event.description}</span>
                </div>
            ))}
            <button onClick={() => createEvent()}>Create Event</button>
            <button onClick={() => logout()}>Logout</button>
        </div>
    );
};

export default Events;
