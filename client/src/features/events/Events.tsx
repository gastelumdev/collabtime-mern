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
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

console.log(API_URL);

interface TEvent {
    _id?: any | null;
    name: String;
    description: String;
}

const Events = () => {
    const events = useAppSelector(selectEvents);
    const newEvent = useAppSelector(selectCreatedEvent);
    const [rerender, setRerender] = useState(true);
    const dispatch = useAppDispatch();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const firstField = React.useRef();

    useEffect(() => {
        dispatch(getEventsAsync());
    }, [dispatch, rerender]);

    // const createEvent = async () => {
    //     const event = { name: "New Event", description: "New Event Desc" };
    //     const createEvent = await axios.post(API_URL + "/create_event", event);
    //     const data = createEvent;
    //     console.log(event);
    // };

    const createEvent = async () => {
        const event = { name: "New Event 1", description: "New Event Desc" };
        dispatch(createEventAsync(event));
        dispatch(getEventsAsync());
        setRerender(!rerender);
        onClose();
    };

    const handleDeleteEvent = async (eventId: string) => {
        console.log(eventId);
        dispatch(deleteEventAsync(eventId));
        dispatch(getEventsAsync());
        setRerender(!rerender);
    };

    const handleSetEventId = (eventId: number) => {
        // dispatch(setEventId(eventId));
        localStorage.setItem("lsEventId", JSON.stringify(eventId));
    };

    const onRerender = () => {
        dispatch(getEventsAsync());
        setRerender(!rerender);
        console.log(rerender);
    };

    const handleLogout = async () => {
        dispatch(logoutAsync());
    };

    return (
        <div>
            <NavBar logout={handleLogout} />

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
                        Create a new account
                    </DrawerHeader>

                    <DrawerBody>
                        <Stack spacing="24px">
                            <Box>
                                <FormLabel htmlFor="username">Name</FormLabel>
                                <Input
                                    // ref={firstField}
                                    id="username"
                                    placeholder="Please enter user name"
                                />
                            </Box>

                            <Box>
                                <FormLabel htmlFor="url">Url</FormLabel>
                                <InputGroup>
                                    <InputLeftAddon>http://</InputLeftAddon>
                                    <Input
                                        type="url"
                                        id="url"
                                        placeholder="Please enter domain"
                                    />
                                    <InputRightAddon>.com</InputRightAddon>
                                </InputGroup>
                            </Box>

                            <Box>
                                <FormLabel htmlFor="owner">
                                    Select Owner
                                </FormLabel>
                                <Select id="owner" defaultValue="segun">
                                    <option value="segun">Segun Adebayo</option>
                                    <option value="kola">Kola Tioluwani</option>
                                </Select>
                            </Box>

                            <Box>
                                <FormLabel htmlFor="desc">
                                    Description
                                </FormLabel>
                                <Textarea id="desc" />
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
                                <button
                                    onClick={() => handleDeleteEvent(event._id)}
                                >
                                    Delete
                                </button>
                            </CardFooter>
                        </Card>
                    ))}
                </SimpleGrid>
            </Container>
        </div>
    );
};

export default Events;
