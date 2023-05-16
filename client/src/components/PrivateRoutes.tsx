import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import {
    getSessionAsync,
    selectIsAuthenticated,
    selectStatus,
} from "../features/auth/authSlice";

const PrivateRoutes = () => {
    const status = useAppSelector(selectStatus);
    const [isAuthenticated, setIsAuthenticated] = useState(
        useAppSelector(selectIsAuthenticated)
    );
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getSessionAsync());
    }, []);

    console.log("isAuthenticated", isAuthenticated);
    if (status === "loading") {
        return null;
    }

    if (isAuthenticated && localStorage.getItem("token")) {
        return <Outlet />;
    }
    return <Navigate to="/login" replace />;
};

export default PrivateRoutes;
