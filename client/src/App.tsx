import Events from "./components/Events";
import { Login } from "./features/auth/Login";
import PrivateRoutes from "./components/PrivateRoutes";
import {
    BrowserRouter as Router,
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
                    <Route path="/" element={<Events />} />
                </Route>
                <Route path="/login" element={<Login />} />
                {/* <Route path="/register" element={<Register />} /> */}
            </Routes>
        </Router>
    );
}

export default App;
