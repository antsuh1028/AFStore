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

const API_URL = import.meta.env.MODE === 'production' 
  ? import.meta.env.VITE_API_URL 
  : import.meta.env.VITE_API_URL_DEV;

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

  const getDateFilteredOrders = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return orders.filter((order) => {
      const orderDate = new Date(order.order_date);
      return orderDate >= weekAgo && orderDate <= now;
    });
  };

  const filteredOrders = getDateFilteredOrders();
  const totalRevenue = filteredOrders.reduce(
    (sum, o) => sum + (Number(o.total_amount) || 0),
    0
  );
  const avgOrderValue =
    filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0;

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isAuthenticated || !userId || !token) {
        setIsLoadingAdmin(false);
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/users/${userId}`, {
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
        const res = await fetch(`${API_URL}/api/inquiries`, {
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
        const res = await fetch(`${API_URL}/api/orders`, {
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
        const res = await fetch(`${API_URL}/api/order-items`, {
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
        const res = await fetch(`${API_URL}/api/items`, {
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
        const res = await fetch(`${API_URL}/api/users`, {
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
          "https://af-store-back.vercel.app/api/users/signup-requests",
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

  const getTrendingItems = () => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyOrders = orders.filter(
      (o) => new Date(o.order_date) >= weekAgo
    );

    const itemCounts = {};
    weeklyOrders.forEach((order) => {
      const orderItems = orderItemsMap[order.id] || [];
      orderItems.forEach((item) => {
        const product = itemsMap[item.item_id];
        if (product) {
          const name = product.name || product.item_name;
          itemCounts[name] = (itemCounts[name] || 0) + item.quantity;
        }
      });
    });

    return Object.entries(itemCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  };

  const trendingItems = getTrendingItems();

  return (
    <Box bg="white" minH="100vh" px={[2, 4, 12]} py={4}>
      <Flex align="center" justify="space-between" mb={4}>
        <Flex align="center" gap={[2, 4]}>
          <Image boxSize={["24px", "32px"]} src="/images/main_logo.png" alt="Logo" />
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
          {/* <SimpleGrid columns={[1, 2]} spacing={6} mb={8}>
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
              border="1px"
            >
              <Box textAlign="left">
                <Text fontWeight="bold" fontSize="lg" mb={1} noOfLines={2}>
                  Total Revenue (7 days)
                </Text>
                <Text fontWeight="extrabold" fontSize="3xl" mb={2}>
                  ${totalRevenue.toLocaleString()}
                </Text>
              </Box>

              <Box textAlign="left">
                <Text fontWeight="bold" fontSize="lg" mb={1} noOfLines={2}>
                  Average Order Value
                </Text>
                <Text fontWeight="extrabold" fontSize="3xl" mb={2}>
                  ${avgOrderValue.toFixed(0)}
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
              border="1px"
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
          </SimpleGrid> */}
          <SimpleGrid columns={[1, 3]} spacing={6} mb={8}>
            <Box
              bg="white"
              borderRadius="3xl"
              p={8}
              boxShadow="lg"
              border="2px solid"
              borderColor="gray.200"
              position="relative"
            >
              <Text fontWeight="bold" fontSize="lg" mb={4} color="gray.700">
                New Orders (Pick Up)
              </Text>
              <Flex align="baseline" gap={2}>
                <Text fontWeight="black" fontSize="6xl" lineHeight="1">
                  {
                    filteredOrders
                      .length
                  }
                </Text>
              </Flex>
              <IconButton
                icon={<ChevronRightIcon boxSize={6} />}
                aria-label="Go"
                size="md"
                position="absolute"
                top={6}
                right={6}
                variant="ghost"
                bg="gray.100"
                borderRadius="full"
                onClick={() => setCurrentPage(2)}
              />
            </Box>

            <Box
              bg="white"
              borderRadius="3xl"
              p={8}
              boxShadow="lg"
              border="2px solid"
              borderColor="gray.200"
              position="relative"
            >
              <Text fontWeight="bold" fontSize="lg" mb={4} color="gray.700">
                New Orders (Delivery)
              </Text>
              <Text fontWeight="black" fontSize="6xl" lineHeight="1">
                {
                  filteredOrders.filter((o) => o.delivery_type === "delivery")
                    .length
                }
              </Text>
              <IconButton
                icon={<ChevronRightIcon boxSize={6} />}
                aria-label="Go"
                size="md"
                position="absolute"
                top={6}
                right={6}
                variant="ghost"
                bg="gray.100"
                borderRadius="full"
                onClick={() => setCurrentPage(2)}
              />
            </Box>

            <Box
              bg="white"
              borderRadius="3xl"
              p={8}
              boxShadow="lg"
              border="2px solid"
              borderColor="gray.200"
              position="relative"
            >
              <Text fontWeight="bold" fontSize="lg" mb={4} color="gray.700">
                New Inquiries
              </Text>
              <Text fontWeight="black" fontSize="6xl" lineHeight="1">
                {inquiries.length}
              </Text>
              <IconButton
                icon={<ChevronRightIcon boxSize={6} />}
                aria-label="Go"
                size="md"
                position="absolute"
                top={6}
                right={6}
                variant="ghost"
                bg="gray.100"
                borderRadius="full"
                onClick={() => setCurrentPage(3)}
              />
            </Box>
          </SimpleGrid>

          <SimpleGrid columns={[1, 2]} spacing={6} mb={8}>
            <Box
              bg="white"
              borderRadius="3xl"
              p={8}
              boxShadow="lg"
              border="2px solid"
              borderColor="gray.200"
              minH="400px"
            >
              <Flex justify="space-between" align="center" mb={6}>
                <Text fontWeight="black" fontSize="xl">
                  Trending Orders
                </Text>
                <Flex align="center" gap={2}>
                  <Text fontSize="sm" color="gray.600">
                    Monthly
                  </Text>
                  <IconButton
                    icon={<ChevronRightIcon boxSize={4} />}
                    aria-label="Dropdown"
                    size="sm"
                    variant="ghost"
                    bg="gray.100"
                    borderRadius="full"
                  />
                </Flex>
              </Flex>

              {/* Chart bars */}
              <Flex align="end" gap={6} h="200px" mb={6}>
                {trendingItems.map(([itemName, quantity], idx) => (
                  <Box key={itemName} textAlign="center" flex="1">
                    <Box
                      bg={idx === 0 ? "red.300" : "gray.200"}
                      borderRadius="lg"
                      height={`${Math.max(quantity * 5, 30)}px`}
                      minW="40px"
                      mx="auto"
                      position="relative"
                    >
                      {idx === 0 && (
                        <Badge
                          position="absolute"
                          top="-30px"
                          left="50%"
                          transform="translateX(-50%)"
                          bg="gray.600"
                          color="white"
                          fontWeight="bold"
                          fontSize="sm"
                          borderRadius="md"
                          px={3}
                          py={1}
                        >
                          {quantity} qty
                        </Badge>
                      )}
                    </Box>
                    <Text
                      fontSize="sm"
                      mt={3}
                      fontWeight="medium"
                      noOfLines={2}
                    >
                      {itemName}
                    </Text>
                  </Box>
                ))}
              </Flex>
            </Box>

            <Box
              bg="white"
              borderRadius="3xl"
              p={8}
              boxShadow="lg"
              border="2px solid"
              borderColor="gray.200"
              minH="400px"
            >
              <Flex justify="space-between" align="center" mb={6}>
                <Text fontWeight="black" fontSize="xl">
                  Predicted Total Price
                </Text>
                <Flex align="center" gap={2}>
                  <Text fontSize="sm" color="gray.600">
                    Monthly
                  </Text>
                  <IconButton
                    icon={<ChevronRightIcon boxSize={4} />}
                    aria-label="Dropdown"
                    size="sm"
                    variant="ghost"
                    bg="gray.100"
                    borderRadius="full"
                  />
                </Flex>
              </Flex>

              <Box textAlign="center" mt={12}>
                <Text fontWeight="black" fontSize="7xl" lineHeight="1">
                  $50,000.00
                </Text>
                <Text
                  fontWeight="bold"
                  fontSize="xl"
                  color="gray.600"
                  mt={8}
                  mb={2}
                >
                  Today Total Price
                </Text>
                <Text fontWeight="black" fontSize="4xl">
                  $2,000.00
                </Text>
              </Box>
            </Box>
          </SimpleGrid>

          <SimpleGrid columns={[1, 2]} spacing={6}>
            <Box
              bg="white"
              borderRadius="3xl"
              p={8}
              boxShadow="lg"
              border="2px solid"
              borderColor="gray.200"
              minH="400px"
            >
              <Flex justify="space-between" align="center" mb={6}>
                <Text fontWeight="black" fontSize="xl">
                  Order History
                </Text>
                <Flex align="center" gap={2}>
                  <Text fontSize="sm" color="gray.600">
                    View all
                  </Text>
                  <IconButton
                    icon={<ChevronRightIcon boxSize={4} />}
                    aria-label="View all"
                    size="sm"
                    variant="ghost"
                    bg="gray.100"
                    borderRadius="full"
                    onClick={() => setCurrentPage(2)}
                  />
                </Flex>
              </Flex>

              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th fontWeight="bold" color="gray.600">
                      Company
                    </Th>
                    <Th fontWeight="bold" color="gray.600">
                      Contact
                    </Th>
                    <Th fontWeight="bold" color="gray.600">
                      Date
                    </Th>
                    <Th fontWeight="bold" color="gray.600">
                      Status
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {orders.slice(0, 5).map((order) => (
                    <Tr key={order.id}>
                      <Td fontWeight="medium">{getUserName(order.user_id)}</Td>
                      <Td color="blue.500" fontWeight="medium">
                        {getUserName(order.user_id)}
                      </Td>
                      <Td>
                        {order.order_date
                          ? new Date(order.order_date).toLocaleDateString()
                          : ""}
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={statusColor(order.order_status)}
                          borderRadius="full"
                          px={3}
                        >
                          {order.order_status}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>

            <Box
              bg="white"
              borderRadius="3xl"
              p={8}
              boxShadow="lg"
              border="2px solid"
              borderColor="gray.200"
              minH="400px"
            >
              <Flex justify="space-between" align="center" mb={6}>
                <Text fontWeight="black" fontSize="xl">
                  Inventory Status
                </Text>
                <Flex align="center" gap={2}>
                  <Text fontSize="sm" color="gray.600">
                    View all
                  </Text>
                  <IconButton
                    icon={<ChevronRightIcon boxSize={4} />}
                    aria-label="View all"
                    size="sm"
                    variant="ghost"
                    bg="gray.100"
                    borderRadius="full"
                    onClick={() => setCurrentPage(4)}
                  />
                </Flex>
              </Flex>

              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th fontWeight="bold" color="gray.600">
                      Product
                    </Th>
                    <Th fontWeight="bold" color="gray.600">
                      In Stock
                    </Th>
                    <Th fontWeight="bold" color="gray.600">
                      Status
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {[
                    {
                      product: "Beef Brisket",
                      stock: "450kg",
                      status: "Good",
                      color: "green",
                    },
                    {
                      product: "Sliced Pork Belly",
                      stock: "120kg",
                      status: "Low",
                      color: "yellow",
                    },
                    {
                      product: "Marinated Galbi",
                      stock: "380kg",
                      status: "Good",
                      color: "green",
                    },
                    {
                      product: "Prime Ribeye",
                      stock: "90kg",
                      status: "Critical",
                      color: "red",
                    },
                    {
                      product: "Wagyu",
                      stock: "400kg",
                      status: "Good",
                      color: "green",
                    },
                    {
                      product: "Wagyu bone",
                      stock: "230kg",
                      status: "Good",
                      color: "green",
                    },
                    {
                      product: "Beef Bulgogi",
                      stock: "50kg",
                      status: "Critical",
                      color: "red",
                    },
                  ].map((row, idx) => (
                    <Tr key={idx}>
                      <Td fontWeight="medium">{row.product}</Td>
                      <Td>{row.stock}</Td>
                      <Td>
                        <Badge
                          colorScheme={row.color}
                          borderRadius="full"
                          px={3}
                        >
                          {row.status}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </SimpleGrid>
        </>
      )}
      {currentPage === 2 && (
        <Orders
          orders={orders}
          usersMap={usersMap}
          itemsMap={itemsMap}
          orderItemsMap={orderItemsMap}
          token={token}
          setOrders={setOrders}
          toast={toast}
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
