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
import ThreeStepLine from "../components/order/ThreeStepLine";
import { ShowCart } from "../components/profile/ShowCart";
import { CircleCheck } from "lucide-react";
import { useAuthContext } from "../hooks/useAuth";

import { API_CONFIG, COLORS } from "../constants";
import { getCart, removeFromCart } from "../utils/cartActions";
import { useLanguage } from "../hooks/LanguageContext";


const StyledCheckbox = ({ isChecked, onChange, children }) => {
  return (
    <HStack
      spacing={3}
      align="flex-start"
      cursor="pointer"
      onClick={() => onChange(!isChecked)}
    >
      <Box
        as="span"
        display="flex"
        alignItems="center"
        justifyContent="center"
        boxSize={5}
        borderRadius="50%"
        border="2px solid"
        borderColor={COLORS.PRIMARY}
        bg="transparent"
        transition="all 0.2s ease"
        flexShrink={0}
        mt="2px"
      >
        {isChecked && (
          <Box
            width="80%"
            height="80%"
            borderRadius="full"
            bg={COLORS.PRIMARY}
          />
        )}
      </Box>

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
  const { selectedLanguage } = useLanguage();
  const translator = (englishText, koreanText) => {
    return selectedLanguage.code === "ko" ? koreanText : englishText;
  };
  return (
    <Box p={6} bg="white" borderRadius="md" maxW="400px">
      <VStack spacing={4} align="stretch">
        {selectedLanguage.code === "en" ? (
          <>
            <Box>
              <Text fontSize="sm" fontWeight="bold" color="black" mb={2}>
                Order & Payment Policy
              </Text>
              <Text fontSize="xs" color="gray.700" lineHeight="tall">
                After placing your order, you will recieve a confirmation email
                and pickup time once confirmed.
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
          </>
        ) : (
          <>
            <Box>
              <Text fontSize="sm" fontWeight="bold" color="black" mb={2}>
                주문 및 결제 정책
              </Text>
              <Text fontSize="xs" color="gray.700" lineHeight="tall">
                주문 후 확인 이메일과 픽업 시간 안내를 받게 됩니다.
              </Text>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="bold" color="black" mb={1}>
                결제 조건
              </Text>
              {/* <Text fontSize="xs" color="gray.700" lineHeight="tall">
            <Text as="span" fontWeight="bold">
              배송:
            </Text>{" "}
            전액 선결제 필수.
          </Text> */}
              <Text fontSize="xs" color="gray.700" lineHeight="tall">
                <Text as="span" fontWeight="bold">
                  픽업:
                </Text>{" "}
                50% 선결제, 잔액은 픽업 시 결제.
              </Text>
              <Text fontSize="xs" color="gray.700" lineHeight="tall" mt={2}>
                픽업 시 잔액을 현금으로 결제하시면 최대 5% 할인 혜택을 드립니다.
              </Text>
              <Text fontSize="xs" color="gray.700" lineHeight="tall">
                신용카드 결제 시에는 판매세가 포함됩니다.
              </Text>
              <Text fontSize="xs" color="gray.700" lineHeight="tall">
                결제 수단: 현금 및 신용카드만 가능합니다.
              </Text>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="bold" color="black" mb={1}>
                노쇼 정책
              </Text>
              <Text fontSize="xs" color="gray.700" lineHeight="tall">
                사전 통보 없이 픽업을 두 번 이상 놓칠 경우 계정이 정지될 수
                있습니다.
              </Text>
              <Text fontSize="xs" color="gray.700" lineHeight="tall">
                환불이 제한될 수 있으며, 향후 주문에 보증금이 요구될 수
                있습니다.
              </Text>
            </Box>
          </>
        )}
        <VStack spacing={3} align="stretch" mt={6}>
          <StyledCheckbox
            isChecked={isAgreed1}
            onChange={() => setIsAgreed1(!isAgreed1)}
          >
            {translator(
              "I have read and agree to the Payment & No-Show Policy.",
              "결제 및 노쇼 정책을 읽고 동의합니다."
            )}
          </StyledCheckbox>

          <StyledCheckbox
            isChecked={isAgreed2}
            onChange={() => setIsAgreed2(!isAgreed2)}
          >
            {translator(
              "I acknowledge that due to the perishable nature of the products, all sales are final and non-refundable. I have read and understood the Return & Refund Policy.",
              "제품의 부패성으로 인해 모든 판매는 최종적이며 환불이 불가함을 확인하였으며, 반품 및 환불 정책을 숙지하였습니다."
            )}
          </StyledCheckbox>

          <StyledCheckbox
            isChecked={isAgreed3}
            onChange={() => setIsAgreed3(!isAgreed3)}
          >
            {translator(
              "I agree that AdamsFoods is not liable for any issues arising after product delivery, including improper storage, preparation,                 or handling.",
              "AdamsFoods는 제품 배송 후 보관, 준비, 취급 부주의로 인한 문제에 대해 책임지지 않음을 동의합니다."
            )}
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
  const [salesTax, setSalesTax] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [userAddress, setUserAddress] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const navigate = useNavigate();
  const { userInfo, isAuthenticated, userName, userId, userEmail } =
    useAuthContext();
  const { selectedLanguage } = useLanguage();

  const translator = (englishText, koreanText) => {
    return selectedLanguage.code === "ko" ? koreanText : englishText;
  };

const subtotal = cartItems.reduce((sum, item) => {
  let price = parseFloat(item.discounted_price) || 0;
  
  if (price === 0) {
    price = parseFloat(item.price) || 0;
  }
  
  const quantity = parseInt(item.quantity) || 0;
  
  return sum + (price * quantity);
}, 0);

const finalTotal = subtotal + deliveryFee;

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

  const formatOrderDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };


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
      order_type: deliveryOption,
      cart_items: cartItems.map((item) => {
        // Convert discounted_price to number, handle string "0" case
        let price = parseFloat(item.discounted_price) || 0;
        
        // If discounted_price is 0 or not valid, fall back to regular price
        if (price === 0) {
          price = parseFloat(item.price) || 0;
        }
        
        const quantity = parseInt(item.quantity) || 0;
        
        return {
          name: item.name,
          quantity: quantity,
          price: price.toFixed(2),
          discountedPrice: price.toFixed(2),
          itemTotal: (quantity * price).toFixed(2),
        };
      }),
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

      // Create order items
      const orderItemPromises = cartItems.map(async (item) => {
        // Same logic for order items
        let price = parseFloat(item.discounted_price) || 0;
        
        if (price === 0) {
          price = parseFloat(item.price) || 0;
        }
        
        const quantity = parseInt(item.quantity) || 0;
        
        const orderItemData = {
          order_id: orderId,
          item_id: item.id,
          quantity: quantity,
          unit_price: price,
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

        // Clear cart
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
                      {translator(
                        "Pickup available at DTLA Warehouse",
                        "픽업은 DTLA 에서 가능합니다."
                      )}
                    </Text>
                  </VStack>
                </HStack>

                {/* <HStack
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
                      Points
                    </Text>
                    <Text fontSize="12px" color="gray.500">
                      {translator(
                        "Points can be redeemed starting from a minimum of 500 points.",
                        "포인트는 최소 500점부터 사용하실 수 있습니다."
                      )}
                    </Text>
                  </VStack>
                </HStack> */}
              </VStack>

              <VStack spacing={4} w="100%">
                <Flex
                  bg={COLORS.GRAY_LIGHT}
                  py={4}
                  pl={4}
                  pr={6}
                  align="flex-start"
                  gap={4}
                >
                  <CircleCheck size={16} />
                  <Text fontSize="12px" color="gray.500" lineHeight="1.2">
                    {translator(
                      "For the moment, we do not provide delivery services. We apologize for the inconvenience.",
                      "인보이스와 픽업 가능 날짜 및 시간을 확정하여, 이메일로 안내해 드립니다."
                    )}
                  </Text>
                </Flex>

                <VStack
                  spacing={3}
                  w="100%"
                  px={4}
                  py={4}
                  bg="gray.50"
                  borderRadius="lg"
                >
                  <Text fontSize="md" fontWeight="bold" alignSelf="flex-start">
                    Order Summary
                  </Text>

                  {deliveryOption === "delivery" && (
                    <HStack justify="space-between" w="100%">
                      <Text fontSize="sm" color="gray.600">
                        Delivery Fee:
                      </Text>
                      <Text fontSize="sm" fontWeight="medium">
                        ${deliveryFee.toFixed(2)}
                      </Text>
                    </HStack>
                  )}

                  <Divider />

                  <HStack justify="space-between" w="100%" pt={2}>
                    <Text fontSize="md" fontWeight="bold">
                      Total:
                    </Text>
                    <Text
                      fontSize="md"
                      fontWeight="bold"
                      color={COLORS.PRIMARY}
                    >
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
            <VStack spacing={6} px={4} align="center" minH="60vh" py={8}>
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
              </VStack>

              <Box p={4} w="100%">
                <HStack align="flex-start" spacing={3}>
                  <Box mt={1} flexShrink={0}>
                    <CircleCheck size={16} />
                  </Box>

                  <VStack align="flex-start" spacing={2} flex={1}>
                    <Text fontSize="sm" color="gray.700" lineHeight="1.4">
                      {translator(
                        "Until you receive a confirmation email, your order is not considered confirmed.",
                        "확인 이메일을 받기 전까지는, 주문이 확정된 것으로 간주되지 않습니다."
                      )}
                    </Text>
                    <Text fontSize="xs" color="gray.500" lineHeight="1.4">
                      {translator(
                        "Check your email for order confirmation and quote details.",
                        "확인 이메일을 꼭 확인해 주세요."
                      )}
                    </Text>
                  </VStack>
                </HStack>
              </Box>

              <VStack spacing={4} w="100%" mt={24}>
                <Box p={4} borderRadius="md" textAlign="center" w="100%">
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
