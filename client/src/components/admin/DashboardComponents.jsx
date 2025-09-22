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
  Grid,
  GridItem,
  Wrap,
  WrapItem,
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
  Center,
} from "@chakra-ui/react";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@chakra-ui/icons";
import { API_CONFIG } from "../../constants";
import { useToast } from "@chakra-ui/react";
// import { ChevronUpIcon } from "lucide-react";

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
  console.log(orders)

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
                          <Badge colorScheme={statusColor(order.order_status)}>
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
                            <Badge colorScheme={statusColor("quote sent")}>
                              quote sent
                            </Badge>
                          </MenuItem>
                          <MenuItem
                            onClick={() =>
                              handleStatusUpdate(order.id, "order placed")
                            }
                          >
                            <Badge colorScheme={statusColor("order placed")}>
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
                            <Badge colorScheme={statusColor("completion")}>
                              complete
                            </Badge>
                          </MenuItem>
                        </MenuList>
                      </Menu>
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
                            {/* 
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
                            </Menu> */}
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
