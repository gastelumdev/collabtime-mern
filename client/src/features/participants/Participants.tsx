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
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
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
import { AddIcon, ChevronRightIcon } from "@chakra-ui/icons";
import NavBar from "../../components/NavBar";
import { logoutAsync } from "../auth/authSlice";

const Dashboard = () => {
    const participants = useAppSelector(selectParticipants);
    const createdParticipant = useAppSelector(selectCreatedParticipant);
    const toast = useToast();
    const error = useAppSelector(selectError);

    const [rerender, setRerender] = useState(true);
    const [data, setData] = useState<TParticipant>({
        name: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        band_director_name: "",
        band_director_phone: "",
        band_director_email: "",
        booster_parent_name: "",
        booster_parent_phone: "",
        booster_parent_email: "",
        parade_march_title: "",
        parade_march_composer: "",
        additional_band_staff_names: "",
        drum_major: "",
        drum_major_name: "",
        color_guard_advisor: "",
        color_guard_captains: "",
        drill_team: "",
        drill_team_advisor: "",
        drill_team_captains: "",
        school_enrollment: "",
        number_of_students_in_band: "",
        number_of_students_in_color_guard: "",
        number_of_students_in_drill_team: "",
        number_of_buses: "",
        number_of_box_trucks: "",
        number_of_trailers: "",
        number_of_tractor_trailer_rigs: "",
        special_instructions: "",
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

    const handleLogout = async () => {
        dispatch(logoutAsync());
    };

    const handleError = () => {};

    function convertArrayOfObjectsToCSV(array: [TParticipant]) {
        let result: string;

        const columnDelimiter = ",";
        const lineDelimiter = "\n";
        const keys = Object.keys(data);

        result = "";
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        array.forEach((item: TParticipant) => {
            let ctr = 0;
            keys.forEach((key: string) => {
                console.log(key);
                if (ctr > 0) result += columnDelimiter;

                result += item[key as keyof TParticipant];
                // eslint-disable-next-line no-plusplus
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }

    // Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
    function downloadCSV(array: [TParticipant]) {
        const link = document.createElement("a");
        let csv = convertArrayOfObjectsToCSV(array);
        if (csv == null) return;

        const filename = "export.csv";

        if (!csv.match(/^data:text\/csv/i)) {
            csv = `data:text/csv;charset=utf-8,${csv}`;
        }

        link.setAttribute("href", encodeURI(csv));
        link.setAttribute("download", filename);
        link.click();
    }

    const Export = ({ onExport }: { onExport: () => void }) => (
        <Button onClick={() => onExport()}>Export CSV</Button>
    );

    const ExportCSV = () => {
        const actionsMemo = React.useMemo(
            () => (
                <Export
                    onExport={() => downloadCSV(participants as [TParticipant])}
                />
            ),
            []
        );

        return (
            <DataTable
                title="Movie List"
                columns={columns}
                data={participants}
                actions={actionsMemo}
                pagination
            />
        );
    };

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
            name: "Street address",
            selector: (row: { street_address: any }) => row.street_address,
            omit: true,
        },
        {
            name: "City",
            selector: (row: { city: any }) => row.city,
            omit: true,
        },
        {
            name: "State",
            selector: (row: { state: any }) => row.state,
            omit: true,
        },
        {
            name: "Zipcode",
            selector: (row: { zipcode: any }) => row.zipcode,
            omit: true,
        },
        {
            name: "Band Director",
            selector: (row: { band_director_name: any }) =>
                row.band_director_name,
            omit: true,
        },
        {
            name: "Band Director Phone",
            selector: (row: { band_director_phone: any }) =>
                row.band_director_phone,
            omit: true,
        },
        {
            name: "Band Director Email",
            selector: (row: { band_director_email: any }) =>
                row.band_director_email,
            omit: true,
        },
        {
            name: "Booster Parent Name",
            selector: (row: { booster_parent_name: any }) =>
                row.booster_parent_name,
            omit: true,
        },
        {
            name: "Booster Parent Phone",
            selector: (row: { booster_parent_phone: any }) =>
                row.booster_parent_phone,
            omit: true,
        },
        {
            name: "Booster Parent Email",
            selector: (row: { booster_parent_email: any }) =>
                row.booster_parent_email,
            omit: true,
        },
        {
            name: "Parade March Title",
            selector: (row: { parade_march_title: any }) =>
                row.parade_march_title,
            omit: true,
        },
        {
            name: "Parade March Composer",
            selector: (row: { parade_march_composer: any }) =>
                row.parade_march_composer,
            omit: true,
        },
        {
            name: "Additional Band Staff Names",
            selector: (row: { additional_band_staff_names: any }) =>
                row.additional_band_staff_names,
            omit: true,
        },
        {
            name: "Drum Major",
            selector: (row: { drum_major: any }) => row.drum_major,
            omit: true,
        },
        {
            name: "Drum Major Name",
            selector: (row: { drum_major_name: any }) => row.drum_major_name,
            omit: true,
        },
        {
            name: "Color Guard Advisor",
            selector: (row: { color_guard_advisor: any }) =>
                row.color_guard_advisor,
            omit: true,
        },
        {
            name: "Color Guard Captains",
            selector: (row: { color_guard_captains: any }) =>
                row.color_guard_captains,
            omit: true,
        },
        {
            name: "Drill Team",
            selector: (row: { drill_team: any }) => row.drill_team,
            omit: true,
        },
        {
            name: "Drill Team Advisor",
            selector: (row: { drill_team_advisor: any }) =>
                row.drill_team_advisor,
            omit: true,
        },
        {
            name: "Color Guard Captains",
            selector: (row: { color_guard_captains: any }) =>
                row.color_guard_captains,
            omit: true,
        },
        {
            name: "School Enrollment",
            selector: (row: { school_enrollment: any }) =>
                row.school_enrollment,
            omit: true,
        },
        {
            name: "Number of Students in Band",
            selector: (row: { number_of_students_in_band: any }) =>
                row.number_of_students_in_band,
            omit: true,
        },
        {
            name: "Number of Students in Color Guard",
            selector: (row: { number_of_students_in_color_guard: any }) =>
                row.number_of_students_in_color_guard,
            omit: true,
        },
        {
            name: "Number of Students in Drill Team",
            selector: (row: { number_of_students_in_drill_team: any }) =>
                row.number_of_students_in_drill_team,
            omit: true,
        },
        {
            name: "Number of Buses",
            selector: (row: { number_of_buses: any }) => row.number_of_buses,
            omit: true,
        },
        {
            name: "Number of Box Trucks",
            selector: (row: { number_of_box_trucks: any }) =>
                row.number_of_box_trucks,
            omit: true,
        },
        {
            name: "Number of Trailers",
            selector: (row: { number_of_trailers: any }) =>
                row.number_of_trailers,
            omit: true,
        },
        {
            name: "Number of Tractor Trailer Rigs",
            selector: (row: { number_of_tractor_trailer_rigs: any }) =>
                row.number_of_tractor_trailer_rigs,
            omit: true,
        },
        {
            name: "Special Instructions",
            selector: (row: { special_instructions: any }) =>
                row.special_instructions,
            omit: true,
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
            <NavBar logout={handleLogout} />
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
                        Invite Participant
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
                        Invite Participant
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
            {/* <h1>{params.id}</h1> */}
            <Box
                bg="white"
                w={"full"}
                borderWidth="1px"
                borderRadius="lg"
                p={5}
                mb={2}
            >
                <Breadcrumb
                    spacing="8px"
                    separator={<ChevronRightIcon color="gray.500" />}
                >
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/#/`}>Events</BreadcrumbLink>
                    </BreadcrumbItem>

                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink href="#">Participants</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
            </Box>
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
                    Invite Participant
                </Button>

                {/* Datatable */}
                <ExportCSV />

                {/* <DataTable
                        columns={columns}
                        data={participants}
                        selectableRows
                        pagination
                    /> */}
            </Box>
        </ChakraProvider>
    );
};

export default Dashboard;
