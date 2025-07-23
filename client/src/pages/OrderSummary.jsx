import React from "react";
import NavDrawer from "../components/NavDrawer";
import Navbar from "../components/Navbar";
import { Spinner } from "@chakra-ui/react";
import {
  Circle,
  Flex,
  Box,
  useDisclosure,
  Divider,
  VStack,
  Heading,
  Container,
  Text,
  HStack,
  Button,
  
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/SideBar";
import { useState, useEffect, } from "react";
import ThreeStepLine from "../components/order/OrderPayment";
import { ShowCart } from "../components/profile/ShowCart";
import { CircleCheck } from "lucide-react";
import { useAuthContext } from "../hooks/useAuth";

import { API_CONFIG, COLORS } from "../constants";
import { getCart, removeFromCart } from "../utils/cartActions";


const StyledCheckbox = ({ isChecked, onChange, children }) => {
  return (
    <HStack spacing={3} align="flex-start">
      <Box
        as="input"
        type="checkbox"
        checked={isChecked}
        onChange={(e) => onChange(e.target.checked)}
        sx={{
          appearance: "none",
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          border: "2px solid #A0AEC0",
          backgroundColor: isChecked ? "black" : "white",
          cursor: "pointer",
          flexShrink: 0,
          marginTop: "2px",
          position: "relative",
          "&:checked": {
            backgroundColor: "black",
            borderColor: "black",
          },
          "&:checked::after": {
            content: '""',
            position: "absolute",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: "white",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          },
          "&:hover": {
            borderColor: "#4A5568",
          },
        }}
      />
      <Text fontSize="sm" color="gray.700" lineHeight="tall">
        {children}
      </Text>
    </HStack>
  );
};

const OrderPayment = ({
  isAgreed1,
  setIsAgreed1,
  isAgreed2,
  setIsAgreed2,
  isAgreed3,
  setIsAgreed3,
}) => {
  return (
    <Box p={6} bg="white" borderRadius="md" maxW="400px">
      <VStack spacing={4} align="stretch">
        <Box>
          <Text fontSize="sm" fontWeight="bold" color="black" mb={2}>
            Order & Payment Policy
          </Text>
          <Text fontSize="xs" color="gray.700" lineHeight="tall">
            After placing your order, you will recieve a confirmation email and pickup
            time once confirmed.
          </Text>
        </Box>

        <Box>
          <Text fontSize="sm" fontWeight="bold" color="black" mb={1}>
            Payment Terms
          </Text>
          <Text fontSize="xs" color="gray.700" lineHeight="tall">
            <Text as="span" fontWeight="bold">
              Delivery:
            </Text>{" "}
            Full prepayment required.
          </Text>
          <Text fontSize="xs" color="gray.700" lineHeight="tall">
            <Text as="span" fontWeight="bold">
              Pickup:
            </Text>{" "}
            50% prepayment, balance due at pickup.
          </Text>
          <Text fontSize="xs" color="gray.700" lineHeight="tall" mt={2}>
            Pay the balance in cash at pickup and get a up to 5% discount.
          </Text>
          <Text fontSize="xs" color="gray.700" lineHeight="tall">
            Credit card payments include sales tax.
          </Text>
          <Text fontSize="xs" color="gray.700" lineHeight="tall">
            Accepted payment methods:
          </Text>
          <Text fontSize="xs" color="gray.700" lineHeight="tall">
            Cash & credit card only.
          </Text>
        </Box>

        <Box>
          <Text fontSize="sm" fontWeight="bold" color="black" mb={1}>
            No-Show Policy
          </Text>
          <Text fontSize="xs" color="gray.700" lineHeight="tall">
            Two or more missed pickups without notice may result in account
            suspension.
          </Text>
          <Text fontSize="xs" color="gray.700" lineHeight="tall">
            Refunds may be limited, and a deposit may be required for future
            orders.
          </Text>
        </Box>

        <VStack spacing={3} align="stretch">
          <StyledCheckbox
            isChecked={isAgreed1}
            onChange={() => setIsAgreed1(!isAgreed1)}
          >
            I have read and agree to the Payment & No-Show Policy.
          </StyledCheckbox>

          <StyledCheckbox
            isChecked={isAgreed2}
            onChange={() => setIsAgreed2(!isAgreed2)}
          >
            I acknowledge that due to the perishable nature of the products, all
            sales are final and non-refundable. I have read and understood the
            Return & Refund Policy.
          </StyledCheckbox>

          <StyledCheckbox
            isChecked={isAgreed3}
            onChange={() => setIsAgreed3(!isAgreed3)}
          >
            I agree that Adams Foods is not liable for any issues arising after
            product delivery, including improper storage, preparation, or
            handling.
          </StyledCheckbox>
        </VStack>
      </VStack>
    </Box>
  );
};

const OrderSummaryPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentStep, setCurrentStep] = useState(0);
  const [deliveryOption, setDeliveryOption] = useState("pickup");
  const contentRef = React.useRef(null);
  const [cartItems, setCartItems] = useState(() => getCart());
  const [orderNumber, setOrderNumber] = useState("");
  const [orderDate, setOrderDate] = useState("");

  const [isAgreed1, setIsAgreed1] = useState(false);
  const [isAgreed2, setIsAgreed2] = useState(false);
  const [isAgreed3, setIsAgreed3] = useState(false);

  const navigate = useNavigate();

  const { userInfo, isAuthenticated, userName, userId, userEmail } =
    useAuthContext();


  const [userAddress, setUserAddress] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const formatOrderDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    const fetchAddress = async () => {
      if (!userId) return;

      try {
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/api/shipping-addresses/user/${userId}`
        );
        const data = await response.json();
        if (data.success && data.data[0]) {
          setUserAddress(data.data[0]);
        }
      } catch (err) {
        console.error("Error fetching address:", err);
      }
    };

    fetchAddress();
  }, [userId]);

  const handleOrder = async () => {
    try {
      if (!isAuthenticated || !userId) {
        console.error("User not authenticated");
        return;
      }
      if (!cartItems || cartItems.length === 0) {
        console.error("Cart is empty");
        return;
      }
      if (!isAgreed1 || !isAgreed2 || !isAgreed3) {
        console.error("All agreements must be accepted");
        return;
      }

      const orderData = {
        user_id: userId,
        total_amount: totalPrice,
      };

      const orderResponse = await fetch(`${API_CONFIG.BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const orderResult = await orderResponse.json();

      if (orderResponse.ok && orderResult.success) {
        const orderId = orderResult.data.id;

        // Create order items for each cart item
        const orderItemPromises = cartItems.map(async (item) => {
          const orderItemData = {
            order_id: orderId,
            item_id: item.id,
            quantity: item.quantity,
            unit_price: item.price,
          };

          const itemResponse = await fetch(
            `${API_CONFIG.BASE_URL}/api/order-items`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(orderItemData),
            }
          );

          return itemResponse.json();
        });

        const orderItemResults = await Promise.all(orderItemPromises);

        const allItemsCreated = orderItemResults.every(
          (result) => result.success
        );

        if (allItemsCreated) {
          setOrderNumber(orderResult.data.order_number);
          setOrderDate(formatOrderDate(orderResult.data.order_date));
          cartItems.forEach((item) => {
            removeFromCart(item.id);
          });

          setCartItems([]);
          setCurrentStep(2);
        } else {
          console.error("Some order items failed to create:", orderItemResults);
        }
      } else {
        console.error(
          "Order creation failed:",
          orderResult.error || orderResult.message
        );
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const formatAddress = (addressData) => {
    if (!addressData) return "—";

    const parts = [
      addressData.address_line_1,
      addressData.address_line_2,
      `${addressData.city}, ${addressData.state} ${addressData.zip_code}`,
    ].filter(Boolean);

    return parts.join(", ");
  };

  if (isPageLoading) {
    return (
      <Sidebar>
        <Container
          maxW={{ base: "100%", lg: "30%" }}
          p={0}
          bg="white"
          boxShadow="xl"
          ml={{ base: 0, lg: "40%" }}
          minH="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <VStack>
            <Spinner size="xl" />
            <Text>Loading...</Text>
          </VStack>
        </Container>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <NavDrawer isOpen={isOpen} onClose={onClose} containerRef={contentRef} />

      <Container
        ref={contentRef}
        maxW={{ base: "100%", lg: "30%" }}
        p={0}
        bg="white"
        boxShadow="xl"
        ml={{ base: 0, lg: "40%" }}
        minH="100vh"
      >
        <Navbar onOpen={onOpen} />
        <Heading
          textAlign="center"
          fontWeight="semibold"
          mt={12}
          fontSize="32px"
        >
          {currentStep === 0
            ? "Order Summary"
            : currentStep === 1
            ? "Payment"
            : "Thank You!"}
        </Heading>
        <Box w="100%" p={4}>
          <ThreeStepLine
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />

          {currentStep === 0 && (
            <VStack pt={12}>
              <ShowCart cartItems={cartItems} setCartItems={setCartItems} />
              {/* Pickup/Delivery Selector */}
              <VStack spacing={8} alignItems="left" pb={32} w="100%">
                <HStack
                  spacing={2}
                  cursor="pointer"
                  onClick={() => setDeliveryOption("pickup")}
                >
                  <Circle
                    size="16px"
                    border="2px solid"
                    borderColor={
                      deliveryOption === "pickup" ? "black" : "gray.300"
                    }
                    bg={deliveryOption === "pickup" ? "black" : "white"}
                    position="relative"
                  >
                    {deliveryOption === "pickup" && (
                      <Circle size="6px" bg="white" />
                    )}
                  </Circle>
                  <VStack align="start" spacing={0}>
                    <Text
                      fontWeight="bold"
                      fontSize="16px"
                      color={deliveryOption === "pickup" ? "black" : "gray.500"}
                    >
                      Pickup
                    </Text>
                    <Text fontSize="12px" color="gray.500">
                      Pickup available at DTLA Warehouse
                    </Text>
                  </VStack>
                </HStack>

                <HStack spacing={2} cursor="not-allowed" opacity={0.5}>
                  <Circle
                    size="16px"
                    border="2px solid"
                    borderColor="gray.300"
                    bg="white"
                    position="relative"
                  ></Circle>
                  <Text fontWeight="bold" fontSize="16px" color="gray.400">
                    Delivery
                  </Text>
                </HStack>
              </VStack>
              <VStack spacing={4}>
                <Flex bg={COLORS.GRAY_LIGHT} py={2} px={6} align="flex-start" gap={4}>
                  <CircleCheck />
                  {/* <Text fontSize="12px" color="gray.500" lineHeight="1.2">
                    If you provide your desired delivery address, We will email
                    you an invoice along with the calculated delivery fee.
                  </Text> */}
                  <Text fontSize="12px" color="gray.500" lineHeight="1.2">
                    For the moment, we do not provide delivery services. We
                    appologize for the inconvenience.
                  </Text>
                </Flex>
                <Button
                  size="sm"
                  bg={COLORS.GRAY_MEDIUM}
                  color={COLORS.PRIMARY}
                  _hover={{ bg: COLORS.SECONDARY }}
                  onClick={() => setCurrentStep(currentStep + 1)}
                  borderRadius="full"
                  h="45px"
                  w="100%"
                  my={6}
                >
                  CHECK OUT ${totalPrice.toFixed(2)}
                </Button>
              </VStack>
            </VStack>
          )}
          {currentStep === 1 && (
            <VStack>
              <OrderPayment
                isAgreed1={isAgreed1}
                isAgreed2={isAgreed2}
                isAgreed3={isAgreed3}
                setIsAgreed1={setIsAgreed1}
                setIsAgreed2={setIsAgreed2}
                setIsAgreed3={setIsAgreed3}
              />
              <Button
                bg={COLORS.GRAY_MEDIUM}
                textColor="black"
                borderRadius="full"
                mt={4}
                isDisabled={!isAgreed1 || !isAgreed2 || !isAgreed3}
                opacity={!isAgreed1 || !isAgreed2 || !isAgreed3 ? 0.5 : 1}
                w="100%"
                my={6}
                onClick={() => handleOrder()}
              >
                PLACE YOUR ORDER
              </Button>
            </VStack>
          )}
          {currentStep === 2 && (
            <VStack
              spacing={4}
              px={4}
              align="center"
              h="55vh"
              justify="space-between"
            >
              {/* Order Number */}
              <VStack spacing={4}>
                <HStack
                  justify="space-between"
                  bg="gray.50"
                  p={3}
                  borderRadius="full"
                  border="1px"
                  borderColor="gray.200"
                  w="100%"
                >
                  <Text fontSize="sm" color="gray.500">
                    Order Number
                  </Text>
                  <Text fontSize="sm" fontWeight="semibold">
                    #{orderNumber}
                  </Text>
                </HStack>

                {/* Date */}
                <HStack
                  justify="space-between"
                  bg="gray.50"
                  p={3}
                  borderRadius="full"
                  border="1px"
                  borderColor="gray.200"
                  w="100%"
                >
                  <Text fontSize="sm" color="gray.500">
                    Date
                  </Text>
                  <Text fontSize="sm" fontWeight="semibold">
                    {orderDate}
                  </Text>
                </HStack>

                {/* Confirmation Message */}
                <Box p={4}>
                  <HStack align="flex-start" spacing={2}>
                    <CircleCheck />
                    <VStack align="flex-start" spacing={2}>
                      <Text fontSize="sm" color="gray.700" lineHeight="1.4">
                        Until you receive a confirmation email, your order is
                        not considered confirmed.
                      </Text>
                      {/* <Text fontSize="sm" color="gray.700" lineHeight="1.4">
                        Please check the confirmation email.
                      </Text> */}
                    </VStack>
                  </HStack>
                </Box>
              </VStack>

              <Button
                justifySelf="end"
                mt={4}
                bg={COLORS.GRAY_MEDIUM}
                borderRadius="full"
                w="100%"
                onClick={() => {navigate("/")}}
              >
                FINISH
              </Button>
            </VStack>
          )}
        </Box>
      </Container>
    </Sidebar>
  );
};

export default OrderSummaryPage;
