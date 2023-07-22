import React, { useEffect, useState } from "react";
import {
    Progress,
    Box,
    ButtonGroup,
    Button,
    Heading,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Text,
} from "@chakra-ui/react";

import { useToast } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectOneData, updateDataFormAsync } from "./slice";
import { Link, useParams } from "react-router-dom";
import { InfoIcon } from "@chakra-ui/icons";
import axios from "axios";
import API_URL from "../api/api_url";
import { TCol, TData, TPage } from "./types";
import config from "./config";

const DataForm = () => {
    const dispatch = useAppDispatch();
    const toast = useToast();
    const [step, setStep] = useState(1);
    const [progress, setProgress] = useState(
        100 / config.formPageTitles.length
    );
    const [rerender, setRerender] = useState(true);

    const { id } = useParams<{ id: any }>();
    console.log(id);

    const oneData = useAppSelector(selectOneData);
    const [data, setData] = useState<TData>(config.defaultData);
    const [finished, setfinished] = useState(false);

    const getData = async () => {
        const response = await axios.get(
            API_URL + `/${config.singularName}/` + id,
            {
                headers: { "Content-Type": "application/json" },
                params: { id: id },
            }
        );
        if (localStorage.getItem("token")) {
            localStorage.setItem(`${config.singularName}Id`, response.data._id);
        }
        setData(response.data);
    };

    useEffect(() => {
        getData();
        console.log(data);
    }, [dispatch, rerender]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = event.target;
        setData({
            ...data,
            [name]: value,
        });
    };

    const backToAdmin = () => {
        return localStorage.getItem("token") ? (
            <Box mt="20px">
                <Link
                    to={
                        `/${config.name}/` +
                        localStorage.getItem(`${config.parentFeature}Id`)
                    }
                >
                    Go back to Admin
                </Link>
            </Box>
        ) : null;
    };

    if (finished) {
        return (
            <Box textAlign="center" py={10} px={6}>
                <InfoIcon boxSize={"50px"} color={"blue.500"} />
                <Heading as="h2" size="xl" mt={6} mb={2}>
                    Thank you.
                </Heading>
                <Text color={"gray.500"}>
                    Use the link provided in the welcome email to make further
                    changes.
                </Text>
                {backToAdmin()}
            </Box>
        );
    }

    // if (participant._id === undefined) {
    //     setRerender(!rerender);
    // }

    return (
        <>
            <Box
                borderWidth="1px"
                rounded="lg"
                shadow="1px 1px 3px rgba(0,0,0,0.3)"
                maxWidth={800}
                p={6}
                m="10px auto"
                as="form"
            >
                <Progress
                    hasStripe
                    value={progress}
                    mb="5%"
                    mx="5%"
                    isAnimated
                ></Progress>

                {config.formPageTitles.map((page: TPage, index: any) => {
                    return (
                        <>
                            <Heading
                                w="100%"
                                textAlign={"center"}
                                fontWeight="normal"
                                mb="2%"
                            >
                                {page.number === step ? page.name : null}
                            </Heading>
                            {config.columns.map((col: TCol, index: any) => {
                                console.log(col.dataFormPageNumber);
                                if (
                                    col.dataForm &&
                                    col.dataFormPageNumber === page.number &&
                                    col.dataFormPageNumber === step
                                ) {
                                    return (
                                        <FormControl mr="5%" mb="2%">
                                            <FormLabel
                                                htmlFor={col.name}
                                                fontWeight={"normal"}
                                            >
                                                {(
                                                    col.name
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                    col.name.slice(1)
                                                )
                                                    .split("_")
                                                    .join(" ")}
                                            </FormLabel>
                                            <Input
                                                id={col.name}
                                                placeholder={col.name
                                                    .split("_")
                                                    .join(" ")}
                                                name={col.name}
                                                value={
                                                    data[
                                                        col.name as keyof TData
                                                    ] ?? ""
                                                }
                                                onChange={handleChange}
                                                focusBorderColor="brand.400"
                                                shadow="sm"
                                                size="sm"
                                                w="full"
                                                rounded="md"
                                            />
                                        </FormControl>
                                    );
                                }
                            })}
                        </>
                    );
                })}

                <ButtonGroup mt="5%" w="100%">
                    <Flex w="100%" justifyContent="space-between">
                        <Flex>
                            <Button
                                onClick={() => {
                                    setStep(step - 1);
                                    setProgress(progress - 20);
                                }}
                                isDisabled={step === 1}
                                colorScheme="teal"
                                variant="solid"
                                w="7rem"
                                mr="5%"
                            >
                                Back
                            </Button>
                            <Button
                                w="7rem"
                                isDisabled={
                                    step === config.formPageTitles.length
                                }
                                onClick={() => {
                                    setStep(step + 1);
                                    if (step === config.formPageTitles.length) {
                                        setProgress(100);
                                    } else {
                                        setProgress(
                                            progress +
                                                100 /
                                                    config.formPageTitles.length
                                        );
                                    }
                                }}
                                colorScheme="teal"
                                variant="outline"
                            >
                                Next
                            </Button>
                        </Flex>
                        {step === config.formPageTitles.length ? (
                            <Button
                                w="7rem"
                                colorScheme="red"
                                variant="solid"
                                onClick={() => {
                                    toast({
                                        title: "Success!.",
                                        description:
                                            "Your form has been submitted.",
                                        status: "success",
                                        duration: 3000,
                                        isClosable: true,
                                    });
                                    dispatch(updateDataFormAsync(data));
                                    setfinished(true);
                                }}
                            >
                                Submit
                            </Button>
                        ) : null}
                    </Flex>
                </ButtonGroup>
            </Box>
        </>
    );
};

export default DataForm;
