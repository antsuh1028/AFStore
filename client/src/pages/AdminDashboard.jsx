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
  Link,
  Select,
} from "@chakra-ui/react";
import {
  BellIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
} from "@chakra-ui/icons";
import { useAuthContext } from "../hooks/useAuth";

import {
  Signups,
  Orders,
  InventoryStatus,
  Inquiries,
} from "../components/admin/DashboardComponents";
import { API_CONFIG } from "../constants";
import { ListEndIcon } from "lucide-react";
import AdminHome from "../components/admin/AdminHome";

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
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [userAddresses, setUserAddresses] = useState({});
  const [orderType, setOrderType] = useState("pickup")

  const pages = {
    1: "Dashboard",
    2: "Orders",
    3: "Inquiries",
    4: "Signup Requests",
    5: "Inventory Status",
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
      setIsLoadingData(true);
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
      } finally {
        setIsLoadingData(false);
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
    if (!isAuthenticated || !isAdmin || !token) return;

    const fetchUserAddresses = async () => {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/addresses`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const response = await res.json();
          const addresses = response.data;
          const map = {}; // Add this line

          addresses.forEach((address) => {
            if (address && address.id) {
              map[address.user_id] = address;
            }
          });
          setUserAddresses(map);
        }
      } catch (err) {
        console.error("Error fetching user addresses:", err);
      }
    };

    fetchUserAddresses();
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
          `${API_CONFIG.BASE_URL}/api/users/signup-requests`,
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

  useEffect(() => {
    window.history.pushState(
      { adminPage: currentPage },
      "",
      window.location.href
    );

    const handlePopState = (event) => {
      if (event.state?.adminPage) {
        setCurrentPage(event.state.adminPage);
      } else {
        setCurrentPage(1);
        window.history.pushState({ adminPage: 1 }, "", window.location.href);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    window.history.replaceState(
      { adminPage: currentPage },
      "",
      window.location.href
    );
  }, [currentPage]);

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
      <Flex align="center" my={12} gap={4}>
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
        <AdminHome
          orders={orders}
          usersMap={usersMap}
          signupRequests={signupRequests}
          inquiries={inquiries}
          orderItemsMap={orderItemsMap}
          setCurrentPage={setCurrentPage}
          isLoading={isLoadingData}
          setOrderType={setOrderType}
        />
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
          userAddresses={userAddresses}
          orderType={orderType}
        />
      )}
      {currentPage === 3 && <Inquiries inquiries={inquiries} />}
      {currentPage === 4 && (
        <Signups
          signupRequests={signupRequests}
          token={token}
          setSignupRequests={setSignupRequests}
          toast={toast}
        />
      )}

      {currentPage === 5 && <InventoryStatus />}
      {/* {currentPage === 5 && <InventoryStatus />} */}
    </Box>
  );
};

export default AdminDashboard;
