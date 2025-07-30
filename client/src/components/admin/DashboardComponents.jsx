import React, { useState } from "react";
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
  HStack,
  Divider,
  Select,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
  Textarea,
  Input,
} from "@chakra-ui/react";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@chakra-ui/icons";
import { API_CONFIG } from "../../constants";
// import { ChevronUpIcon } from "lucide-react";

const InquiryResponseModal = ({
  isOpen,
  onClose,
  request,
  onConfirmReject,
}) => {
  const [rejectReason, setRejectReason] = useState("");

  //TODO: Email Rejection with message

  const handleConfirm = () => {
    onConfirmReject(request, rejectReason);
    setRejectReason("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Reject Signup Request</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={4}>
            Are you sure you want to reject the signup request from{" "}
            <Text as="span" fontWeight="bold">
              {request?.first_name} {request?.last_name}
            </Text>
            ?
          </Text>
          <Text mb={2} fontSize="sm" fontWeight="bold">
            Reason for rejection (optional):
          </Text>
          <Textarea
            placeholder="Enter reason for rejection..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={handleConfirm}>
            Confirm Reject
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const RejectModal = ({ isOpen, onClose, request, onConfirmReject }) => {
  const [rejectReason, setRejectReason] = useState("");

  //TODO: Email Rejection with message

  const handleConfirm = () => {
    onConfirmReject(request, rejectReason);
    setRejectReason("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Reject Signup Request</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={4}>
            Are you sure you want to reject the signup request from{" "}
            <Text as="span" fontWeight="bold">
              {request?.first_name} {request?.last_name}
            </Text>
            ?
          </Text>
          <Text mb={2} fontSize="sm" fontWeight="bold">
            Reason for rejection (optional):
          </Text>
          <Textarea
            placeholder="Enter reason for rejection..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={handleConfirm}>
            Confirm Reject
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};



export const Orders = ({
  orders,
  usersMap,
  orderItemsMap,
  itemsMap,
  token,
  setOrders,
  toast,
  userAddresses,
  orderType,
}) => {
  const [filter, setFilter] = useState(orderType);
  const [expandedRows, setExpandedRows] = useState(new Set());

  const statusColor = (status) => {
    if (status === "complete" || status === "completion") return "green";
    if (status === "incomplete") return "yellow";
    if (status === "pending") return "red";
    if (status === "contacted") return "orange";
    if (status === "quote sent") return "purple";
    if (status === "order placed") return "blue";
    if (status === "declined") return "red";
    return "gray";
  };
  const FormatAddress = (address) => {
    if (!address) return "No address provided";

    return `${address.address_line_1}${
      address.address_line_2 ? ", " + address.address_line_2 : ""
    }, ${address.city}, ${address.state} ${address.zip_code}`;
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await fetch(
        `${API_CONFIG.BASE_URL}/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (res.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, order_status: newStatus } : order
          )
        );

        toast({
          title: "Status Updated",
          description: `Order status changed to ${newStatus}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
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
    orders
      ?.filter((order) => {
        if (filter === "all") return true;
        return (
          order.order_status?.toLowerCase() === filter ||
          order.order_type?.toLowerCase() === filter
        );
      })
      .sort((a, b) => new Date(b.order_date) - new Date(a.order_date)) || [];

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
          {Array.from(
            new Set(orders?.map((order) => order.order_status).filter(Boolean))
          ).map((status) => (
            <option key={status} value={status.toLowerCase()}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </Select>
      </Flex>

      {/* Stats Cards */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
        <Box bg="gray.50" p={4} borderRadius="lg">
          <Text fontSize="sm" color="gray.600">
            Total Orders
          </Text>
          <Text fontSize="2xl" fontWeight="bold">
            {filteredOrders?.length || 0}
          </Text>
        </Box>
        <Box bg="gray.50" p={4} borderRadius="lg">
          <Text fontSize="sm" color="gray.600">
            Pending Orders
          </Text>
          <Text fontSize="2xl" fontWeight="bold">
            {filteredOrders?.filter(
              (o) => o.order_status?.toLowerCase() === "pending"
            ).length || 0}
          </Text>
        </Box>
        <Box bg="gray.50" p={4} borderRadius="lg">
          <Text fontSize="sm" color="gray.600">
            Total Revenue
          </Text>
          <Text fontSize="2xl" fontWeight="bold">
            $
            {filteredOrders
              ?.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0)
              .toLocaleString() || 0}
          </Text>
        </Box>
      </SimpleGrid>

      {/* Orders Table */}
      <Box overflow="auto" maxH="600px">
        <Table variant="simple" size="sm">
          <Thead position="sticky" top={0} bg="white" zIndex={1}>
            <Tr>
              <Th>Customer</Th>
              <Th fontWeight="bold">Order #</Th>
              <Th fontWeight="bold">Email</Th>
              <Th fontWeight="bold">License Number</Th>
              <Th fontWeight="bold">CA resale</Th>
              <Th>Date</Th>

              <Th>Total</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <Tr>
                    <Td py={4}>
                      <Text fontWeight="bold" fontSize="md" mb={2}>
                        {getUserName(order.user_id)}
                      </Text>
                      <Text color="gray.600" fontSize="md" fontWeight="bold">
                        {usersMap[order.user_id]?.company || "Not Listed"}
                      </Text>
                    </Td>
                    <Td fontWeight="bold">#{order.order_number}</Td>
                    <Td py={4}>{usersMap[order.user_id]?.email}</Td>
                    <Td py={4}>{usersMap[order.user_id]?.license_number}</Td>
                    <Td py={4}>{usersMap[order.user_id]?.california_resale}</Td>
                    <Td py={4}>
                      {order.order_date
                        ? new Date(order.order_date).toLocaleDateString()
                        : "N/A"}
                    </Td>
                    <Td fontWeight="bold">${order.total_amount}</Td>
                    <Td py={4}>
                      <Badge
                        colorScheme={statusColor(order.order_status)}
                        variant="subtle"
                      >
                        {order.order_status}
                      </Badge>
                    </Td>

                    <Td py={4}>
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => toggleRow(order.id)}
                        border="none"
                        _hover={{ bg: "transparent" }}
                      >
                        {expandedRows.has(order.id) ? (
                          <ChevronUpIcon boxSize={8} />
                        ) : (
                          <ChevronDownIcon boxSize={8} />
                        )}
                      </Button>
                    </Td>
                  </Tr>

                  {expandedRows.has(order.id) && (
                    <Tr>
                      <Td colSpan={9} p={4}>
                        <Flex gap={6}>
                          {/* Left - Address */}
                          <Box w="30%">
                            <Text fontSize="sm" fontWeight="bold" mb={2}>
                              Address:
                            </Text>
                            <Text fontSize="sm" mb={3}>
                              {FormatAddress(userAddresses[order.user_id])}
                            </Text>

                            <Text fontSize="sm" fontWeight="bold" mb={2}>
                              Phone:
                            </Text>
                            <Text fontSize="sm" mb={3}>
                              {usersMap[order.user_id]?.phone_number || "N/A"}
                            </Text>

                            <Text fontSize="sm" fontWeight="bold" mb={2}>
                              Created:
                            </Text>
                            <Text fontSize="sm" mb={4}>
                              {order.created_at
                                ? new Date(order.created_at).toLocaleString()
                                : "N/A"}
                            </Text>

                            <Menu>
                              <MenuButton
                                as={Button}
                                rightIcon={<ChevronDownIcon />}
                                size="xs"
                                variant="outline"
                                bg="white"
                                borderColor="gray.300"
                                _hover={{ bg: "gray.50" }}
                                _active={{ bg: "gray.100" }}
                              >
                                <Badge
                                  colorScheme={statusColor(order.order_status)}
                                >
                                  {order.order_status}
                                </Badge>
                              </MenuButton>
                              <MenuList>
                                <MenuItem
                                  onClick={() =>
                                    handleStatusUpdate(order.id, "contacted")
                                  }
                                >
                                  <Badge colorScheme={statusColor("contacted")}>
                                    contacted
                                  </Badge>
                                </MenuItem>
                                <MenuItem
                                  onClick={() =>
                                    handleStatusUpdate(order.id, "quote sent")
                                  }
                                >
                                  <Badge
                                    colorScheme={statusColor("quote sent")}
                                  >
                                    quote sent
                                  </Badge>
                                </MenuItem>
                                <MenuItem
                                  onClick={() =>
                                    handleStatusUpdate(order.id, "order placed")
                                  }
                                >
                                  <Badge
                                    colorScheme={statusColor("order placed")}
                                  >
                                    order placed
                                  </Badge>
                                </MenuItem>
                                <MenuItem
                                  onClick={() =>
                                    handleStatusUpdate(order.id, "declined")
                                  }
                                >
                                  <Badge colorScheme={statusColor("declined")}>
                                    declined
                                  </Badge>
                                </MenuItem>
                                <MenuItem
                                  onClick={() =>
                                    handleStatusUpdate(order.id, "pending")
                                  }
                                >
                                  <Badge colorScheme={statusColor("pending")}>
                                    pending
                                  </Badge>
                                </MenuItem>
                                <MenuItem
                                  onClick={() =>
                                    handleStatusUpdate(order.id, "complete")
                                  }
                                >
                                  <Badge
                                    colorScheme={statusColor("completion")}
                                  >
                                    complete
                                  </Badge>
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </Box>

                          {/* Right - Items Table */}
                          <Box w="70%">
                            {orderItemsMap[order.id]?.length > 0 ? (
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
                                          {itemsMap[item.item_id]?.name ||
                                            `Item #${item.item_id}`}
                                        </Td>
                                        <Td fontSize="xs">{item.quantity}</Td>
                                        <Td fontSize="xs">
                                          ${itemsMap[item.item_id]?.price}
                                        </Td>
                                        <Td fontSize="xs" fontWeight="bold">
                                          $
                                          {(
                                            item.quantity *
                                              itemsMap[item.item_id]?.price || 0
                                          ).toFixed(2)}
                                        </Td>
                                      </Tr>
                                    )
                                  )}
                                </Tbody>
                              </Table>
                            ) : (
                              <Text fontSize="sm" color="gray.500">
                                No items found
                              </Text>
                            )}
                          </Box>
                        </Flex>
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
  token,
  setSignupRequests,
  toast,
}) => {
  const [expandedInquiries, setExpandedInquiries] = useState(new Set());
  const [selectedRequest, setSelectedRequest] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleAccept = async (request) => {
    try {
      const res = await fetch(
        `${API_CONFIG.BASE_URL}/api/users/approve-signup/${request.id}`,
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

  const handleReject = (request) => {
    setSelectedRequest(request);
    onOpen();
  };

  const handleConfirmReject = async (request, reason) => {
    try {
      const res = await fetch(
        `${API_CONFIG.BASE_URL}/api/users/signup-requests/${request.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason }),
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

  const handleRespondInquiry = (inquiry) => {
    // Implement respond to inquiry logic
    console.log("Responding to inquiry:", inquiry);
  };

  return (
    <Box>
      <RejectModal
        isOpen={isOpen}
        onClose={onClose}
        request={selectedRequest}
        onConfirmReject={handleConfirmReject}
      />

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
    </Box>
  );
};

export const Inquiries = ({ inquiries }) => {
  const [expandedInquiries, setExpandedInquiries] = useState(new Set());
  const [responses, setResponses] = useState({});
  const toggleInquiry = (inquiryId) => {
    const newExpanded = new Set(expandedInquiries);
    if (newExpanded.has(inquiryId)) {
      newExpanded.delete(inquiryId);
    } else {
      newExpanded.add(inquiryId);
    }
    setExpandedInquiries(newExpanded);
  };

  const handleRespondInquiry = (inquiry, message) => {
    // TODO SEND EMAIL THROUGH EMAILJS
    console.log("Responding to inquiry:", inquiry);
    console.log("Message:", message);
  };
  return (
    <Box bg="white" borderRadius="2xl" p={6} boxShadow="sm" minH="600px" mt={8}>
      <Heading size="lg" fontWeight="bold" mb={6}>
        Inquiries - {inquiries.length}
      </Heading>
      <Box overflow="auto" maxH="600px">
        <Table variant="simple" size="sm">
          <Thead position="sticky" top={0} bg="white" zIndex={1}>
            <Tr>
              <Th fontWeight="bold">Name</Th>
              <Th>Company</Th>
              <Th>Email</Th>
              <Th>License #</Th>
              <Th>CA Resale</Th>
              <Th>Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {inquiries?.length > 0 ? (
              inquiries.map((inquiry) => (
                <React.Fragment key={inquiry.id}>
                  <Tr>
                    <Td fontWeight="bold">{inquiry.name}</Td>
                    <Td>{inquiry.company}</Td>
                    <Td>{inquiry.email}</Td>
                    <Td>{inquiry.license_number}</Td>
                    <Td>{inquiry.california_resale}</Td>
                    <Td>
                      {inquiry.timestamp
                        ? new Date(inquiry.timestamp).toLocaleDateString()
                        : "N/A"}
                    </Td>
                    <Td>
                      <Button
                        size="xs"
                        variant="outline"
                        mr={2}
                        onClick={() => toggleInquiry(inquiry.id)}
                        border="none"
                        _hover={{ bg: "transparent" }}
                      >
                        {expandedInquiries.has(inquiry.id) ? (
                          <ChevronUpIcon boxSize={8} />
                        ) : (
                          <ChevronDownIcon boxSize={8} />
                        )}
                      </Button>
                    </Td>
                  </Tr>
                  {expandedInquiries.has(inquiry.id) && (
                    <Tr>
                      <Td colSpan={7} p={4}>
                        <Flex gap={6}>
                          {/* Left - Contact Info */}
                          <Box w="25%">
                            <VStack align="start" spacing={3}>
                              <Box>
                                <Text fontSize="sm" fontWeight="bold" mb={2}>
                                  Phone:
                                </Text>
                                <Text fontSize="sm" ml={1}>
                                  {inquiry.phone}
                                </Text>
                              </Box>
                              <Box>
                                <Text fontSize="sm" fontWeight="bold" mb={2}>
                                  Address:
                                </Text>
                                <Text fontSize="sm" ml={1}>
                                  {inquiry.company_address_1}
                                  {inquiry.company_address_2 &&
                                    `, ${inquiry.company_address_2}`}
                                  <br />
                                  {inquiry.city}, {inquiry.state}{" "}
                                  {inquiry.zip_code}
                                </Text>
                              </Box>
                            </VStack>
                          </Box>

                          {/* Right - Message & Response */}
                          <Box w="60%">
                            <VStack align="stretch" spacing={4}>
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
                                  Response:
                                </Text>
                                <Textarea
                                  name="response"
                                  fontSize="sm"
                                  bg="white"
                                  placeholder="Type your response..."
                                  rows={4}
                                  value={responses[inquiry.id] || ""}
                                  onChange={(e) =>
                                    setResponses((prev) => ({
                                      ...prev,
                                      [inquiry.id]: e.target.value,
                                    }))
                                  }
                                />
                                <Button
                                  size="sm"
                                  my={4}
                                  onClick={() =>
                                    handleRespondInquiry(
                                      inquiry,
                                      responses[inquiry.id] || ""
                                    )
                                  }
                                >
                                  Send Email
                                </Button>
                              </Box>
                            </VStack>
                          </Box>
                        </Flex>
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
