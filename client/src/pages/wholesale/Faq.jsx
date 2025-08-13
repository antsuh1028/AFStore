import React, { useRef } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Divider,
  useDisclosure,
  Image,
} from "@chakra-ui/react";
import NavDrawer from "../../components/NavDrawer";
import Sidebar from "../../components/SideBar";
import Breadcrumbs from "../../components/Breadcrumbs";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { useLanguage } from "../../hooks/LanguageContext";
import { COLORS } from "../../constants";
import { translator } from "../../utils/translator";

const FAQPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const contentRef = useRef(null);

  const breadcrumbs = [
    { label: "Home", url: "/" },
    { label: "Wholesale", url: "/" },
    { label: "FAQ", url: "/wholesale/faq" },
  ];

  const AddressDisplay = () => (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      fontWeight="semibold"
      pt={4}
    >
      <Image
        src="/images/only_here.png"
        h="20px"
        alt="Adams Logo"
        filter="grayscale(100%)"
      />
      <Text fontSize="sm">1805 Industrial St, Los Angeles, CA 90021</Text>
    </Box>
  );

  const BulkDiscountNote = () => (
    <Text>
      •{" "}
      <Text as="span" color={COLORS.ACCENT} fontWeight="semibold">
        $3,000
      </Text>{" "}
      {translator(
        "이상 대량 주문 시 할인 혜택이 제공됩니다. 문의는 직접 연락 부탁드립니다.",
        "이상 대량 주문 시 할인 혜택이 제공됩니다. 문의는 직접 연락 부탁드립니다."
      )}
    </Text>
  );

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
          <Breadcrumbs listOfBreadCrumbs={breadcrumbs} />
        </Box>

        <Box width="100%">
          <Box py={4} px={6} borderColor="gray.200" bg="white" mb={4}>
            <Heading as="h1" size="lg" fontWeight="semibold" textAlign="center">
              FAQ
            </Heading>
          </Box>
          <Divider mt={2} borderColor="gray.200" />
        </Box>

        <VStack spacing={8} px={8} py={4} align="start">
          {/* Q. Delivery / 배송 */}
          <Box>
            <Heading size="md" my={6}>
              <Text as="span" color={COLORS.ACCENT}>
                Q.
              </Text>{" "}
              {translator("Delivery", "배송")}
            </Heading>

            <Text fontSize="sm" color="gray.700">
              {translator(
                "We offer free delivery within Los Angeles County for orders that meet our ",
                "로스앤젤레스 카운티 내 "
              )}
              <Text as="span" color={COLORS.ACCENT} fontWeight="semibold">
                $3,000
              </Text>
              {translator(" minimum.", " 이상 주문에 대해 무료 배송을 제공합니다.")}
            </Text>

            <Text fontSize="sm" mt={4} color="gray.700">
              {translator(
                "If your order does not meet the minimum, you may either pick it up from our facility or pay a delivery fee. This policy enables us to maintain reliable, high-quality service at competitive wholesale prices.",
                "최소 주문 금액에 미치지 못할 경우, 직접 픽업하시거나 배송비를 부담하셔야 합니다. 이 정책은 경쟁력 있는 도매가로 안정적이고 고품질의 서비스를 유지하기 위함입니다."
              )}
            </Text>

            <Box mt={4}>
              <AddressDisplay />
            </Box>

            {/* Always show these sections in English, with Korean translations when Korean is selected */}
            <Box my={8}>
              <Text
                fontSize="sm"
                fontWeight="semibold"
                mb={2}
                textDecor="underline"
              >
                Transfer of Risk & Title
              </Text>
              <Text fontSize="sm" color="gray.700">
                {translator(
                  "Title and risk of loss pass to the buyer upon pickup at our facility or delivery to the address provided by the buyer. We are not responsible for loss or damage after this point.",
                  "제품의 소유권과 위험은 당사 시설에서 픽업 시 또는 구매자가 지정한 주소로 배송 완료 시점에 구매자에게 이전됩니다. 이후 발생하는 손실이나 손상에 대해 당사는 책임지지 않습니다."
                )}
              </Text>
            </Box>

            <Box my={4}>
              <Text
                fontSize="sm"
                fontWeight="semibold"
                mb={2}
                textDecor="underline"
              >
                Temperature Control
              </Text>
              <Text fontSize="sm" color="gray.700">
                {translator(
                  "We take all reasonable measures to maintain proper storage temperatures during transit. If temperature control failure is suspected, claims must be submitted with timestamped photos within 24 hrs of delivery.",
                  "운송 중 적정 온도 유지를 위해 모든 합리적 조치를 취합니다. 온도 관리 실패가 의심될 경우, 배송 후 24시간 이내에 시간 스탬프가 있는 사진과 함께 클레임을 접수해 주셔야 합니다."
                )}
              </Text>
            </Box>
          </Box>

          {/* Q. Refund / 환불 정책 */}
          <Box>
            <Heading size="md" my={6}>
              <Text as="span" color={COLORS.ACCENT}>
                Q.
              </Text>{" "}
              {translator("Refund", "환불 정책")}
            </Heading>

            <Text fontSize="sm" color="gray.700">
              <Text as="span" color={COLORS.ACCENT} fontWeight="semibold">
                {translator(
                  "All meat sales are final and non-refundable,",
                  "당사는 제품의 안전성과 품질에 자신이 있으므로 모든 육류 판매는 최종 판매이며 환불이 불가합니다."
                )}
              </Text>
              {translator(
                " as we are confident in the safety and quality of our products.",
                " 단, 제품에 문제가 있을 경우 교환은 가능합니다."
              )}
            </Text>

            <Text fontSize="sm" mt={4} color="gray.700">
              {translator(
                "However, exchanges are possible if there is an issue with the product. For pickup orders, both parties will inspect the product together before handing it over. Therefore, refunds are not possible after this point.",
                "픽업 주문의 경우 양측이 함께 고기를 검사 후 인도하므로, 이 이후 환불은 불가능합니다."
              )}
            </Text>

            <Text fontSize="sm" mt={4} color="gray.700">
              {translator(
                "If you receive the product via delivery and find a problem, please contact us within 24 hours. If you have any questions or concerns, please feel free to contact us. We are happy to help.",
                "배송 주문에서 문제가 발견될 경우 배송 후 24시간 이내에 연락해 주세요. 문의 사항이 있으시면 언제든 연락 주시기 바랍니다. 친절히 도와드리겠습니다."
              )}
            </Text>

            <Box fontSize="sm" mt={4} fontWeight="semibold">
              <Text>• (323)943-9318</Text>
              <Text>• sales@adamsfoods.us</Text>
            </Box>
          </Box>

          {/* Q. Purchase / 결제 */}
          <Box>
            <Heading size="md" my={6}>
              <Text as="span" color={COLORS.ACCENT}>
                Q.
              </Text>{" "}
              {translator("Purchase", "결제")}
            </Heading>

            <Text fontSize="sm" color="gray.700">
              <Text as="span" color={COLORS.ACCENT} fontWeight="semibold">
                {translator(
                  "We accept Cash, Credit Card Only. (Without AMEX Card)",
                  "현금 및 신용카드 결제만 가능 (AMEX 카드 제외)"
                )}
              </Text>
            </Text>

            <Text fontSize="sm" mt={4} color="gray.700">
              {translator("However, please note:", "However, please note:")}
            </Text>

            <Box fontSize="sm" mt={2} color="gray.700">
              <Text>
                •{" "}
                {translator(
                  "Cash payments receive the highest discount.",
                  "현금 결제 시 가장 높은 할인이 적용됩니다."
                )}
              </Text>
              <Text>
                •{" "}
                {translator(
                  "A sales tax will be added for card payments.",
                  "신용카드 결제에는 판매세가 추가됩니다."
                )}
              </Text>
            </Box>

            <Text fontSize="sm" mt={4} color="gray.700">
              {translator(
                "We appreciate your understanding and are happy to assist with any further questions.",
                "이해해 주셔서 감사드리며, 추가 문의 사항이 있으시면 언제든 도와드리겠습니다."
              )}
            </Text>
          </Box>

          {/* Q. Bulk Purchase / 대량 구매 */}
          <Box>
            <Heading size="md" my={6}>
              <Text as="span" color={COLORS.ACCENT}>
                Q.
              </Text>{" "}
              {translator("Bulk Purchase", "대량 구매")}
            </Heading>

            <Text fontSize="sm" color="gray.700">
              {translator(
                "For bulk purchases, please contact us via the ",
                "대량 구매는 '"
              )}
              <Text as="span" color={COLORS.ACCENT} fontWeight="semibold">
                {translator("'Contact Us'", "문의하기")}
              </Text>
              {translator(" page.", "' 페이지를 통해 연락해 주세요.")}
            </Text>

            <Box fontSize="sm" mt={4} color="gray.700">
              <Text>
                •{" "}
                {translator(
                  "Discounts are available for bulk orders over ",
                  ""
                )}
                <Text as="span" color={COLORS.ACCENT} fontWeight="semibold">
                  $3,000
                </Text>
                {translator(
                  ". For inquiries, please contact us directly.",
                  " 이상 대량 주문 시 할인 혜택이 제공됩니다. 문의는 직접 연락 부탁드립니다."
                )}
              </Text>
            </Box>
          </Box>

          {/* Q. Cash & Carry / 현금 결제 픽업 혜택 */}
          <Box>
            <Heading size="md" mt={6}>
              <Text as="span" color={COLORS.ACCENT}>
                Q.
              </Text>{" "}
              {translator("Cash & Carry", "현금 결제 픽업 혜택")}
            </Heading>

            <Text fontSize="sm" color="gray.700">
              {translator(
                "Get an extra discount when you pay cash and pick up!",
                "현금 결제 후 직접 픽업시 추가 할인이 있습니다!"
              )}
            </Text>
          </Box>

          {/* Q. Allergy */}
          <Box>
            <Heading size="md" my={6}>
              <Text as="span" color={COLORS.ACCENT}>
                Q.
              </Text>{" "}{translator(
                "Allergen",
                "알레르기 유발물질"
              )}
              
            </Heading>

            <Text fontSize="sm" color="gray.700">
              {translator(
                "Our products are processed in facilities that may also handle soy, wheat, sesame, fish, shellfish, dairy, eggs, peanuts, and tree nuts. It is the customer's responsibility to communicate potential allergen risks to their end consumers.",
                "당사 제품은 대두, 밀, 참깨, 생선, 조개류, 유제품, 달걀, 땅콩, 견과류 등을 취급하는 시설에서 가공됩니다. "
              )}
            </Text>
            <Text fontSize="sm" color="gray.700" mt={4}>
              {translator(
                "",
                "고객께서는 직접 소비자에게 적절한 알레르기 위험을 반드시 안내해 주셔야 합니다."
              )}
            </Text>
          </Box>
        </VStack>

        <Footer />
      </Container>
    </Sidebar>
  );
};

export default FAQPage;
