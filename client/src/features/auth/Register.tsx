import React, { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
    registerAsync,
    selectIsAuthenticated,
    selectStatus,
} from "./authSlice";
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    HStack,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    ChakraProvider,
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const Register = () => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const status = useAppSelector(selectStatus);
    const dispatch = useAppDispatch();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const errorMessage = useAppSelector((state) => state.auth.error.message);
    const errorStatus = useAppSelector((state) => state.auth.error.status);
    const [err, setErr] = useState(
        useAppSelector((state) => state.auth.error.message)
    );
    const [isError, setIsError] = useState(false);

    if (status === "loading") {
        console.log("Spinning!");
        return null;
    }

    const handleUsername = (event: {
        target: { value: React.SetStateAction<string> };
    }) => {
        setUsername(event.target.value);
    };

    const handleEmail = (event: {
        target: { value: React.SetStateAction<string> };
    }) => {
        setEmail(event.target.value);
    };

    const handlePassword = (event: {
        target: { value: React.SetStateAction<string> };
    }) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        dispatch(registerAsync({ username, email, password }));
        setIsError(true);
    };

    return isAuthenticated ? (
        <Navigate to="/" />
    ) : (
        <ChakraProvider>
            <Flex
                minH={"100vh"}
                align={"center"}
                justify={"center"}
                // bg={useColorModeValue("gray.50", "gray.800")}
            >
                <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
                    <Stack align={"center"}>
                        <Heading fontSize={"4xl"} textAlign={"center"}>
                            Sign up
                        </Heading>
                        <Text fontSize={"lg"} color={"gray.600"}>
                            to enjoy an easier way to manage your events ✌️
                        </Text>
                    </Stack>
                    <Box
                        rounded={"lg"}
                        // bg={useColorModeValue("white", "gray.700")}
                        boxShadow={"lg"}
                        p={8}
                    >
                        <Stack spacing={4}>
                            <FormControl id="username" isRequired>
                                <FormLabel>Username</FormLabel>
                                <Input type="text" onChange={handleUsername} />
                            </FormControl>
                            <FormControl id="email" isRequired>
                                <FormLabel>Email address</FormLabel>
                                <Input type="email" onChange={handleEmail} />
                            </FormControl>
                            <FormControl id="password" isRequired>
                                <FormLabel>Password</FormLabel>
                                <InputGroup>
                                    <Input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        onChange={handlePassword}
                                    />
                                    <InputRightElement h={"full"}>
                                        <Button
                                            variant={"ghost"}
                                            onClick={() =>
                                                setShowPassword(
                                                    (showPassword) =>
                                                        !showPassword
                                                )
                                            }
                                        >
                                            {showPassword ? (
                                                <ViewIcon />
                                            ) : (
                                                <ViewOffIcon />
                                            )}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                            <Stack spacing={10} pt={2}>
                                <Button
                                    loadingText="Submitting"
                                    size="lg"
                                    bg={"blue.400"}
                                    color={"white"}
                                    _hover={{
                                        bg: "blue.500",
                                    }}
                                    onClick={handleSubmit}
                                >
                                    Sign up
                                </Button>
                                {errorStatus === 500 && isError ? (
                                    <Alert status="error">
                                        <AlertIcon />
                                        <AlertTitle>Signup Error</AlertTitle>
                                        <AlertDescription>
                                            {errorMessage}
                                        </AlertDescription>
                                    </Alert>
                                ) : null}
                            </Stack>
                            <Stack pt={6}>
                                <Text align={"center"}>
                                    Already a user?{" "}
                                    <Link to="/login">Login</Link>
                                </Text>
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
            </Flex>
        </ChakraProvider>
    );
};

export default Register;
