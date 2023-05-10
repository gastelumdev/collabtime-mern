import axios from "axios";
import { useEffect, useState } from "react";

function App() {
    const [message, setMessage] = useState("");
    const [events, setEvents] = useState();

    // Fetching message from backend on mount
    useEffect(() => {
        fetch("https://collabtime-mern-backend.onrender.com")
            .then((res) => res.json())
            .then((data) => setMessage(data.message));
    }, []);

    const createEvent = async () => {
        const event = { name: "New Event", description: "New Event Desc" };
        const createEvent = await axios.post(
            "https://collabtime-mern-backend.onrender.com/create_event",
            event
        );
        const data = createEvent;
        console.log(event);
    };

    const getEvents = async () => {
        const data = (await axios.get(
            "https://collabtime-mern-backend.onrender.com/events"
        )) as any;
        setEvents(data);
    };

    return (
        <div className="App">
            <h1>{message}</h1>
            {/* {getEvents.map()} */}
        </div>
    );
}

export default App;
