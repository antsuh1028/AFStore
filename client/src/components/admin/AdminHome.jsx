import React, { useState } from "react";
import {
  VStack,
  Flex,
  Box,
  Text,
  IconButton,
  Select,
  Divider,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Link,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { ChevronRightIcon, ChevronDownIcon } from "@chakra-ui/icons";

const AdminHome = ({
  orders = [],
  usersMap = {},
  signupRequests = [],
  inquiries = [],
  orderItemsMap = {},
  setCurrentPage,
  isLoading = false,
  setOrderType,
}) => {
  const [topDisplay, setTopDisplay] = useState(1);
  const [botDisplay, setBotDisplay] = useState(1);
  const [timeFilter, setTimeFilter] = useState(7);

  const getUserName = (userId) => {
    return (
      usersMap[userId]?.name ||
      usersMap[userId]?.username ||
      `User #${userId}` ||
      "Unknown User"
    );
  };

  const getCompanyName = (userId) => {
    return usersMap[userId]?.company || "Not Listed";
  };

  const recentOrders = orders
    .sort((a, b) => new Date(b.order_date) - new Date(a.order_date))
    .slice(0, 6);

  const getStatusColorScheme = (status) => {
    if (!status) return "gray";
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "new":
        return "blue";
      case "pending":
        return "red";
      case "contacted":
      case "completed":
        return "orange";
      case "quote sent":
        return "purple";
      case "order placed":
        return "blue";
      case "delivered":
        return "green";
      case "incomplete":
        return "yellow";
      case "declined":
        return "red";
      case "approved":
        return "yellow";
      default:
        return "gray";
    }
  };

  const getDateFilteredOrders = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - timeFilter * 24 * 60 * 60 * 1000);
    return orders.filter((order) => {
      const orderDate = new Date(order.order_date);
      return orderDate >= weekAgo && orderDate <= now;
    });
  };

  // Add function to filter inquiries by date
  const getDateFilteredInquiries = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - timeFilter * 24 * 60 * 60 * 1000);
    return inquiries.filter((inquiry) => {
      if (!inquiry.timestamp) return false;
      const inquiryDate = new Date(inquiry.timestamp);
      return inquiryDate >= weekAgo && inquiryDate <= now;
    });
  };

  const filteredOrders = getDateFilteredOrders();
  const filteredInquiries = getDateFilteredInquiries();
  
  const pickupOrders = filteredOrders.filter(
    (order) => order.order_type?.toLowerCase() === "pickup"
  ).length;
  const deliveryOrders = filteredOrders.filter(
    (order) => order.order_type?.toLowerCase() === "delivery"
  ).length;
  const totalRevenue = filteredOrders.reduce(
    (sum, o) => sum + (Number(o.total_amount) || 0),
    0
  );

  // Calculate monthly revenue based on time filter
  const now = new Date();
  const getRevenueData = () => {
    if (timeFilter === 7) {
      // Weekly view - show this week vs last week
      const thisWeekStart = new Date(now);
      thisWeekStart.setDate(now.getDate() - now.getDay()); // Start of this week (Sunday)
      thisWeekStart.setHours(0, 0, 0, 0);
      
      const lastWeekStart = new Date(thisWeekStart);
      lastWeekStart.setDate(thisWeekStart.getDate() - 7);
      const lastWeekEnd = new Date(thisWeekStart);
      lastWeekEnd.setTime(thisWeekStart.getTime() - 1);

      const thisWeekOrders = orders.filter((order) => {
        const orderDate = new Date(order.order_date);
        return orderDate >= thisWeekStart && orderDate <= now;
      });

      const lastWeekOrders = orders.filter((order) => {
        const orderDate = new Date(order.order_date);
        return orderDate >= lastWeekStart && orderDate <= lastWeekEnd;
      });

      return {
        currentPeriod: thisWeekOrders,
        previousPeriod: lastWeekOrders,
        currentLabel: "Total Sales this Week",
        previousLabel: "Total Sales last Week"
      };
    } else {
      // Monthly view - show this month vs last month
      const thisMonth = orders.filter((order) => {
        const orderDate = new Date(order.order_date);
        return (
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      });

      const lastMonth = orders.filter((order) => {
        const orderDate = new Date(order.order_date);
        const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        return (
          orderDate.getMonth() === lastMonthDate.getMonth() &&
          orderDate.getFullYear() === lastMonthDate.getFullYear()
        );
      });

      return {
        currentPeriod: thisMonth,
        previousPeriod: lastMonth,
        currentLabel: "Total Sales this Month",
        previousLabel: "Total Sales last Month"
      };
    }
  };

  const revenueData = getRevenueData();
  const currentPeriodRevenue = revenueData.currentPeriod.reduce(
    (sum, o) => sum + (Number(o.total_amount) || 0),
    0
  );
  const previousPeriodRevenue = revenueData.previousPeriod.reduce(
    (sum, o) => sum + (Number(o.total_amount) || 0),
    0
  );

  return (
    <VStack spacing={0} minH={{ base: "80vh", md: "70vh" }} w="100%" mb={8}>
      <Flex
        w="100%"
        minH={{ base: "auto", md: "90%", lg: "40vh" }}
        direction={{ base: "column", lg: "row" }}
        flex={{ base: "none", md: "0 0 40%" }}
      >
        <Box
          w={{ base: "100%", lg: "60%" }}
          p={4}
          minH={{ base: "auto", md: "100%" }}
        >
          <Flex justify="space-between" align="start" gap={4}>
            <VStack spacing={4} flex={1}>
              {/* Top Row - Stats Cards */}
              <Flex
                gap={4}
                minH={{ base: "120px", md: "50%" }}
                align="stretch"
                direction={{ base: "column", md: "row" }}
                w="100%"
              >
                <Flex
                  gap={4}
                  flex={1}
                  direction={{ base: "column", sm: "row" }}
                >
                  {/* Pick Up Card */}
                  <Box
                    w={{ base: "100%", sm: "33%" }}
                    p={4}
                    bg="white"
                    border="1px"
                    borderColor="gray.100"
                    borderRadius="md"
                    minH="50px"
                  >
                    <Text
                      fontSize="sm"
                      color="black"
                      mb={2}
                      fontWeight="extrabold"
                    >
                      New Orders (Pick Up)
                    </Text>
                    <Flex align="center" justify="space-between">
                      <Text
                        fontSize={{ base: "2xl", md: "3xl" }}
                        fontWeight="bold"
                      >
                        {pickupOrders}
                      </Text>
                      <IconButton
                        size="sm"
                        variant="ghost"
                        borderRadius="full"
                        bg="gray.100"
                        icon={<ChevronRightIcon />}
                        onClick={() => {
                          setOrderType("pickup");
                          setCurrentPage(2);
                        }}
                      />
                    </Flex>
                  </Box>

                  {/* Delivery Card */}
                  <Box
                    w={{ base: "100%", sm: "33%" }}
                    p={4}
                    bg="white"
                    border="1px"
                    borderColor="gray.100"
                    borderRadius="md"
                    minH="50px"
                  >
                    <Text
                      fontSize="sm"
                      color="black"
                      mb={2}
                      fontWeight="extrabold"
                    >
                      New Orders (Delivery)
                    </Text>
                    <Flex align="center" justify="space-between">
                      <Text
                        fontSize={{ base: "2xl", md: "3xl" }}
                        fontWeight="bold"
                      >
                        {deliveryOrders}
                      </Text>
                      <IconButton
                        size="sm"
                        variant="ghost"
                        borderRadius="full"
                        bg="gray.100"
                        icon={<ChevronRightIcon />}
                        onClick={() => {
                          setOrderType("delivery");
                          setCurrentPage(2);
                        }}
                      />
                    </Flex>
                  </Box>

                  {/* Inquiries Card - Updated to use filtered inquiries */}
                  <Box
                    w={{ base: "100%", sm: "33%" }}
                    p={4}
                    bg="white"
                    border="1px"
                    borderColor="gray.100"
                    borderRadius="md"
                    minH="50px"
                  >
                    <Text
                      fontSize="sm"
                      color="black"
                      mb={2}
                      fontWeight="extrabold"
                    >
                      New Inquiries
                    </Text>
                    <Flex align="center" justify="space-between">
                      <Text
                        fontSize={{ base: "2xl", md: "3xl" }}
                        fontWeight="bold"
                      >
                        {filteredInquiries.length}
                      </Text>
                      <IconButton
                        size="sm"
                        variant="ghost"
                        borderRadius="full"
                        bg="gray.100"
                        icon={<ChevronRightIcon />}
                        onClick={() => setCurrentPage(3)}
                      />
                    </Flex>
                  </Box>
                </Flex>
              </Flex>

              {/* Bottom Row - Financial Stats */}
              <Flex
                gap={4}
                minH={{ base: "120px", md: "50%" }}
                align="stretch"
                direction={{ base: "column", md: "row" }}
                w="100%"
              >
                <Flex
                  gap={4}
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
                    <Text
                      fontSize="sm"
                      color="black"
                      mb={2}
                      fontWeight="extrabold"
                    >
                      {timeFilter === 7 ? "Today" : "This Period"} Total Price
                    </Text>
                    <Text
                      fontSize={{ base: "xl", md: "2xl" }}
                      fontWeight="bold"
                    >
                      ${totalRevenue.toLocaleString()}
                    </Text>
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
                    <Text
                      fontSize="sm"
                      color="black"
                      mb={2}
                      fontWeight="extrabold"
                    >
                      {revenueData.currentLabel}
                    </Text>
                    <Text
                      fontSize={{ base: "xl", md: "2xl" }}
                      fontWeight="bold"
                    >
                      ${currentPeriodRevenue.toLocaleString()}
                    </Text>
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
                    <Text
                      fontSize="sm"
                      color="black"
                      mb={2}
                      fontWeight="extrabold"
                    >
                      {revenueData.previousLabel}
                    </Text>
                    <Text
                      fontSize={{ base: "xl", md: "2xl" }}
                      fontWeight="bold"
                    >
                      ${previousPeriodRevenue.toLocaleString()}
                    </Text>
                  </Box>
                </Flex>
              </Flex>
            </VStack>

            {/* Time Filter Select */}
            <Select
              defaultValue={1}
              size="sm"
              width="fit-content"
              borderRadius="full"
              bg="gray.50"
              onChange={(e) => {
                setTopDisplay(e.target.value);
                setTimeFilter(e.target.value === "1" ? 7 : 30);
              }}
            >
              <option value={1}>Weekly</option>
              <option value={2}>Monthly</option>
            </Select>
          </Flex>
        </Box>

        <Box display={{ base: "none", lg: "flex" }} alignItems="center" px={2}>
          <Divider
            orientation="vertical"
            borderColor="gray.500"
            borderWidth="1px"
            height="80%"
          />
        </Box>

        {/* Horizontal Divider - Mobile only */}
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
              {/* Jul 2025 */}
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
              Chart Unavailable Temporarily
            </Text>
          </Box>
        </Box>
      </Flex>

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
          {/* Recent Order History Content */}
          <Flex justify="space-between" align="center" mb={6}>
            <Box>
              <Text fontSize="lg" fontWeight="bold" mb={1}>
                Recently Order History
              </Text>
            </Box>
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<ChevronRightIcon />}
              _hover={{ bg: "blue.50" }}
              onClick={() => {
                setCurrentPage(2);
              }}
            >
              View all
            </Button>
          </Flex>

          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th fontSize="xs" color="gray.600" fontWeight="medium" py={2}>
                  Order #
                </Th>
                <Th fontSize="xs" color="gray.600" fontWeight="medium" py={2}>
                  Company
                </Th>
                <Th fontSize="xs" color="gray.600" fontWeight="medium" py={2}>
                  Contact
                </Th>
                <Th fontSize="xs" color="gray.600" fontWeight="medium" py={2}>
                  Date
                </Th>
                <Th fontSize="xs" color="gray.600" fontWeight="medium" py={2}>
                  Status
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {isLoading ? (
                <Tr>
                  <Td colSpan={5} py={8}>
                    <Center>
                      <Spinner size="md" color="blue.500" />
                    </Center>
                  </Td>
                </Tr>
              ) : recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <Tr key={order.id}>
                    <Td py={3} px={4} borderColor="gray.100">
                      <Text fontSize="xs" fontWeight="medium">
                        {order.order_number}
                      </Text>
                    </Td>
                    <Td py={3} px={4} borderColor="gray.100">
                      <Text fontSize="sm" fontWeight="medium">
                        {getCompanyName(order.user_id)}
                      </Text>
                    </Td>
                    <Td py={3} px={4} borderColor="gray.100">
                      <Text fontSize="sm" color="gray.700">
                        {getUserName(order.user_id)}
                      </Text>
                    </Td>
                    <Td py={3} px={4} borderColor="gray.100">
                      <Text fontSize="sm" color="gray.700">
                        {order.order_date
                          ? new Date(order.order_date).toLocaleDateString()
                          : "N/A"}
                      </Text>
                    </Td>
                    <Td py={3} px={4} borderColor="gray.100">
                      <Badge
                        colorScheme={getStatusColorScheme(order.order_status)}
                        variant="subtle"
                        borderRadius="full"
                        px={3}
                        py={1}
                        fontSize="xs"
                      >
                        {order.order_status || "Unknown"}
                      </Badge>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={5} py={8}>
                    <Center>
                      <Text color="gray.500">No orders found</Text>
                    </Center>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>

        <Box display={{ base: "none", lg: "flex" }} alignItems="center" px={2}>
          <Divider
            orientation="vertical"
            borderColor="gray.500"
            borderWidth="1px"
            height="80%"
          />
        </Box>
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
              _hover={{ bg: "blue.50" }}
              onClick={() => {
                setCurrentPage(4);
              }}
            >
              View all
            </Button>
          </Flex>
          <Box
            h={{ base: "250px", md: "80%" }}
            borderRadius="md"
            p={4}
            display="flex"
            flexDirection="column"
            alignItems="stretch"
          >
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th fontSize="xs" color="gray.600" fontWeight="medium" py={2}>
                    Name
                  </Th>
                  <Th fontSize="xs" color="gray.600" fontWeight="medium" py={2}>
                    Company
                  </Th>
                  <Th fontSize="xs" color="gray.600" fontWeight="medium" py={2}>
                    Status
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {isLoading ? (
                  <Tr>
                    <Td colSpan={3} py={8}>
                      <Center>
                        <Spinner size="md" color="blue.500" />
                      </Center>
                    </Td>
                  </Tr>
                ) : signupRequests.length > 0 ? (
                  signupRequests.map((signup) => (
                    <Tr key={signup.id}>
                      <Td py={3} px={4} borderColor="gray.100">
                        <Text fontSize="xs" fontWeight="medium">
                          {signup.first_name} {signup.last_name}
                        </Text>
                      </Td>
                      <Td py={3} px={4} borderColor="gray.100">
                        <Text fontSize="sm" fontWeight="medium">
                          {signup.company || "Not Listed"}
                        </Text>
                      </Td>
                      <Td py={3} px={4} borderColor="gray.100">
                        <Text fontSize="sm" color="gray.700">
                          <Badge
                            colorScheme={getStatusColorScheme(signup.status)}
                            variant="subtle"
                            borderRadius="full"
                            px={3}
                            py={1}
                            fontSize="xs"
                          >
                            {signup.status || "Unknown"}
                          </Badge>
                        </Text>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={3} py={8}>
                      <Center>
                        <Text color="gray.500">No signup requests</Text>
                      </Center>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Flex>
    </VStack>
  );
};

export default AdminHome;
