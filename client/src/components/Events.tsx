import React from "react";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import axios from "axios";
import API_URL from "../features/api/api_url";
import { logoutAsync } from "../features/auth/authSlice";

console.log(API_URL);

interface TEvent {
    _id?: any | null;
    name: String;
    description: String;
}

const Events = () => {
    const [events, setEvents] = useState<Array<TEvent>>([]);
    const dispatch = useAppDispatch();

    useEffect(() => {
        getEvents();
    }, []);

    const createEvent = async () => {
        const event = { name: "New Event", description: "New Event Desc" };
        const createEvent = await axios.post(API_URL + "/create_event", event);
        const data = createEvent;
        console.log(event);
    };

    const getEvents = async () => {
        if (localStorage.getItem("token")) {
            const response = (await axios.get<Array<TEvent>>(
                API_URL + "/events",
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "JWT " + localStorage.getItem("token"),
                    },
                }
            )) as any;

            console.log("Response", response);

            return setEvents(response.data);
        }
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
