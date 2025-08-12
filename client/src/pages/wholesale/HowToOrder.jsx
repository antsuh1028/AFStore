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
} from "@chakra-ui/react";
import NavDrawer from "../../components/NavDrawer";
import Sidebar from "../../components/SideBar";
import Breadcrumbs from "../../components/Breadcrumbs";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { COLORS } from "../../constants";
import { useLanguage } from "../../hooks/LanguageContext";

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
          <Box width="100%" py={6} px={10}>
            <Heading
              as="h1"
              size="md"
              fontWeight="bold"
              textAlign="center"
              mb={6}
            >
              {selectedLanguage.code === "en"
                ? "Sign up to unlock exclusive deals and extra perks!"
                : "독점 혜택과 추가 특전을 누리려면 회원가입하세요!"}
            </Heading>

            {/* Step 1 - Create an Account */}
            <Flex align="center" mb={4}>
              <Circle size="24px" bg="black" color="white" mr={3}>
                <Text fontSize="sm" fontWeight="bold">
                  1
                </Text>
              </Circle>
              <Text fontSize="md" fontWeight="bold">
                {selectedLanguage.code === "en"
                  ? "Create an Account"
                  : "계정 생성"}
              </Text>
            </Flex>

            {/* Requirements Section */}
            <Box mb={12} p={4} pb={8} borderRadius="xl" bg={COLORS.GRAY_MEDIUM}>
              <Text fontSize="sm" fontWeight="extrabold" color={COLORS.ACCENT}>
                {selectedLanguage.code === "en"
                  ? "Requirements:"
                  : "필수 서류:"}
              </Text>
              <List spacing={1} fontSize="xs">
                <ListItem>
                  •{"\u00A0\u00A0"}{" "}
                  {selectedLanguage.code === "en"
                    ? "Wholesale License"
                    : "도매 라이선스"}
                </ListItem>
                <ListItem>
                  •{"\u00A0\u00A0"}
                  {selectedLanguage.code === "en"
                    ? "ID (Passport, Driver License, Real ID)"
                    : "신분증 (여권, 운전면허증, Real ID)"}
                </ListItem>
                <ListItem>
                  •{"\u00A0\u00A0"}
                  {selectedLanguage.code === "en"
                    ? "Business License or Reseller Permit"
                    : "사업자등록증 또는 재판매 허가증"}
                </ListItem>
              </List>

              <Text fontSize="xs" mt={4} color="gray.600">
                •{"\u00A0\u00A0"}
                {selectedLanguage.code === "en"
                  ? `AdamsFoods sells at wholesale prices, so these${" "}${"\u00A0\u00A0"}documents are required.`
                  : `AdamsFoods는 도매가로 판매하므로 위 서류 제출이 필요합니다.`}
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
                {selectedLanguage.code === "en"
                  ? "After internal review, you will receive an approval email."
                  : "내부 심사 후, 승인 이메일을 받으실 수 있습니다."}
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
                {selectedLanguage.code === "en"
                  ? "Choose your meats and select Pick-Up or Delivery (Not available temporarily)."
                  : "원하는 고기를 선택하고 배송 방식을 선택하세요."}
              </Text>
            </Flex>

            {/* Step 4 */}
            <Flex align="center" mb={6}>
              <Circle size="24px" bg="black" color="white" mr={3}>
                <Text fontSize="sm" fontWeight="bold">
                  4
                </Text>
              </Circle>
              <Text fontSize="md" fontWeight="bold">
                {selectedLanguage.code === "en"
                  ? "An invoice will be sent along with the approval email."
                  : "승인 이메일과 함께 인보이스가 발송됩니다."}
              </Text>
            </Flex>

            {/* Pick-up Section */}
            <Box mb={2} p={4} pb={8} borderRadius="xl" bg={COLORS.GRAY_MEDIUM}>
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
                  {selectedLanguage.code === "en"
                    ? "Pay half the balance upfront."
                    : "잔액의 절반을 선결제."}
                </ListItem>
                <ListItem>
                  • {"\u00A0\u00A0"}
                  {selectedLanguage.code === "en"
                    ? "Pay the remaining balance at pick-up."
                    : "나머지 잔액은 픽업 시 결제."}
                </ListItem>
              </List>
              <Text
                fontSize="sm"
                fontWeight="bold"
                color={COLORS.ACCENT}
                mt={4}
              >
                DELIVERY
              </Text>
              <List spacing={1} fontSize="xs" ml={4} mb={4}>
                {/* <ListItem>• {"\u00A0\u00A0"}Full payment is required upfront.</ListItem> */}
                <ListItem>
                  • {"\u00A0\u00A0"}
                  {selectedLanguage.code === "en"
                    ? "Delivery options are unavailable at this time."
                    : "전액 선결제 필수."}
                </ListItem>
              </List>
            </Box>

            {/* Payment Methods */}
            <Box mb={8} px={4}>
              <Text fontSize="xs" color="gray.600">
                * {"\u00A0\u00A0"}
                {selectedLanguage.code === "en"
                  ? "Cash or Card Only (excluding AMEX Card)"
                  : "현금 또는 카드 결제 가능 (AMEX 카드 제외)."}
              </Text>
            </Box>

            {/* Payment Policy Section */}
            <Box mt={12} p={6} borderRadius="lg">
              <Heading as="h2" size="md" mb={4} fontWeight="bold">
                {selectedLanguage.code === "en"
                  ? "Payment Policy"
                  : "결제 정책"}
              </Heading>
              <Text fontSize="sm" mb={4}>
                {selectedLanguage.code === "en"
                  ? "At AdamsFoods, we accept cash and credit card payments for all orders. Payment requirements vary by order type as follows:"
                  : "AdamsFoods는 모든 주문에 대해 현금 및 신용카드를 받습니다. 결제 조건은 주문 유형에 따라 다릅니다."}
              </Text>

              <VStack align="start" mb={4} ml={4}>
                {/* <Text fontSize="sm">
                  • {"\u00A0\u00A0"}
                  {selectedLanguage.code === "en"
                    ? "Delivery Orders: Full prepayment is required before delivery."
                    : "배송 주문: 배송 전 전액 선결제 필수."}
                </Text> */}

                <Box>
                  <Text fontSize="sm">
                    • {"\u00A0\u00A0"}
                    {selectedLanguage.code === "en"
                      ? "Pickup Orders: 50% prepayment is required, with the remaining balance payable at the time of pickup."
                      : "픽업 주문: 50% 선결제, 픽업 시 잔액 결제."}
                  </Text>
                  <Text fontSize="sm" ml={2}>
                    {selectedLanguage.code === "en"
                      ? "★ A 5% discount will be applied to the remaining balance if paid in cash at pickup."
                      : "★ 픽업 시 현금 결제 시 잔액에 대해 5% 할인 적용."}
                  </Text>
                </Box>
              </VStack>

              <Text fontSize="sm" mb={4}>
                {selectedLanguage.code === "en"
                  ? "All prepayments are processed through secure invoicing systems such as Stripe or Square. An invoice will be sent to your email, allowing you to complete payment safely by entering your card information."
                  : "모든 선결제는 Stripe, Square 등 안전한 인보이스 결제 시스템을 통해 처리됩니다. 결제 완료를 위해 이메일로 발송되는 인보이스에서 카드 정보를 입력해 안전하게 결제할 수 있습니다."}
              </Text>

              <Text fontSize="sm" fontWeight="semibold" mb={2} ml={1}>
                {selectedLanguage.code === "en"
                  ? "※ Applicable sales tax will be added to all credit card payments."
                  : "※ 모든 신용카드 결제에는 해당 판매세가 추가됩니다."}
              </Text>

              <Text fontSize="sm" fontWeight="semibold" ml={1}>
                {selectedLanguage.code === "en"
                  ? "※ Two or more missed pickups without notice may result in suspension. Refunds and future orders may be subject to policy and deposit requirements."
                  : "※ 사전 통보 없이 픽업을 두 번 이상 놓칠 경우 계정이 정지될 수 있으며, 환불 및 향후 주문은 정책과 보증금 요건이 적용될 수 있습니다."}
              </Text>
            </Box>
          </Box>
        </Box>
        <Footer />
      </Container>
    </Sidebar>
  );
};

export default HowToOrderPage;
