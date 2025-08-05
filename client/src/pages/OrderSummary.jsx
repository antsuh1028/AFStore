import React from "react";
import NavDrawer from "../components/NavDrawer";
import Navbar from "../components/Navbar";
import { Spinner } from "@chakra-ui/react";
import {
  Circle,
  Flex,
  Box,
  useDisclosure,
  VStack,
  Heading,
  Container,
  Text,
  HStack,
  Button,
  Link,
  Divider,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/SideBar";
import { useState, useEffect } from "react";
import ThreeStepLine from "../components/order/OrderPayment";
import { ShowCart } from "../components/profile/ShowCart";
import { CircleCheck } from "lucide-react";
import { useAuthContext } from "../hooks/useAuth";

import { API_CONFIG, COLORS } from "../constants";
import { getCart, removeFromCart } from "../utils/cartActions";

import emailjs from "emailjs-com"; 

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
            After placing your order, you will recieve a confirmation email and
            pickup time once confirmed.
          </Text>
        </Box>

        <Box>
          <Text fontSize="sm" fontWeight="bold" color="black" mb={1}>
            Payment Terms
          </Text>
          {/* <Text fontSize="xs" color="gray.700" lineHeight="tall">
            <Text as="span" fontWeight="bold">
              Delivery:
            </Text>{" "}
            Full prepayment required.
          </Text> */}
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
            Cash & credit card only (AMEX excluded ).
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

  // Add tax and delivery calculations
  const [salesTax, setSalesTax] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);

  const navigate = useNavigate();

  const { userInfo, isAuthenticated, userName, userId, userEmail } =
    useAuthContext();

  const [userAddress, setUserAddress] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Calculate pricing
  const TAX_RATE = 0.095; // 9.5% CA sales tax
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const calculatedTax = subtotal * TAX_RATE;
  const finalTotal = subtotal + calculatedTax + deliveryFee;

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
          `${API_CONFIG.BASE_URL}/api/addresses/user/${userId}`
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
  useEffect(() => {
    if (deliveryOption === "pickup") {
      setDeliveryFee(0);
    } else {
      setDeliveryFee(25);
    }
  }, [deliveryOption]);

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
        total_amount: finalTotal,
        subtotal: subtotal,
        tax_amount: calculatedTax,
        delivery_fee: deliveryFee,
        order_type: deliveryOption,
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
          
          // Send confirmation email
          await sendOrderConfirmationEmail(orderResult.data);
          
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

