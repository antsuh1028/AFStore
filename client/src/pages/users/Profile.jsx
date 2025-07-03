import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Container,
  useDisclosure,
  Flex,
  IconButton,
  Text,
  Heading,
  Link,
  VStack,
  useToast,
  Alert,
  AlertIcon,
  Spinner,
  Center,
  Button,
  Divider,
  HStack,
  Image,
  Grid,
  GridItem,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,
  TabList,
  Icon,
} from "@chakra-ui/react";
import Sidebar from "../../components/SideBar";
import NavDrawer from "../../components/NavDrawer";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useAuthContext } from "../../hooks/useAuth";
import { CheckCircleIcon } from "lucide-react";
import Footer from "../../components/Footer";

const myPages = (currPage, { userInfo, userName, userEmail, handleLogout, setCurrPage }) => {
  if (currPage === "all") {
    return (
      <>
        <Flex
          p={4}
          bg="#494949"
          borderRadius="full"
          align="center"
          justify="space-between"
          h="45px"
          mb={2}
        >
          <Text color="white" fontWeight="bold" ml={2}>
            Profile
          </Text>
          <Link
            fontSize="10px"
            color="white"
            textDecoration="underline"
            mx={2}
            _hover={{ color: "gray.200" }}
            minW="48px"
            textAlign="right"
          >
            Edit
          </Link>
        </Flex>
        <VStack p={2} my={4} align="stretch">
          <Box px={4} py={2}>
            <Grid templateColumns="90px 1fr" rowGap={4} columnGap={2}>
              <Text
                fontWeight="bold"
                textTransform="uppercase"
                textAlign="left"
                fontSize="sm"
                mr={2}
              >
                Name :
              </Text>
              <Text fontSize="sm" textAlign="left">
                {userName || "—"}
              </Text>
              <Text
                fontWeight="bold"
                textTransform="uppercase"
                textAlign="left"
                fontSize="sm"
                mr={2}
              >
                Email :
              </Text>
              <Text fontSize="sm" textAlign="left">
                {userEmail || "—"}
              </Text>
              <Text
                fontWeight="bold"
                textTransform="uppercase"
                textAlign="left"
                fontSize="sm"
                mr={2}
              >
                Phone :
              </Text>
              <Text fontSize="sm" textAlign="left">
                {userInfo?.phone_number || "—"}
              </Text>
              <Text
                fontWeight="bold"
                textTransform="uppercase"
                textAlign="left"
                fontSize="sm"
                mr={2}
              >
                Address :
              </Text>
              <Text fontSize="sm" textAlign="left" whiteSpace="pre-line">
                {userInfo?.address || "—"}
              </Text>
            </Grid>
          </Box>
          <Flex my={10} justify="space-between" width="100%">
            <Button
              bg="none"
              size="xs"
              textDecoration="underline"
              color="#b8b7b7"
              _hover={{ bg: "none", color: "black" }}
            >
              Delete Account
            </Button>
            <Button
              bg="none"
              size="xs"
              textDecoration="underline"
              color="#b8b7b7"
              _hover={{ bg: "none", color: "black" }}
              onClick={handleLogout}
            >
              Log out
            </Button>
          </Flex>
        </VStack>

        <Flex
          p={4}
          bg="#494949"
          borderRadius="full"
          align="center"
          justify="space-between"
          h="45px"
          mb={2}
        >
          <Text color="white" fontWeight="bold" ml={2}>
            My Orders
          </Text>
          <Link
            fontSize="10px"
            color="white"
            textDecoration="underline"
            mx={2}
            _hover={{ color: "gray.200" }}
            minW="48px"
            textAlign="right"
            onClick={() => {setCurrPage("orders")}}
          >
            View all
          </Link>
        </Flex>

        <Flex
          p={4}
          bg="#494949"
          borderRadius="full"
          align="center"
          justify="space-between"
          h="45px"
          mb={2}
        >
          <Text color="white" fontWeight="bold" ml={2}>
            Purchase History
          </Text>
          <Link
            fontSize="10px"
            color="white"
            textDecoration="underline"
            mx={2}
            _hover={{ color: "gray.200" }}
            minW="48px"
            textAlign="right"
            onClick={() => {setCurrPage("history")}}
          >
            View all
          </Link>
        </Flex>
      </>
    );
  }
  if (currPage === "orders") {
    return (
      <>
        <Flex
          p={4}
          bg="#494949"
          borderRadius="full"
          align="center"
          justify="space-between"
          h="45px"
          mb={2}
        >
          <Text color="white" fontWeight="bold" ml={2}>
            My Order
          </Text>
          <Link
            fontSize="10px"
            color="white"
            textDecoration="underline"
            mx={2}
            _hover={{ color: "gray.200" }}
            minW="48px"
            textAlign="right"
          >
            View all
          </Link>
        </Flex>
        <VStack bg="#f9f9f9" p={2} my={4}>
          <Flex>
            <Icon as={CheckCircleIcon} color="black" m={2} />
            <Text fontSize="12px" color="black" textAlign="left" ml={2} mr={4}>
              For order changes or mistakes, please contact us via the “Contact
              Us” page.
            </Text>
          </Flex>
          <Flex>
            <Icon as={CheckCircleIcon} color="black" m={2} />
            <Text fontSize="12px" color="black" textAlign="left" ml={2} mr={4}>
              Returns are not accepted once meat processing has begun.
            </Text>
          </Flex>
        </VStack>
      </>
    );
  }
  if (currPage === "history") {
    return <Text>History Content</Text>;
  }
  return null;
};

