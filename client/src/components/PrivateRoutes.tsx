import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import {
    getSessionAsync,
    selectIsAuthenticated,
    selectStatus as selectAuthStatus,
} from "../features/auth/authSlice";
import { Spinner } from "@chakra-ui/react";

const PrivateRoutes = () => {
    const status = useAppSelector(selectAuthStatus);
    const [isAuthenticated, setIsAuthenticated] = useState(
        useAppSelector(selectIsAuthenticated)
    );
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getSessionAsync());
    }, []);

    if (status === "loading") {
        return <Spinner />;
    } else {
        if (isAuthenticated && localStorage.getItem("token")) {
            return <Outlet />;
        }
        return <Navigate to="/login" replace />;
    }
};

export default PrivateRoutes;