const sendOrderConfirmationEmail = async (orderData) => {
  try {
    // Format order items as an array of objects for the template
    const orderItemsForEmail = cartItems.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price.toFixed(2),
      itemTotal: (item.price * item.quantity).toFixed(2)
    }));

    const emailData = {
      customerName: userName,
      companyName: userInfo?.company || "Not specified",
      customerAddress: formatAddress(userAddress),
      orderNumber: orderData.order_number,
      orderDate: formatOrderDate(orderData.order_date),
      orderItems: orderItemsForEmail, // Array of item objects
      totalQuantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      estimatedTotal: finalTotal.toFixed(2),
      email: userEmail,   
      name: userName,      
    };

    // Using EmailJS
    await emailjs.send(
      API_CONFIG.VITE_EMAIL_JS_SERVICE_ID,
      API_CONFIG.VITE_EMAIL_JS_TEMPLATE_ORDER_CONFIRMATION,
      emailData,
      API_CONFIG.VITE_EMAIL_JS_PUBLIC_KEY
    );

    console.log('Order confirmation email sent successfully');
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
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
              
              <VStack spacing={4} w="100%">
                <Flex
                  bg={COLORS.GRAY_LIGHT}
                  py={2}
                  px={6}
                  align="flex-start"
                  gap={4}
                >
                  <CircleCheck />
                  <Text fontSize="12px" color="gray.500" lineHeight="1.2">
                    For the moment, we do not provide delivery services. We
                    apologize for the inconvenience.
                  </Text>
                </Flex>
                
                {/* Order Summary Section */}
                <VStack spacing={3} w="100%" px={4} py={4} bg="gray.50" borderRadius="lg">
                  <Text fontSize="md" fontWeight="bold" alignSelf="flex-start">
                    Order Summary
                  </Text>
                  
                  <HStack justify="space-between" w="100%">
                    <Text fontSize="sm" color="gray.600">Subtotal:</Text>
                    <Text fontSize="sm" fontWeight="medium">${subtotal.toFixed(2)}</Text>
                  </HStack>
                  
                  <HStack justify="space-between" w="100%">
                    <Text fontSize="sm" color="gray.600">Sales Tax (9.5%):</Text>
                    <Text fontSize="sm" fontWeight="medium">${calculatedTax.toFixed(2)}</Text>
                  </HStack>
                  
                  {deliveryOption === "delivery" && (
                    <HStack justify="space-between" w="100%">
                      <Text fontSize="sm" color="gray.600">Delivery Fee:</Text>
                      <Text fontSize="sm" fontWeight="medium">${deliveryFee.toFixed(2)}</Text>
                    </HStack>
                  )}
                  
                  <Divider />
                  
                  <HStack justify="space-between" w="100%" pt={2}>
                    <Text fontSize="md" fontWeight="bold">Total:</Text>
                    <Text fontSize="md" fontWeight="bold" color={COLORS.PRIMARY}>
                      ${finalTotal.toFixed(2)}
                    </Text>
                  </HStack>
                </VStack>
                
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
                  CHECK OUT ${finalTotal.toFixed(2)}
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
                PLACE YOUR ORDER - ${finalTotal.toFixed(2)}
              </Button>
            </VStack>
          )}
          
          {currentStep === 2 && (
  <VStack
    spacing={6}
    px={4}
    align="center"
    minH="60vh"  // Changed from fixed height to minimum height
    py={8}      // Added padding for better spacing
  >
    {/* Order Details Section */}
    <VStack spacing={4} w="100%">
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
          Total
        </Text>
        <Text fontSize="sm" fontWeight="semibold">
          ${finalTotal.toFixed(2)}
        </Text>
      </HStack>
    </VStack>

    {/* Confirmation Message */}
    <Box p={4} w="100%">
      <HStack align="flex-start" spacing={2}>
        <CircleCheck />
        <VStack align="flex-start" spacing={2}>
          <Text fontSize="sm" color="gray.700" lineHeight="1.4">
            Until you receive a confirmation email, your order is
            not considered confirmed.
          </Text>
          <Text fontSize="xs" color="gray.500" lineHeight="1.4">
            Check your email for order confirmation and quote details.
          </Text>
        </VStack>
      </HStack>
    </Box>
    
    {/* Bottom Section */}
    <VStack spacing={4} w="100%" mt="auto">  {/* mt="auto" pushes to bottom */}
      <Box
        p={4}
        borderRadius="md"
        textAlign="center"
        w="100%"
      >
        <Text fontSize="xs" color="gray.600" mb={2}>
          Have any concerns about your order?
        </Text>
        <HStack justify="center" spacing={1}>
          <Text fontSize="xs" color="gray.600">
            Email us at
          </Text>
          <Link
            fontSize="sm"
            href="mailto:sales@adamsfoods.us"
            color="#b3967f"
            fontWeight="semibold"
            textDecoration="underline"
            _hover={{ color: "#494949" }}
          >
            sales@adamsfoods.us
          </Link>
        </HStack>
      </Box>
      
      <Button
        bg={COLORS.GRAY_MEDIUM}
        borderRadius="full"
        w="100%"
        onClick={() => navigate("/")}
      >
        FINISH
      </Button>
    </VStack>
  </VStack>
)}
        </Box>
      </Container>
    </Sidebar>
  );
};

export default OrderSummaryPage;
