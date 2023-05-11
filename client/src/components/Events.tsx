import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../features/api/api_url";

console.log(API_URL);

interface TEvent {
    _id?: any | null;
    name: String;
    description: String;
}

const Events = () => {
    const [events, setEvents] = useState<Array<TEvent>>([]);

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
        const response = (await axios.get<Array<TEvent>>(
            API_URL + "/events"
        )) as any;

        console.log("Response", response);

        return setEvents(response.data);
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
        </div>
    );
};

export default Events;
