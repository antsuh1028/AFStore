import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Link,
  VStack,
  Spinner,
  Center,
  Button,
  Divider,
  HStack,
  Image,
  Grid,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
  Input,
  Toast,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useMemo } from "react";

import { useNavigate } from "react-router-dom";
import { ChevronLeft, Filter } from "lucide-react";
import { CheckCircleIcon } from "lucide-react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { SimpleGrid } from "@chakra-ui/react";

import { COLORS, API_CONFIG } from "../../constants";
import Logger from "../../utils/logger";

const OrdersList = ({ orders, currPage }) => {
  const navigate = useNavigate();
  const [orderItemsMap, setOrderItemsMap] = useState({});
  const [itemDetailsMap, setItemDetailsMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  const sortedAndFilteredOrders = useMemo(() => {
    const sorted = [...orders].sort((a, b) => {
      return new Date(b.order_date) - new Date(a.order_date);
    });

    if (filterStatus === "all") {
      return sorted;
    } else {
      return sorted.filter((order) => order.order_status === filterStatus);
    }
  }, [orders, filterStatus]);

  const getUniqueStatuses = () => {
    const statuses = [...new Set(orders.map((order) => order.order_status))];
    return statuses.filter((status) => status);
  };

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
    if (!sortedAndFilteredOrders || sortedAndFilteredOrders.length === 0) return;
    setLoading(true);

    const fetchOrderItemsAndDetails = async () => {
      const itemsMap = {};
      const itemIds = new Set();

      await Promise.all(
        sortedAndFilteredOrders.map(async (order) => {
          const res = await fetch(
            `${API_CONFIG.BASE_URL}/api/order-items/orders/${order.id}`
          );
          const data = await res.json();
          if (data.success) {
            itemsMap[order.id] = data.data;
            data.data.forEach((oi) => itemIds.add(oi.item_id));
          }
        })
      );

      setOrderItemsMap(itemsMap);
      Logger.info("Order items map (pre-sorted by order_date):", itemsMap);

      if (itemIds.size > 0) {
        const itemDetailsRes = await fetch(
          `${API_CONFIG.BASE_URL}/api/items?ids=${Array.from(itemIds).join(',')}`
        );
        const itemDetailsData = await itemDetailsRes.json();
        if (itemDetailsData.success) {
          const detailsMap = {};
          itemDetailsData.data.forEach((item) => {
            detailsMap[item.id] = item;
          });
          setItemDetailsMap(detailsMap);
        }
      }

      setLoading(false);
    };

    fetchOrderItemsAndDetails();
  }, [sortedAndFilteredOrders]);

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
    <VStack
      align="stretch"
      spacing={8}
      py={4}
      maxH="90vh"
      overflowY="auto"
      sx={{
        "&::webkitScrollbar": { display: "none" },
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}
    >
      {currPage === "orders" && (
        <Flex alignItems="center" justifyContent="space-between" px={4}>
          <Text fontSize="sm" color="gray.600">
            {sortedAndFilteredOrders.length} of {orders.length} orders
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

      {sortedAndFilteredOrders.length === 0 ? (
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
        sortedAndFilteredOrders.map((order) => (
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
                  ? item.name.replace(/[\/\\:*?"<>|]/g, "").trim()
                  : "";
                const imgSrc =
                  safeStyle && safeName
                    ? `/products/${safeStyle}/${safeName}/01.jpg`
                    : "/images/gray.avif";
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
                      fallbackSrc="/images/gray.avif"
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

export const myPages = (
  currPage,
  {
    userInformation,
    setUserInformation,
    handleLogout,
    setCurrPage,
    orders,
    address,
    updateUserInfo,
    refreshUserInfo,
    toast,
    deleteModalDisclosure,
  }
) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInformation((prev) => ({
      ...prev,
      [name.replace("new_", "")]: value,
    }));
  };

  const handleSubmit = async () => {
    const updates = {
      name: userInformation.name,
      email: userInformation.email,
      phone_number: userInformation.phone_number,
    };

    try {
      const response = await updateUserInfo(updates);
      if (response.success) {
        refreshUserInfo();
        setCurrPage("all");
        toast({
          title: "Profile updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        console.error("Failed to update:", response.message);
        toast({
          title: "Update failed",
          description: response.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      toast({
        title: "Update failed",
        description: "An error occurred while updating your profile",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (currPage === "all") {
    return (
      <>
        <Flex
          p={4}
          bg={COLORS.PRIMARY}
          borderRadius="full"
          align="center"
          justify="space-between"
          h="45px"
          mb={2}
        >
          <Text color="white" fontWeight="bold" ml={2}>
            Profile
          </Text>
          <Flex gap={2} align="center">
            <Link
              fontSize="xs"
              color="white"
              textDecoration="underline"
              _hover={{ color: "gray.200" }}
              onClick={() => setCurrPage("edit")}
            >
              Edit
            </Link>
            <Divider orientation="vertical" borderColor="white" h="12px" />
            <Link
              fontSize="xs"
              color="white"
              textDecoration="underline"
              _hover={{ color: "gray.200" }}
              onClick={handleLogout}
            >
              Log out
            </Link>
          </Flex>
        </Flex>
        <VStack p={2} mt={4} mb={16} align="stretch">
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
                {userInformation.name || "—"}
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
                {userInformation.email || "—"}
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
                {userInformation.phone_number || "—"}
              </Text>
              <Text
                fontWeight="bold"
                textTransform="uppercase"
                textAlign="left"
                fontSize="xs"
                mr={2}
              >
                California Resale :
              </Text>
              <Text fontSize="sm" textAlign="left">
                {userInformation.california_resale || "—"}
              </Text>
              <Text
                fontWeight="bold"
                textTransform="uppercase"
                textAlign="left"
                fontSize="xs"
                mr={2}
              >
                Business License :
              </Text>
              <Text fontSize="sm" textAlign="left">
                {userInformation.license_number || "—"}
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
          {/* <Flex my={10} justify="space-between" width="100%">
            <Button
              bg="none"
              size="xs"
              textDecoration="underline"
              color="#b8b7b7"
              _hover={{ bg: "none", color: "black" }}
              onClick={deleteModalDisclosure.onOpen}
            >
              Delete Account
            </Button>
          </Flex> */}
        </VStack>

        <Flex
          p={4}
          bg={COLORS.PRIMARY}
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
            fontSize="xs"
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
        <Modal
          isOpen={deleteModalDisclosure.isOpen}
          onClose={deleteModalDisclosure.onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Delete Account</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you want to delete your account? This action cannot
              be undone.
            </ModalBody>
            <ModalFooter>
              <Button
                variant="ghost"
                mr={3}
                onClick={deleteModalDisclosure.onClose}
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  deleteModalDisclosure.onClose();
                }}
              >
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }
  if (currPage === "orders") {
    return (
      <>
        <Flex
          p={4}
          bg={COLORS.PRIMARY}
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
        <VStack bg={COLORS.GRAY_LIGHT} p={2} my={4}>
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
  if (currPage === "edit") {
    return (
      <>
        <Flex
          p={4}
          bg={COLORS.PRIMARY}
          borderRadius="full"
          align="center"
          justify="space-between"
          h="45px"
          mb={2}
        >
          <Text color="white" fontWeight="bold" ml={2}>
            Edit Profile
          </Text>
        </Flex>
        <VStack p={2} my={4}>
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
              <Input
                h="120%"
                fontSize="sm"
                textAlign="left"
                value={userInformation.name || ""}
                name="new_name"
                onChange={handleInputChange}
              />
              <Text
                fontWeight="bold"
                textTransform="uppercase"
                textAlign="left"
                fontSize="sm"
                mr={2}
              >
                Email :
              </Text>
              <Input
                h="120%"
                fontSize="sm"
                textAlign="left"
                value={userInformation.email || ""}
                name="new_email"
                onChange={handleInputChange}
              />
              <Text
                fontWeight="bold"
                textTransform="uppercase"
                textAlign="left"
                fontSize="sm"
                mr={2}
              >
                Phone :
              </Text>
              <Input
                h="120%"
                fontSize="sm"
                textAlign="left"
                value={userInformation.phone_number || ""}
                name="new_phone_number"
                onChange={handleInputChange}
              />
              <Text
                fontWeight="bold"
                textTransform="uppercase"
                textAlign="left"
                fontSize="xs"
                mr={2}
              >
                California Resale :
              </Text>
              <Input
                h="100%"
                fontSize="sm"
                textAlign="left"
                value={userInformation.california_resale || ""}
                name="california_resale"
                readOnly
              />
              <Text
                fontWeight="bold"
                textTransform="uppercase"
                textAlign="left"
                fontSize="xs"
                mr={2}
              >
                Business License :
              </Text>
              <Input
                h="100%"
                fontSize="sm"
                textAlign="left"
                value={userInformation.license_number || ""}
                name="license_number"
                readOnly
              />
              <Text
                fontWeight="bold"
                textTransform="uppercase"
                textAlign="left"
                fontSize="sm"
                mr={2}
              >
                Address :
              </Text>
              <Input
                h="120%"
                fontSize="sm"
                textAlign="left"
                value={address || ""}
                name="address"
                readOnly
              />
            </Grid>
          </Box>
          <Button colorScheme="gray" size="md" my={8} onClick={handleSubmit}>
            Submit
          </Button>
        </VStack>
      </>
    );
  }
  if (currPage === "history") {
    return <Text>History Content</Text>;
  }
  return null;
};
