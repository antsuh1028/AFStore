import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  useDisclosure,
  List,
  ListItem,
} from "@chakra-ui/react";
import { MdCircle } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import NavDrawer from "../components/NavDrawer";
import Footer from "../components/Footer";
import Sidebar from "../components/SideBar";
import Navbar from "../components/Navbar";
import { COLORS } from "../constants";

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
        boxShadow="xl"
        ml={{ base: 0, lg: "40%" }}
      >
        <Navbar onOpen={onOpen} home={true} />

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
          bg={COLORS.GRAY_LIGHT}
        >
          <VStack spacing={5} align="stretch">
            <Box>
              <Box
                bg={COLORS.PRIMARY}
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
                This agreement governs your use of the AdamsFoods Wholesale App.
                By using our services, you agree to these terms.
              </Text>
            </Box>

            <Box>
              <Box
                bg={COLORS.PRIMARY}
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
                bg={COLORS.PRIMARY}
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
                bg={COLORS.PRIMARY}
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
                bg={COLORS.PRIMARY}
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
                AdamsFoods is not liable for indirect damages, loss of revenue,
                or product misuse.
              </Text>
            </Box>

            <Box>
              <Box
                bg={COLORS.PRIMARY}
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
          bg={COLORS.GRAY_LIGHT}
        >
          <VStack spacing={5} align="stretch">
            <Box>
              <Box
                bg={COLORS.PRIMARY}
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
                  Business License
                </ListItem>
                <ListItem fontSize="sm" display="flex" alignItems="center">
                  <Box as="span" mr={2} fontSize="6px">
                    <MdCircle />
                  </Box>
                  California Resale Certificate
                </ListItem>
                <ListItem fontSize="sm" display="flex" alignItems="center">
                  <Box as="span" mr={2} fontSize="6px">
                    <MdCircle />
                  </Box>
                  Personal Real ID
                </ListItem>
                <ListItem fontSize="sm" display="flex" alignItems="center">
                  <Box as="span" mr={2} fontSize="6px">
                    <MdCircle />
                  </Box>
                  Company Address
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
                bg={COLORS.PRIMARY}
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
                bg={COLORS.PRIMARY}
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
                bg={COLORS.PRIMARY}
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
          bg={COLORS.GRAY_LIGHT}
        >
          <VStack spacing={5} align="stretch">
            <Box>
              <Box
                bg={COLORS.PRIMARY}
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
                bg={COLORS.PRIMARY}
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
                bg={COLORS.PRIMARY}
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

        {/* Payment Policy Section */}
        <Heading
          size="sm"
          fontWeight="bold"
          textAlign="right"
          mb={-2}
          mr={10}
          mt={12}
        >
          Payment Policy
        </Heading>
        <Box
          px={6}
          paddingTop={4}
          paddingBottom={10}
          m={4}
          borderRadius={24}
          bg={COLORS.GRAY_LIGHT}
        >
          <VStack spacing={5} align="stretch">
            <Box>
              <Box
                bg={COLORS.PRIMARY}
                color="white"
                px={4}
                borderRadius="full"
                display="inline-block"
                mb={1}
              >
                <Text fontSize="sm" fontWeight="semibold">
                  Payment Notice
                </Text>
              </Box>
              <Text fontSize="sm" color="gray.700" ml={2} mb={2}>
                Please note that a credit card processing fee may apply, which
                is the responsibility of the buyer.
              </Text>
              <Text fontSize="sm" color="gray.700" ml={2} mb={2}>
                Cash payments offer the best available discount.
              </Text>
              <Text fontSize="sm" color="gray.700" ml={2}>
                If a delivery address is incorrect and redelivery is required,
                additional charges may apply.
              </Text>
            </Box>

            <Box>
              <Text fontSize="sm" color="gray.700" ml={2}>
                Orders are not finalized until payment is received. Payment
                terms differ depending on order type and may change without
                notice. Please refer to the 'How to Order' section, which forms
                part of our Terms of Sale.
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
          px={6}
          paddingTop={4}
          paddingBottom={10}
          m={4}
          borderRadius={24}
          bg={COLORS.GRAY_LIGHT}
        >
          <VStack spacing={5} align="stretch">
            <Box>
              <Box
                bg={COLORS.PRIMARY}
                color="white"
                px={4}
                borderRadius="full"
                display="inline-block"
                mb={1}
              >
                <Text fontSize="sm" fontWeight="semibold">
                  Product Liability Notice
                </Text>
              </Box>
              <Text fontSize="sm" color="gray.700" ml={2} mb={2}>
                AdamsFoods takes all reasonable precautions to ensure food
                safety during storage, packaging, and transport. However, once
                products are picked up or delivered, the responsibility for
                proper handling, storage, and cooking transfers to the customer.
              </Text>
              <Text fontSize="sm" color="gray.700" ml={2} mb={2}>
                Our liability is limited to issues that arise from verified
                handling or processing faults before customer receipt.
              </Text>
              <Text fontSize="sm" color="gray.700" ml={2}>
                AdamsFoods maintains commercial product liability insurance in
                compliance with food safety regulations. However, this does not
                cover misuse, neglect, or improper storage by the customer.
              </Text>
            </Box>
          </VStack>
        </Box>

        {/* Security & Privacy Section */}
        <Heading
          size="sm"
          fontWeight="bold"
          textAlign="right"
          mb={-2}
          mr={10}
          mt={12}
        >
          Security & Privacy
        </Heading>
        <Box
          px={6}
          paddingTop={4}
          paddingBottom={10}
          m={4}
          borderRadius={24}
          bg={COLORS.GRAY_LIGHT}
        >
          <Box>
            <Text fontSize="sm" color="gray.700">
              AdamsFoods uses industry-standard secure payment systems such as
              Stripe and Square. Your personal and payment information is never
              shared with third parties, and is handled in strict compliance
              with privacy regulations.
            </Text>
          </Box>
        </Box>
        {/* Privacy & Image Rights Statement Section */}
        <Heading
          size="sm"
          fontWeight="bold"
          textAlign="right"
          mb={-2}
          mr={10}
          mt={12}
        >
          Image Rights & Copyright
        </Heading>
        <Box
          px={6}
          paddingTop={4}
          paddingBottom={10}
          m={4}
          borderRadius={24}
          bg={COLORS.GRAY_LIGHT}
        >
          <VStack spacing={5} align="stretch">
            <Text fontSize="sm" color="gray.700" ml={2}>
              All images, logos, and visual content on this platform are the
              exclusive property of AdamsFoods and its affiliated brands,
              including Meat Papa, Adams Gourmet Beef, and Yukbul. Unauthorized
              use, reproduction, or distribution of any visual materials without
              written consent is strictly prohibited.
            </Text>
          </VStack>
        </Box>

        <Footer />
      </Container>
    </Sidebar>
  );
};

export default TermsAndPoliciesPage;
