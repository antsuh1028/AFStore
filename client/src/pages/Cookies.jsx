import {
  Container,
  Box,
  Text,
  VStack,
  Heading,
  useDisclosure,
  List,
  ListItem,
} from "@chakra-ui/react";
import { useRef } from "react";
import Sidebar from "../components/SideBar";
import NavDrawer from "../components/NavDrawer";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { COLORS } from "../constants";
import { translator } from "../utils/translator.jsx";

export const CookiesPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const contentRef = useRef(null);
  

  const SectionHeader = ({ children }) => (
    <Box
      bg={COLORS.PRIMARY}
      color="white"
      px={3}
      borderRadius="full"
      display="block"
      width="fit-content"
      alignSelf="flex-start"
    >
      <Text fontSize="sm" fontWeight="bold">
        {children}
      </Text>
    </Box>
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
        minHeight="100vh"
      >
        <Navbar onOpen={onOpen} />

        <VStack spacing={6} px={4} py={6}>
          <Heading
            textAlign="center"
            fontSize="3xl"
            fontWeight="semibold"
            pt={2}
            pb={8}
          >
            Cookie Policy
          </Heading>

          <VStack
            bg={COLORS.GRAY_LIGHT}
            borderRadius="3xl"
            p={6}
            align="stretch"
            width="100%"
          >
            <SectionHeader>
              {translator("What Cookies Are", "쿠키란 무엇인가요")}
            </SectionHeader>
            <Text fontSize="sm" color="gray.700" mb={4} lineHeight="shorter">
              {translator(
                "Cookies are small text files stored on your device to help websites function properly and enhance your browsing experience.",
                "쿠키는 웹사이트가 정상적으로 작동하고 귀하의 브라우징 경험을 향상시키기 위해 귀하의 기기에 저장되는 작은 텍스트 파일입니다."
              )}
            </Text>

            <SectionHeader>
              {translator("Why We Use Cookies", "쿠키 사용 목적")}
            </SectionHeader>
            <Text fontSize="sm" color="gray.700" mb={2} lineHeight="shorter">
              {translator(
                "At AdamsFoods, we use cookies for the following purposes:",
                "AdamsFoods는 다음과 같은 목적으로 쿠키를 사용합니다:"
              )}
            </Text>

            <List styleType="disc" spacing={3} pl={4} mb={12}>
              <ListItem fontSize="sm" lineHeight="shorter">
                <Text fontWeight="bold" color={COLORS.ACCENT} mb={1}>
                  {translator("Essential Cookies", "필수 쿠키")}
                </Text>
                <Text color="gray.700">
                  {translator(
                    "Needed for site operation (e.g., login, shopping cart).",
                    "사이트 운영에 필요 (예: 로그인, 장바구니)."
                  )}
                </Text>
              </ListItem>

              <ListItem fontSize="sm" lineHeight="shorter">
                <Text fontWeight="bold" color={COLORS.ACCENT} mb={1}>
                  {translator("Performance/Analytics Cookies", "성능/분석 쿠키")}
                </Text>
                <Text color="gray.700">
                  {translator(
                    "Used to analyze traffic and improve performance.",
                    "트래픽 분석 및 성능 개선"
                  )}
                </Text>
              </ListItem>

              <ListItem fontSize="sm" lineHeight="shorter">
                <Text fontWeight="bold" color={COLORS.ACCENT} mb={1}>
                  {translator("Functionality Cookies", "기능성 쿠키")}
                </Text>
                <Text color="gray.700">
                  {translator(
                    "Remember user preferences (e.g., language, location).",
                    "사용자 설정 기억 (예: 언어, 위치)"
                  )}
                </Text>
              </ListItem>

              <ListItem fontSize="sm" lineHeight="shorter">
                <Text fontWeight="bold" color={COLORS.ACCENT} mb={1}>
                  {translator("Advertising/Targeting Cookies", "광고/타겟팅 쿠키")}
                </Text>
                <Text color="gray.700">
                  {translator(
                    "Deliver personalized advertisements.",
                    "개인 맞춤 광고 제공"
                  )}
                </Text>
              </ListItem>
            </List>

            <SectionHeader>
              {translator("Data Collected", "수집되는 데이터")}
            </SectionHeader>
            <Text fontSize="sm" color="gray.700" mb={4} lineHeight="shorter">
              {translator(
                "Examples include browser type, visited pages, and click activity.",
                "예: IP 주소, 브라우저 유형, 방문한 페이지, 클릭 활동 등"
              )}
            </Text>

            <SectionHeader>
              {translator("Third-Party Services", "제3자 서비스")}
            </SectionHeader>
            <Text fontSize="sm" color="gray.700" mb={4} lineHeight="shorter">
              {translator(
                "We may use services such as Google Analytics, Facebook Pixel, or other third-party tools.",
                "Google Analytics, Facebook Pixel 등 제3자 도구를 사용할 수 있습니다."
              )}
            </Text>

            <SectionHeader>{translator("Managing Cookies", "쿠키 관리")}</SectionHeader>
            <Text fontSize="sm" color="gray.700" mb={0} lineHeight="shorter">
              {translator(
                "You can reject or delete cookies via your browser settings. For EU/UK users: You may withdraw your cookie consent at any time.",
                "브라우저 설정을 통해 쿠키를 거부하거나 삭제할 수 있습니다."
              )}
            </Text>
            <Text fontSize="sm" color="gray.700" mb={4} lineHeight="shorter">
              {translator("", "EU/영국 이용자는 언제든 쿠키 동의를 철회할 수 있습니다.")}
            </Text>

            <SectionHeader>{translator("Contact Information", "문의처")}</SectionHeader>
            <Text fontSize="sm" color="gray.700" mb={16} lineHeight="shorter">
              {translator(
                "For any questions about this Cookie Policy, please contact us at ",
                "쿠키 정책에 관한 문의는 "
              )}
              <Text as="span" color={COLORS.ACCENT} fontWeight="semibold">
                {translator("admin@adamsfoods.us", "admin@adamsfoods.us")}
              </Text>
              {translator(".", "로 연락해 주세요.")}
            </Text>
          </VStack>
        </VStack>
        <Footer />
      </Container>
    </Sidebar>
  );
};
