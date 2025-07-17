import React, { useRef } from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  IconButton,
  useDisclosure,
  Text,
  VStack,
  Image,
} from "@chakra-ui/react";
import { ChevronLeft } from "lucide-react";
import Footer from "../../components/Footer";
import Sidebar from "../../components/SideBar";
import NavDrawer from "../../components/NavDrawer";
import Navbar from "../../components/Navbar";

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

        <Navbar onOpen={onOpen} />

        {/* Deal Header */}
        <Box textAlign="center" py={6} px={4}>
          <Heading
            fontSize="30px"
            fontWeight="bold"
            fontFamily="'SUIT-Bold', sans-serif"
            mb={8}
          >
            Deal
          </Heading>

          <Image
            src="/Final_pic/Deal pg poster.jpg"
            fallbackSrc="/gray.avif"
            boxSize="100%"
            objectFit="cover"
            mb={6}
          />

          {/* Create Account Section */}
          <VStack spacing={4} align="stretch" px={4}>
            <Box textAlign="left">
              <Heading fontSize="18px" fontWeight="bold" mb={0}>
                Create your account and
              </Heading>
              <Heading fontSize="18px" fontWeight="bold" mb={4}>
                Enjoy special launch offers!
              </Heading>
            </Box>

            {/* Offer 1 */}
            <Box textAlign="left">
              <Flex align="center" mb={2}>
                <Text fontSize="16px" fontWeight="bold" color=" #CA3836" mr={2}>
                  1.
                </Text>
                <Text fontSize="16px" fontWeight="bold" color=" #CA3836">
                  UP TO 5% OFF
                </Text>
              </Flex>
              <Text fontSize="14px" color="gray.600" mb={3}>
                Sign up now and get up to 5% off during our launch event!
              </Text>
            </Box>

            {/* Offer 2 */}
            <Box textAlign="left">
              <Flex align="center" mb={2}>
                <Text fontSize="16px" fontWeight="bold" color=" #CA3836" mr={2}>
                  2.
                </Text>
                <Text fontSize="16px" fontWeight="bold" color=" #CA3836">
                  EXCLUSIVE DEALS
                </Text>
              </Flex>
              <Text fontSize="14px" color="gray.600" mb={3}>
                Exclusive deals available only on the app.
              </Text>
              <Text fontSize="14px" color="gray.600">
                App-only pricing and early access to new products.
              </Text>
            </Box>
          </VStack>
        </Box>

        <Footer />
      </Container>
    </Sidebar>
  );
};

export default DealPage;
