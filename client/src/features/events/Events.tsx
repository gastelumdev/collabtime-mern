import React from "react";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import axios from "axios";
import API_URL from "../api/api_url";
import { logoutAsync } from "../auth/authSlice";
import {
    createEventAsync,
    deleteEventAsync,
    getEventsAsync,
    selectCreatedEvent,
    selectEvents,
    updateEventAsync,
} from "./eventsSlice";
import NavBar from "../../components/NavBar";
import {
    SimpleGrid,
    Card,
    CardHeader,
    Heading,
    CardBody,
    CardFooter,
    Button,
    Text,
    Wrap,
    Container,
    Center,
    Box,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    FormLabel,
    Input,
    InputGroup,
    InputLeftAddon,
    InputRightAddon,
    Select,
    Stack,
    Textarea,
    useDisclosure,
    HStack,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { Navigate } from "react-router-dom";
import EditEvent from "./EditEvent";

console.log(API_URL);

interface TEvent {
    _id?: any | null;
    name: string;
    description: string;
}

const Events = () => {
    const events = useAppSelector(selectEvents);
    const newEvent = useAppSelector(selectCreatedEvent);

    const [rerender, setRerender] = useState(true);
    const [redirect, setRedirect] = useState(false);
    const [data, setData] = useState<TEvent>({
        name: "",
        description: "",
    });

    const dispatch = useAppDispatch();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const firstField = React.useRef();

    useEffect(() => {
        dispatch(getEventsAsync());
    }, [dispatch, rerender, redirect]);

    const createEvent = async () => {
        // const event = { name: "New Event 1", description: "New Event Desc" };
        dispatch(createEventAsync(data));
        setData({
            name: "",
            description: "",
        });
        dispatch(getEventsAsync());
        setRerender(!rerender);
        onClose();
    };

    const handleUpdateEventButton = (event: TEvent) => {
        console.log(event);
        onOpen();
    };

    const handleUpdateEvent = async (event: TEvent) => {
        dispatch(updateEventAsync(data));
        dispatch(getEventsAsync());
        setRerender(!rerender);
    };

    const handleDeleteEvent = async (eventId: string) => {
        console.log(eventId);
        dispatch(deleteEventAsync(eventId));
        dispatch(getEventsAsync());
        setRerender(!rerender);
    };

    const handleSetEventId = (eventId: string) => {
        // dispatch(setEventId(eventId));
        localStorage.setItem("eventId", eventId);
        setRerender(!rerender);
        setRedirect(true);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = event.target;
        setData({
            ...data,
            [name]: value,
        });
    };

    const onRerender = () => {
        dispatch(getEventsAsync());
        setRerender(!rerender);
        console.log(rerender);
    };

    const handleLogout = async () => {
        dispatch(logoutAsync());
    };

    if (redirect && localStorage.getItem("eventId"))
        return (
            <Navigate
                to={`/dashboard/${localStorage.getItem("eventId")}/`}
                replace
            />
        );

    return (
        <div>
            <NavBar logout={handleLogout} />

            {/********** CREATE EVENT DRAWER **********/}
            <Drawer
                isOpen={isOpen}
                placement="right"
                // initialFocusRef={firstField}
                onClose={onClose}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth="1px">
                        Create a new event
                    </DrawerHeader>

                    <DrawerBody>
                        <Stack spacing="24px">
                            <Box>
                                <FormLabel htmlFor="name">Name</FormLabel>
                                <Input
                                    // ref={firstField}
                                    id="name"
                                    name="name"
                                    placeholder="Please enter event name"
                                    onChange={handleChange}
                                />
                            </Box>

                            <Box>
                                <FormLabel htmlFor="name">
                                    Description
                                </FormLabel>
                                <Input
                                    // ref={firstField}
                                    id="description"
                                    name="description"
                                    placeholder="Please enter event description"
                                    onChange={handleChange}
                                />
                            </Box>
                        </Stack>
                    </DrawerBody>

                    <DrawerFooter borderTopWidth="1px">
                        <Button variant="outline" mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="blue"
                            onClick={() => createEvent()}
                        >
                            Submit
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>

            {/********************* EVENTS BODY **********************/}
            <Container maxW="4xl" pt={"30px"} pb={"50px"}>
                <Button
                    leftIcon={<AddIcon />}
                    colorScheme="teal"
                    onClick={onOpen}
                >
                    Create user
                </Button>
                <Heading>
                    <Center pb={"50px"}>Events</Center>
                </Heading>
                <SimpleGrid
                    spacing={4}
                    templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                    // alignContent={"center"}
                >
                    {events.map((event: TEvent, index: any) => (
                        <Card key={index}>
                            <CardHeader>
                                <Heading size="md">{event.name}</Heading>
                            </CardHeader>
                            <CardBody>
                                <Text>{event.description}</Text>
                            </CardBody>
                            <CardFooter>
                                <HStack>
                                    <Button
                                        colorScheme="teal"
                                        variant="ghost"
                                        size="xs"
                                        onClick={() =>
                                            handleSetEventId(event._id)
                                        }
                                    >
                                        View
                                    </Button>
                                    <EditEvent
                                        _event={event}
                                        onRerender={onRerender}
                                    />
                                    {/* <Button
                                        colorScheme="teal"
                                        variant="ghost"
                                        size="xs"
                                        onClick={() =>
                                            handleUpdateEventButton(event)
                                        }
                                    >
                                        Edit
                                    </Button> */}
                                    <Button
                                        colorScheme="teal"
                                        variant="ghost"
                                        size="xs"
                                        onClick={() =>
                                            handleDeleteEvent(event._id)
                                        }
                                    >
                                        Delete
                                    </Button>
                                </HStack>
                            </CardFooter>
                        </Card>
                    ))}
                </SimpleGrid>
            </Container>
        </div>
    );
};

export default Events;
