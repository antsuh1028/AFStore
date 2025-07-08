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
import { ExternalLinkIcon } from "@chakra-ui/icons";

// OrdersList component to show orders, order items, and item details
import { SimpleGrid } from "@chakra-ui/react";

const OrdersList = ({ orders }) => {
  const navigate = useNavigate();
  const [orderItemsMap, setOrderItemsMap] = useState({});
  const [itemDetailsMap, setItemDetailsMap] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orders || orders.length === 0) return;
    setLoading(true);

    const fetchOrderItemsAndDetails = async () => {
      const itemsMap = {};
      const itemIds = new Set();

      await Promise.all(
        orders.map(async (order) => {
          const res = await fetch(
            `http://localhost:3001/api/order-items/orders/${order.id}`
          );
          const data = await res.json();
          if (data.success) {
            itemsMap[order.id] = data.data;
            data.data.forEach((oi) => itemIds.add(oi.item_id));
          }
        })
      );
      setOrderItemsMap(itemsMap);

      const detailsMap = {};
      await Promise.all(
        Array.from(itemIds).map(async (itemId) => {
          const res = await fetch(`http://localhost:3001/api/items/${itemId}`);
          const data = await res.json();
          if (data.data) {
            detailsMap[itemId] = data.data;
          }
        })
      );
      setItemDetailsMap(detailsMap);
      setLoading(false);
    };

    fetchOrderItemsAndDetails();
  }, [orders]);

  if (loading) {
    return (
      <Center py={6}>
        <Spinner size="md" />
        <Text ml={2}>Loading order details...</Text>
      </Center>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Text color="gray.500" py={4}>
        No orders found.
      </Text>
    );
  }

  return (
    <VStack align="stretch" spacing={8} py={4}>
      {orders.map((order) => (
        <Box key={order.id}>
          <Flex
            gap={4}
            alignItems="center"
            justifyContent="center"
            alignSelf="center"
            height="24px"
          >
            {" "}
            <Text
              fontSize="sm"
              color="gray.500"
              mb={2}
              textAlign="left"
              textDecoration="underline"
            >
              {order.order_date
                ? new Date(order.order_date).toLocaleDateString()
                : ""}
            </Text>
            <Divider
              orientation="vertical"
              borderColor="black"
              bg="black"
              height="20px"
            />
            <Text
              fontSize="sm"
              color="gray.500"
              mb={2}
              textAlign="left"
              fontWeight="bold"
            >
              {order.order_status}
            </Text>
          </Flex>
          <SimpleGrid columns={1} spacing={4}>
            {(orderItemsMap[order.id] || []).map((oi) => {
              const item = itemDetailsMap[oi.item_id] || {};
              const safeStyle = item.style
                ? item.style.replace(/[^a-zA-Z0-9-_]/g, " ")
                : "";
              const safeName = item.name
                ? item.name.replace(/[^a-zA-Z0-9-_]/g, " ")
                : "";
              const imgSrc =
                safeStyle && safeName
                  ? `/products/${safeStyle}/${safeName}/01.jpg`
                  : "/gray.avif";
              return (
                <Flex
                  key={oi.id}
                  bg="white"
                  borderRadius="xl"
                  boxShadow="md"
                  p={3}
                  alignItems="center"
                  _hover={{ cursor: "pointer" }}
                  onClick={() => {
                    navigate(`/wholesale/product/${item.id}`);
                  }}
                >
                  <Image
                    src={imgSrc}
                    alt={item.name || ""}
                    boxSize="80px"
                    objectFit="cover"
                    borderRadius="md"
                    fallbackSrc="/gray.avif"
                    mr={4}
                  />
                  <Box flex="1">
                    <Text fontWeight="semibold" fontSize="sm" noOfLines={2} textAlign="left">
                      {item.name || "Item"}
                    </Text>
                    <Text fontSize="xs" color="gray.500" mt={1} textAlign="left">
                      {item.spec || ""}
                    </Text>
                    <Text fontSize="xs" color="gray.500" mt={1} textAlign="left">
                      Qty: {oi.quantity}
                    </Text>
                  </Box>
                </Flex>
              );
            })}
          </SimpleGrid>
        </Box>
      ))}
    </VStack>
  );
};

const myPages = (
  currPage,
  { userInfo, userName, userEmail, handleLogout, setCurrPage, orders }
) => {
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
            onClick={() => {
              setCurrPage("orders");
            }}
          >
            View all
          </Link>
        </Flex>
        <OrdersList orders={orders.slice(0, 2)} />

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
            onClick={() => {
              setCurrPage("history");
            }}
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
            My Orders
          </Text>
        </Flex>
        <OrdersList orders={orders} />
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

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/orders/user/${userId}`
        );
        const data = await response.json();
        if (data.success) {
          setOrders(data.data);
        }
      } catch (err) {
        // handle error
      }
    };

    if (userId) {
      fetchOrders();
    }
  }, [userId]);

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
              Hello,{" "}
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
                {myPages(currPage, {
                  userInfo,
                  userName,
                  userEmail,
                  handleLogout,
                  setCurrPage,
                  orders,
                })}
              </TabPanel>
              <TabPanel p={0}>Cart</TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
        <Footer />
      </Container>
    </Sidebar>
  );
};
