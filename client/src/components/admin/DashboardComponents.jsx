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
  Image,
} from "@chakra-ui/react";
import { ChevronRightIcon, ChevronDownIcon } from "@chakra-ui/icons";

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
}) => {
  const [filter, setFilter] = useState("all");
  const [expandedRows, setExpandedRows] = useState(new Set());

  const statusColor = (status) => {
    if (status === "complete") return "green";
    if (status === "incomplete") return "yellow";
    if (status === "pending") return "gray";
    return "gray";
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/orders/${orderId}/status`,
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
        return order.order_status?.toLowerCase() === filter;
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
              <Th>Company</Th>
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
                    <Td>{usersMap[order.user_id]?.company || `Not Listed`}</Td>
                    <Td>
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
                            <Badge colorScheme={statusColor("complete")}>
                              complete
                            </Badge>
                          </MenuItem>
                          <MenuItem
                            onClick={() =>
                              handleStatusUpdate(order.id, "incomplete")
                            }
                          >
                            <Badge colorScheme={statusColor("incomplete")}>
                              incomplete
                            </Badge>
                          </MenuItem>
                        </MenuList>
                      </Menu>
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
                                          {itemsMap[item.item_id].name ||
                                            `Item #${item.item_id}`}
                                        </Td>
                                        <Td fontSize="xs">{item.quantity}</Td>
                                        <Td fontSize="xs">
                                          ${itemsMap[item.item_id].price}
                                        </Td>
                                        <Td fontSize="xs" fontWeight="bold">
                                          $
                                          {(
                                            item.quantity *
                                            itemsMap[item.item_id].price
                                          ).toFixed(2) || 0}
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




// export const Orders = ({
//   orders,
//   usersMap,
//   orderItemsMap,
//   itemsMap,
//   token,
//   setOrders,
//   toast,
// }) => {
//   const [filter, setFilter] = useState("all");
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   const statusColor = (status) => {
//     if (status === "complete") return "green";
//     if (status === "incomplete") return "yellow";
//     if (status === "pending") return "red";
//     return "gray";
//   };

//   const handleStatusUpdate = async (orderId, newStatus) => {
//     try {
//       const res = await fetch(
//         `http://localhost:3001/api/orders/${orderId}/status`,
//         {
//           method: "PUT",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ status: newStatus }),
//         }
//       );

//       if (res.ok) {
//         setOrders((prev) =>
//           prev.map((order) =>
//             order.id === orderId ? { ...order, order_status: newStatus } : order
//           )
//         );

//         toast({
//           title: "Status Updated",
//           description: `Order status changed to ${newStatus}`,
//           status: "success",
//           duration: 3000,
//           isClosable: true,
//         });
//       }
//     } catch (error) {
//       console.error("Error updating status:", error);
//       toast({
//         title: "Error",
//         description: "Failed to update order status",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//     }
//   };

//   const getUserName = (userId) => {
//     return (
//       usersMap[userId]?.name ||
//       usersMap[userId]?.username ||
//       `User #${userId}` ||
//       "Unknown User"
//     );
//   };

//   const filteredOrders =
//     orders
//       ?.filter((order) => {
//         if (filter === "all") return true;
//         return order.order_status?.toLowerCase() === filter;
//       })
//       .sort((a, b) => new Date(b.order_date) - new Date(a.order_date)) || [];

//   const getImagePath = (name, style) => {
//     if (style && name) {
//       const safeName = name.replace(/[^a-zA-Z0-9-_]/g, " ");
//       const safeStyle = style.replace(/[^a-zA-Z0-9-_]/g, " ");
//       return `/products/${safeStyle}/${safeName}/01.jpg`;
//     }
//     return "/gray.avif";
//   };

//   return (
//     <Flex gap={6} h="100vh" p={4}>
//       {/* Left Panel - Orders List */}
//       <Box
//         bg="white"
//         borderRadius="3xl"
//         p={8}
//         boxShadow="lg"
//         border="2px solid"
//         borderColor="gray.200"
//         flex="1"
//         maxW="400px"
//         overflowY="auto"
//       >
//         <Flex justify="space-between" align="center" mb={6}>
//           <Text fontWeight="black" fontSize="xl">
//             New Orders
//           </Text>
//           {/* <IconButton
//             icon={<ChevronRightIcon boxSize={4} />}
//             aria-label="Options"
//             size="sm"
//             variant="ghost"
//             bg="gray.100"
//             borderRadius="full"
//           /> */}
//         </Flex>

//         <VStack spacing={0} align="stretch">
//           <Flex justify="space-between" mb={4} px={2}>
//             <Text fontSize="sm" fontWeight="bold" color="gray.600">
//               Name
//             </Text>
//             <Text fontSize="sm" fontWeight="bold" color="gray.600" textAlign="left">
//               Date
//             </Text>
//           </Flex>

//           {filteredOrders.slice(0, 10).map((order) => (
//             <Box
//               key={order.id}
//               p={4}
//               borderBottom="1px solid"
//               borderColor="gray.100"
//               cursor="pointer"
//               _hover={{ bg: "gray.50" }}
//               onClick={() => setSelectedOrder(order)}
//               bg={selectedOrder?.id === order.id ? "gray.50" : "white"}
//             >
//               <Flex justify="space-between" align="center">
//                 <VStack align="start" spacing={1}>
//                   <Text fontWeight="bold" fontSize="sm">
//                     {getUserName(order.user_id)}
//                   </Text>
//                   <Text fontSize="xs" >
//                     {usersMap[order.user_id]?.company || "Company"}
//                   </Text>
//                 </VStack>
//                 <Text fontSize="sm" color="gray.600">
//                   {order.order_date
//                     ? new Date(order.order_date).toLocaleDateString("en-US", {
//                         month: "2-digit",
//                         day: "2-digit",
//                         year: "numeric",
//                       })
//                     : "N/A"}
//                 </Text>
//               </Flex>
//             </Box>
//           ))}
//         </VStack>
//       </Box>

//       {/* Right Panel - Order Details */}
//       <Box
//         bg="white"
//         borderRadius="3xl"
//         p={8}
//         boxShadow="lg"
//         border="2px solid"
//         borderColor="gray.200"
//         flex="2"
//         overflowY="auto"
//       >
//         {selectedOrder ? (
//           <>
//             <Flex justify="space-between" align="center" mb={8}>
//               <Text fontWeight="black" fontSize="xl">
//                 Order Detail
//               </Text>
//             </Flex>

//             {/* Order Info */}
//             <VStack spacing={6} align="stretch">
//               <Flex
//                 justify="space-between"
//                 align="center"
//                 p={4}
//                 borderRadius="full"
//                 bg="#ECECEC"
//                 border="2px solid"
//                 borderColor="gray.300"
//                 w="50%"
//                 pr={6}
//               >
//                 <Text fontSize="lg" color="gray.500" fontWeight="medium">
//                   Order Number
//                 </Text>
//                 <Text fontSize="lg" fontWeight="black">
//                   #{selectedOrder.order_number}
//                 </Text>
//               </Flex>

//               <Flex
//                 justify="space-between"
//                 align="center"
//                 p={4}
//                 borderRadius="full"
//                 bg="#ECECEC"
//                 border="2px solid"
//                 borderColor="gray.300"
//                 w="50%"
//                 pr={6}
//               >
//                 <Text fontSize="sm" color="gray.600">
//                   Date
//                 </Text>
//                 <Text fontWeight="bold">
//                   {selectedOrder.order_date
//                     ? new Date(selectedOrder.order_date).toLocaleDateString(
//                         "en-US",
//                         {
//                           month: "short",
//                           day: "numeric",
//                           year: "numeric",
//                         }
//                       )
//                     : "N/A"}
//                 </Text>
//               </Flex>

//               <Flex
//                 justify="space-between"
//                 align="center"
//                 p={4}
//                 borderRadius="full"
//                 bg="#ECECEC"
//                 border="2px solid"
//                 borderColor="gray.300"
//                 w="50%"
//                 pr={6}
//               >
//                 <Text fontSize="sm" color="gray.600">
//                   Email
//                 </Text>
//                 <Text fontWeight="bold" >
//                   {usersMap[selectedOrder.user_id]?.email || "N/A"}
//                 </Text>
//               </Flex>

//               {/* Order Items */}
//               <Box>
//                 {orderItemsMap[selectedOrder.id]?.map((item, idx) => {
//                   const product = itemsMap[item.item_id];
//                   return (
//                     <Flex
//                       key={idx}
//                       align="center"
//                       gap={4}
//                       mb={6}
//                       p={4}
//                       borderRadius="lg"
//                     >
//                       <Image
//                         src={getImagePath(product.name, product.style)}
//                         alt={item.name}
//                         w="130px"
//                         h="130px"
//                         objectFit="cover"
//                         borderRadius="md"
//                         fallbackSrc="/gray.avif"
//                       />
//                       <VStack align="start" flex="1" spacing={1}>
//                         <Text fontSize="13px" mb={2}>
//                           {product?.style === "marinated"
//                             ? "Marinated Meat"
//                             : product?.style === "processed"
//                             ? "Prepped Meat"
//                             : "Untrimmed Meat"}
//                         </Text>
//                         <Text
//                           fontWeight="bold"
//                           fontSize="sm"
//                           whiteSpace="pre-line"
//                         >
//                           {product?.name || `Item #${item.item_id}`}
//                           {"\n"}
//                           {product?.spec || ""}
//                         </Text>
//                         <Flex
//                           justifyContent="space-between"
//                           align="center"
//                           w="100%"
//                         >
//                           <Text fontWeight="bold" color="black">
//                             ${product?.price || 0}
//                           </Text>
//                           <Text fontWeight="black" fontSize="2xl">
//                             {item.quantity}
//                           </Text>
//                         </Flex>
//                       </VStack>
//                     </Flex>
//                   );
//                 })}
//               </Box>

//               {/* Total */}
//               <Box borderTop="2px solid" borderColor="gray.200" pt={4}>
//                 <Text fontWeight="black" fontSize="xl" textAlign="right">
//                   Total ${selectedOrder.total_amount}
//                 </Text>

//                 {/* Status Buttons */}
//                 <Flex gap={3} justifyContent="flex-end" my={4}>
//                   <Button
//                     size="sm"
//                     bg="purple.100"
//                     color="purple.700"
//                     borderRadius="full"
//                     onClick={() =>
//                       handleStatusUpdate(selectedOrder.id, "quote_sent")
//                     }
//                   >
//                     Quote Sent
//                   </Button>
//                   <Button
//                     size="sm"
//                     bg="red.100"
//                     color="red.700"
//                     borderRadius="full"
//                     onClick={() =>
//                       handleStatusUpdate(selectedOrder.id, "pending")
//                     }
//                   >
//                     Pending
//                   </Button>
//                 </Flex>
//               </Box>
//             </VStack>
//           </>
//         ) : (
//           <Flex align="center" justify="center" h="full">
//             <Text color="gray.500" fontSize="lg">
//               Select an order to view details
//             </Text>
//           </Flex>
//         )}
//       </Box>
//     </Flex>
//   );
// };

export const Signups = ({
  signupRequests,
  inquiries,
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

  const handleReject = (request) => {
    setSelectedRequest(request);
    onOpen();
  };

  const handleConfirmReject = async (request, reason) => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/users/signup-requests/${request.id}`,
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

  //   console.log(inquiries);

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

      <Box
        bg="white"
        borderRadius="2xl"
        p={6}
        boxShadow="sm"
        minH="500px"
        mt={8}
      >
        <Heading size="lg" fontWeight="bold" mb={6}>
          Inquiries - {inquiries.length}
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
                      <Td>{inquiry.license_number}</Td>
                      <Td>${inquiry.cart_total}</Td>
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
                                  {inquiry.license_number}
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
                                    ${inquiry.cart_total}
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
