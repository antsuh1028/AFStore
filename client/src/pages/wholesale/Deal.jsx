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
  UnorderedList,
  ListItem,
  Circle,
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

        <Box textAlign="center" py={6} px={4} mb={12}>
          <Box width="100%">
            <Box py={4} px={6} borderColor="gray.200" bg="white" mb={4}>
              <Heading
                as="h1"
                size="lg"
                fontWeight="semibold"
                textAlign="center"
              >
                Deal
              </Heading>
            </Box>
            <Divider mt={2} borderColor="gray.200" />
          </Box>
          <Image
            src="/images/side_image.avif"
            fallbackSrc="/images/side_image.png"
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
             {/* Offer 1 */}
            <Box textAlign="left">
              <Flex align="center" mb={2}>
                <Circle size="20px" fontSize="80%" bg="#CA3836" color="white" mr={2}>
                  1
                </Circle>
                <Text fontSize="16px" fontWeight="bold" >
                  {translator("First Purchase", "첫 구매 (최대 5% 할인)")}
                </Text>
              </Flex>

              {translator(
                <UnorderedList
                  spacing={2}
                  ml={6}
                  color="gray.600"
                  fontSize="14px"
                  lineHeight="1.6"
                >
                  <ListItem>
                    When you sign up, and on your First Purchase — we’ll give you a free meat item.
                  </ListItem>
                  <ListItem>Limited to the first 50 new customers.</ListItem>
                </UnorderedList>,
                <UnorderedList
                  spacing={2}
                  ml={6}
                  color="gray.600"
                  fontSize="14px"
                  lineHeight="1.6"
                >
                  <ListItem>
                    가입 시 및 첫 구매 시 — 무료 육류(5lb)를 드립니다.
                  </ListItem>
                  <ListItem>신규 고객 선착순 50명 한정.</ListItem>
                </UnorderedList>
              )}
            </Box>

            {/* Offer 2 */}
            <Box textAlign="left">
              <Flex align="center" mb={2}>
                <Circle size="20px" fontSize="80%" bg="#CA3836" color="white" mr={2}>
                  2
                </Circle>
                <Text fontSize="16px" fontWeight="bold" >
                  {translator("Ongoing Free Meat Rewards", "지속적인 무료 육류 혜택")}
                </Text>
              </Flex>

              {translator(
                <UnorderedList
                  spacing={2}
                  ml={6}
                  color="gray.600"
                  fontSize="14px"
                  lineHeight="1.6"
                >
                  <ListItem>
                    After your first order, we’ll continue to send you email offers for free meat, based on your future purchase amounts.
                  </ListItem>
                </UnorderedList>,
                <UnorderedList
                  spacing={2}
                  ml={6}
                  color="gray.600"
                  fontSize="14px"
                  lineHeight="1.6"
                >
                  <ListItem>
                    첫 주문 후에도 향후 구매량에 따라 무료 육류 제공 혜택을 이메일로 계속 안내해 드립니다.
                  </ListItem>
                  <ListItem>{`(향후 구매 실적 기준)`}</ListItem>
                </UnorderedList>
              )}
            </Box>
          </VStack>
        </Box>

        <Footer />
      </Container>
    </Sidebar>
  );
};

export default DealPage;
