import React, { useRef } from "react";
import {
  Box,
  Container,
  useDisclosure,
  Heading,
  Text,
  VStack,
  Flex,
  Circle,
  List,
  ListItem,
  Divider,
  Image,
} from "@chakra-ui/react";
import NavDrawer from "../../components/NavDrawer";
import Sidebar from "../../components/SideBar";
import Breadcrumbs from "../../components/Breadcrumbs";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { COLORS } from "../../constants";
import { useLanguage } from "../../hooks/LanguageContext";

import { translator } from "../../utils/translator";
const HowToOrderPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const contentRef = useRef(null);
  const { selectedLanguage } = useLanguage();

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
      >
        <Navbar onOpen={onOpen} home={true} />

        <Box py={3} px={4} display="flex" justifyContent="center">
          <Breadcrumbs
            listOfBreadCrumbs={[
              { label: "Home", url: "/" },
              { label: "Wholesale", url: "/" },
              { label: "Order", url: "/wholesale/how-to-order" },
            ]}
          />
        </Box>
        <Box width="100%">
          {/* Header Section */}
          <Box py={4} px={6} borderColor="gray.200" bg="white" mb={4}>
            <Heading as="h1" size="lg" fontWeight="semibold" textAlign="center">
              How to Order
            </Heading>
          </Box>
          <Divider mt={2} borderColor="gray.200" />
        </Box>

        <Box>
          <Box width="100%" py={6} px={6}>
            <Heading
              as="h1"
              size="md"
              fontWeight="bold"
              textAlign="center"
              mb={6}
            >
              {translator(
                "Sign up to unlock exclusive deals and extra perks!",
                "독점 혜택과 추가 특전을 누리려면 회원가입하세요!"
              )}
            </Heading>

            {/* Step 1 - Create an Account */}
            <Flex align="center" mb={4}>
              <Circle size="24px" bg="black" color="white" mr={3}>
                <Text fontSize="sm" fontWeight="bold">
                  1
                </Text>
              </Circle>
              <Text fontSize="md" fontWeight="bold">
                {translator("Create an Account", "계정 생성")}
              </Text>
            </Flex>

            {/* Requirements Section */}
            <Box mb={12} p={4} pb={8} borderRadius="xl" bg={COLORS.GRAY_LIGHT}>
              <Text fontSize="sm" fontWeight="extrabold" color={COLORS.ACCENT}>
                {translator("Requirements:", "Requirements:")}
              </Text>
              <List spacing={1} fontSize="xs">
                <ListItem>
                  •{"\u00A0\u00A0"}{" "}
                  {translator(
                    "Wholesale License(Seller’s Permit)",
                    "Wholesale License(Seller’s Permit)"
                  )}
                </ListItem>
                <Box pl={4} pt={2} mb={8}>
                  <Image
                    src="/images/sellers.png"
                    alt="Resale certificate example"
                    maxW="75%"
                    alignContent="left"
                  />
                </Box>
                <ListItem>
                  •{"\u00A0\u00A0"}
                  {translator(
                    "ID (Passport, Driver License, Real ID)",
                    "ID (Passport, Driver License, Real ID)"
                  )}
                </ListItem>
                <Box pl={4} pt={2} mb={8}>
                  <Image
                    src="/images/gov_id.png"
                    alt="Resale certificate example"
                    maxW="75%"
                    alignContent="left"
                  />
                </Box>
                <ListItem>
                  •{"\u00A0\u00A0"}
                  {translator(
                    "Business License and Reseller Permit",
                    "Business License and Reseller Permit"
                  )}
                </ListItem>
                <Flex pl={4} pt={2} mb={8} gap={2}>
                  <Box flex="1">
                    <Image
                      src="/images/business_license.jpg"
                      alt="Business License example"
                      w="100%"
                      objectFit="contain"
                    />
                  </Box>
                  <Box flex="1">
                    <Image
                      src="/images/resale.png"
                      alt="Resale certificate example"
                      w="100%"
                      objectFit="contain"
                    />
                  </Box>
                </Flex>
              </List>

              <Text fontSize="xs" mt={4} color="gray.600">
                •{"\u00A0\u00A0"}
                {translator(
                  `AdamsFoods sells at wholesale prices, so these${" "}${"\u00A0\u00A0"}documents are required.`,
                  `AdamsFoods는 도매가로 판매하므로, 이 서류들이 필요합니다.`
                )}
              </Text>
            </Box>

            {/* Step 2 */}
            <Flex align="center" mb={6}>
              <Circle size="24px" bg="black" color="white" mr={3}>
                <Text fontSize="sm" fontWeight="bold">
                  2
                </Text>
              </Circle>
              <Text fontSize="md" fontWeight="bold">
                {translator(
                  "After internal review, you will receive an approval email.",
                  "내부 심사 후, 승인 이메일을 받으실 수 있습니다."
                )}
              </Text>
            </Flex>

            {/* Step 3 */}
            <Flex align="center" mb={6}>
              <Circle size="24px" bg="black" color="white" mr={3}>
                <Text fontSize="sm" fontWeight="bold">
                  3
                </Text>
              </Circle>
              <Text fontSize="md" fontWeight="bold">
                {translator(
                  "Choose your meats and select Pick-Up",
                  "고기를 선택하고 픽업을 선택하세요."
                )}
              </Text>
            </Flex>
            <Box mb={12} p={4} pb={8} borderRadius="xl" bg={COLORS.GRAY_LIGHT}>
              <Text fontSize="xs" fontWeight="extrabold" color={COLORS.ACCENT}>
                {translator("CUT OFF TIME:", "주문 마감 시간 안내:")}
              </Text>
              <Text fontSize="xs" color="gray.600" mb={1}>
                • {"\u00A0\u00A0"}
                {translator(
                  "Orders placed before 2:30 PM: Confirmation email will be sent within 1–2 business days.",
                  "오후 2시 30분 이전 주문: 확인 이메일이 1~2 영업일 내에 발송됩니다."
                )}
              </Text>
              <Text fontSize="xs" color="gray.600" mb={1}>
                • {"\u00A0\u00A0"}
                {translator(
                  "Orders placed after 2:30 PM: Confirmation email will be sent within 1–3 business days.",
                  "오후 2시 30분 이후 주문: 확인 이메일이 1~3 영업일 내에 발송됩니다."
                )}
              </Text>
              <Text fontSize="xs" color="gray.600" mb={4}>
                • {"\u00A0\u00A0"}
                {translator(
                  "Orders placed on Friday: Processing may take 1–3 days including the weekend.",
                  "금요일 주문: 주말을 제외하여 처리에 1~3일이 소요될 수 있습니다."
                )}
              </Text>
            </Box>

            {/* Step 4 */}
            <Flex align="center" mb={6}>
              <Circle size="24px" bg="black" color="white" mr={3}>
                <Text fontSize="sm" fontWeight="bold">
                  4
                </Text>
              </Circle>
              <Text fontSize="md" fontWeight="bold">
                {translator(
                  "An invoice will be sent along with the approval email.",
                  "승인 이메일과 함께 인보이스가 발송됩니다."
                )}
              </Text>
            </Flex>

            {/* Pick-up Section */}
            <Box mb={2} p={4} pb={8} borderRadius="xl" bg={COLORS.GRAY_LIGHT}>
              <Text
                fontSize="sm"
                fontWeight="bold"
                color={COLORS.ACCENT}
                mb={2}
              >
                PICK-UP
              </Text>
              <List spacing={1} fontSize="xs" ml={4}>
                <ListItem>
                  • {"\u00A0\u00A0"}
                  {translator(
                    "Pay half the balance upfront.",
                    "잔액의 절반을 선결제."
                  )}
                </ListItem>
                <ListItem>
                  • {"\u00A0\u00A0"}
                  {translator(
                    "Pay the remaining balance at pick-up.",
                    "나머지 잔액은 픽업 시 결제."
                  )}
                </ListItem>
              </List>
              <Text
                fontSize="sm"
                fontWeight="bold"
                color={COLORS.ACCENT}
                mt={4}
              >
                DEPOSIT
              </Text>
              <List spacing={1} fontSize="xs" ml={4} mb={4}>
                {/* <ListItem>• {"\u00A0\u00A0"}Full payment is required upfront.</ListItem> */}
                <ListItem>
                  • {"\u00A0\u00A0"}
                  {translator(
                    "To confirm your reservation, a deposit payment is required in advance. Please note that deposits are non-refundable. This policy is in place to prevent no-shows.",
                    "예약을 확정하려면 사전 디파짓 결제가 필요하며, 디파짓은 환불되지 않습니다. 이 정책은 노쇼(No-Show)를 방지하기 위해 시행됩니다."
                  )}
                </ListItem>
              </List>
            </Box>

            {/* Payment Methods */}
            <Box mb={8} px={4}>
              <Text fontSize="xs" color="gray.600">
                * {"\u00A0\u00A0"}
                {translator(
                  "Cash or Card Only (Excluding AMEX, Discovery Card)",
                  "Cash or Card Only (Excluding AMEX, Discovery Card)"
                )}
              </Text>
            </Box>

            {/* Payment Policy Section */}
            <Box mt={12} p={6} borderRadius="lg">
              <Heading as="h2" size="md" mb={4} fontWeight="bold">
                {translator("Payment Policy", "Payment Policy")}
              </Heading>
              <Text fontSize="sm" mb={4}>
                {translator(
                  "At AdamsFoods, we accept cash and credit card payments for all orders. Payment requirements vary by order type as follows:",
                  "AdamsFoods에서는 모든 주문에 대해 현금 및 신용카드 결제를 받습니다.결제 방식은 주문 유형에 따라 다음과 같이 다릅니다."
                )}
              </Text>

              <VStack align="start" mb={4}>
                {/* <Text fontSize="sm">
                  • {"\u00A0\u00A0"}
                  {translator("Delivery Orders: Full prepayment is required before delivery."
                    , "배송 주문: 배송 전 전액 선결제 필수.")}
                </Text> */}

                <Box>
                  <Flex>
                    •
                    <Text fontSize="sm">
                      {"\u00A0\u00A0"}
                      {translator(
                        "Delivery Orders: Full prepayment is required before delivery.",
                        "Delivery Orders: 배송 전에 전액 선결제가 필요합니다."
                      )}
                    </Text>
                  </Flex>
                  <Text fontSize="sm">
                    • {"\u00A0\u00A0"}
                    {translator(
                      "Pickup Orders: 30% prepayment is required, with the remaining balance payable at the time of pickup.",
                      "Pickup Orders: 30% 선결제, 나머지 잔액은 픽업 시 결제"
                    )}
                  </Text>
                  <Text fontSize="2xs" ml={2} mb={4}>
                    {translator(
                      "* You can receive a cash discount at pickup.",
                      "* 픽업 시 현금으로 결제하면 할인을 받을 수 있습니다."
                    )}
                  </Text>
                </Box>
              </VStack>

              <Text fontSize="sm" mb={4}>
                {translator(
                  "All prepayments are processed through secure invoicing systems such as Stripe or Square. An invoice will be sent to your email, allowing you to complete payment safely by entering your card information.",
                  "모든 선결제는 Stripe, Square 등 안전한 인보이스 결제 시스템을 통해 처리됩니다. 결제 완료를 위해 이메일로 발송되는 인보이스에서 카드 정보를 입력해 안전하게 결제할 수 있습니다."
                )}
              </Text>
              <Flex>
                ※
                <Text fontSize="sm" fontWeight="semibold" mb={2} ml={1}>
                  {translator(
                    "Applicable sales tax will be added to all credit card payments.",
                    "모든 신용카드 결제에는 해당 판매세가 추가됩니다."
                  )}
                </Text>
              </Flex>
              <Flex>
                ※
                <Text fontSize="sm" fontWeight="semibold" ml={1}>
                  {translator(
                    "Two or more missed pickups without notice may result in suspension. Refunds and future orders may be subject to policy and deposit requirements.",
                    " 사전 통보 없이 픽업을 두 번 이상 놓칠 경우 계정이 정지될 수 있으며, 환불 및 향후 주문은 정책과 보증금 요건이 적용될 수 있습니다."
                  )}
                </Text>
              </Flex>
            </Box>
          </Box>
        </Box>
        <Footer />
      </Container>
    </Sidebar>
  );
};

export default HowToOrderPage;
