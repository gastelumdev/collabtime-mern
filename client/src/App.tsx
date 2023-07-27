import Events from "./features/events/View";
import { Login } from "./features/auth/Login";
import PrivateRoutes from "./components/PrivateRoutes";
import {
    HashRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import {
    getSessionAsync,
    selectIsAuthenticated,
} from "./features/auth/authSlice";
import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import Participants from "./features/participants/View";
import Register from "./features/auth/Register";
import ParticipantForm from "./features/participants/DataForm";
import { EventsList } from "./features/api/EventsList";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(
        useAppSelector(selectIsAuthenticated)
    );
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getSessionAsync());
    }, [isAuthenticated]);
    console.log("isAuthenticated", isAuthenticated);

    return (
        <Router>
            <Routes>
                <Route element={<PrivateRoutes />}>
                    <Route
                        path="/participants/:eventId"
                        element={<Participants />}
                    />
                    <Route path="/" element={<Events />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/participants/form/:id/"
                    element={<ParticipantForm />}
                />
                <Route path="/eventsList" element={<EventsList />} />
                {/* <Route path="/register" element={<Register />} /> */}
            </Routes>
        </Router>
    );
}

export default App;
