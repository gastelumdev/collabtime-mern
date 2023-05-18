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
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import DataTable, { TableColumn, TableRow } from "react-data-table-component";
import { useParams } from "react-router-dom";
import {
    createParticipantAsync,
    deleteParticipantAsync,
    getParticipantsAsync,
    selectParticipants,
    updateParticipantAsync,
} from "./participantSlice";
import { TParticipant } from "../types/participant";
import { AddIcon } from "@chakra-ui/icons";

const Dashboard = () => {
    const participants = useAppSelector(selectParticipants);
    const [rerender, setRerender] = useState(true);
    const [data, setData] = useState<TParticipant>({
        name: "",
        role: "",
        event: localStorage.getItem("eventId"),
    });
    const params = useParams();

    const dispatch = useAppDispatch();
    const {
        isOpen: isDeleteOpen,
        onOpen: onDeleteOpen,
        onClose: onDeleteClose,
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
        dispatch(createParticipantAsync(data));
        setData({
            name: "",
            role: "",
            event: localStorage.getItem("eventId"),
        });
        dispatch(getParticipantsAsync(localStorage.getItem("eventId")));
        setRerender(!rerender);
        onDeleteClose();
    };

    const handleDelete = async (participantId: string) => {
        dispatch(deleteParticipantAsync(participantId));
        dispatch(getParticipantsAsync(localStorage.getItem("eventId")));
        setRerender(!rerender);
    };

    const handleUpdateButton = async (participant: TParticipant) => {
        onUpdateOpen();
        setData({
            _id: participant._id,
            name: participant.name,
            role: participant.role,
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

    type DataRow = {
        _id: string;
        name: string;
        role: string;
    };

    const columns: any = [
        {
            name: "Name",
            selector: (row: { name: any }) => row.name,
            sortable: true,
        },
        {
            name: "Role",
            selector: (row: { role: any }) => row.role,
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
    ];

    return (
        <ChakraProvider>
            {/**************** DELETE DRAWER ********************************/}
            <Drawer
                isOpen={isDeleteOpen}
                placement="right"
                // initialFocusRef={firstField}
                onClose={onDeleteClose}
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
                                <FormLabel htmlFor="role">Role</FormLabel>
                                <Input
                                    // ref={firstField}
                                    id="role"
                                    name="role"
                                    placeholder="Please enter participant role"
                                    onChange={handleChange}
                                />
                            </Box>
                        </Stack>
                    </DrawerBody>

                    <DrawerFooter borderTopWidth="1px">
                        <Button
                            variant="outline"
                            mr={3}
                            onClick={onDeleteClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            colorScheme="blue"
                            onClick={() => createParticipant()}
                        >
                            Submit
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            {/**************** UPDATE DRAWER ********************************/}
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
                                <FormLabel htmlFor="role">Role</FormLabel>
                                <Input
                                    // ref={firstField}
                                    id="role"
                                    name="role"
                                    placeholder="Please enter participant role"
                                    onChange={handleChange}
                                    value={data.role}
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
                            Submit
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
                        onClick={onUpdateOpen}
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
