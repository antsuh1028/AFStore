import React, { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
} from "@chakra-ui/react";
import Sidebar from "../../components/SideBar";
import NavDrawer from "../../components/NavDrawer";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Filter } from "lucide-react";
import { useAuthContext } from "../../hooks/useAuth";
import { CheckCircleIcon } from "lucide-react";
import Footer from "../../components/Footer";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { SimpleGrid } from "@chakra-ui/react";
import {
  getCart,
} from "../../utils/cartActions";
import { ShowCart } from "../../components/shop/ShowCart";

const API_URL = import.meta.env.MODE === 'production' 
  ? import.meta.env.VITE_API_URL 
  : import.meta.env.VITE_API_URL_DEV;

const OrdersList = ({ orders, currPage }) => {
  const navigate = useNavigate();
  const [orderItemsMap, setOrderItemsMap] = useState({});
  const [itemDetailsMap, setItemDetailsMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filteredOrders, setFilteredOrders] = useState(orders);

  const getUniqueStatuses = () => {
    const statuses = [...new Set(orders.map((order) => order.order_status))];
    return statuses.filter((status) => status);
  };

  useEffect(() => {
    if (filterStatus === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter((order) => order.order_status === filterStatus)
      );
    }
  }, [orders, filterStatus]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "yellow";
      case "complete":
        return "green";
      case "processing":
        return "blue";
      case "cancelled":
        return "red";
      case "shipped":
        return "purple";
      default:
        return "gray";
    }
  };

  useEffect(() => {
    if (!filteredOrders || filteredOrders.length === 0) return;
    setLoading(true);

    const fetchOrderItemsAndDetails = async () => {
      const itemsMap = {};
      const itemIds = new Set();

      await Promise.all(
        filteredOrders.map(async (order) => {
          const res = await fetch(
            `${API_URL}/api/order-items/orders/${order.id}`
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
          const res = await fetch(`${API_URL}/api/items/${itemId}`);
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
  }, [filteredOrders]);

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
      {currPage === "orders" && (
        <Flex alignItems="center" justifyContent="space-between" px={4}>
          <Text fontSize="sm" color="gray.600">
            {filteredOrders.length} of {orders.length} orders
          </Text>

          <Flex alignItems="center" gap={2}>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                size="xs"
                variant="outline"
                leftIcon={<Filter size={16} />}
                bg="white"
                borderColor="gray.300"
                _hover={{ bg: "gray.50" }}
                _active={{ bg: "gray.100" }}
              >
                {filterStatus === "all" ? "All Status" : filterStatus}
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={() => setFilterStatus("all")}
                  bg={filterStatus === "all" ? "gray.100" : "white"}
                >
                  <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <Text>All Status</Text>
                    <Badge colorScheme="gray" ml={2}>
                      {orders.length}
                    </Badge>
                  </Flex>
                </MenuItem>
                <Divider />
                {getUniqueStatuses().map((status) => {
                  const count = orders.filter(
                    (order) => order.order_status === status
                  ).length;
                  return (
                    <MenuItem
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      bg={filterStatus === status ? "gray.100" : "white"}
                    >
                      <Flex
                        alignItems="center"
                        justifyContent="space-between"
                        width="100%"
                      >
                        <Text textTransform="capitalize">{status}</Text>
                        <Badge colorScheme={getStatusColor(status)} ml={2}>
                          {count}
                        </Badge>
                      </Flex>
                    </MenuItem>
                  );
                })}
              </MenuList>
            </Menu>

            {filterStatus !== "all" && (
              <Button
                size="xs"
                variant="ghost"
                onClick={() => setFilterStatus("all")}
                color="blue.500"
                _hover={{ bg: "blue.50" }}
              >
                Clear
              </Button>
            )}
          </Flex>
        </Flex>
      )}

      {filteredOrders.length === 0 ? (
        <Center py={8}>
          <VStack spacing={2}>
            <Text color="gray.500">
              {currPage === "orders" && filterStatus !== "all"
                ? `No orders found with status "${filterStatus}"`
                : "No orders found."}
            </Text>
            {currPage === "orders" && filterStatus !== "all" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setFilterStatus("all")}
              >
                Show All Orders
              </Button>
            )}
          </VStack>
        </Center>
      ) : (
        filteredOrders
          .sort((b, a) => new Date(a.order_date) - new Date(b.order_date))
          .map((order) => (
            <Box key={order.id}>
              <Flex
                gap={4}
                alignItems="left"
                justifyContent="left"
                alignSelf="center"
                height="24px"
                ml={4}
                mb={4}
              >
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
                <Badge
                  colorScheme={getStatusColor(order.order_status)}
                  fontSize="xs"
                  mb={2}
                  textTransform="capitalize"
                >
                  {order.order_status}
                </Badge>
                <Divider
                  orientation="vertical"
                  borderColor="black"
                  bg="black"
                  height="20px"
                />
                <Text fontSize="xs" color="gray.500" mb={2} textAlign="left">
                  {order.order_number}
                </Text>
              </Flex>
              <SimpleGrid columns={2} spacing={4}>
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
                    <VStack
                      key={oi.id}
                      bg="white"
                      borderRadius="xl"
                      p={2}
                      alignItems="center"
                      _hover={{ cursor: "pointer", boxShadow: "sm" }}
                      onClick={() => {
                        navigate(`/wholesale/product/${item.id}`);
                      }}
                    >
                      <Image
                        src={imgSrc}
                        alt={item.name || ""}
                        boxSize="175px"
                        objectFit="cover"
                        borderRadius="md"
                        fallbackSrc="/gray.avif"
                      />
                      <Box flex="1">
                        <Text
                          fontWeight="semibold"
                          fontSize="sm"
                          noOfLines={2}
                          textAlign="left"
                        >
                          {item.name || "Item"}
                        </Text>
                        <Text
                          fontSize="xs"
                          color="gray.500"
                          mt={1}
                          textAlign="left"
                        >
                          {item.spec || ""}
                        </Text>
                        <Text
                          fontSize="xs"
                          color="gray.500"
                          mt={1}
                          textAlign="left"
                        >
                          Qty: {oi.quantity}
                        </Text>
                      </Box>
                    </VStack>
                  );
                })}
              </SimpleGrid>
              <Divider borderColor="gray.200" my={2} />
            </Box>
          ))
      )}
    </VStack>
  );
};

