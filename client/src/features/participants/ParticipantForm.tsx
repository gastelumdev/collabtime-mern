import React, { useEffect, useState } from "react";
import {
    Progress,
    Box,
    ButtonGroup,
    Button,
    Heading,
    Flex,
    FormControl,
    GridItem,
    FormLabel,
    Input,
    Select,
    SimpleGrid,
    Text,
    InputLeftAddon,
    InputGroup,
    Textarea,
    FormHelperText,
    InputRightElement,
} from "@chakra-ui/react";

import { useToast } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
    getParticipantAsync,
    selectParticipant,
    updateParticipantAsync,
    updateParticipantFormAsync,
} from "./participantSlice";
import { Link, Navigate, useParams } from "react-router-dom";
import { TParticipant } from "../types/participant";
import { InfoIcon } from "@chakra-ui/icons";
import { setConstantValue } from "typescript";
import axios from "axios";
import API_URL from "../api/api_url";

const ParticipantForm = () => {
    const dispatch = useAppDispatch();
    const toast = useToast();
    const [step, setStep] = useState(1);
    const [progress, setProgress] = useState(33.33);
    const [rerender, setRerender] = useState(true);

    const { id } = useParams<{ id: any }>();
    console.log(id);

    const participant = useAppSelector(selectParticipant);

    const [data, setData] = useState<TParticipant>({
        name: participant.name,
        email: participant.email,
        event: localStorage.getItem("eventId"),
    });
    const [finished, setfinished] = useState(false);

    const getData = async () => {
        const response = await axios.get(API_URL + "/participant/" + id, {
            headers: { "Content-Type": "application/json" },
            params: { id: id },
        });
        if (localStorage.getItem("token")) {
            localStorage.setItem("participantId", response.data._id);
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
                <Link to={"/participants/" + localStorage.getItem("eventId")}>
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
                    You will hear about your event in the coming weeks. Use the
                    link provided in the welcome email to make further changes.
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
                {step === 1 ? (
                    // <Form1 name={name} email={email} />
                    // <Form1 id={id} setData={setData} data={data} />
                    <>
                        <Heading
                            w="100%"
                            textAlign={"center"}
                            fontWeight="normal"
                            mb="2%"
                        >
                            Participation Form
                        </Heading>
                        <FormControl mr="5%">
                            <FormLabel
                                htmlFor="participantName"
                                fontWeight={"normal"}
                            >
                                Participant Name
                            </FormLabel>
                            <Input
                                id="participantName"
                                placeholder="Participant Name"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl mt="2%">
                            <FormLabel htmlFor="email" fontWeight={"normal"}>
                                Email address
                            </FormLabel>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                            />
                        </FormControl>
                    </>
                ) : step === 2 ? (
                    <>
                        <Heading
                            w="100%"
                            textAlign={"center"}
                            fontWeight="normal"
                            mb="2%"
                        >
                            Address
                        </Heading>

                        <FormControl as={GridItem} colSpan={6}>
                            <FormLabel
                                htmlFor="street_address"
                                fontSize="sm"
                                fontWeight="md"
                                color="gray.700"
                                _dark={{
                                    color: "gray.50",
                                }}
                                mt="2%"
                            >
                                Street address
                            </FormLabel>
                            <Input
                                type="text"
                                name="street"
                                value={data.street}
                                onChange={handleChange}
                                id="street_address"
                                autoComplete="street-address"
                                focusBorderColor="brand.400"
                                shadow="sm"
                                size="sm"
                                w="full"
                                rounded="md"
                            />
                        </FormControl>

                        <FormControl as={GridItem} colSpan={[6, 6, null, 2]}>
                            <FormLabel
                                htmlFor="city"
                                fontSize="sm"
                                fontWeight="md"
                                color="gray.700"
                                _dark={{
                                    color: "gray.50",
                                }}
                                mt="2%"
                            >
                                City
                            </FormLabel>
                            <Input
                                type="text"
                                name="city"
                                value={data.city}
                                onChange={handleChange}
                                id="city"
                                autoComplete="city"
                                focusBorderColor="brand.400"
                                shadow="sm"
                                size="sm"
                                w="full"
                                rounded="md"
                            />
                        </FormControl>

                        <FormControl as={GridItem} colSpan={[6, 3, null, 2]}>
                            <FormLabel
                                htmlFor="state"
                                fontSize="sm"
                                fontWeight="md"
                                color="gray.700"
                                _dark={{
                                    color: "gray.50",
                                }}
                                mt="2%"
                            >
                                State / Province
                            </FormLabel>
                            <Input
                                type="text"
                                name="state"
                                value={data.state}
                                onChange={handleChange}
                                id="state"
                                autoComplete="state"
                                focusBorderColor="brand.400"
                                shadow="sm"
                                size="sm"
                                w="full"
                                rounded="md"
                            />
                        </FormControl>

                        <FormControl as={GridItem} colSpan={[6, 3, null, 2]}>
                            <FormLabel
                                htmlFor="postal_code"
                                fontSize="sm"
                                fontWeight="md"
                                color="gray.700"
                                _dark={{
                                    color: "gray.50",
                                }}
                                mt="2%"
                            >
                                ZIP / Postal
                            </FormLabel>
                            <Input
                                type="text"
                                name="zipcode"
                                value={data.zipcode}
                                onChange={handleChange}
                                id="postal_code"
                                autoComplete="postal-code"
                                focusBorderColor="brand.400"
                                shadow="sm"
                                size="sm"
                                w="full"
                                rounded="md"
                            />
                        </FormControl>
                    </>
                ) : (
                    <>
                        <Heading
                            w="100%"
                            textAlign={"center"}
                            fontWeight="normal"
                        >
                            Band Info
                        </Heading>
                        <SimpleGrid columns={1} spacing={6}>
                            <FormControl>
                                <FormLabel
                                    htmlFor="bandDirectorName"
                                    fontWeight={"normal"}
                                >
                                    Band Director Name
                                </FormLabel>
                                <Input
                                    id="bandDirectorName"
                                    placeholder="Band Director Name"
                                    name="band_director_name"
                                    value={data.band_director_name}
                                    onChange={handleChange}
                                />
                            </FormControl>
                        </SimpleGrid>
                    </>
                )}
                <ButtonGroup mt="5%" w="100%">
                    <Flex w="100%" justifyContent="space-between">
                        <Flex>
                            <Button
                                onClick={() => {
                                    setStep(step - 1);
                                    setProgress(progress - 33.33);
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
                                isDisabled={step === 3}
                                onClick={() => {
                                    setStep(step + 1);
                                    if (step === 3) {
                                        setProgress(100);
                                    } else {
                                        setProgress(progress + 33.33);
                                    }
                                }}
                                colorScheme="teal"
                                variant="outline"
                            >
                                Next
                            </Button>
                        </Flex>
                        {step === 3 ? (
                            <Button
                                w="7rem"
                                colorScheme="red"
                                variant="solid"
                                onClick={() => {
                                    toast({
                                        title: "Account created.",
                                        description:
                                            "We've created your account for you.",
                                        status: "success",
                                        duration: 3000,
                                        isClosable: true,
                                    });
                                    dispatch(updateParticipantFormAsync(data));
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

export default ParticipantForm;
