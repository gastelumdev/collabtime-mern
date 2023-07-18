import React, { useEffect, useState } from "react";
import { updateDataAsync, getDataAsync } from "./slice";
import { TData } from "./types";
import config from "./config";
import {
    Button,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    FormLabel,
    Input,
    DrawerFooter,
    Box,
    useDisclosure,
    Stack,
} from "@chakra-ui/react";
import { useAppDispatch } from "../../app/hooks";

interface PropsType {
    _data: TData;
    onRerender(): void;
}

const Edit = (props: PropsType) => {
    const [redirect, setRedirect] = useState(false);
    const { _data, onRerender } = props;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [data, setData] = useState<TData>({
        ...config.defaultData,
        owner: localStorage.getItem("userId"),
    });

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getDataAsync());
    }, [dispatch, data]);

    const handleClick = () => {
        onOpen();
        setData(_data);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = event.target;
        setData({
            ...data,
            [name]: value,
        });
    };

    const onSubmit = () => {
        dispatch(
            updateDataAsync({
                ...data,
                owner: localStorage.getItem("userId"),
            })
        );
        dispatch(getDataAsync());
        onRedirect();
        onRerender();
        onClose();
    };

    const onRedirect = () => {
        setRedirect(!redirect);
    };

    return (
        <>
            <Button
                colorScheme="teal"
                variant="ghost"
                size="xs"
                onClick={() => handleClick()}
            >
                Edit
            </Button>

            <Drawer onClose={onClose} isOpen={isOpen} size={"full"}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>
                        Edit{" "}
                        {config.singularName.charAt(0).toUpperCase() +
                            config.singularName.slice(1)}
                    </DrawerHeader>
                    <DrawerBody>
                        <DrawerBody>
                            <Stack spacing="24px">
                                {" "}
                                */
                                {config.formInputs.map(
                                    (item: string, index: any) => {
                                        return (
                                            <Box key={index}>
                                                <FormLabel htmlFor={item}>
                                                    {item
                                                        .charAt(0)
                                                        .toUpperCase() +
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
                            <Button colorScheme="blue" onClick={onSubmit}>
                                Submit
                            </Button>
                        </DrawerFooter>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default Edit;
