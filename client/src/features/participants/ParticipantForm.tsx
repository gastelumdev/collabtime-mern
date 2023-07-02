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
import participantSlice, {
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
        name: participant.name || "",
        email: participant.email || "",
        street: participant.street || "",
        city: participant.city || "",
        state: participant.state || "",
        zipcode: participant.zipcode || "",
        band_director_name: participant.band_director_name || "",
        band_director_phone: participant.band_director_phone || "",
        band_director_email: participant.band_director_email || "",
        booster_parent_name: participant.booster_parent_name || "",
        booster_parent_phone: participant.booster_parent_phone || "",
        booster_parent_email: participant.booster_parent_email || "",
        parade_march_title: participant.parade_march_title || "",
        parade_march_composer: participant.parade_march_composer || "",
        additional_band_staff_names:
            participant.additional_band_staff_names || "",
        drum_major: participant.drum_major || "",
        drum_major_name: participant.drum_major_name || "",
        color_guard_advisor: participant.color_guard_advisor || "",
        color_guard_captains: participant.color_guard_captains || "",
        drill_team: participant.drill_team || "",
        drill_team_advisor: participant.drill_team_advisor || "",
        drill_team_captains: participant.drill_team_captains || "",
        school_enrollment: participant.school_enrollment || "",
        number_of_students_in_band:
            participant.number_of_students_in_band || "",
        number_of_students_in_color_guard:
            participant.number_of_students_in_color_guard || "",
        number_of_students_in_drill_team:
            participant.number_of_students_in_drill_team || "",
        number_of_buses: participant.number_of_buses || "",
        number_of_box_trucks: participant.number_of_box_trucks || "",
        number_of_trailers: participant.number_of_trailers || "",
        number_of_tractor_trailer_rigs:
            participant.number_of_tractor_trailer_rigs || "",
        special_instructions: participant.special_instructions || "",
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
                            Participant Form
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
                                value={data.name ?? ""}
                                onChange={handleChange}
                                focusBorderColor="brand.400"
                                shadow="sm"
                                size="sm"
                                w="full"
                                rounded="md"
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
                                value={data.email ?? ""}
                                onChange={handleChange}
                                focusBorderColor="brand.400"
                                shadow="sm"
                                size="sm"
                                w="full"
                                rounded="md"
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
                                Street Address
                            </FormLabel>
                            <Input
                                type="text"
                                name="street"
                                value={data.street ?? ""}
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
                                value={data.city ?? ""}
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
                                value={data.state ?? ""}
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
                                value={data.zipcode ?? ""}
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
                ) : step == 3 ? (
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
                                    value={data.band_director_name ?? ""}
                                    onChange={handleChange}
                                    focusBorderColor="brand.400"
                                    shadow="sm"
                                    size="sm"
                                    w="full"
                                    rounded="md"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel
                                    htmlFor="bandDirectorPhone"
                                    fontWeight={"normal"}
                                >
                                    Band Director Phone
                                </FormLabel>
                                <Input
                                    id="bandDirectorPhone"
                                    placeholder="Band Director Phone"
                                    name="band_director_phone"
                                    value={data.band_director_phone ?? ""}
                                    onChange={handleChange}
                                    focusBorderColor="brand.400"
                                    shadow="sm"
                                    size="sm"
                                    w="full"
                                    rounded="md"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel
                                    htmlFor="bandDirectorEmail"
                                    fontWeight={"normal"}
                                >
                                    Band Director Email
                                </FormLabel>
                                <Input
                                    id="bandDirectorEmail"
                                    placeholder="Band Director Email"
                                    name="band_director_email"
                                    value={data.band_director_email ?? ""}
                                    onChange={handleChange}
                                    focusBorderColor="brand.400"
                                    shadow="sm"
                                    size="sm"
                                    w="full"
                                    rounded="md"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel
                                    htmlFor="boosterParentName"
                                    fontWeight={"normal"}
                                >
                                    Booster Parent Name
                                </FormLabel>
                                <Input
                                    id="boosterParentName"
                                    placeholder="Booster Parent Name"
                                    name="booster_parent_name"
                                    value={data.booster_parent_name ?? ""}
                                    onChange={handleChange}
                                    focusBorderColor="brand.400"
                                    shadow="sm"
                                    size="sm"
                                    w="full"
                                    rounded="md"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel
                                    htmlFor="boosterParentPhone"
                                    fontWeight={"normal"}
                                >
                                    Booster Parent Phone
                                </FormLabel>
                                <Input
                                    id="boosterParentPhone"
                                    placeholder="Booster Parent Phone"
                                    name="booster_parent_phone"
                                    value={data.booster_parent_phone ?? ""}
                                    onChange={handleChange}
                                    focusBorderColor="brand.400"
                                    shadow="sm"
                                    size="sm"
                                    w="full"
                                    rounded="md"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel
                                    htmlFor="boosterParentEmail"
                                    fontWeight={"normal"}
                                >
                                    Booster Parent Email
                                </FormLabel>
                                <Input
                                    id="boosterParentEmail"
                                    placeholder="Booster Parent Email"
                                    name="booster_parent_email"
                                    value={data.booster_parent_email ?? ""}
                                    onChange={handleChange}
                                    focusBorderColor="brand.400"
                                    shadow="sm"
                                    size="sm"
                                    w="full"
                                    rounded="md"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel
                                    htmlFor="paradeMarchTitle"
                                    fontWeight={"normal"}
                                >
                                    Parade March Title
                                </FormLabel>
                                <Input
                                    id="paradeMarchTitle"
                                    placeholder="Parade March Title"
                                    name="parade_march_title"
                                    value={data.parade_march_title ?? ""}
                                    onChange={handleChange}
                                    focusBorderColor="brand.400"
                                    shadow="sm"
                                    size="sm"
                                    w="full"
                                    rounded="md"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel
                                    htmlFor="paradeMarchComposer"
                                    fontWeight={"normal"}
                                >
                                    Parade March Composer
                                </FormLabel>
                                <Input
                                    id="paradeMarchComposer"
                                    placeholder="Parade March Composer"
                                    name="parade_march_composer"
                                    value={data.parade_march_composer ?? ""}
                                    onChange={handleChange}
                                    focusBorderColor="brand.400"
                                    shadow="sm"
                                    size="sm"
                                    w="full"
                                    rounded="md"
                                />
                            </FormControl>
                        </SimpleGrid>
                    </>
                ) : step == 4 ? (
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
                                    htmlFor="additionalBandStaffNames"
                                    fontWeight={"normal"}
                                >
                                    Additional Band Staff Names
                                </FormLabel>
                                <Input
                                    id="additionalBandStaffNames"
                                    placeholder="Additional Band Staff Names"
                                    name="additional_band_staff_names"
                                    value={
                                        data.additional_band_staff_names ?? ""
                                    }
                                    onChange={handleChange}
                                    focusBorderColor="brand.400"
                                    shadow="sm"
                                    size="sm"
                                    w="full"
                                    rounded="md"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel
                                    htmlFor="drumMajor"
                                    fontWeight={"normal"}
                                >
                                    Drum Major
                                </FormLabel>
                                <Input
                                    id="drumMajor"
                                    placeholder="Drum Major"
                                    name="drum_major"
                                    value={data.drum_major ?? ""}
                                    onChange={handleChange}
                                    focusBorderColor="brand.400"
                                    shadow="sm"
                                    size="sm"
                                    w="full"
                                    rounded="md"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel
                                    htmlFor="drumMajorName"
                                    fontWeight={"normal"}
                                >
                                    Drum Major Name
                                </FormLabel>
                                <Input
                                    id="drumMajorName"
                                    placeholder="Drum Major Name"
                                    name="drum_major_name"
                                    value={data.drum_major_name ?? ""}
                                    onChange={handleChange}
                                    focusBorderColor="brand.400"
                                    shadow="sm"
                                    size="sm"
                                    w="full"
                                    rounded="md"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel
                                    htmlFor="colorGuardAdvisor"
                                    fontWeight={"normal"}
                                >
                                    Color Guard Advisor
                                </FormLabel>
                                <Input
                                    id="colorGuardAdvisor"
                                    placeholder="Color Guard Advisor"
                                    name="color_guard_advisor"
                                    value={data.color_guard_advisor ?? ""}
                                    onChange={handleChange}
                                    focusBorderColor="brand.400"
                                    shadow="sm"
                                    size="sm"
                                    w="full"
                                    rounded="md"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel
                                    htmlFor="colorGuardCaptains"
                                    fontWeight={"normal"}
                                >
                                    Color Guard Captains
                                </FormLabel>
                                <Input
                                    id="colorGuardCaptains"
                                    placeholder="Color Guard Captains"
                                    name="color_guard_captains"
                                    value={data.color_guard_captains ?? ""}
                                    onChange={handleChange}
                                    focusBorderColor="brand.400"
                                    shadow="sm"
                                    size="sm"
                                    w="full"
                                    rounded="md"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel
                                    htmlFor="drillTeam"
                                    fontWeight={"normal"}
                                >
                                    Drill Team
                                </FormLabel>
                                <Input
                                    id="drillTeam"
                                    placeholder="Drill Team"
                                    name="drill_team"
                                    value={data.drill_team ?? ""}
                                    onChange={handleChange}
                                    focusBorderColor="brand.400"
                                    shadow="sm"
                                    size="sm"
                                    w="full"
                                    rounded="md"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel
                                    htmlFor="drillTeamAdvisor"
                                    fontWeight={"normal"}
                                >
                                    Drill Team Advisor
                                </FormLabel>
                                <Input
                                    id="drillTeamAdvisor"
                                    placeholder="Drill Team Advisor"
                                    name="drill_team_advisor"
                                    value={data.drill_team_advisor ?? ""}
                                    onChange={handleChange}
                                    focusBorderColor="brand.400"
                                    shadow="sm"
                                    size="sm"
                                    w="full"
                                    rounded="md"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel
                                    htmlFor="drillTeamCaptains"
                                    fontWeight={"normal"}
                                >
                                    Drill Team Captains
                                </FormLabel>
                                <Input
                                    id="drillTeamCaptains"
                                    placeholder="Drill Team Captains"
                                    name="drill_team_captains"
                                    value={data.drill_team_captains ?? ""}
                                    onChange={handleChange}
                                    focusBorderColor="brand.400"
                                    shadow="sm"
                                    size="sm"
                                    w="full"
                                    rounded="md"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel
                                    htmlFor="schoolEnrollment"
                                    fontWeight={"normal"}
                                >
                                    School Enrollment
                                </FormLabel>
                                <Input
                                    id="schoolEnrollment"
                                    placeholder="School Enrollment"
                                    name="school_enrollment"
                                    value={data.school_enrollment ?? ""}
                                    onChange={handleChange}
                                    focusBorderColor="brand.400"
                                    shadow="sm"
                                    size="sm"
                                    w="full"
                                    rounded="md"
                                />
                            </FormControl>
                        </SimpleGrid>
                    </>
                ) : step == 5 ? (
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
                                    htmlFor="numberOfStudentsInBand"
                                    fontWeight={"normal"}
                                >
                                    Number of Students in Band
                                </FormLabel>
                                <Input
                                    id="numberOfStudentsInBand"
                                    placeholder="Number of Students in Band"
                                    name="number_of_students_in_band"
                                    value={
                                        data.number_of_students_in_band ?? ""
                                    }
                                    onChange={handleChange}
                                    focusBorderColor="brand.400"
                                    shadow="sm"
                                    size="sm"
                                    w="full"
                                    rounded="md"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel
                                    htmlFor="numberOfStudentsInColorGuard"
                                    fontWeight={"normal"}
                                >
                                    Number of Students in Color Guard
                                </FormLabel>
                                <Input
                                    id="numberOfStudentsInColorGuard"
                                    placeholder="Number of Students in Color Guard"
                                    name="number_of_students_in_color_guard"
                                    value={
                                        data.number_of_students_in_color_guard ??
                                        ""
                                    }
                                    onChange={handleChange}
                                    focusBorderColor="brand.400"
                                    shadow="sm"
                                    size="sm"
                                    w="full"
                                    rounded="md"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel
                                    htmlFor="numberOfStudentsInDrillTeam"
                                    fontWeight={"normal"}
                                >
                                    Number of Students in Drill Team
                                </FormLabel>
                                <Input
                                    id="numberOfStudentsInDrillTeam"
                                    placeholder="Number of Students in Drill Team"
                                    name="number_of_students_in_drill_team"
                                    value={
                                        data.number_of_students_in_drill_team ??
                                        ""
                                    }
                                    onChange={handleChange}
                                    focusBorderColor="brand.400"
                                    shadow="sm"
                                    size="sm"
                                    w="full"
                                    rounded="md"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel
                                    htmlFor="numberOfBuses"
                                    fontWeight={"normal"}
                                >
                                    Number of Buses
                                </FormLabel>
                                <Input
                                    id="numberOfBuses"
                                    placeholder="Number of Buses"
                                    name="number_of_buses"
                                    value={data.number_of_buses ?? ""}
                                    onChange={handleChange}
                                    focusBorderColor="brand.400"
                                    shadow="sm"
                                    size="sm"
                                    w="full"
                                    rounded="md"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel
                                    htmlFor="numberOfBoxTrucks"
                                    fontWeight={"normal"}
                                >
                                    Number of Box Trucks
                                </FormLabel>
                                <Input
                                    id="numberOfBoxTrucks"
                                    placeholder="Number of Box Trucks"
                                    name="number_of_box_trucks"
                                    value={data.number_of_box_trucks ?? ""}
                                    onChange={handleChange}
                                    focusBorderColor="brand.400"
                                    shadow="sm"
                                    size="sm"
                                    w="full"
                                    rounded="md"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel
                                    htmlFor="numberOfTrailers"
                                    fontWeight={"normal"}
                                >
                                    Number of Trailers
                                </FormLabel>
                                <Input
                                    id="numberOfTrailers"
                                    placeholder="Number of Trailers"
                                    name="number_of_trailers"
                                    value={data.number_of_trailers ?? ""}
                                    onChange={handleChange}
                                    focusBorderColor="brand.400"
                                    shadow="sm"
                                    size="sm"
                                    w="full"
                                    rounded="md"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel
                                    htmlFor="numberOfTractorTrailerRigs"
                                    fontWeight={"normal"}
                                >
                                    Number of Tractor Trailer Rigs
                                </FormLabel>
                                <Input
                                    id="numberOfTractorTrailerRigs"
                                    placeholder="Number of Tractor Trailer Rigs"
                                    name="number_of_tractor_trailer_rigs"
                                    value={
                                        data.number_of_tractor_trailer_rigs ??
                                        ""
                                    }
                                    onChange={handleChange}
                                    focusBorderColor="brand.400"
                                    shadow="sm"
                                    size="sm"
                                    w="full"
                                    rounded="md"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel
                                    htmlFor="specialInstructions"
                                    fontWeight={"normal"}
                                >
                                    Special Instructions
                                </FormLabel>
                                <Input
                                    id="specialInstructions"
                                    placeholder="Special Instructions"
                                    name="special_instructions"
                                    value={data.special_instructions ?? ""}
                                    onChange={handleChange}
                                    focusBorderColor="brand.400"
                                    shadow="sm"
                                    size="sm"
                                    w="full"
                                    rounded="md"
                                />
                            </FormControl>
                        </SimpleGrid>
                    </>
                ) : null}
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
                                isDisabled={step === 5}
                                onClick={() => {
                                    setStep(step + 1);
                                    if (step === 5) {
                                        setProgress(100);
                                    } else {
                                        setProgress(progress + 20);
                                    }
                                }}
                                colorScheme="teal"
                                variant="outline"
                            >
                                Next
                            </Button>
                        </Flex>
                        {step === 5 ? (
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