const myPages = (
  currPage,
  { userInfo, userName, userEmail, handleLogout, setCurrPage, orders, address }
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
                {address}
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
        <OrdersList orders={orders.slice(0, 2)} currPage={currPage} />
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
        <OrdersList orders={orders} currPage={currPage} />
        <VStack bg="#f9f9f9" p={2} my={4}>
          <Flex>
            <Icon as={CheckCircleIcon} color="black" m={2} />
            <Text fontSize="12px" color="black" textAlign="left" ml={2} mr={4}>
              For order changes or mistakes, please contact us via the "Contact
              Us" page.
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

const UserProfile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const toast = useToast();
  const [currPage, setCurrPage] = useState("all");
  const location = useLocation();
  const defaultTabIndex = location.state?.activeTab || 0;

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
  const [cartItems, setCartItems] = useState(() => getCart());
  const [userAddress, setUserAddress] = useState([]);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const formatAddress = (addressData) => {
    if (!addressData || addressData.length === 0) return "—";

    const addr = Array.isArray(addressData) ? addressData[0] : addressData;

    if (!addr) return "—";

    const parts = [
      addr.address_line_1,
      addr.address_line_2,
      `${addr.city}, ${addr.state} ${addr.zip_code}`,
    ].filter(Boolean);

    return parts.join(",");
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/orders/user/${userId}`
        );
        const data = await response.json();
        if (data.success) {
          setOrders(data.data);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const addressResponse = await fetch(
          `${API_URL}/api/shipping-addresses/user/${userId}`
        );

        const address = await addressResponse.json();
        if (address.success) {
          setUserAddress(address.data[0]);
          console.log("done");
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    if (userId) {
      fetchAddress();
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
          minH="100vh"
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

  if (!userInfo) {
    return (
      <Sidebar>
        <Container
          maxW={{ base: "100%", lg: "30%" }}
          p={0}
          bg="white"
          border={{ base: "none", lg: "1px" }}
          ml={{ base: 0, lg: "40%" }}
          minH="100vh"
        >
          <Center h="100vh">
            <VStack spacing={4}>
              <Spinner size="xl" />
              <Text>Loading user info...</Text>
            </VStack>
          </Center>
        </Container>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <NavDrawer isOpen={isOpen} onClose={onClose} containerRef={contentRef} />
      <Container
        ref={contentRef}
        maxW={{ base: "100%", lg: "30%" }}
        p={0}
        bg="white"
        boxShadow="xl"
        ml={{ base: 0, lg: "40%" }}
        minH="100vh"
      >
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

        <Box textAlign="center" mb={6}>
          <Heading as="h1" size="lg" mb={8}>
            <Text as="span" color="gray.500" fontWeight="normal">
              Hello,{" "}
            </Text>
            <Text as="span" color="black" fontWeight="medium">
              {userName}
            </Text>
          </Heading>

          {userInfo.is_admin ? (
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
                  Profile
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
                  onClick={() => navigate("/admin/dashboard")}
                >
                  Admin Dashboard
                </Tab>
              </TabList>
              <TabPanels my={12}>
                <TabPanel p={4}>
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
                        <Text
                          fontSize="sm"
                          textAlign="left"
                          whiteSpace="pre-line"
                        >
                          {formatAddress(userAddress) || "—"}
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
                </TabPanel>
              </TabPanels>
            </Tabs>
          ) : (
            <Tabs
              colorScheme="gray"
              align="center"
              defaultIndex={defaultTabIndex}
            >
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
              <TabPanels my={8}>
                <TabPanel>
                  {myPages(currPage, {
                    userInfo,
                    userName,
                    userEmail,
                    handleLogout,
                    setCurrPage,
                    orders,
                    address: formatAddress(userAddress),
                  })}
                </TabPanel>
                <TabPanel>
                  <Flex
                    p={4}
                    bg="#494949"
                    borderRadius="full"
                    align="center"
                    justify="space-between"
                    h="45px"
                    mb={8}
                  >
                    <Text color="white" fontWeight="bold" ml={2}>
                      Cart
                    </Text>
                    <Text color="white" fontWeight="normal" fontSize="14px">
                      {totalItems} item(s)
                    </Text>
                  </Flex>
                  <ShowCart
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                    totalPrice={totalPrice}
                  />
                  
                  {cartItems.length !== 0 && <Button
                    size="sm"
                    bg="#ECECEC"
                    color="#494949"
                    _hover={{ bg: "#6AAFDB" }}
                    onClick={() => navigate("/order-summary")}
                    borderRadius="full"
                    h="45px"
                    w="100%"
                  >
                    CHECK OUT ${totalPrice.toFixed(2)}
                  </Button>}
                </TabPanel>
              </TabPanels>
            </Tabs>
          )}
        </Box>
        <Footer />
      </Container>
    </Sidebar>
  );
};

export default UserProfile;
