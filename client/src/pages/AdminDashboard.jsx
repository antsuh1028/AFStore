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
  Image,
  Divider,
  Spinner,
  Alert,
  AlertIcon,
  Center,
  useToast,
  GridItem,
  Grid,
  VStack,
} from "@chakra-ui/react";
import { BellIcon, ChevronRightIcon, ChevronLeftIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useAuthContext } from "../hooks/useAuth";

import {
  Signups,
  Orders,
  InventoryStatus,
} from "../components/admin/DashboardComponents";
import { API_CONFIG } from "../constants";

const AdminHome = () => {
  return (
    <VStack spacing={0} minH={{ base: "80vh", md: "70vh" }} w="100%">
      {/* Top Section - Responsive height */}
      <Flex 
        w="100%" 
        minH={{ base: "auto", md: "40%" }}
        direction={{ base: "column", lg: "row" }}
        flex={{ base: "none", md: "0 0 40%" }}
      >
        {/* Left side - Stats Cards */}
        <Box 
          w={{ base: "100%", lg: "60%" }} 
          p={4}
          minH={{ base: "auto", md: "100%" }}
        >
          {/* Top Row - 3 Stat Cards + Monthly Button */}
          <Flex 
            gap={4} 
            minH={{ base: "120px", md: "50%" }}
            align="stretch" 
            mb={4}
            direction={{ base: "column", md: "row" }}
          >
            <Flex 
              gap={4} 
              w={{ base: "100%", md: "90%" }}
              flex={1}
              direction={{ base: "column", sm: "row" }}
            >
              {/* New Orders (Pick Up) */}
              <Box 
                w={{ base: "100%", sm: "33%" }}
                p={4} 
                bg="white" 
                border="1px" 
                borderColor="gray.100" 
                borderRadius="md"
                minH="100px"
              >
                <Text fontSize="sm" color="gray.600" mb={2}>
                  New Orders (Pick Up)
                </Text>
                <Flex align="center" justify="space-between" mb={4}>
                  <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold">10</Text>
                  <IconButton 
                    size="sm" 
                    variant="ghost" 
                    borderRadius="full"
                    bg="gray.100"
                    icon={<ChevronRightIcon />}
                  />
                </Flex>
              </Box>

              {/* New Orders (Delivery) */}
              <Box 
                w={{ base: "100%", sm: "33%" }}
                p={4} 
                bg="white" 
                border="1px" 
                borderColor="gray.100" 
                borderRadius="md"
                minH="100px"
              >
                <Text fontSize="sm" color="gray.600" mb={2}>
                  New Orders (Delivery)
                </Text>
                <Flex align="center" justify="space-between" mb={4}>
                  <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold">5</Text>
                  <IconButton 
                    size="sm" 
                    variant="ghost" 
                    borderRadius="full"
                    bg="gray.100"
                    icon={<ChevronRightIcon />}
                  />
                </Flex>
              </Box>

              {/* New Inquiries */}
              <Box 
                w={{ base: "100%", sm: "33%" }}
                p={4} 
                bg="white" 
                border="1px" 
                borderColor="gray.100" 
                borderRadius="md"
                minH="100px"
              >
                <Text fontSize="sm" color="gray.600" mb={2}>
                  New Inquiries
                </Text>
                <Flex align="center" justify="space-between" mb={4}>
                  <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold">5</Text>
                  <IconButton 
                    size="sm" 
                    variant="ghost" 
                    borderRadius="full"
                    bg="gray.100"
                    icon={<ChevronRightIcon />}
                  />
                </Flex>
              </Box>
            </Flex>

            {/* Monthly Button */}
            <Flex 
              direction={{ base: "row", md: "column" }}
              justify={{ base: "center", md: "flex-start" }}
              align="center" 
              minW={{ base: "auto", md: "100px" }}
              w={{ base: "100%", md: "auto" }}
            >
              <Button 
                variant="outline" 
                size="sm"
                rightIcon={<ChevronDownIcon />}
                bg="white"
                borderColor="gray.300"
                _hover={{ bg: "gray.50" }}
              >
                Monthly
              </Button>
            </Flex>
          </Flex>

          {/* Bottom Row - Financial Stats */}
          <Flex 
            gap={4} 
            minH={{ base: "120px", md: "50%" }}
            align="stretch"
            direction={{ base: "column", md: "row" }}
          >
            <Flex 
              gap={4} 
              w={{ base: "100%", md: "90%" }}
              flex={1}
              direction={{ base: "column", sm: "row" }}
            >
              <Box 
                w={{ base: "100%", sm: "33%" }}
                p={4} 
                bg="white" 
                border="1px" 
                borderColor="gray.100" 
                borderRadius="md"
                minH="80px"
              >
                <Text fontSize="sm" color="gray.600" mb={2}>
                  Today Total Price
                </Text>
                <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">$2,000.00</Text>
              </Box>
              <Box 
                w={{ base: "100%", sm: "33%" }}
                p={4} 
                bg="white" 
                border="1px" 
                borderColor="gray.100" 
                borderRadius="md"
                minH="80px"
              >
                <Text fontSize="sm" color="gray.600" mb={2}>
                  Total Sales this Month
                </Text>
                <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">$50,000.00</Text>
              </Box>
              <Box 
                w={{ base: "100%", sm: "33%" }}
                p={4} 
                bg="white" 
                border="1px" 
                borderColor="gray.100" 
                borderRadius="md"
                minH="80px"
              >
                <Text fontSize="sm" color="gray.600" mb={2}>
                  Total Sales last Month
                </Text>
                <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">$40,000.00</Text>
              </Box>
            </Flex>
            
            {/* Monthly Button for bottom row */}
            <Flex 
              direction={{ base: "row", md: "column" }}
              justify={{ base: "center", md: "flex-start" }}
              align="center" 
              minW={{ base: "auto", md: "100px" }}
              w={{ base: "100%", md: "auto" }}
            >
              <Button 
                variant="outline" 
                size="sm"
                rightIcon={<ChevronDownIcon />}
                bg="white"
                borderColor="gray.300"
                _hover={{ bg: "gray.50" }}
              >
                Monthly
              </Button>
            </Flex>
          </Flex>
        </Box>

        {/* Vertical Divider - Hidden on mobile */}
        <Divider
          orientation="vertical"
          borderColor="gray.200"
          h="90%"
          borderWidth="1px"
          alignSelf="center"
          display={{ base: "none", lg: "block" }}
        />

        {/* Horizontal Divider - Only on mobile */}
        <Divider
          orientation="horizontal"
          borderColor="gray.200"
          borderWidth="1px"
          my={4}
          display={{ base: "block", lg: "none" }}
        />

        {/* Right side - Trending Chart */}
        <Box 
          w={{ base: "100%", lg: "40%" }}
          p={4}
          minH={{ base: "300px", md: "100%" }}
        >
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontSize={{ base: "md", md: "lg" }} fontWeight="semibold">
              Trending Orders
            </Text>
            <Button 
              variant="outline" 
              size="xs"
              rightIcon={<ChevronDownIcon />}
              bg="white"
              borderColor="gray.300"
              _hover={{ bg: "gray.50" }}
            >
              Jul 2025
            </Button>
          </Flex>
          <Box 
            h={{ base: "200px", md: "80%" }}
            bg="gray.50" 
            borderRadius="md" 
            p={4}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text color="gray.500" textAlign="center">
              Chart Component Here
            </Text>
          </Box>
        </Box>
      </Flex>

      {/* Horizontal Divider - Only on desktop */}
      <Divider 
        orientation="horizontal" 
        borderColor="gray.200" 
        borderWidth="1px"
        display={{ base: "none", lg: "block" }}
      />

      {/* Bottom Section - Responsive height */}
      <Flex 
        w="100%" 
        minH={{ base: "auto", md: "60%" }}
        direction={{ base: "column", lg: "row" }}
        flex={{ base: "none", md: "0 0 60%" }}
      >
        {/* Recently Order History */}
        <Box 
          w={{ base: "100%", lg: "60%" }}
          p={4}
          minH={{ base: "300px", md: "100%" }}
        >
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontSize={{ base: "md", md: "lg" }} fontWeight="semibold">
              Recently Order History
            </Text>
            <Button 
              variant="ghost" 
              size="sm"
              rightIcon={<ChevronRightIcon />}
              color="blue.500"
              _hover={{ bg: "blue.50" }}
            >
              View all
            </Button>
          </Flex>
          <Box 
            h={{ base: "250px", md: "80%" }}
            bg="gray.50" 
            borderRadius="md" 
            p={4}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text color="gray.500" textAlign="center">
              Order History Table
            </Text>
          </Box>
        </Box>

        {/* Vertical Divider - Hidden on mobile */}
        <Divider
          orientation="vertical"
          borderColor="gray.200"
          h="90%"
          alignSelf="center"
          borderWidth="1px"
          display={{ base: "none", lg: "block" }}
        />

        {/* Horizontal Divider - Only on mobile */}
        <Divider
          orientation="horizontal"
          borderColor="gray.200"
          borderWidth="1px"
          my={4}
          display={{ base: "block", lg: "none" }}
        />

        {/* Sign Up Request */}
        <Box 
          w={{ base: "100%", lg: "40%" }}
          p={4}
          minH={{ base: "300px", md: "100%" }}
        >
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontSize={{ base: "md", md: "lg" }} fontWeight="semibold">
              Sign Up Request
            </Text>
            <Button 
              variant="ghost" 
              size="sm"
              rightIcon={<ChevronRightIcon />}
              color="blue.500"
              _hover={{ bg: "blue.50" }}
            >
              View all
            </Button>
          </Flex>
          <Box 
            h={{ base: "250px", md: "80%" }}
            bg="gray.50" 
            borderRadius="md" 
            p={4}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text color="gray.500" textAlign="center">
              Sign Up Requests Table
            </Text>
          </Box>
        </Box>
      </Flex>
    </VStack>
  );
};

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
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/users/${userId}`, {
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
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/inquiries`, {
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
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/orders`, {
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
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/order-items`, {
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
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/items`, {
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
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/users`, {
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
        <Image w="200px" src="/images/gray_adams.png" alt="Logo" />
        <Text
          fontWeight="regular"
          fontSize="xl"
          color="gray.600"
          display={["none", "block"]}
        >
          <Text as="span" fontWeight="extrabold">
            MEAT
          </Text>{" "}
          WHOLESALE
        </Text>
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

      {currentPage === 1 && <AdminHome />}

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
