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
  Image,
} from "@chakra-ui/react";
import { ChevronLeft } from "lucide-react";
import NavDrawer from "../../components/NavDrawer";
import Sidebar from "../../components/SideBar";
import Breadcrumbs from "../../components/Breadcrumbs";
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
      highlight: "$3,000",
      textEnd: " minimum.",
      noteBody:
        "If the minimum order is not met, you may either pick it up from our facility or pay a delivery fee. This policy enables us to maintain reliable, high-quality service at competitive wholesale prices.\n\n",
      noteBold: (
        <Box display="flex" alignItems="center" gap={2}>
          <Image
            src="../../Final_pic/only here.png"
            h="20px"
            alt="Adams Logo"
            filter="grayscale(100%)"
          />
          <Text>1805 Industrial St, Los Angeles, CA 90021</Text>
        </Box>
      ),
    },
    {
      heading: "Q. Refund",
      highlight: "All meat purchases are final and non-refundable,",
      textEnd:
        " as we are confident in the safety and quality of our products.",
      noteBody:
        "However, exchanges are possible if there is an issue with the product. For pick-up orders, both parties will inspect the meat together before handing it over. Therefore, refunds are not possible after this point. \n\nIf you receive the meat via delivery and find a problem, please contact us within 24 hours. If you have any questions or concerns, please feel free to contact us. We are happy to assist you.",
      noteBold: `• ${"\u00A0\u00A0"}(323)943-9318\n•  ${"\u00A0\u00A0"}admin@adamsfoods.us`,
    },
    {
      heading: "Q. Purchase",
      highlight: "We accept Cash, Credit Card Only. (Excluding AMEX) \n",
      noteBody: `However, please note:\n•${"\u00A0\u00A0"}Cash payments receive the highest discount.\n•${"\u00A0\u00A0"}A sales tax will be added for card payments.\n\nWe appreciate your understanding and are happy to assist with any further questions.`,
    },
    {
      heading: "Q. Bulk Purchase",
      textStart: "For bulk purchases, please reach out to us through the",
      highlight: " 'Contact Us' page.",
      noteBody: (
        <Text>
          {"\u00A0\u00A0"}•{"\u00A0\u00A0"}Discounts are available for bulk
          orders over{" "}
          <Text as="span" color="#CA3836" fontWeight="semibold">
            $3,000
          </Text>
          . For inquiries, please contact us directly
        </Text>
      ),
    },
    {
      heading: "Q. Cash & Carry",
      textStart: "Get ",
      highlight: "extra meat",
      textEnd: " when you pay with cash and pick up!",
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
        boxShadow="xl"
        ml={{ base: 0, lg: "40%" }}
      >
        {/* Top nav */}
        <Navbar onOpen={onOpen} />

        {/* Breadcrumbs */}
        <Box py={3} px={4} display="flex" justifyContent="center">
          <Breadcrumbs
            listOfBreadCrumbs={[
              { label: "Home", url: "/" },
              { label: "Wholesale", url: "/" },
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
        <VStack spacing={8} px={8} py={4} align="start">
          {faqData.map((item, index) => (
            <Box key={index}>
              <Heading size="md" my={6}>
                <Text as="span" color="#CA3836">
                  {item.heading.split(" ")[0]}
                </Text>{" "}
                {item.heading.split(" ").slice(1).join(" ")}
              </Heading>

              {/* Highlighted text if present */}
              {item.text ? (
                <Text fontSize="sm" color="gray.700" whiteSpace="pre-line">
                  {item.text}
                </Text>
              ) : (
                <Text fontSize="sm" color="gray.700">
                  {item.textStart}
                  <Text
                    fontSize="sm"
                    as="span"
                    color="#CA3836"
                    fontWeight="semibold"
                  >
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
                <Box
                  fontSize="sm"
                  mt={4}
                  fontWeight="semibold"
                  whiteSpace="pre-line"
                >
                  {typeof item.noteBold === "string" ? (
                    <Text>{item.noteBold}</Text>
                  ) : (
                    item.noteBold
                  )}
                </Box>
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
