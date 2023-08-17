import React from "react";
import { Link } from "react-router-dom";

import { useGetEventsQuery } from "../events/rtkSlice";
import { Heading } from "@chakra-ui/react";

export const EventsList = () => {
    const {
        data: events,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useGetEventsQuery(null);

    let content;

    if (isLoading) {
        content = <Heading>Loading...</Heading>;
    } else if (isSuccess) {
        content = events.map((event: any) => <Heading>{event.name}</Heading>);
        console.log(events);
    } else if (isError) {
        content = <Heading>{error.toString()}</Heading>;
        console.log(error);
    }
    console.log(content);

    return <>{content}</>;
};
