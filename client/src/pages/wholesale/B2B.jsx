import React, { useRef } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Divider,
  useColorModeValue,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import NavDrawer from "../../components/NavDrawer";
import Sidebar from "../../components/SideBar";
import Breadcrumbs from "../../components/Breadcrumbs";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { useLanguage } from "../../hooks/LanguageContext";
import { COLORS } from "../../constants";

import { translator } from "../../utils/translator";

const B2BPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const { selectedLanguage } = useLanguage();
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const breadcrumbs = [
    { label: "Home", url: "/" },
    { label: "Wholesale", url: "/" },
    { label: "B2B", url: "/wholesale/b2b" },
  ];

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
          {/* Header Section */}
          <Box py={4} px={6} borderColor={borderColor} bg="white" mb={4}>
            <Heading as="h1" size="lg" fontWeight="semibold" textAlign="center">
              Business to Business
            </Heading>
          </Box>

          <Divider />

          {/* B2B Introduction */}
          <Box p={4}>
            <Text fontSize="sm" color="gray.600" p={4}>
              {translator(
                "Partner with us for a reliable supply of fresh, good-quality meat.",
                "신선하고 고품질의 믿을 수 있는 고기 공급을 위해 저희와 파트너가 되어 주세요."
              )}
            </Text>

            <Text fontSize="sm" color="gray.600" mb={12} px={3}>
              {translator(
                "We offer customized meat solutions at competitive prices, fostering long-term relationships with many satisfied clients.",
                "경쟁력 있는 가격으로 맞춤형 육류 솔루션을 제공하며, 일관된 품질로 만족도 높은 장기 파트너십을 구축합니다."
              )}
            </Text>

            {/* Why Choose Us Section */}
            <Heading as="h3" size="md" mb={5} ml={4} fontWeight="semibold">
              Why Choose Us?
            </Heading>

            <VStack spacing={6} align="stretch" mb={6}>
              {/* Feature 1 */}
              <Box borderRadius={16} p={4} bg={COLORS.GRAY_LIGHT}>
                <HStack mb={2}>
                  <Text
                    textColor={COLORS.ACCENT}
                    fontWeight="semibold"
                    fontSize="md"
                  >
                    1.
                  </Text>
                  <Heading as="h4" size="xs" fontWeight="semibold">
                    {translator(
                      "Fresh, Good-Quality Products",
                      "신선하고 고품질의 제품"
                    )}
                  </Heading>
                </HStack>
                <Text fontSize="sm" color="gray.600" mt={3}>
                  {translator(
                    "We provide only the freshest, high-quality meat sourced with care. Our strict handling and storage standards ensure safety, freshness, and taste in every order.",
                    "정성껏 엄선한 신선하고 고품질의 고기만을 제공합니다. 엄격한 취급 및 보관 기준으로 안전하고 신선하며 맛있는 제품을 보장합니다."
                  )}
                </Text>
              </Box>

              {/* Feature 2 */}
              <Box borderRadius={16} p={4} bg={COLORS.GRAY_LIGHT}>
                <HStack mb={2}>
                  <Text
                    textColor={COLORS.ACCENT}
                    fontWeight="semibold"
                    fontSize="md"
                  >
                    2.
                  </Text>
                  <Heading as="h4" size="xs" fontWeight="semibold">
                    {translator("Tailored Solutions", "맞춤형 솔루션")}
                  </Heading>
                </HStack>
                <Text fontSize="sm" color="gray.600" mt={3}>
                  {translator(
                    "Your business is unique — and so are your needs. We offer customized meat cuts, packaging, and ordering options to match your exact requirements.",
                    "사업마다 고유한 요구가 다르기에, 맞춤형 고기 손질, 포장, 유연한 주문 옵션을 통해 고객의 정확한 니즈에 부응합니다."
                  )}
                </Text>
              </Box>

              {/* Feature 3 */}
              <Box borderRadius={16} p={4} bg={COLORS.GRAY_LIGHT}>
                <HStack mb={2}>
                  <Text
                    textColor={COLORS.ACCENT}
                    fontWeight="semibold"
                    fontSize="md"
                  >
                    3.
                  </Text>
                  <Heading as="h4" size="xs" fontWeight="semibold">
                    {translator("Competitive Pricing", "경쟁력 있는 가격")}
                  </Heading>
                </HStack>
                <Text fontSize="sm" color="gray.600" mt={3}>
                  {translator(
                    "We offer fair and competitive wholesale prices without compromising on quality. Our pricing structure is designed to support your bottom line.",
                    "품질을 희생하지 않고 경쟁력 있는 도매 가격을 제시하여 고객님의 수익성을 지원합니다."
                  )}
                </Text>
              </Box>

              {/* Feature 4 */}
              <Box borderRadius={16} p={4} bg={COLORS.GRAY_LIGHT}>
                <HStack mb={2}>
                  <Text
                    textColor={COLORS.ACCENT}
                    fontWeight="semibold"
                    fontSize="md"
                  >
                    4.
                  </Text>
                  <Heading as="h4" size="xs" fontWeight="semibold">
                    {translator(
                      "Excellent Customer Service",
                      "우수한 고객 서비스"
                    )}
                  </Heading>
                </HStack>
                <Text fontSize="sm" color="gray.600" mt={3}>
                  {translator(
                    "Our responsive support team is here to assist you, whether you have questions, need assistance with orders, or require special arrangements.",
                    "주문 문의, 지원 요청, 특별 요청 등 언제든 신속하고 친절한 지원을 약속드립니다."
                  )}
                </Text>
              </Box>

              {/* Feature 5 */}
              <Box borderRadius={16} p={4} bg={COLORS.GRAY_LIGHT}>
                <HStack mb={2}>
                  <Text
                    textColor={COLORS.ACCENT}
                    fontWeight="semibold"
                    fontSize="md"
                  >
                    5.
                  </Text>
                  <Heading as="h4" size="xs" fontWeight="semibold">
                    {translator(
                      "Flexibility in Order Sizes",
                      "다양한 주문 규모 대응"
                    )}
                  </Heading>
                </HStack>
                <Text fontSize="sm" color="gray.600" mt={3}>
                  {translator(
                    "Whether you run a small kitchen or a large-scale operation, we customize order volumes to meet your scale and schedule.",
                    "소규모 주방부터 대규모 사업장까지 다양한 주문량을 유연하게 맞춰드립니다."
                  )}
                </Text>
              </Box>

              {/* Feature 6 */}
              <Box borderRadius={16} p={4} bg={COLORS.GRAY_LIGHT}>
                <HStack mb={2}>
                  <Text
                    textColor={COLORS.ACCENT}
                    fontWeight="semibold"
                    fontSize="md"
                  >
                    6.
                  </Text>
                  <Heading as="h4" size="xs" fontWeight="semibold">
                    {translator(
                      "Quality Control & Certification",
                      "품질 관리 및 인증"
                    )}
                  </Heading>
                </HStack>
                <Text fontSize="sm" color="gray.600" mt={3}>
                  {translator(
                    "All our meat products undergo strict quality control and are certified to meet local safety and industry standards. You can trust what you serve to your customers.",
                    "모든 제품은 엄격한 품질 관리를 거치며, 지역 안전 기준과 업계 인증을 충족합니다."
                  )}
                </Text>
                <Text fontSize="sm" color="gray.600" mt={3}>
                  {translator("", "고객에게 신뢰할 수 있는 제품을 제공하세요.")}
                </Text>
              </Box>

              {/* Feature 7 */}
              <Box borderRadius={16} p={4} pb={8} bg={COLORS.GRAY_LIGHT}>
                <HStack mb={2}>
                  <Text
                    textColor={COLORS.ACCENT}
                    fontWeight="semibold"
                    fontSize="md"
                  >
                    7.
                  </Text>
                  <Heading as="h4" size="xs" fontWeight="semibold">
                    {translator("Long-term Partnerships", "장기 파트너십")}
                  </Heading>
                </HStack>
                <Text fontSize="sm" color="gray.600" mt={3}>
                  {translator(
                    "We're not just a supplier, we're a reliable business partner. We aim to build long-lasting relationships based on trust, consistency, and mutual success.",
                    "저희는 단순 공급자를 넘어 신뢰와 일관성, 상호 성공을 바탕으로 한 오래가는 파트너가 되겠습니다."
                  )}
                </Text>
              </Box>
            </VStack>

            {/* Contact Button */}
            <Box display="flex" justifyContent="center" mt={8} mb={6}>
              <Button
                as="button"
                bg={COLORS.PRIMARY}
                color="white"
                py={3}
                px={6}
                borderRadius={24}
                fontWeight="medium"
                _hover={{ bg: "gray.800" }}
                width="90%"
                onClick={() => navigate("/contact")}
                fontSize="sm"
              >
                GO TO CONTACT US
              </Button>
            </Box>
          </Box>
        </Box>
        <Footer />
      </Container>
    </Sidebar>
  );
};

export default B2BPage;
