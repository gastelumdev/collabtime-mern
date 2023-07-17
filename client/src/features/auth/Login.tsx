import React, { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { loginAsync, selectIsAuthenticated } from "./authSlice";

import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Button,
    Heading,
    Text,
    ChakraProvider,
    Alert,
    AlertIcon,
    AlertDescription,
    AlertTitle,
} from "@chakra-ui/react";

export function Login() {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const errorMessage = useAppSelector((state) => state.auth.error.message);
    const errorStatus = useAppSelector((state) => state.auth.error.status);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isError, setIsError] = useState(false);

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
        dispatch(loginAsync({ email, password }));
        setIsError(true);
    };

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <ChakraProvider>
            <Flex
                minH={"100vh"}
                align={"center"}
                justify={"center"}
                // bg={useColorModeValue("gray.50", "gray.800")}
            >
                <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
                    <Stack align={"center"}>
                        <Heading fontSize={"4xl"}>
                            Sign in to your account
                        </Heading>
                        <Text fontSize={"lg"} color={"gray.600"}>
                            to enjoy all of our cool{" "}
                            <Link to="/">features</Link> ✌️
                        </Text>
                    </Stack>
                    <Box
                        rounded={"lg"}
                        // bg={useColorModeValue("white", "gray.700")}
                        boxShadow={"lg"}
                        p={8}
                    >
                        <Stack spacing={4}>
                            <FormControl id="email">
                                <FormLabel>Email</FormLabel>
                                <Input type="text" onChange={handleEmail} />
                            </FormControl>
                            <FormControl id="password">
                                <FormLabel>Password</FormLabel>
                                <Input
                                    type="password"
                                    onChange={handlePassword}
                                />
                            </FormControl>
                            <Stack spacing={10}>
                                <Button
                                    bg={"blue.400"}
                                    color={"white"}
                                    _hover={{
                                        bg: "blue.500",
                                    }}
                                    onClick={handleSubmit}
                                >
                                    Sign in
                                </Button>
                                {errorStatus === 401 && isError ? (
                                    <Alert status="error">
                                        <AlertIcon />
                                        <AlertTitle>Login Error</AlertTitle>
                                        <AlertDescription>
                                            {errorMessage}
                                        </AlertDescription>
                                    </Alert>
                                ) : null}
                                <Stack pt={6}>
                                    <Text align={"center"}>
                                        Need to signup?{" "}
                                        <Link to="/register">Register</Link>
                                    </Text>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
            </Flex>
        </ChakraProvider>
    );
}
