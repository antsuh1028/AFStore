import React, { useRef } from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  IconButton,
  Text,
  VStack,
  Divider,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronLeft } from "lucide-react";
import NavDrawer from "../../components/NavDrawer";
import Sidebar from "../../components/SideBar";
import Breadcrumbs from "../../components/BreadCrumbs.";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

const FAQPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const contentRef = useRef(null);

  const faqData = [
    {
      heading: "Q. Delivery",
      textStart:
        "We offer free delivery within Los Angeles County for orders that meet our ",
      highlight: "$4,000",
      textEnd: " minimum.",
      noteBody:
        "If the minimum order is not met, we kindly ask that you pick up your order directly from our facility. This policy allows us to continue offering reliable wholesale pricing.\n\n",
      noteBold: "📍1805 Industrial St, Los Angeles, CA 90021",
    },
    {
      heading: "Q. Refund",
      highlight: "All meat purchases are final and non-refundable,",
      textEnd:
        " as we are confident in the safety and quality of our products.",
      noteBody:
        "If you have any questions or concerns about your order, feel free to reach out to us by phone or email we're happy to assist you.",
      noteBold: "•  (323)943-9318\n•  admin@adamsfoods.us",
    },
    {
      heading: "Q. Purchase",
      highlight: "We accept cash, checks, and credit cards.\n",
      noteBody:
        "However, please note:\n• Cash payments receive the highest discount.\n• Credit card payments are subject to additional tax.\n\nWe appreciate your understanding and are happy to assist with any further questions.",
    },
    {
      heading: "Q. Bulk Purchase",
      textStart: "For bulk purchases, please reach out to us through the",
      highlight: " 'Contact Us' page.",
    },
    {
      heading: "Q. Cash & Carry",
      textStart: "Cash payments and pick-up orders get",
      highlight: " 00% off.",
    },
    {
      heading: "Q. Allergy",
      text: "Please make sure to check for any allergies related to this meat.",
    },
  ];

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
        {/* Top nav */}
        <Navbar onOpen={onOpen} />

        {/* Breadcrumbs */}
        <Box py={3} px={4} display="flex" justifyContent="center">
          <Breadcrumbs
            listOfBreadCrumbs={[
              { label: "Home", url: "/" },
              { label: "Wholesale", url: "/wholesale" },
              { label: "FAQ", url: "/wholesale/faq" },
            ]}
          />
        </Box>

        {/* Page header */}
        <Box width="100%">
          <Box py={4} px={6} borderColor="gray.200" bg="white" mb={4}>
            <Heading as="h1" size="md" fontWeight="semibold" textAlign="center">
              FAQ
            </Heading>
          </Box>
          <Divider mt={2} borderColor="gray.200" />
        </Box>

        {/* FAQ content */}
        <VStack spacing={16} px={6} py={4} align="start">
          {faqData.map((item, index) => (
            <Box key={index}>
              <Heading size="md" my={6}>
                <Text as="span" color="tan">
                  {item.heading.split(" ")[0]}
                </Text>{" "}
                {item.heading.split(" ").slice(1).join(" ")}
              </Heading>

              {/* Highlighted $4,000 if present */}
              {item.text ? (
                <Text fontSize="sm" color="gray.700" whiteSpace="pre-line">
                  {item.text}
                </Text>
              ) : (
                <Text fontSize="sm" color="gray.700">
                  {item.textStart}
                  <Text fontSize="sm" as="span" color="tan" fontWeight="black">
                    {item.highlight}
                  </Text>
                  {item.textEnd}
                </Text>
              )}

              {item.noteBody && (
                <Text
                  fontSize="sm"
                  mt={1}
                  color="gray.700"
                  whiteSpace="pre-line"
                  marginTop={4}
                >
                  {item.noteBody}
                </Text>
              )}
              {item.noteBold && (
                <Text
                  fontSize="sm"
                  mt={4}
                  fontWeight="semibold"
                  whiteSpace="pre-line"
                >
                  {item.noteBold}
                </Text>
              )}
            </Box>
          ))}
        </VStack>

        <Footer />
      </Container>
    </Sidebar>
  );
};

export default FAQPage;
