import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { logoutAsync } from "../auth/authSlice";
import {
    createDataAsync,
    deleteDataAsync,
    getDataAsync,
    selectData,
} from "./slice";
import { TData } from "./types";
import config from "./config";
import NavBar from "../../components/NavBar";
import Edit from "./Edit";
import {
    SimpleGrid,
    Card,
    CardHeader,
    Heading,
    CardBody,
    CardFooter,
    Button,
    Text,
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
    Stack,
    useDisclosure,
    HStack,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

const View = () => {
    const dispatch = useAppDispatch();
    const _data = useAppSelector(selectData);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [rerender, setRerender] = useState(true);
    const [redirect, setRedirect] = useState(false);
    const [data, setData] = useState<TData>({
        ...config.defaultData,
        owner: localStorage.getItem("userId"),
    });

    useEffect(() => {
        dispatch(getDataAsync());
    }, [dispatch, rerender, redirect]);

    const createData = async () => {
        delete data._id;
        dispatch(createDataAsync(data));
        setData({
            ...config.defaultData,
            owner: localStorage.getItem("userId"),
        });
        dispatch(getDataAsync());
        setRerender(!rerender);
        onClose();
    };

    const handleDeleteData = async (dataId: string) => {
        dispatch(deleteDataAsync(dataId));
        dispatch(getDataAsync());
        setRerender(!rerender);
    };

    const handleLogout = async () => {
        dispatch(logoutAsync());
    };

    const handleSetDataId = (dataId: string) => {
        localStorage.setItem(`${config.singularName}Id`, dataId);
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
        dispatch(getDataAsync());
        setRerender(!rerender);
    };

    if (redirect && localStorage.getItem(`${config.singularName}Id`))
        return (
            <Navigate
                to={`/${config.redirectComponent}/${localStorage.getItem(
                    `${config.singularName}Id`
                )}/`}
                replace
            />
        );

    return (
        <div>
            <NavBar logout={handleLogout} />

            {/********** CREATE DRAWER **********/}
            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth="1px">
                        Create a new {config.singularName}
                    </DrawerHeader>

                    <DrawerBody>
                        <Stack spacing="24px">
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
                        <Button variant="outline" mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="blue" onClick={() => createData()}>
                            Submit
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>

            {/********************* PAGE BODY **********************/}
            <Container maxW="4xl" pt={"30px"} pb={"50px"}>
                <Button
                    leftIcon={<AddIcon />}
                    colorScheme="blue"
                    onClick={onOpen}
                    mb={"50px"}
                >
                    Create {config.singularName}
                </Button>
                <Heading>
                    <Center pb={"50px"}>
                        {config.name.charAt(0).toUpperCase() +
                            config.name.slice(1)}
                    </Center>
                </Heading>
                <SimpleGrid
                    spacing={4}
                    templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                    // alignContent={"center"}
                >
                    {_data.length > 0
                        ? _data.map((data: TData, index: any) => (
                              <Card key={index}>
                                  <CardHeader>
                                      <Heading size="md">
                                          {data["name"]}
                                      </Heading>
                                  </CardHeader>
                                  <CardBody>
                                      <Text>{data["description"]}</Text>
                                  </CardBody>
                                  <CardFooter>
                                      <HStack>
                                          <Button
                                              colorScheme="blue"
                                              variant="ghost"
                                              size="xs"
                                              onClick={() =>
                                                  handleSetDataId(data["_id"])
                                              }
                                          >
                                              View
                                          </Button>
                                          <Edit
                                              _data={data}
                                              onRerender={onRerender}
                                          />

                                          <Button
                                              colorScheme="red"
                                              variant="ghost"
                                              size="xs"
                                              onClick={() =>
                                                  handleDeleteData(data["_id"])
                                              }
                                          >
                                              Delete
                                          </Button>
                                      </HStack>
                                  </CardFooter>
                              </Card>
                          ))
                        : null}
                </SimpleGrid>
                {_data.length === 0 ? (
                    <Center>
                        Click the Create {config.name} button to create an{" "}
                        {config.name}.
                    </Center>
                ) : null}
            </Container>
        </div>
    );
};

export default View;
