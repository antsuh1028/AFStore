import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  useDisclosure,
  Link,
  List,
  ListItem,
  Divider,
} from "@chakra-ui/react";
import { MdCircle } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import NavDrawer from "../components/NavDrawer";
import Footer from "../components/Footer";
import Sidebar from "../components/SideBar";
import Navbar from "../components/Navbar";
import { COLORS } from "../constants";
import { ViewContainer } from "../components/ViewContainer";

const TermsAndPoliciesPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const contentRef = React.useRef(null);

  return (
    <Sidebar>
      <NavDrawer isOpen={isOpen} onClose={onClose} containerRef={contentRef} />

      <ViewContainer contentRef={contentRef}>
        <Navbar onOpen={onOpen} home={true} />

        {/* Header */}
        <Box px={4} py={6} textAlign="center">
          <Heading as="h1" size="lg" fontWeight="bold">
            Terms & Policies
          </Heading>
        </Box>

        <Box px={4} pb={8}>
          {/* Terms of Service */}
          <Box mb={8}>
            <Heading
              size="sm"
              fontWeight="extrabold"
              mb={2}
              mr={4}
              textAlign="right"
            >
              Terms of Service
            </Heading>

            <VStack
              spacing={6}
              align="stretch"
              bg={COLORS.GRAY_LIGHT}
              p={4}
              borderRadius="3xl"
              pb={8}
            >
              <Box>
                <Box
                  bg={COLORS.PRIMARY}
                  color="white"
                  px={3}
                  borderRadius="full"
                  display="inline-block"
                  mb={2}
                >
                  <Text fontSize="sm" fontWeight="bold">
                    Purpose
                  </Text>
                </Box>
                <Text fontSize="sm" color="gray.700">
                  This agreement governs your use of the AdamsFoods Wholesale
                  App. By using our services, you agree to these terms.
                </Text>
              </Box>

              <Box>
                <Box
                  bg={COLORS.PRIMARY}
                  color="white"
                  px={3}
                  borderRadius="full"
                  display="inline-block"
                  mb={2}
                >
                  <Text fontSize="sm" fontWeight="bold">
                    Eligibility & Licensing
                  </Text>
                </Box>
                <Text fontSize="sm" color="gray.700">
                  Our platform is only available to verified businesses with a
                  valid Business License and California Resale Certificate. We
                  reserve the right to verify or deny access.{" "}
                </Text>
              </Box>

              <Box>
                <Box
                  bg={COLORS.PRIMARY}
                  color="white"
                  px={3}
                  borderRadius="full"
                  display="inline-block"
                  mb={2}
                >
                  <Text fontSize="sm" fontWeight="bold">
                    Ordering & Payments
                  </Text>
                </Box>
                <Text fontSize="sm" color="gray.700">
                  Orders are received via the platform and processed by cash or
                  credit card (excluding Amex), or other agreed methods.
                </Text>
              </Box>

              <Box>
                <Box
                  bg={COLORS.PRIMARY}
                  color="white"
                  px={3}
                  borderRadius="full"
                  display="inline-block"
                  mb={2}
                >
                  <Text fontSize="sm" fontWeight="bold">
                    Modification Clause
                  </Text>
                </Box>
                <Text fontSize="sm" color="gray.700">
                  We may update these terms at any time. Continued use of the
                  platform means acceptance of the changes.
                </Text>
              </Box>

              <Box>
                <Box
                  bg={COLORS.PRIMARY}
                  color="white"
                  px={3}
                  borderRadius="full"
                  display="inline-block"
                  mb={2}
                >
                  <Text fontSize="sm" fontWeight="bold">
                    Limitation of Liability
                  </Text>
                </Box>
                <Text fontSize="sm" color="gray.700">
                  AdamsFoods is not liable for indirect damages, loss of
                  revenue, or product misuse.
                </Text>
              </Box>

              <Box>
                <Box
                  bg={COLORS.PRIMARY}
                  color="white"
                  px={3}
                  borderRadius="full"
                  display="inline-block"
                  mb={2}
                >
                  <Text fontSize="sm" fontWeight="bold">
                    Governing Law & Jurisdiction
                  </Text>
                </Box>
                <Text fontSize="sm" color="gray.700">
                  These Terms are governed by the laws of the State of
                  California. Any dispute shall be resolved exclusively in the
                  Superior Court of Los Angeles County, unless otherwise
                  mutually agreed in writing.
                </Text>
              </Box>
              <Box>
                <Box
                  bg={COLORS.PRIMARY}
                  color="white"
                  px={3}
                  borderRadius="full"
                  display="inline-block"
                  mb={2}
                >
                  <Text fontSize="sm" fontWeight="bold">
                    Force Majeure
                  </Text>
                </Box>
                <Text fontSize="sm" color="gray.700">
                  We are not liable for any delay or failure in performance due
                  to causes beyond our reasonable control, including but not
                  limited to acts of God, labor disputes, transportation
                  disruptions, epidemics, or governmental actions.
                </Text>
              </Box>
              <Box>
                <Box
                  bg={COLORS.PRIMARY}
                  color="white"
                  px={3}
                  borderRadius="full"
                  display="inline-block"
                  mb={2}
                >
                  <Text fontSize="sm" fontWeight="bold">
                    Indemnification
                  </Text>
                </Box>
                <Text fontSize="sm" color="gray.700">
                  You agree to indemnify, defend, and hold harmless AdamsFoods,
                  its affiliates, and employees from and against any claims,
                  damages, liabilities, and expenses arising from your misuse of
                  the products, violation of these Terms, or breach of
                  applicable laws.
                </Text>
              </Box>
              <Box>
                <Box
                  bg={COLORS.PRIMARY}
                  color="white"
                  px={3}
                  borderRadius="full"
                  display="inline-block"
                  mb={2}
                >
                  <Text fontSize="sm" fontWeight="bold">
                    Entire Agreement & Severability
                  </Text>
                </Box>
                <Text fontSize="sm" color="gray.700">
                  These Terms constitute the entire agreement between you and
                  AdamsFoods. If any provision is found invalid, the remaining
                  provisions shall remain in full force and effect.
                </Text>
              </Box>
              <Box>
                <Box
                  bg={COLORS.PRIMARY}
                  color="white"
                  px={3}
                  borderRadius="full"
                  display="inline-block"
                  mb={2}
                >
                  <Text fontSize="sm" fontWeight="bold">
                    Dispute Resolution and Arbitration
                  </Text>
                </Box>
                <Text fontSize="sm" color="gray.700">
                  Any dispute, claim, or controversy arising out of or relating
                  to these Terms, or the breach, termination, enforcement,
                  interpretation, or validity thereof, including the
                  determination of the scope or applicability of this agreement
                  to arbitrate, shall be resolved by binding arbitration
                  administered by the American Arbitration Association (AAA)
                  under its Commercial Arbitration Rules.
                </Text>
                <Text fontSize="sm" color="gray.700" my={4}>
                  The arbitration shall be conducted in Los Angeles, California.
                </Text>
                <Text fontSize="sm" color="gray.700" my={4}>
                  By agreeing to these Terms, you and the Company waive any
                  right to a trial by jury or to participate in a class action.
                </Text>
                <Text fontSize="sm" color="gray.700" my={4}>
                  This arbitration agreement shall survive termination of these
                  Terms.
                </Text>
              </Box>
            </VStack>
          </Box>

          <Divider my={8} />

          {/* Privacy Policy */}
          <Box mb={8}>
            <Heading
              size="sm"
              fontWeight="bold"
              mb={2}
              mr={4}
              textAlign="right"
            >
              Privacy Policy
            </Heading>
            <Box
              bg={COLORS.GRAY_LIGHT}
              p={4}
              borderRadius="3xl"
              cursor="pointer"
            >
              <Text
                fontSize="sm"
                textDecor="underline"
                textAlign="center"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = "/AdamsFoods_Privacy_Policy.pdf";
                  link.download = "AdamsFoods_Privacy_Policy.pdf";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                _hover={{ color: COLORS.SECONDARY }}
              >
                See our Privacy Policy for full details_Download
              </Text>
            </Box>
          </Box>

          <Divider my={8} />

          {/* Return & Refund Policy */}
          <Box mb={8}>
            <Heading
              size="sm"
              fontWeight="bold"
              mb={2}
              mr={4}
              textAlign="right"
            >
              Return & Refund Policy
            </Heading>

            <VStack
              spacing={6}
              align="stretch"
              bg={COLORS.GRAY_LIGHT}
              p={4}
              borderRadius="3xl"
              pb={8}
            >
              <Box>
                <Box
                  bg={COLORS.PRIMARY}
                  color="white"
                  px={3}
                  borderRadius="full"
                  display="inline-block"
                  mb={2}
                >
                  <Text fontSize="sm" fontWeight="bold">
                    No Returns Policy
                  </Text>
                </Box>
                <Text fontSize="sm" color="gray.700">
                  Due to the perishable nature of our products, all sales are
                  final. We do not accept returns. However, verified quality
                  issues reported within 24 hours of delivery may be eligible
                  for exchange or credit at our discretion.
                </Text>
              </Box>

              <Box>
                <Box
                  bg={COLORS.PRIMARY}
                  color="white"
                  px={3}
                  borderRadius="full"
                  display="inline-block"
                  mb={2}
                >
                  <Text fontSize="sm" fontWeight="bold">
                    Quality Issue Handling
                  </Text>
                </Box>
                <Text fontSize="sm" color="gray.700">
                  If there is a verified issue with quality, contact us within
                  24 hours of delivery. Exchanges may be offered at our
                  discretion.
                </Text>
              </Box>

              <Box>
                <Box
                  bg={COLORS.PRIMARY}
                  color="white"
                  px={3}
                  borderRadius="full"
                  display="inline-block"
                  mb={2}
                >
                  <Text fontSize="sm" fontWeight="bold">
                    Shipping Damage
                  </Text>
                </Box>
                <Text fontSize="sm" color="gray.700">
                  Please inspect goods at pickup or delivery. Claims must be
                  submitted with evidence within 24 hours.
                </Text>
              </Box>
              <Box>
                <Box
                  bg={COLORS.PRIMARY}
                  color="white"
                  px={3}
                  borderRadius="full"
                  display="inline-block"
                  mb={2}
                >
                  <Text fontSize="sm" fontWeight="bold">
                    Claims Procedure
                  </Text>
                </Box>
                <Text fontSize="sm" color="gray.700">
                  To request an exchange or credit for a verified quality issue,
                  you must submit photographic evidence and a detailed
                  description within 24 hrs of receipt. Claims submitted after
                  this period will not be accepted.
                </Text>
              </Box>
              <Box>
                <Box
                  bg={COLORS.PRIMARY}
                  color="white"
                  px={3}
                  borderRadius="full"
                  display="inline-block"
                  mb={2}
                >
                  <Text fontSize="sm" fontWeight="bold">
                    Partial Credit
                  </Text>
                </Box>
                <Text fontSize="sm" color="gray.700">
                  For verified defects affecting only part of the shipment, a
                  pro-rated credit may be issued instead of a full replacement.
                </Text>
              </Box>
            </VStack>
          </Box>

          <Divider my={8} />

          {/* Payment Policy */}
          <Box mb={8}>
            <Heading
              size="sm"
              fontWeight="bold"
              mb={2}
              mr={4}
              textAlign="right"
            >
              Payment Policy
            </Heading>

            <VStack
              spacing={6}
              align="stretch"
              bg={COLORS.GRAY_LIGHT}
              p={4}
              borderRadius="3xl"
              pb={8}
            >
              <Box>
                <Box
                  bg={COLORS.PRIMARY}
                  color="white"
                  px={3}
                  borderRadius="full"
                  display="inline-block"
                  mb={2}
                >
                  <Text fontSize="sm" fontWeight="bold">
                    Payment Notice
                  </Text>
                </Box>
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" color="gray.700">
                    Please note that a credit card processing fee may apply,
                    which is the responsibility of the buyer. Cash payments
                    offer the best available discount. If a delivery address is
                    incorrect and redelivery is required, additional charges may
                    apply.
                  </Text>
                </VStack>
              </Box>

              <Box>
                <Text fontSize="sm" color="gray.700">
                  Orders are not finalized until payment is received. Payment
                  terms differ depending on order type and may change without
                  notice. Please refer to the 'How to Order' section, which
                  forms part of our Terms of Sale.
                </Text>
              </Box>

              <Box>
                <Box
                  bg={COLORS.PRIMARY}
                  color="white"
                  px={3}
                  borderRadius="full"
                  display="inline-block"
                  mb={2}
                >
                  <Text fontSize="sm" fontWeight="bold">
                    Chargeback Policy
                  </Text>
                </Box>
                <Text fontSize="sm" color="gray.700">
                  Unauthorized or fraudulent chargebacks will be disputed.
                  Accounts may be suspended, and legal action may be taken to
                  recover the disputed amount.
                </Text>
              </Box>

              <Box>
                <Box
                  bg={COLORS.PRIMARY}
                  color="white"
                  px={3}
                  borderRadius="full"
                  display="inline-block"
                  mb={2}
                >
                  <Text fontSize="sm" fontWeight="bold">
                    Late Payment
                  </Text>
                </Box>
                <Text fontSize="sm" color="gray.700">
                  Unpaid balances may accrue interest at a rate of 1.5% per
                  month or the maximum allowed by law, whichever is lower.
                </Text>
              </Box>
            </VStack>
          </Box>

          <Divider my={8} />

          {/* Disclaimer */}
          <Box mb={8}>
            <Heading
              size="sm"
              fontWeight="bold"
              mb={2}
              mr={4}
              textAlign="right"
            >
              Disclaimer
            </Heading>

            <VStack
              spacing={6}
              align="stretch"
              bg={COLORS.GRAY_LIGHT}
              p={4}
              borderRadius="3xl"
              pb={8}
            >
              <Box>
                <Box
                  bg={COLORS.PRIMARY}
                  color="white"
                  px={3}
                  borderRadius="full"
                  display="inline-block"
                  mb={2}
                >
                  <Text fontSize="sm" fontWeight="bold">
                    Product Liability Notice
                  </Text>
                </Box>
                <Text fontSize="sm" color="gray.700" mb={4}>
                  AdamsFoods takes all reasonable precautions to ensure food
                  safety during storage, packaging, and transport. However, once
                  products are picked up or delivered, the responsibility for
                  proper handling, storage, and cooking transfers to the
                  customer.
                </Text>
                <Text fontSize="sm" color="gray.700" my={4}>
                  Our liability is limited to issues that arise from verified
                  handling or processing faults before customer receipt.
                </Text>
                <Text fontSize="sm" color="gray.700" my={4}>
                  AdamsFoods maintains commercial product liability insurance in
                  compliance with food safety regulations. However, this does
                  not cover misuse, neglect, or improper storage by the
                  customer.
                </Text>
              </Box>
            </VStack>
          </Box>
          <Box mb={8}>
            <Heading
              size="sm"
              fontWeight="bold"
              mb={2}
              mr={4}
              textAlign="right"
            >
              Security & Privacy
            </Heading>

            <VStack
              spacing={6}
              align="stretch"
              bg={COLORS.GRAY_LIGHT}
              p={4}
              borderRadius="3xl"
              pb={8}
            >
              <Box>
                <Text fontSize="sm" color="gray.700" mb={4}>
                  AdamsFoods uses industry-standard secure payment systems such
                  as Stripe and Square. Your personal and payment information is
                  never shared with third parties, and is handled in strict
                  compliance with privacy regulations.
                </Text>
              </Box>
            </VStack>
          </Box>
        </Box>

        <Footer />
      </ViewContainer>
    </Sidebar>
  );
};

export default TermsAndPoliciesPage;
