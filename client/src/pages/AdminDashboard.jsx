import React, { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Text,
  Heading,
  SimpleGrid,
  Button,
  IconButton,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  Image,
  Divider,
  Select,
  Spinner,
  Alert,
  AlertIcon,
  Center,
  useToast,
} from "@chakra-ui/react";
import { BellIcon, ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { useAuthContext } from "../hooks/useAuth";

import {
  Signups,
  Orders,
  InventoryStatus,
} from "../components/admin/DashboardComponents";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const {
    userInfo,
    isAuthenticated,
    logout,
    userName,
    userId,
    loading: authLoading,
    error: authError,
    token,
  } = useAuthContext();

  const [isLoadingAdmin, setIsLoadingAdmin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [orders, setOrders] = useState([]);
  const [orderItemsMap, setOrderItemsMap] = useState({});
  const [itemsMap, setItemsMap] = useState({});
  const [usersMap, setUsersMap] = useState({});
  const [inventory, setInventory] = useState([]);
  const [signupRequests, setSignupRequests] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  const pages = {
    1: "Dashboard",
    2: "Orders",
    3: "Sign Ups & Inquiries",
    4: "Inventory Status",
  };
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isAuthenticated || !userId || !token) {
        setIsLoadingAdmin(false);
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(`http://localhost:3001/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const userData = await res.json();

        const user = userData.user || userData;
        const adminStatus = user.is_admin === true || user.isAdmin === true;

        setIsAdmin(adminStatus);

        if (!adminStatus) {
          navigate("/login");
          return;
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
        navigate("/login");
      } finally {
        setIsLoadingAdmin(false);
      }
    };

    if (!authLoading) {
      checkAdminStatus();
    }
  }, [isAuthenticated, userId, token, authLoading, navigate]);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin || !token) return;

    const fetchInquiries = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/inquiries", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data.success) {
          setInquiries(data.data);
        } else {
          setInquiries([]);
        }
      } catch (err) {
        console.error("Error fetching inquiries:", err);
        setInquiries([]);
      }
    };

    fetchInquiries();
  }, [isAuthenticated, isAdmin, token]);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin || !token) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setOrders(data);
        } else if (data.data) {
          setOrders(data.data);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrders([]);
      }
    };
    fetchOrders();
  }, [isAuthenticated, isAdmin, token]);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin || !token) return;

    const fetchOrderItems = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/order-items", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const map = {};
          data.data.forEach((item) => {
            if (!map[item.order_id]) map[item.order_id] = [];
            map[item.order_id].push(item);
          });
          setOrderItemsMap(map);
        } else {
          setOrderItemsMap({});
        }
      } catch (err) {
        console.error("Error fetching order items:", err);
        setOrderItemsMap({});
      }
    };
    fetchOrderItems();
  }, [isAuthenticated, isAdmin, token]);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin || !token) return;

    const fetchItems = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/items", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const map = {};
          data.data.forEach((item) => {
            map[item.id] = item;
          });
          setItemsMap(map);
        } else {
          setItemsMap({});
        }
      } catch (err) {
        console.error("Error fetching items:", err);
        setItemsMap({});
      }
    };
    fetchItems();
  }, [isAuthenticated, isAdmin, token]);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin || !token) return;

    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        if (data && Array.isArray(data)) {
          const map = {};
          data.forEach((user) => {
            if (user && user.id) {
              map[user.id] = user;
            }
          });
          setUsersMap(map);
        } else {
          console.warn("API response structure unexpected:", data);
          setUsersMap({});
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setUsersMap({});
      }
    };

    fetchUsers();
  }, [isAuthenticated, isAdmin, token]);

  useEffect(() => {
    if (Object.keys(itemsMap).length > 0) {
      const inventoryData = Object.values(itemsMap).map((item) => ({
        item_id: item.id,
        item_name: item.item_name,
        category: item.category || "Meat",
        quantity_in_stock: Math.floor(Math.random() * 500) + 50,
        unit: "kg",
      }));
      setInventory(inventoryData);
    }
  }, [itemsMap]);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin || !token) return;

    const fetchSignupRequests = async () => {
      try {
        const res = await fetch(
          "http://localhost:3001/api/users/signup-requests",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setSignupRequests(data);
        } else {
          console.error("Failed to fetch signup requests");
          setSignupRequests([]);
        }
      } catch (err) {
        console.error("Error fetching signup requests:", err);
        setSignupRequests([]);
      }
    };

    fetchSignupRequests();
  }, [isAuthenticated, isAdmin, token]);

  const getStockStatus = (quantity) => {
    if (quantity <= 50) return "Critical";
    if (quantity <= 150) return "Low";
    return "Good";
  };

  const statusColor = (status) => {
    if (status === "Good" || status === "Order Placed" || status === "In Stock")
      return "green";
    if (status === "Low" || status === "Quote Sent") return "yellow";
    if (
      status === "Critical" ||
      status === "Pending" ||
      status === "Out of Stock"
    )
      return "red";
    if (status === "Contacted" || status === "complete") return "blue";
    return "gray";
  };

  const getUserName = (userId) => {
    const user = usersMap[userId];
    if (user) {
      return user.name || user.username || user.email || `User #${userId}`;
    }
    return `User #${userId}`;
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (authLoading || isLoadingAdmin) {
    return (
      <Center minH="100vh">
        <Box textAlign="center">
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text mt={4} fontSize="lg">
            {authLoading ? "Loading user..." : "Verifying admin access..."}
          </Text>
        </Box>
      </Center>
    );
  }

  if (authError) {
    return (
      <Center minH="100vh" p={8}>
        <Alert status="error" maxW="md" borderRadius="lg">
          <AlertIcon />
          <Box>
            <Text fontWeight="bold">Authentication Error</Text>
            <Text>{authError}</Text>
            <Button mt={4} size="sm" onClick={() => navigate("/login")}>
              Go to Login
            </Button>
          </Box>
        </Alert>
      </Center>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <Center minH="100vh" p={8}>
        <Alert status="error" maxW="md" borderRadius="lg">
          <AlertIcon />
          <Box>
            <Text fontWeight="bold">Access Denied</Text>
            <Text>You don't have permission to access this admin page.</Text>
            <Button mt={4} size="sm" onClick={() => navigate("/")}>
              Go Home
            </Button>
          </Box>
        </Alert>
      </Center>
    );
  }

  return (
    <Box bg="gray.50" minH="100vh" px={[2, 4, 12]} py={4}>
      <Flex align="center" justify="space-between" mb={4}>
        <Flex align="center" gap={[2, 4]}>
          <Image boxSize={["24px", "32px"]} src="/MainLogo.png" alt="Logo" />
          <Text
            fontWeight="bold"
            fontSize={["md", "lg"]}
            letterSpacing="wide"
            _hover={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            AdamsFoods
          </Text>
          <Text
            fontWeight="semibold"
            fontSize={["sm", "lg"]}
            color="gray.600"
            display={["none", "block"]}
          >
            MEAT WHOLESALE
          </Text>
        </Flex>
        <Flex align="center" gap={[2, 4]}>
          <Text
            fontSize={["xs", "sm"]}
            color="gray.600"
            display={["none", "block"]}
          >
            Welcome, {userName || userInfo?.name || "Admin"}
          </Text>
          <Button
            variant="outline"
            size={["xs", "sm"]}
            colorScheme="red"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Flex>
      </Flex>
      <Divider
        orientation="horizontal"
        my={4}
        border="1px"
        borderColor="gray.400"
      />
      <Flex align="center" gap={6} mb={4} justify="space-between">
        <IconButton
          icon={<ChevronLeftIcon boxSize={6} />}
          aria-label="Back"
          size="sm"
          variant="ghost"
          onClick={() => {
            currentPage === 1
              ? navigate(`/profile/user/${userId}`)
              : setCurrentPage(1);
          }}
        />

        <Flex align="center" gap={6}>
          <Flex align="center" gap={2}>
            <IconButton
              icon={<BellIcon />}
              aria-label="Notifications"
              size="sm"
              variant="ghost"
            />
            <Badge
              colorScheme="red"
              borderRadius="full"
              px={2}
              fontWeight="bold"
              fontSize="md"
            >
              4
            </Badge>
            <Text fontWeight="semibold" fontSize="md">
              Notifications
            </Text>
          </Flex>

          <Divider orientation="vertical" height="24px" />

          <Box>
            <Text fontWeight="semibold" fontSize="md">
              Date
            </Text>
            <Text fontSize="sm" color="gray.600">
              {new Date(
                Date.now() - 7 * 24 * 60 * 60 * 1000
              ).toLocaleDateString()}{" "}
              – {new Date().toLocaleDateString()}
            </Text>
          </Box>
        </Flex>
      </Flex>
      <Flex align="center" justify="space-between" mb={8}>
        <Heading
          as="h1"
          fontWeight="extrabold"
          fontSize={["3xl", "4xl"]}
          letterSpacing="tight"
          lineHeight="1"
        >
          Dashboard{" "}
          {currentPage !== 1 && (
            <Text as="span" fontWeight="normal" fontSize="2x">
              - {pages[currentPage]}
            </Text>
          )}
        </Heading>
      </Flex>
      {currentPage === 1 && (
        <>
          <SimpleGrid columns={[1, 2]} spacing={6} mb={8}>
            <Flex
              bg="white"
              borderRadius="2xl"
              p={6}
              boxShadow="sm"
              flexDirection="row"
              alignItems="flex-start"
              gap={16}
              position="relative"
              overflow="hidden"
            >
              <Box textAlign="left">
                <Text fontWeight="bold" fontSize="lg" mb={1} noOfLines={2}>
                  New Orders (Pick Up)
                </Text>
                <Text fontWeight="extrabold" fontSize="3xl" mb={2}>
                  {
                    orders.filter((order) => order.delivery_method === "pickup")
                      .length
                  }
                </Text>
              </Box>

              <Box textAlign="left">
                <Text fontWeight="bold" fontSize="lg" mb={1} noOfLines={2}>
                  New Orders (Delivery)
                </Text>
                <Text fontWeight="extrabold" fontSize="3xl" mb={2}>
                  {
                    orders.filter(
                      (order) => order.delivery_method === "delivery"
                    ).length
                  }
                </Text>
              </Box>

              <IconButton
                icon={<ChevronRightIcon boxSize={6} />}
                aria-label="Go"
                size="sm"
                position="absolute"
                top={4}
                right={4}
                variant="ghost"
                onClick={() => setCurrentPage(2)}
              />
            </Flex>

            <Flex
              bg="white"
              borderRadius="2xl"
              p={6}
              boxShadow="sm"
              flexDirection="row"
              alignItems="flex-start"
              gap={16}
              position="relative"
              overflow="hidden"
            >
              <Box textAlign="left">
                <Text fontWeight="bold" fontSize="lg" mb={1} noOfLines={2}>
                  Sign up Requests
                </Text>
                <Text fontWeight="extrabold" fontSize="3xl" mb={2}>
                  {signupRequests.length}
                </Text>
              </Box>

              <Box textAlign="left">
                <Text fontWeight="bold" fontSize="lg" mb={1} noOfLines={2}>
                  Inquiries
                </Text>
                <Text fontWeight="extrabold" fontSize="3xl" mb={2}>
                  {inquiries.length}
                </Text>
              </Box>

              <IconButton
                icon={<ChevronRightIcon boxSize={6} />}
                aria-label="Go"
                size="sm"
                position="absolute"
                top={4}
                right={4}
                variant="ghost"
                onClick={() => setCurrentPage(3)}
              />
            </Flex>
          </SimpleGrid>

          <SimpleGrid columns={[1, 2]} spacing={6} mb={8}>
            <Box
              bg="white"
              borderRadius="2xl"
              p={6}
              boxShadow="sm"
              minH="320px"
              overflow="hidden"
            >
              <Flex justify="space-between" align="center" mb={2}>
                <Text fontWeight="extrabold" fontSize="xl" noOfLines={1}>
                  Trending Orders
                </Text>
                <Select size="sm" width="auto" defaultValue="Monthly">
                  <option>Monthly</option>
                  <option>Weekly</option>
                </Select>
              </Flex>
              <Box overflow="auto" maxH="260px">
                <Flex align="end" gap={4} h="180px" mt={8} mb={2}>
                  {orders.slice(0, 5).map((order, idx) => (
                    <Box key={order.id} textAlign="center" flex="1">
                      <Box
                        bg={idx === 3 ? "gray.300" : "gray.100"}
                        borderRadius="md"
                        height={`${Math.min(
                          (orderItemsMap[order.id]?.length || 1) * 30,
                          120
                        )}px`}
                        minW="32px"
                        mx="auto"
                        position="relative"
                        display="flex"
                        alignItems="flex-end"
                        justifyContent="center"
                      >
                        {idx === 3 && (
                          <Badge
                            position="absolute"
                            top="-24px"
                            left="50%"
                            transform="translateX(-50%)"
                            colorScheme="gray"
                            fontWeight="bold"
                            fontSize="sm"
                            borderRadius="md"
                            px={2}
                          >
                            {orderItemsMap[order.id]?.length || 1} qty
                          </Badge>
                        )}
                      </Box>
                      <Text fontSize="sm" mt={2} noOfLines={1}>
                        Order #{order.order_number}
                      </Text>
                    </Box>
                  ))}
                </Flex>
              </Box>
            </Box>

            <Box
              bg="white"
              borderRadius="2xl"
              p={6}
              boxShadow="sm"
              minH="320px"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              overflow="hidden"
            >
              <Flex justify="space-between" align="center" mb={2}>
                <Text fontWeight="extrabold" fontSize="xl" noOfLines={1}>
                  Predicted Total Price
                </Text>
                <Select size="sm" width="auto" defaultValue="Monthly">
                  <option>Monthly</option>
                  <option>Weekly</option>
                </Select>
              </Flex>
              <Box mt={8} overflow="hidden">
                <Text fontWeight="bold" fontSize="6xl" mb={2} noOfLines={1}>
                  $
                  {orders
                    .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0)
                    .toLocaleString()}
                </Text>
                <Text
                  fontWeight="bold"
                  fontSize="2xl"
                  color="gray.600"
                  noOfLines={1}
                >
                  Today Total Price
                </Text>
                <Text fontWeight="bold" fontSize="4xl" noOfLines={1}>
                  $
                  {orders
                    .filter(
                      (o) =>
                        new Date(o.order_date).toDateString() ===
                        new Date().toDateString()
                    )
                    .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0)
                    .toLocaleString()}
                </Text>
              </Box>
            </Box>
          </SimpleGrid>

          <SimpleGrid columns={[1, 2]} spacing={6}>
            <Box
              bg="white"
              borderRadius="2xl"
              p={6}
              boxShadow="sm"
              minH="320px"
              overflow="hidden"
            >
              <Flex justify="space-between" align="center" mb={2}>
                <Text fontWeight="extrabold" fontSize="xl" noOfLines={1}>
                  Order History
                </Text>
                <Button
                  size="sm"
                  rightIcon={<ChevronRightIcon boxSize={6} />}
                  variant="ghost"
                  fontWeight="bold"
                  onClick={() => setCurrentPage(2)}
                >
                  View all
                </Button>
              </Flex>

              <Box overflow="auto" maxH="250px">
                <Table variant="simple" size="sm" mt={4}>
                  <Thead position="sticky" top={0} bg="white" zIndex={1}>
                    <Tr>
                      <Th fontWeight="bold" minW="80px">
                        Order #
                      </Th>
                      <Th minW="100px">Customer</Th>
                      <Th minW="80px">Date</Th>
                      <Th minW="80px">Status</Th>
                      <Th minW="70px">Total</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {orders.slice(0, 10).map((order) => (
                      <Tr key={order.id}>
                        <Td
                          fontWeight="bold"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                          maxW="80px"
                        >
                          {order.order_number}
                        </Td>
                        <Td
                          overflow="hidden"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                          maxW="100px"
                          title={getUserName(order.user_id)}
                        >
                          {getUserName(order.user_id)}
                        </Td>
                        <Td
                          overflow="hidden"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                          maxW="80px"
                        >
                          {order.order_date
                            ? new Date(order.order_date).toLocaleDateString()
                            : ""}
                        </Td>
                        <Td maxW="80px">
                          <Badge
                            colorScheme={statusColor(order.order_status)}
                            fontSize="xs"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                            maxW="70px"
                          >
                            {order.order_status}
                          </Badge>
                        </Td>
                        <Td
                          overflow="hidden"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                          maxW="70px"
                        >
                          ${order.total_amount}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </Box>

            <Box
              bg="white"
              borderRadius="2xl"
              p={6}
              boxShadow="sm"
              minH="320px"
              overflow="hidden"
            >
              <Flex justify="space-between" align="center" mb={2}>
                <Text fontWeight="extrabold" fontSize="xl" noOfLines={1}>
                  Inventory Status
                </Text>
                <Button
                  size="sm"
                  rightIcon={<ChevronRightIcon boxSize={6} />}
                  variant="ghost"
                  fontWeight="bold"
                  onClick={() => setCurrentPage(4)}
                >
                  View all
                </Button>
              </Flex>

              <Box overflow="auto" maxH="250px">
                <Table variant="simple" size="sm" mt={4}>
                  <Thead position="sticky" top={0} bg="white" zIndex={1}>
                    <Tr>
                      <Th fontWeight="bold" minW="120px">
                        Product
                      </Th>
                      <Th minW="70px">Category</Th>
                      <Th minW="80px">In Stock</Th>
                      <Th minW="80px">Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {Object.values(itemsMap)
                      .slice(0, 10)
                      .map((item, idx) => (
                        <Tr key={idx}>
                          <Td
                            fontWeight="bold"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                            maxW="120px"
                            title={item.item_name}
                          >
                            {item.item_name}
                          </Td>
                          <Td
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                            maxW="70px"
                            fontSize="xs"
                            color="gray.600"
                            title={item.category || "Meat"}
                          >
                            {item.category || "Meat"}
                          </Td>
                          <Td
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                            maxW="80px"
                          >
                            -
                          </Td>
                          <Td maxW="80px">
                            <Badge
                              colorScheme="green"
                              fontSize="xs"
                              overflow="hidden"
                              textOverflow="ellipsis"
                              whiteSpace="nowrap"
                              maxW="70px"
                            >
                              In Stock
                            </Badge>
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </Box>
            </Box>
          </SimpleGrid>
        </>
      )}
      {currentPage === 2 && (
        <Orders
          orders={orders}
          usersMap={usersMap}
          orderItemsMap={orderItemsMap}
        />
      )}
      {currentPage === 3 && (
        <Signups
          signupRequests={signupRequests}
          inquiries={inquiries}
          token={token}
          setSignupRequests={setSignupRequests}
          toast={toast}
        />
      )}

      {currentPage === 4 && <InventoryStatus />}
      {/* {currentPage === 5 && <InventoryStatus />} */}
    </Box>
  );
};

export default AdminDashboard;