export const UserProfile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const toast = useToast();
  const pages = ["all", "orders", "history"];
  const [currPage, setCurrPage] = useState("all");

  const {
    userInfo,
    isAuthenticated,
    logout,
    userName,
    userId,
    loading,
    error,
    userEmail,
  } = useAuthContext();

  // Mock order data - replace with actual API call
  const [orders, setOrders] = useState([
    {
      id: 1,
      date: "04.17.2024",
      items: [
        {
          name: "Beef Clod, Korean-Inspired Marinated Sliced Boneless Beef",
          weight: "5 lbs/1 ~ 4 packs",
          image: "/api/placeholder/120/120",
        },
        {
          name: "Beef Clod, Korean-Inspired Marinated Sliced Boneless Beef",
          weight: "5 lbs/1 ~ 4 packs",
          image: "/api/placeholder/120/120",
        },
      ],
    },
    {
      id: 2,
      date: "02.28.2024",
      items: [
        {
          name: "Beef Clod, Korean-Inspired Marinated Sliced Boneless Beef",
          weight: "5 lbs/1 ~ 4 packs",
          image: "/api/placeholder/120/120",
        },
        {
          name: "Beef Clod, Korean-Inspired Marinated Sliced Boneless Beef",
          weight: "5 lbs/1 ~ 4 packs",
          image: "/api/placeholder/120/120",
        },
        {
          name: "Beef Clod, Korean-Inspired Marinated Sliced Boneless Beef",
          weight: "5 lbs/1 ~ 4 packs",
          image: "/api/placeholder/120/120",
        },
      ],
    },
  ]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    navigate("/");
  };

  // Show loading state
  if (loading) {
    return (
      <Sidebar>
        <Container
          maxW={{ base: "100%", lg: "30%" }}
          p={0}
          bg="white"
          border={{ base: "none", lg: "1px" }}
          ml={{ base: 0, lg: "40%" }}
        >
          <Center h="100vh">
            <VStack spacing={4}>
              <Spinner size="xl" />
              <Text>Loading profile...</Text>
            </VStack>
          </Center>
        </Container>
      </Sidebar>
    );
  }

  // Show error state
  if (error) {
    return (
      <Sidebar>
        <Container
          maxW={{ base: "100%", lg: "30%" }}
          p={0}
          bg="white"
          border={{ base: "none", lg: "1px" }}
          ml={{ base: 0, lg: "40%" }}
        >
          <Box p={6}>
            <Alert status="error" mb={4}>
              <AlertIcon />
              Error loading profile: {error}
            </Alert>
            <Button onClick={() => navigate("/")}>Go Home</Button>
          </Box>
        </Container>
      </Sidebar>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Sidebar>
      <NavDrawer isOpen={isOpen} onClose={onClose} containerRef={contentRef} />
      <Container
        ref={contentRef}
        maxW={{ base: "100%", lg: "30%" }}
        p={0}
        bg="white"
        border={{ base: "none", lg: "1px" }}
        ml={{ base: 0, lg: "40%" }}
      >
        {/* Header */}
        <Flex p={4} justify="space-between" align="center">
          <IconButton
            aria-label="Back"
            icon={<ChevronLeft size={24} />}
            variant="ghost"
            size="lg"
            colorScheme="gray"
            onClick={() => navigate("/")}
          />
          <IconButton
            aria-label="Menu"
            icon={<Text>☰</Text>}
            variant="ghost"
            onClick={onOpen}
          />
        </Flex>

        {/* Welcome Section */}
        <Box textAlign="center" mb={6} px={4}>
          <Heading as="h1" size="lg" mb={2}>
            <Text as="span" color="gray.500" fontWeight="normal">
              Hello.{" "}
            </Text>
            <Text as="span" color="black" fontWeight="medium">
              {userName}
            </Text>
          </Heading>
          <Tabs colorScheme="gray" align="center">
            <TabList
              gap={0}
              borderBottom="none"
              justifyContent="center"
              alignItems="center"
            >
              <Tab
                fontWeight="medium"
                px={2}
                py={1}
                fontSize="md"
                border="none"
                _selected={{
                  color: "black",
                  fontWeight: "bold",
                  border: "none",
                }}
                onClick={() => setCurrPage("all")}
                color="gray.600"
              >
                My Pages
              </Tab>
              <Text
                mx={2}
                color="gray.400"
                fontWeight="normal"
                fontSize="lg"
                userSelect="none"
              >
                |
              </Text>
              <Tab
                fontWeight="medium"
                px={2}
                py={1}
                fontSize="md"
                border="none"
                _selected={{
                  color: "black",
                  fontWeight: "bold",
                  border: "none",
                }}
                color="gray.600"
              >
                Cart
              </Tab>
            </TabList>
            <TabPanels my={12}>
              <TabPanel p={0}>
                {myPages(currPage, { userInfo, userName, userEmail, handleLogout, setCurrPage })}
              </TabPanel>
              <TabPanel p={0}>Cart</TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
        <Footer/>
      </Container>
    </Sidebar>
  );
};
