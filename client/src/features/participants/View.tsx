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
    createDataAsync,
    deleteDataAsync,
    getDataAsync,
    selectCreatedData,
    selectError,
    selectData,
    updateDataAsync,
} from "./slice";
import { TCol, TData } from "./types";
import { AddIcon, ChevronRightIcon } from "@chakra-ui/icons";
import NavBar from "../../components/NavBar";
import { logoutAsync } from "../auth/authSlice";
import config from "./config";

const View = () => {
    const _data = useAppSelector(selectData);
    const createdData = useAppSelector(selectCreatedData);
    const toast = useToast();
    const error = useAppSelector(selectError);

    const [rerender, setRerender] = useState(false);
    const [data, setData] = useState<TData>(config.defaultData);
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
        dispatch(
            getDataAsync(
                localStorage.getItem(`${config.parentFeature.slice(0, -1)}Id`)
            )
        );
        console.log(rerender);
    }, [dispatch, rerender, data]);

    const createData = async () => {
        delete data._id;
        dispatch(createDataAsync(data));
        setData(config.defaultData);
        dispatch(
            getDataAsync(
                localStorage.getItem(`${config.parentFeature.slice(0, -1)}Id`)
            )
        );
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

    const handleDelete = async (dataId: string) => {
        dispatch(deleteDataAsync(dataId));
        dispatch(
            getDataAsync(
                localStorage.getItem(`${config.parentFeature.slice(0, -1)}Id`)
            )
        );
        setRerender(!rerender);
    };

    const handleUpdateButton = async (data: TData) => {
        setIsCreate(true);
        onUpdateOpen();
        setData({
            ...data,
            [config.parentFeature.slice(0, -1)]: localStorage.getItem(
                `${config.parentFeature.slice(0, -1)}Id`
            ),
        });
        setRerender(true);
    };

    const handleUpdate = async () => {
        dispatch(updateDataAsync(data));
        setData(data);
        onRerender();
        onUpdateClose();
    };

    const onRerender = () => {
        dispatch(
            getDataAsync(
                localStorage.getItem(`${config.parentFeature.slice(0, -1)}Id`)
            )
        );
        setRerender(!rerender);
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

    function convertArrayOfObjectsToCSV(array: [TData]) {
        let result: string;

        const columnDelimiter = ",";
        const lineDelimiter = "\n";
        const keys = Object.keys(data);

        result = "";
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        array.forEach((item: TData) => {
            let ctr = 0;
            keys.forEach((key: string) => {
                console.log(key);
                if (ctr > 0) result += columnDelimiter;

                result += item[key as keyof TData];
                // eslint-disable-next-line no-plusplus
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }

    // Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
    function downloadCSV(array: [TData]) {
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
            () => <Export onExport={() => downloadCSV(_data as [TData])} />,
            []
        );

        return (
            <DataTable
                title={
                    config.name.charAt(0).toUpperCase() + config.name.slice(1)
                }
                columns={columns}
                data={_data}
                actions={actionsMemo}
                pagination
            />
        );
    };

    const createColumnsFromConfig = (cols: TCol[]) => {
        const colsResult: any = [];
        cols.forEach((col: TCol) => {
            const name = col.name;
            const sortable = col.sortable;
            const omit = col.omit;
            colsResult.push({
                name: name.charAt(0).toUpperCase() + name.slice(1),
                selector: (row: { [name: string]: string }) => row[name],
                sortable: sortable,
                omit: omit,
            });
        });

        return colsResult;
    };

    const columns: any = [
        ...createColumnsFromConfig(config.columns),
        {
            cell: (row: TData) => (
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
            cell: (row: TData) =>
                row.status === "Pending" ? (
                    <>
                        <Badge colorScheme="blue">
                            <Text>Pending</Text>
                        </Badge>
                    </>
                ) : row.status === "Submitted" ? (
                    <>
                        <Badge colorScheme="purple">
                            <Link to={`/${config.name}/form/` + row._id}>
                                Verify
                            </Link>
                        </Badge>
                    </>
                ) : (
                    <>
                        <Badge colorScheme="green">
                            <Link to={`/${config.name}/form/` + row._id}>
                                Verified
                            </Link>
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
                        Invite{" "}
                        {config.singularName.charAt(0).toUpperCase() +
                            config.singularName.slice(1)}
                    </DrawerHeader>

                    <DrawerBody>
                        <Stack spacing="24px">
                            {/* <Box>
                                <FormLabel htmlFor="name">Name</FormLabel>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Please enter event name"
                                    onChange={handleChange}
                                />
                            </Box>

                            <Box>
                                <FormLabel htmlFor="email">Email</FormLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    placeholder="Please enter participant email"
                                    onChange={handleChange}
                                />
                            </Box> */}
                            {config.formInputs.map(
                                (item: string, index: any) => {
                                    return (
                                        <Box key={index}>
                                            <FormLabel htmlFor={item}>
                                                {item.charAt(0).toUpperCase() +
                                                    item.slice(1)}
                                            </FormLabel>
                                            <Input
                                                id={item}
                                                name={item}
                                                placeholder={`Pleas enter the ${item} of the ${config.singularName}`}
                                                onChange={handleChange}
                                                value={(data as any)[item]}
                                            />
                                        </Box>
                                    );
                                }
                            )}
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
                        <Button colorScheme="blue" onClick={() => createData()}>
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
                        Invite{" "}
                        {config.singularName.charAt(0).toUpperCase() +
                            config.singularName.slice(1)}
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
                        <BreadcrumbLink href={`/#/`}>
                            {config.parentFeature.charAt(0).toUpperCase() +
                                config.parentFeature.slice(1)}
                        </BreadcrumbLink>
                    </BreadcrumbItem>

                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink href="#">
                            {config.name.charAt(0).toUpperCase() +
                                config.name.slice(1)}
                        </BreadcrumbLink>
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
                    Invite{" "}
                    {config.singularName.charAt(0).toUpperCase() +
                        config.singularName.slice(1)}
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

export default View;
