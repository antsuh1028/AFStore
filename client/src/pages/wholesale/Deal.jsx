import React, { useRef } from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  useDisclosure,
  Text,
  VStack,
  Image,
  Divider,
} from "@chakra-ui/react";
import Footer from "../../components/Footer";
import Sidebar from "../../components/SideBar";
import NavDrawer from "../../components/NavDrawer";
import Navbar from "../../components/Navbar";
import { translator } from "../../utils/translator";

const DealPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const contentRef = useRef(null);

  return (
    <Sidebar>
      <Container
        ref={contentRef}
        maxW={{ base: "100%", lg: "30%" }}
        p={0}
        bg="white"
        boxShadow="xl"
        ml={{ base: 0, lg: "40%" }}
      >
        <NavDrawer
          isOpen={isOpen}
          onClose={onClose}
          containerRef={contentRef}
        />

        <Navbar onOpen={onOpen} home={true} />

        {/* Deal Header */}
        
        <Box textAlign="center" py={6} px={4}>
          <Box width="100%">
            <Box py={4} px={6} borderColor="gray.200" bg="white" mb={4}>
              <Heading as="h1" size="lg" fontWeight="semibold" textAlign="center">
                Deal
              </Heading>
            </Box>
            <Divider mt={2} borderColor="gray.200" />
          </Box>
          <Image
            src="/images/deal_pg_poster.jpg"
            fallbackSrc="/images/gray.avif"
            boxSize="100%"
            objectFit="cover"
            mb={6}
          />

          {/* Create Account Section */}
          <VStack spacing={4} align="stretch" px={4}>
            <Box textAlign="left" my={4}>
              <Heading fontSize="18px" fontWeight="bold" mb={0}>
                {translator(
                  "Create your account and",
                  "계정을 생성하고 론칭 혜택을 누려보세요!"
                )}
              </Heading>
              {translator(
                <Heading fontSize="18px" fontWeight="bold" mb={4}>
                  Enjoy special launch offers!
                </Heading>,
                null
              )}
            </Box>

            {/* Offer 1 */}
            <Box textAlign="left">
              <Flex align="center" mb={2}>
                <Text fontSize="16px" fontWeight="bold" color=" #CA3836" mr={2}>
                  1.
                </Text>
                <Text fontSize="16px" fontWeight="bold" color=" #CA3836">
                  {translator("UP TO 5% OFF", "최대 5% 할인")}
                </Text>
              </Flex>
              <Text fontSize="14px" color="gray.600" mb={3}>
                {translator(
                  "Sign up now and get up to 5% off during our launch event!",
                  "지금 가입하고 론칭 이벤트 기간 동안, 최대 5% 할인을 받으세요!"
                )}
              </Text>
            </Box>

            {/* Offer 2 */}
            <Box textAlign="left">
              <Flex align="center" mb={2}>
                <Text fontSize="16px" fontWeight="bold" color=" #CA3836" mr={2}>
                  2.
                </Text>
                <Text fontSize="16px" fontWeight="bold" color=" #CA3836">
                  {translator("EXCLUSIVE DEALS", "단독 혜택")}
                </Text>
              </Flex>
              <Text fontSize="14px" color="gray.600" mb={3}>
                {translator(
                  "Exclusive deals available only on the app.",
                  "앱에서만 제공되는 단독 할인 및 신제품을 가장 먼저 만나보세요."
                )}
              </Text>
              <Text fontSize="14px" color="gray.600">
                {translator(
                  "App-only pricing and early access to new products.",
                  ""
                )}
              </Text>
              <Flex align="center" mb={2}></Flex>
            </Box>
          </VStack>
        </Box>

        <Footer />
      </Container>
    </Sidebar>
  );
};

export default DealPage;