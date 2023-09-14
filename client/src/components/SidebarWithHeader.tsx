"use client";

import config from "../config";

import {
    IconButton,
    Avatar,
    Box,
    CloseButton,
    Flex,
    HStack,
    VStack,
    Icon,
    useColorModeValue,
    Text,
    Drawer,
    DrawerContent,
    useDisclosure,
    BoxProps,
    FlexProps,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Button,
} from "@chakra-ui/react";
import {
    FiHome,
    FiTrendingUp,
    FiCompass,
    FiStar,
    FiSettings,
    FiMenu,
    FiBell,
    FiChevronDown,
} from "react-icons/fi";

import { IconType } from "react-icons";
import logo from "../logo.png";

interface LinkItemProps {
    name: string;
    href: string;
    icon: IconType;
}

interface NavItemProps extends FlexProps {
    icon: IconType;
    href: string;
    children: React.ReactNode;
}

interface MobileProps extends FlexProps {
    onOpen: () => void;
    handleLogout: () => void;
}

interface SidebarProps extends BoxProps {
    onClose: () => void;
}

const LinkItems: Array<LinkItemProps> = config.dashboardNavLinks;

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    return (
        <Box
            transition="3s ease"
            bg={useColorModeValue("white", "gray.900")}
            borderRight="1px"
            borderRightColor={useColorModeValue("gray.200", "gray.700")}
            w={{ base: "full", md: 60 }}
            pos="fixed"
            h="full"
            {...rest}
        >
            <Flex
                h="20"
                alignItems="center"
                mx="6"
                // mb="14"
                pl="0"
                justifyContent="space-between"
            >
                {/* <img src={logo} height={75} width={75} /> */}
                <Text fontSize={"24px"}>CollabTime</Text>
                <CloseButton
                    display={{ base: "flex", md: "none" }}
                    onClick={onClose}
                />
            </Flex>
            {LinkItems.map((link) => {
                if (link.name !== config.parentFeature) {
                    return (
                        <NavItem
                            key={link.name}
                            icon={link.icon}
                            href={
                                link.href +
                                `${localStorage.getItem(
                                    config.localStorageId
                                )}/`
                            }
                        >
                            {link.name}
                        </NavItem>
                    );
                }
                return (
                    <NavItem key={link.name} icon={link.icon} href={link.href}>
                        {link.name}
                    </NavItem>
                );
            })}
        </Box>
    );
};

const NavItem = ({ icon, href, children, ...rest }: NavItemProps) => {
    return (
        <Box
            as="a"
            href={href}
            style={{ textDecoration: "none" }}
            _focus={{ boxShadow: "none" }}
        >
            <Flex
                align="center"
                p="4"
                pl="6"
                // mx="8"
                // borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: "#3182ce",
                    color: "white",
                }}
                {...rest}
            >
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        _groupHover={{
                            color: "white",
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Box>
    );
};

const MobileNav = ({ onOpen, handleLogout, ...rest }: MobileProps) => {
    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 4 }}
            height="20"
            alignItems="center"
            bg={useColorModeValue("white", "gray.900")}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue("gray.200", "gray.700")}
            justifyContent={{ base: "space-between", md: "flex-end" }}
            {...rest}
        >
            <IconButton
                display={{ base: "flex", md: "none" }}
                onClick={onOpen}
                variant="outline"
                aria-label="open menu"
                icon={<FiMenu />}
            />

            <Text
                display={{ base: "flex", md: "none" }}
                fontSize="2xl"
                fontFamily="monospace"
                fontWeight="bold"
            >
                Logo
            </Text>

            <HStack spacing={{ base: "0", md: "6" }}>
                {/* <IconButton
                    size="lg"
                    variant="ghost"
                    aria-label="open menu"
                    icon={<FiBell />}
                /> */}
                <Flex alignItems={"center"}>
                    <Menu>
                        <MenuButton
                            py={2}
                            transition="all 0.3s"
                            _focus={{ boxShadow: "none" }}
                        >
                            <HStack>
                                <Avatar
                                    size={"sm"}
                                    // src={
                                    //     "https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                                    //     "/home/ogcollabtime/DevSchool/projects/collabtime-mern/client/public/avatar.png"
                                    // }
                                />
                                <VStack
                                    display={{ base: "none", md: "flex" }}
                                    alignItems="flex-start"
                                    spacing="1px"
                                    ml="2"
                                >
                                    {/* <Text fontSize="sm">Justina Clark</Text>
                                    <Text fontSize="xs" color="gray.600">
                                        Admin
                                    </Text> */}
                                </VStack>
                                <Box display={{ base: "none", md: "flex" }}>
                                    <FiChevronDown />
                                </Box>
                            </HStack>
                        </MenuButton>
                        <MenuList
                            bg={useColorModeValue("white", "gray.900")}
                            borderColor={useColorModeValue(
                                "gray.200",
                                "gray.700"
                            )}
                        >
                            {/* <MenuItem>Profile</MenuItem>
                            <MenuItem>Settings</MenuItem>
                            <MenuItem>Billing</MenuItem>
                            <MenuDivider /> */}
                            <MenuItem onClick={handleLogout}>Sign out</MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </HStack>
        </Flex>
    );
};

const SidebarWithHeader = ({ content, handleLogout }: any) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
            <SidebarContent
                onClose={() => onClose}
                display={{ base: "none", md: "block" }}
            />
            <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full"
            >
                <DrawerContent>
                    <SidebarContent onClose={onClose} />
                </DrawerContent>
            </Drawer>
            {/* mobilenav */}
            <MobileNav onOpen={onOpen} handleLogout={handleLogout} />
            <Box ml={{ base: 0, md: 60 }} p="4">
                {/* Content */}
                {content}
            </Box>
        </Box>
    );
};

export default SidebarWithHeader;
