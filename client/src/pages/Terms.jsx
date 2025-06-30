import React from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  Divider,
  Image,
  IconButton,
  useDisclosure,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import { MdCircle } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import NavDrawer from "../components/NavDrawer";
import Footer from "../components/Footer";
import Sidebar from "../components/SideBar";
import Navbar from "../components/Navbar";

const TermsAndPoliciesPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const contentRef = React.useRef(null);

  return (
    <Sidebar>
      <NavDrawer isOpen={isOpen} onClose={onClose} containerRef={contentRef} />

      <Container
        ref={contentRef}
        maxW={{ base: "100%", lg: "30%" }}
        p={0}
        bg="white"
        border={{ base: "none", lg: "1px" }}
        ml={{ base: 0, lg: "40%" }}
      >
        <Navbar onOpen={onOpen} />
        {/* Header */}
        {/* <Flex p={4} justify="space-between" align="center">
          <Image src="../../grayAdams.png" alt="AdamsFoods Logo" width="40%" />
          <IconButton
            aria-label="Menu"
            icon={<Text>☰</Text>}
            variant="ghost"
            onClick={onOpen}
          />
        </Flex> */}

        {/* Terms & Policies Header */}
        <Box px={4} py={8} textAlign="center">
          <Heading as="h1" size="lg">
            <Text as="span" fontWeight="bold">
              Terms & Policies
            </Text>
          </Heading>
        </Box>

        <Heading
          size="sm"
          fontWeight="bold"
          textAlign="right"
          mb={-2}
          mr={10}
          mt={8}
        >
          Terms of Service
        </Heading>
        {/* Terms of Service Section */}
        <Box
          px={6}
          paddingTop={4}
          paddingBottom={10}
          m={4}
          borderRadius={24}
          bg="#f9f9f9"
        >
          <VStack spacing={5} align="stretch">
            <Box>
              <Box
                bg="#b7a495"
                color="white"
                px={4}
                borderRadius="full"
                display="inline-block"
                mb={1}
              >
                <Text fontSize="sm" fontWeight="semibold">
                  Purpose
                </Text>
              </Box>
              <Text fontSize="sm" color="gray.700" ml={2}>
                This agreement governs your use of the Adams Foods Wholesale
                App. By using our services, you agree to these terms.
              </Text>
            </Box>

            <Box>
              <Box
                bg="#b7a495"
                color="white"
                px={4}
                borderRadius="full"
                display="inline-block"
                mb={1}
              >
                <Text fontSize="sm" fontWeight="semibold">
                  Eligibility & Licensing
                </Text>
              </Box>
              <Text fontSize="sm" color="gray.700" ml={2}>
                Our platform is only available to verified businesses with a
                valid Wholesale License. We reserve the right to verify or deny
                access.
              </Text>
            </Box>

            <Box>
              <Box
                bg="#b7a495"
                color="white"
                px={4}
                borderRadius="full"
                display="inline-block"
                mb={1}
              >
                <Text fontSize="sm" fontWeight="semibold">
                  Ordering & Payments
                </Text>
              </Box>
              <Text fontSize="sm" color="gray.700" ml={2}>
                Orders are received via the platform and processed on a COD
                (Cash on Delivery) basis or other agreed methods.
              </Text>
            </Box>

            <Box>
              <Box
                bg="#b7a495"
                color="white"
                px={4}
                borderRadius="full"
                display="inline-block"
                mb={1}
              >
                <Text fontSize="sm" fontWeight="semibold">
                  Modification Clause
                </Text>
              </Box>
              <Text fontSize="sm" color="gray.700" ml={2}>
                We may update these terms at any time. Continued use of the
                platform means acceptance of the changes.
              </Text>
            </Box>

            <Box>
              <Box
                bg="#b7a495"
                color="white"
                px={4}
                borderRadius="full"
                display="inline-block"
                mb={1}
              >
                <Text fontSize="sm" fontWeight="semibold">
                  Limitation of Liability
                </Text>
              </Box>
              <Text fontSize="sm" color="gray.700" ml={2}>
                Adams Foods is not liable for indirect damages, loss of revenue,
                or product misuse.
              </Text>
            </Box>

            <Box>
              <Box
                bg="#b7a495"
                color="white"
                px={4}
                borderRadius="full"
                display="inline-block"
                mb={1}
              >
                <Text fontSize="sm" fontWeight="semibold">
                  Governing Law
                </Text>
              </Box>
              <Text fontSize="sm" color="gray.700" ml={2}>
                These terms are governed by the laws of the State of California.
              </Text>
            </Box>
          </VStack>
        </Box>

        {/* Privacy Policy Section */}
        <Heading
          size="sm"
          fontWeight="bold"
          textAlign="right"
          mb={-2}
          mr={10}
          mt={12}
        >
          Privacy Policy
        </Heading>
        <Box
          px={6}
          paddingTop={4}
          paddingBottom={10}
          m={4}
          borderRadius={24}
          bg="#f9f9f9"
        >
          <VStack spacing={5} align="stretch">
            <Box>
              <Box
                bg="#b7a495"
                color="white"
                px={4}
                borderRadius="full"
                display="inline-block"
                mb={1}
              >
                <Text fontSize="sm" fontWeight="semibold">
                  Information We Collect
                </Text>
              </Box>
              <List ml={2}>
                <ListItem fontSize="sm" display="flex" alignItems="center">
                  <Box as="span" mr={2} fontSize="6px">
                    <MdCircle />
                  </Box>
                  Business Name, Owner Name
                </ListItem>
                <ListItem fontSize="sm" display="flex" alignItems="center">
                  <Box as="span" mr={2} fontSize="6px">
                    <MdCircle />
                  </Box>
                  Wholesale License Number
                </ListItem>
                <ListItem fontSize="sm" display="flex" alignItems="center">
                  <Box as="span" mr={2} fontSize="6px">
                    <MdCircle />
                  </Box>
                  Contact Details (Email, Phone)
                </ListItem>
                <ListItem fontSize="sm" display="flex" alignItems="center">
                  <Box as="span" mr={2} fontSize="6px">
                    <MdCircle />
                  </Box>
                  Order History & Preferences
                </ListItem>
              </List>
            </Box>

            <Box>
              <Box
                bg="#b7a495"
                color="white"
                px={4}
                borderRadius="full"
                display="inline-block"
                mb={1}
              >
                <Text fontSize="sm" fontWeight="semibold">
                  How We Use It
                </Text>
              </Box>
              <List ml={2}>
                <ListItem fontSize="sm" display="flex" alignItems="center">
                  <Box as="span" mr={2} fontSize="6px">
                    <MdCircle />
                  </Box>
                  To process and fulfill orders
                </ListItem>
                <ListItem fontSize="sm" display="flex" alignItems="center">
                  <Box as="span" mr={2} fontSize="6px">
                    <MdCircle />
                  </Box>
                  For internal analytics and service improvements
                </ListItem>
                <ListItem fontSize="sm" display="flex" alignItems="center">
                  <Box as="span" mr={2} fontSize="6px">
                    <MdCircle />
                  </Box>
                  To contact you about your orders or promotions
                </ListItem>
              </List>
            </Box>

            <Box>
              <Box
                bg="#b7a495"
                color="white"
                px={4}
                borderRadius="full"
                display="inline-block"
                mb={1}
              >
                <Text fontSize="sm" fontWeight="semibold">
                  CCPA Compliance
                </Text>
              </Box>
              <Text fontSize="sm" color="gray.700" mb={1}>
                Under the California Consumer Privacy Act (CCPA), you have the
                right to:
              </Text>
              <List ml={2}>
                <ListItem fontSize="sm" display="flex" alignItems="center">
                  <Box as="span" mr={2} fontSize="6px">
                    <MdCircle />
                  </Box>
                  Know what personal information we collect
                </ListItem>
                <ListItem fontSize="sm" display="flex" alignItems="center">
                  <Box as="span" mr={2} fontSize="6px">
                    <MdCircle />
                  </Box>
                  Request deletion of your data
                </ListItem>
                <ListItem fontSize="sm" display="flex" alignItems="center">
                  <Box as="span" mr={2} fontSize="6px">
                    <MdCircle />
                  </Box>
                  Opt out of data sharing
                </ListItem>
              </List>
            </Box>

            <Box>
              <Box
                bg="#b7a495"
                color="white"
                px={4}
                borderRadius="full"
                display="inline-block"
                mb={1}
              >
                <Text fontSize="sm" fontWeight="semibold">
                  Security
                </Text>
              </Box>
              <List>
                <ListItem fontSize="sm" display="flex" alignItems="center">
                  <Box as="span" mr={2} fontSize="6px">
                    <MdCircle />
                  </Box>
                  We use industry-standard methods to secure your data, though
                  no system is 100% safe.
                </ListItem>
              </List>
            </Box>
          </VStack>
        </Box>

        {/* Return & Refund Policy Section */}
        <Heading
          size="sm"
          fontWeight="bold"
          textAlign="right"
          mb={-2}
          mr={10}
          mt={12}
        >
          Return & Refund Policy
        </Heading>
        <Box
          px={6}
          paddingTop={4}
          paddingBottom={10}
          m={4}
          borderRadius={24}
          bg="#f9f9f9"
        >
          <VStack spacing={5} align="stretch">
            <Box>
              <Box
                bg="#b7a495"
                color="white"
                px={4}
                borderRadius="full"
                display="inline-block"
                mb={1}
              >
                <Text fontSize="sm" fontWeight="semibold">
                  No Returns Policy
                </Text>
              </Box>
              <Text fontSize="sm" color="gray.700" ml={2}>
                Due to the perishable nature of our products, all sales are
                final. We do not accept returns.
              </Text>
            </Box>

            <Box>
              <Box
                bg="#b7a495"
                color="white"
                px={4}
                borderRadius="full"
                display="inline-block"
                mb={1}
              >
                <Text fontSize="sm" fontWeight="semibold">
                  Quality Issue Handling
                </Text>
              </Box>
              <Text fontSize="sm" color="gray.700" ml={2}>
                If there is a verified issue with quality, contact us within 24
                hours of delivery. Exchanges may be offered at our discretion.
              </Text>
            </Box>

            <Box>
              <Box
                bg="#b7a495"
                color="white"
                px={4}
                borderRadius="full"
                display="inline-block"
                mb={1}
              >
                <Text fontSize="sm" fontWeight="semibold">
                  Shipping Damage
                </Text>
              </Box>
              <Text fontSize="sm" color="gray.700" ml={2}>
                Please inspect goods at pickup or delivery. Claims must be
                submitted with evidence within 24 hours.
              </Text>
            </Box>
          </VStack>
        </Box>

        {/* Disclaimer Section */}
        <Heading
          size="sm"
          fontWeight="bold"
          textAlign="right"
          mb={-2}
          mr={10}
          mt={12}
        >
          Disclaimer
        </Heading>
        <Box
          px={4}
          paddingTop={4}
          paddingBottom={10}
          m={4}
          borderRadius={24}
          bg="#f9f9f9"
        >
          <Box>
            <Text fontSize="sm" color="gray.700">
              Adams Foods provides meat products intended for commercial use. We
              do not guarantee product outcomes once items are outside of our
              handling, including storage and cooking methods. Customers are
              responsible for the proper use and storage of all products
              received.
            </Text>
          </Box>
        </Box>

        <Footer />
      </Container>
    </Sidebar>
  );
};

export default TermsAndPoliciesPage;
