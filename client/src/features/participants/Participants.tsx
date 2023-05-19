import React, { useEffect, useState } from "react";
import SidebarWithHeader from "../../components/DashboardNav";
import {
    Box,
    Button,
    ChakraProvider,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    FormLabel,
    Input,
    Stack,
    useDisclosure,
    Text,
    Badge,
    Toast,
    useToast,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import DataTable, { TableColumn, TableRow } from "react-data-table-component";
import { Link, useParams } from "react-router-dom";
import {
    createParticipantAsync,
    deleteParticipantAsync,
    getParticipantsAsync,
    selectCreatedParticipant,
    selectError,
    selectParticipants,
    updateParticipantAsync,
} from "./participantSlice";
import { TParticipant } from "../types/participant";
import { AddIcon } from "@chakra-ui/icons";

const Dashboard = () => {
    const participants = useAppSelector(selectParticipants);
    const createdParticipant = useAppSelector(selectCreatedParticipant);
    const toast = useToast();
    const error = useAppSelector(selectError);

    const [rerender, setRerender] = useState(true);
    const [data, setData] = useState<TParticipant>({
        name: "",
        email: "",
        event: localStorage.getItem("eventId"),
    });
    const [isCreate, setIsCreate] = useState(true);
    const params = useParams();

    const dispatch = useAppDispatch();
    const {
        isOpen: isCreateOpen,
        onOpen: onCreateOpen,
        onClose: onCreateClose,
    } = useDisclosure();
    const {
        isOpen: isUpdateOpen,
        onOpen: onUpdateOpen,
        onClose: onUpdateClose,
    } = useDisclosure();

    useEffect(() => {
        dispatch(getParticipantsAsync(localStorage.getItem("eventId")));
    }, [dispatch, rerender]);

    const createParticipant = async () => {
        console.log(data);
        dispatch(createParticipantAsync(data));
        setData({
            name: "",
            email: "",
            event: localStorage.getItem("eventId"),
        });
        dispatch(getParticipantsAsync(localStorage.getItem("eventId")));
        setRerender(!rerender);
        onCreateClose();

        console.log(error);
        if (error) {
            return toast({
                position: "top",
                title: "Participant already exists",
                description: "The participant with that email already exists",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleDelete = async (participantId: string) => {
        dispatch(deleteParticipantAsync(participantId));
        dispatch(getParticipantsAsync(localStorage.getItem("eventId")));
        setRerender(!rerender);
    };

    const handleUpdateButton = async (participant: TParticipant) => {
        setIsCreate(true);
        onUpdateOpen();
        setData({
            _id: participant._id,
            name: participant.name,
            email: participant.email,
            event: localStorage.getItem("eventId"),
        });
    };

    const handleUpdate = async () => {
        dispatch(updateParticipantAsync(data));
        dispatch(getParticipantsAsync(localStorage.getItem("eventId")));
        setRerender(!rerender);
        onUpdateClose();
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = event.target;
        setData({
            ...data,
            [name]: value,
        });
    };

    const handleError = () => {};

    type DataRow = {
        _id: string;
        name: string;
        email: string;
    };

    const columns: any = [
        {
            name: "Name",
            selector: (row: { name: any }) => row.name,
            sortable: true,
        },
        {
            name: "Email",
            selector: (row: { email: any }) => row.email,
            sortable: true,
        },
        {
            cell: (row: TParticipant) => (
                <>
                    <Button
                        size="xs"
                        colorScheme="red"
                        mr="6px"
                        onClick={() => handleDelete(row._id)}
                    >
                        Delete
                    </Button>
                    <Button
                        colorScheme="blue"
                        size="xs"
                        onClick={() => handleUpdateButton(row)}
                    >
                        Update
                    </Button>
                </>
            ),
        },
        {
            cell: (row: TParticipant) =>
                row.status === "Pending" ? (
                    <>
                        <Badge colorScheme="blue">
                            <Text>Pending</Text>
                        </Badge>
                    </>
                ) : row.status === "Submitted" ? (
                    <>
                        <Badge colorScheme="purple">
                            <Link to={"/participants/form/" + row._id}>
                                Verify
                            </Link>
                        </Badge>
                    </>
                ) : (
                    <>
                        <Badge colorScheme="green">
                            <Text>Verified</Text>
                        </Badge>
                    </>
                ),
        },
    ];

    return (
        <ChakraProvider>
            <Drawer
                isOpen={isCreateOpen}
                placement="right"
                // initialFocusRef={firstField}
                onClose={onCreateClose}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth="1px">
                        Envite Participant
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
                                <FormLabel htmlFor="email">Email</FormLabel>
                                <Input
                                    // ref={firstField}
                                    id="email"
                                    name="email"
                                    placeholder="Please enter participant email"
                                    onChange={handleChange}
                                />
                            </Box>
                        </Stack>
                    </DrawerBody>

                    <DrawerFooter borderTopWidth="1px">
                        <Button
                            variant="outline"
                            mr={3}
                            onClick={onCreateClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            colorScheme="blue"
                            onClick={() => createParticipant()}
                        >
                            Create
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>

            <Drawer
                isOpen={isUpdateOpen}
                placement="right"
                // initialFocusRef={firstField}
                onClose={onUpdateClose}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth="1px">
                        Envite Participant
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
                                    value={data.name}
                                />
                            </Box>

                            <Box>
                                <FormLabel htmlFor="email">Email</FormLabel>
                                <Input
                                    // ref={firstField}
                                    id="email"
                                    name="email"
                                    placeholder="Please enter participant email"
                                    onChange={handleChange}
                                    value={data.email}
                                />
                            </Box>
                        </Stack>
                    </DrawerBody>

                    <DrawerFooter borderTopWidth="1px">
                        <Button
                            variant="outline"
                            mr={3}
                            onClick={onUpdateClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            colorScheme="blue"
                            onClick={() => handleUpdate()}
                        >
                            Update
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            <SidebarWithHeader>
                <h1>{params.id}</h1>
                <Box
                    // maxW={{ base: "full", md: "275px" }}
                    bg="white"
                    w={"full"}
                    borderWidth="1px"
                    borderRadius="lg"
                    p={5}
                >
                    <Button
                        leftIcon={<AddIcon />}
                        colorScheme="blue"
                        size="sm"
                        mb="30px"
                        onClick={onCreateOpen}
                    >
                        Envite Participant
                    </Button>
                    <DataTable
                        columns={columns}
                        data={participants}
                        selectableRows
                        pagination
                    />
                </Box>
            </SidebarWithHeader>
        </ChakraProvider>
    );
};

export default Dashboard;
