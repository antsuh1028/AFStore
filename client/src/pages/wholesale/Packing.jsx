import React, { useRef } from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  IconButton,
  Text,
  VStack,
  Image,
  Stack,
  Divider,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronLeft } from "lucide-react";
import NavDrawer from "../../components/NavDrawer";
import Sidebar from "../../components/SideBar";
import Breadcrumbs from "../../components/BreadCrumbs.";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

const PackingPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const contentRef = useRef(null);

  const sectionData = [
    {
      heading: "40°F Full Cold Chain",
      text: "From production to delivery, we strictly control the temperature to stay at or below 6°C at all times, preserving the freshness, quality, and safety of our meat products.",
    },
    {
      heading: "Specialized Packaging for Safety",
      text: "We invest in advanced packaging to preserve freshness, extend shelf life, and ensure safety, while preventing contamination and maintaining quality during storage and transport.",
    },
    {
      heading: "Meat Browning",
      text: "The browning happens because myoglobin in the meat doesn't bind with oxygen. Once exposed to air, the meat will return to a reddish color within 15 to 30 minutes.",
      note: "This is a natural process, and the meat is safe.",
    },
  ];

  const imageUrls = ["/images/packing1.jpg", "/images/packing2.jpg"];

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

        <Box py={3} px={4} display="flex" justifyContent="center">
          <Breadcrumbs
            listOfBreadCrumbs={[
              { label: "Home", url: "/" },
              { label: "Wholesale", url: "/wholesale" },
              { label: "Packing", url: "/wholesale/packing" },
            ]}
          />
        </Box>

        <Box width="100%">
          {/* Header Section */}
          <Box py={4} px={6} borderColor="gray.200" bg="white" mb={4}>
            <Heading as="h1" size="md" fontWeight="semibold" textAlign="center">
              Packing
            </Heading>
          </Box>
          <Divider mt={2} borderColor="gray.200" />
        </Box>

        <VStack spacing={8} px={6} py={4} align="start">
          {sectionData.map((section, index) => (
            <Box key={index}>
              <Heading size="md" mb={2}>
                {section.heading}
              </Heading>
              <Text fontSize="sm" color="gray.700">
                {section.text}
              </Text>
              {section.note && (
                <Text fontSize="sm" mt={2} color="orange.400">
                  {section.note}
                </Text>
              )}
              <Stack direction="row" spacing={4} mt={4}>
                {imageUrls.map((src, i) => (
                  <Image
                    key={i}
                    // src={src}
                    src="../../gray.avif"
                    alt={`Packing image ${i + 1}`}
                    borderRadius="md"
                    boxSize="120px"
                    objectFit="cover"
                    width="50%"
                  />
                ))}
              </Stack>
            </Box>
          ))}
        </VStack>

        <Footer />
      </Container>
    </Sidebar>
  );
};

export default PackingPage;
