import React, { use, useEffect, useState } from "react";
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
  Divider,
  Select,
} from "@chakra-ui/react";
import {ChevronRightIcon } from "@chakra-ui/icons";

export const Orders = ({ orders, usersMap, orderItemsMap }) => {
  const [filter, setFilter] = useState("all");
  const [expandedRows, setExpandedRows] = useState(new Set());

  const statusColor = (status) => {
    if (status === "complete") return "green";
    if (status === "incomplete") return "yellow";
    if (status === "pending") return "gray";
    return "gray";
  };

  const getUserName = (userId) => {
    return (
      usersMap[userId]?.name ||
      usersMap[userId]?.username ||
      `User #${userId}` ||
      "Unknown User"
    );
  };

  const toggleRow = (orderId) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(orderId)) {
      newExpandedRows.delete(orderId);
    } else {
      newExpandedRows.add(orderId);
    }
    setExpandedRows(newExpandedRows);
  };

  const filteredOrders =
    orders?.filter((order) => {
      if (filter === "all") return true;
      return order.order_status?.toLowerCase() === filter;
    }) || [];

  return (
    <Box bg="white" borderRadius="2xl" p={6} boxShadow="sm" minH="500px">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" fontWeight="bold">
          Orders Management
        </Heading>
        <Select
          size="sm"
          width="auto"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="complete">Complete</option>
        </Select>
      </Flex>

      {/* Stats Cards */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
        <Box bg="gray.50" p={4} borderRadius="lg">
          <Text fontSize="sm" color="gray.600">
            Total Orders
          </Text>
          <Text fontSize="2xl" fontWeight="bold">
            {orders?.length || 0}
          </Text>
        </Box>
        <Box bg="gray.50" p={4} borderRadius="lg">
          <Text fontSize="sm" color="gray.600">
            Pending Orders
          </Text>
          <Text fontSize="2xl" fontWeight="bold">
            {orders?.filter((o) => o.order_status?.toLowerCase() === "pending")
              .length || 0}
          </Text>
        </Box>
        <Box bg="gray.50" p={4} borderRadius="lg">
          <Text fontSize="sm" color="gray.600">
            Total Revenue
          </Text>
          <Text fontSize="2xl" fontWeight="bold">
            $
            {orders
              ?.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0)
              .toLocaleString() || 0}
          </Text>
        </Box>
      </SimpleGrid>

      {/* Orders Table */}
      <Box overflow="auto" maxH="400px">
        <Table variant="simple" size="sm">
          <Thead position="sticky" top={0} bg="white" zIndex={1}>
            <Tr>
              <Th fontWeight="bold">Order #</Th>
              <Th>Customer</Th>
              <Th>Date</Th>
              <Th>Delivery Method</Th>
              <Th>Status</Th>
              <Th>Total</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <Tr>
                    <Td fontWeight="bold">{order.order_number}</Td>
                    <Td>{getUserName(order.user_id)}</Td>
                    <Td>
                      {order.order_date
                        ? new Date(order.order_date).toLocaleDateString()
                        : "N/A"}
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={
                          order.delivery_method === "delivery"
                            ? "blue"
                            : "orange"
                        }
                        textTransform="capitalize"
                      >
                        {order.delivery_method}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge colorScheme={statusColor(order.order_status)}>
                        {order.order_status}
                      </Badge>
                    </Td>
                    <Td fontWeight="bold">${order.total_amount}</Td>
                    <Td>
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => toggleRow(order.id)}
                      >
                        {expandedRows.has(order.id) ? "Hide" : "View"}
                      </Button>
                    </Td>
                  </Tr>
                  {expandedRows.has(order.id) && (
                    <Tr>
                      <Td colSpan={7} bg="gray.50" p={4}>
                        <Box>
                          <Heading size="sm" mb={3}>
                            Order Details
                          </Heading>
                          <SimpleGrid columns={2} spacing={4} mb={4}>
                            <Box>
                              <Text fontSize="sm" fontWeight="bold">
                                Order Date:
                              </Text>
                              <Text fontSize="sm">
                                {order.order_date
                                  ? new Date(
                                      order.order_date
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </Text>
                            </Box>
                            <Box>
                              <Text fontSize="sm" fontWeight="bold">
                                User ID:
                              </Text>
                              <Text fontSize="sm">{order.user_id}</Text>
                            </Box>
                            <Box>
                              <Text fontSize="sm" fontWeight="bold">
                                Address:
                              </Text>
                              <Text fontSize="sm">
                                {order.shipping_address || "N/A"}
                              </Text>
                            </Box>
                            <Box>
                              <Text fontSize="sm" fontWeight="bold">
                                Phone:
                              </Text>
                              <Text fontSize="sm">
                                {usersMap[order.user_id].phone_number || "N/A"}
                              </Text>
                            </Box>
                            <Box>
                              <Text fontSize="sm" fontWeight="bold">
                                Notes:
                              </Text>
                              <Text fontSize="sm">
                                {order.notes || "No notes"}
                              </Text>
                            </Box>
                            <Box>
                              <Text fontSize="sm" fontWeight="bold">
                                Created:
                              </Text>
                              <Text fontSize="sm">
                                {order.created_at
                                  ? new Date(order.created_at).toLocaleString()
                                  : "N/A"}
                              </Text>
                            </Box>
                          </SimpleGrid>

                          {/* Order Items Section */}
                          <Box>
                            <Heading size="sm" mb={3}>
                              Order Items
                            </Heading>
                            {orderItemsMap[order.id] &&
                            orderItemsMap[order.id].length > 0 ? (
                              <Table size="sm" variant="simple">
                                <Thead>
                                  <Tr>
                                    <Th fontSize="xs">Item</Th>
                                    <Th fontSize="xs">Quantity</Th>
                                    <Th fontSize="xs">Price</Th>
                                    <Th fontSize="xs">Total</Th>
                                  </Tr>
                                </Thead>
                                <Tbody>
                                  {orderItemsMap[order.id].map(
                                    (item, index) => (
                                      <Tr key={index}>
                                        <Td fontSize="xs">
                                          {item.item_name ||
                                            `Item #${item.item_id}`}
                                        </Td>
                                        <Td fontSize="xs">{item.quantity}</Td>
                                        <Td fontSize="xs">
                                          ${item.price_per_unit}
                                        </Td>
                                        <Td fontSize="xs" fontWeight="bold">
                                          $
                                          {(
                                            item.quantity * item.price_per_unit
                                          ).toFixed(2)}
                                        </Td>
                                      </Tr>
                                    )
                                  )}
                                </Tbody>
                              </Table>
                            ) : (
                              <Text fontSize="sm" color="gray.500">
                                No items found for this order
                              </Text>
                            )}
                          </Box>
                        </Box>
                      </Td>
                    </Tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <Tr>
                <Td colSpan={7} textAlign="center" py={8}>
                  <Text color="gray.500">No orders found</Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export const Signups = ({
  signupRequests,
  inquiries,
  token,
  setSignupRequests,
  toast,
}) => {
  const [expandedInquiries, setExpandedInquiries] = useState(new Set());

  const inquiriesDummyData = [
    {
      id: 1,
      name: "Anthony Suh",
      email: "ant.suh1028@gmail.com",
      phone: "3109059326",
      licenseNumber: "C-1234567",
      message:
        "Interested in bulk pricing for marinated beef chuck slice for my restaurant chain. Need weekly deliveries.",
      cartItems: [
        { name: "Marinated Beef Chuck Slice", quantity: 2, price: 15.99 },
      ],
      cartTotal: 31.98,
      timestamp: "2024-01-15T10:30:00Z",
      status: "pending",
    },
    {
      id: 2,
      name: "Maria Rodriguez",
      email: "maria.r@koreatown-market.com",
      phone: "2135551234",
      licenseNumber: "C-2345678",
      message:
        "Looking for wholesale prices on galbi and bulgogi for Korea Town Market. Need consistent quality.",
      cartItems: [
        { name: "Premium Galbi", quantity: 5, price: 28.5 },
        { name: "Bulgogi Beef", quantity: 3, price: 22.75 },
      ],
      cartTotal: 210.75,
      timestamp: "2024-01-14T14:15:00Z",
      status: "responded",
    },
    {
      id: 3,
      name: "David Kim",
      email: "dkim@bbqhaven.net",
      phone: "7145559876",
      licenseNumber: "C-3456789",
      message:
        "BBQ restaurant needs regular supply of various cuts. Can you accommodate weekly orders of 200+ lbs?",
      cartItems: [
        { name: "Short Ribs", quantity: 8, price: 32.0 },
        { name: "Beef Brisket", quantity: 4, price: 18.99 },
        { name: "Pork Belly", quantity: 6, price: 16.5 },
      ],
      cartTotal: 431.92,
      timestamp: "2024-01-13T09:45:00Z",
      status: "pending",
    },
    {
      id: 4,
      name: "Jennifer Lee",
      email: "jennifer@freshmeatco.com",
      phone: "3234447890",
      licenseNumber: "C-4567890",
      message:
        "Small grocery store looking for competitive wholesale pricing. Interested in marinated options.",
      cartItems: [
        { name: "Marinated Chicken", quantity: 3, price: 12.99 },
        { name: "Spicy Pork", quantity: 2, price: 14.5 },
      ],
      cartTotal: 67.97,
      timestamp: "2024-01-12T16:20:00Z",
      status: "quote_sent",
    },
    {
      id: 5,
      name: "Robert Johnson",
      email: "rob.johnson@meatdistributors.com",
      phone: "8185552468",
      licenseNumber: "C-5678901",
      message:
        "Large distributor seeking partnership for Korean-style cuts. Volume pricing needed.",
      cartItems: [
        { name: "LA Galbi", quantity: 10, price: 35.0 },
        { name: "Beef Chuck Eye", quantity: 12, price: 19.99 },
        { name: "Pork Shoulder", quantity: 8, price: 13.75 },
      ],
      cartTotal: 699.88,
      timestamp: "2024-01-11T11:00:00Z",
      status: "in_negotiation",
    },
  ];

  const handleAccept = async (request) => {
    //TODO: Send Confirmation Email
    try {
      const res = await fetch(
        `http://localhost:3001/api/users/approve-signup/${request.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.ok) {
        setSignupRequests((prev) => prev.filter((r) => r.id !== request.id));

        toast({
          title: "User Approved Successfully",
          description: `${request.first_name} ${request.last_name} has been approved and added to the system.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "User Approval Failed",
          description: `${request.first_name} ${request.last_name}'s email is already in the system`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        console.error("Failed to approve user");
      }
    } catch (err) {
      console.error("Error approving user:", err);
    }
  };

  const handleReject = async (request) => {
    try {
      //TODO: Send Confirmation Email
      const res = await fetch(
        `http://localhost:3001/api/users/signup-requests/${request.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        setSignupRequests((prev) => prev.filter((r) => r.id !== request.id));

        toast({
          title: "Request Rejected",
          description: `Signup request from ${request.first_name} ${request.last_name} has been rejected.`,
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      } else {
        const errorData = await res
          .json()
          .catch(() => ({ error: "Unknown error" }));

        toast({
          title: "Failed to Reject Request",
          description:
            errorData.error ||
            errorData.message ||
            "An unexpected error occurred",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });

        console.error("Failed to reject request:", errorData);
      }
    } catch (err) {
      toast({
        title: "Error Rejecting Request",
        description:
          "Network error or server is unavailable. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });

      console.error("Error rejecting request:", err);
    }
  };

  const toggleInquiry = (inquiryId) => {
    const newExpanded = new Set(expandedInquiries);
    if (newExpanded.has(inquiryId)) {
      newExpanded.delete(inquiryId);
    } else {
      newExpanded.add(inquiryId);
    }
    setExpandedInquiries(newExpanded);
  };

  return (
    <Box>
      <Box bg="white" borderRadius="2xl" p={6} boxShadow="sm" minH="500px">
        <Heading size="lg" fontWeight="bold" mb={6}>
          Signup Requests
        </Heading>

        {/* Stats */}
        <Box bg="gray.50" p={4} borderRadius="lg" mb={6}>
          <Text fontSize="sm" color="gray.600">
            Total Requests
          </Text>
          <Text fontSize="2xl" fontWeight="bold">
            {signupRequests?.length || 0}
          </Text>
        </Box>

        {/* Requests Table */}
        <Box overflow="auto" maxH="400px">
          <Table variant="simple" size="sm">
            <Thead position="sticky" top={0} bg="white" zIndex={1}>
              <Tr>
                <Th fontWeight="bold">Name</Th>
                <Th>Company</Th>
                <Th>Email</Th>
                <Th>License #</Th>
                <Th>Date</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {signupRequests?.length > 0 ? (
                signupRequests.map((request) => (
                  <Tr key={request.id}>
                    <Td fontWeight="bold">
                      {request.first_name} {request.last_name}
                    </Td>
                    <Td>{request.company}</Td>
                    <Td>{request.email}</Td>
                    <Td>{request.license_number}</Td>
                    <Td>
                      {request.timestamp
                        ? new Date(request.timestamp).toLocaleDateString()
                        : "N/A"}
                    </Td>
                    <Td>
                      <Button
                        size="xs"
                        colorScheme="green"
                        mr={2}
                        onClick={() => handleAccept(request)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="xs"
                        colorScheme="red"
                        onClick={() => handleReject(request)}
                      >
                        Reject
                      </Button>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={6} textAlign="center" py={8}>
                    <Text color="gray.500">No signup requests found</Text>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </Box>
      <Box
        bg="white"
        borderRadius="2xl"
        p={6}
        boxShadow="sm"
        minH="500px"
        mt={8}
      >
        <Heading size="lg" fontWeight="bold" mb={6}>
          Inquiries
        </Heading>
        <Box overflow="auto" maxH="400px">
          <Table variant="simple" size="sm">
            <Thead position="sticky" top={0} bg="white" zIndex={1}>
              <Tr>
                <Th fontWeight="bold">Name</Th>
                <Th>Email</Th>
                <Th>License #</Th>
                <Th>Cart Total</Th>
                <Th>Date</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {inquiries?.length > 0 ? (
                inquiries.map((inquiry) => (
                  <React.Fragment key={inquiry.id}>
                    <Tr>
                      <Td fontWeight="bold">{inquiry.name}</Td>
                      <Td>{inquiry.email}</Td>
                      <Td>{inquiry.licenseNumber}</Td>
                      <Td>${inquiry.cartTotal}</Td>
                      <Td>
                        {inquiry.timestamp
                          ? new Date(inquiry.timestamp).toLocaleDateString()
                          : "N/A"}
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={
                            inquiry.status === "pending"
                              ? "yellow"
                              : inquiry.status === "responded"
                              ? "green"
                              : inquiry.status === "quote_sent"
                              ? "blue"
                              : inquiry.status === "in_negotiation"
                              ? "purple"
                              : "gray"
                          }
                          textTransform="capitalize"
                        >
                          {inquiry.status.replace("_", " ")}
                        </Badge>
                      </Td>
                      <Td>
                        <Button
                          size="xs"
                          variant="outline"
                          mr={2}
                          onClick={() => toggleInquiry(inquiry.id)}
                        >
                          {expandedInquiries.has(inquiry.id) ? "Hide" : "View"}
                        </Button>
                        <Button
                          size="xs"
                          colorScheme="green"
                          onClick={() => handleRespondInquiry(inquiry)}
                        >
                          Respond
                        </Button>
                      </Td>
                    </Tr>
                    {expandedInquiries.has(inquiry.id) && (
                      <Tr>
                        <Td colSpan={7} bg="gray.50" p={4}>
                          <VStack align="stretch" spacing={4}>
                            <SimpleGrid columns={2} spacing={4}>
                              <Box>
                                <Text fontSize="sm" fontWeight="bold">
                                  Phone:
                                </Text>
                                <Text fontSize="sm">{inquiry.phone}</Text>
                              </Box>
                              <Box>
                                <Text fontSize="sm" fontWeight="bold">
                                  License:
                                </Text>
                                <Text fontSize="sm">
                                  {inquiry.licenseNumber}
                                </Text>
                              </Box>
                            </SimpleGrid>

                            <Box>
                              <Text fontSize="sm" fontWeight="bold" mb={2}>
                                Message:
                              </Text>
                              <Text
                                fontSize="sm"
                                bg="white"
                                p={3}
                                borderRadius="md"
                              >
                                {inquiry.message}
                              </Text>
                            </Box>

                            <Box>
                              <Text fontSize="sm" fontWeight="bold" mb={2}>
                                Cart Items:
                              </Text>
                              <VStack spacing={1} align="stretch">
                                {(inquiry.cart_items || []).map((item, idx) => (
                                  <Flex
                                    key={idx}
                                    justify="space-between"
                                    bg="white"
                                    p={2}
                                    borderRadius="md"
                                  >
                                    <Text fontSize="xs">
                                      {item.name} (Qty: {item.quantity})
                                    </Text>
                                    <Text fontSize="xs" fontWeight="bold">
                                      ${(item.price * item.quantity).toFixed(2)}
                                    </Text>
                                  </Flex>
                                ))}
                                <Divider />
                                <Flex justify="space-between" fontWeight="bold">
                                  <Text fontSize="sm">Total:</Text>
                                  <Text fontSize="sm">
                                    ${inquiry.cartTotal}
                                  </Text>
                                </Flex>
                              </VStack>
                            </Box>
                          </VStack>
                        </Td>
                      </Tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <Tr>
                  <Td colSpan={7} textAlign="center" py={8}>
                    <Text color="gray.500">No inquiries found</Text>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
};

export const InventoryStatus = () => {
  return (
    <Box
      bg="white"
      borderRadius="2xl"
      p={6}
      boxShadow="sm"
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      position="relative"
    >
      <Text fontWeight="bold" fontSize="lg" mb={1}>
        Inventory Status
      </Text>
      <Text fontWeight="extrabold" fontSize="3xl" mb={2}>
        0
      </Text>
      <IconButton
        icon={<ChevronRightIcon boxSize={6} />}
        aria-label="Go"
        size="sm"
        position="absolute"
        top={4}
        right={4}
        variant="ghost"
      />
    </Box>
  );
};