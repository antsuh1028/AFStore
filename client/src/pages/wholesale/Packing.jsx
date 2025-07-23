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
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { ChevronLeft } from "lucide-react";
import NavDrawer from "../../components/NavDrawer";
import Sidebar from "../../components/SideBar";
import Breadcrumbs from "../../components/Breadcrumbs";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

const PackingPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const contentRef = useRef(null);

  const sectionData = [
    {
      heading: "40°F Full Cold Chain",
      text: "From production to delivery, we strictly control the temperature to stay at or below 6°C at all times, preserving the freshness, quality, and safety of our meat products.",
      images: [
        { avif: "../../images/thermometer.avif", jpg: "../../images/thermometer.jpg" },
        { avif: "../../images/packing1.avif", jpg: "../../images/packing1.jpg" },
      ],
    },
    {
      heading: "Specialized Packaging for Safety",
      text: "We invest in advanced packaging to preserve freshness, extend shelf life, and ensure safety, while preventing contamination and maintaining quality during storage and transport.",
      images: [
        { avif: "../../images/packing2.avif", jpg: "../../images/packing2.jpg" },
        { avif: "../../images/packing3.avif", jpg: "../../images/packing3.jpg" },
      ],
    },
    {
      heading: "Meat Browning",
      text: "The browning happens because myoglobin in the meat doesn't bind with oxygen. Once exposed to air, the meat will return to a reddish color within 15 to 30 minutes.",
      note: "This is a natural process, and the meat is safe.",
      images: [
        { avif: "../../images/meat_browning_1.avif", jpg: "../../images/meat_browning_1.jpg" },
        { avif: "../../images/meat_browning_2.avif", jpg: "../../images/meat_browning_2.jpg" },
      ],
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
        <Navbar onOpen={onOpen} />

        <Box py={3} px={4} display="flex" justifyContent="center">
          <Breadcrumbs
            listOfBreadCrumbs={[
              { label: "Home", url: "/" },
              { label: "Wholesale", url: "/" },
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

        <VStack spacing={8} px={8} py={4} align="start">
          {sectionData.map((section, index) => (
            <Box key={index}>
              <Heading size="md" mb={2}>
                {section.heading}
              </Heading>
              <Text fontSize="sm" color="gray.700">
                {section.text}
              </Text>
              {section.note && (
                <Text fontSize="sm" mt={2} color="#CA3836">
                  {section.note}
                </Text>
              )}
              <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={4}>
                {section.images.map((imageSet, i) => (
                  <GridItem key={i}>
                    <Image
                      src={imageSet.avif}
                      fallbackSrc={imageSet.jpg}
                      alt={`${section.heading} image ${i + 1}`}
                      borderRadius="md"
                      width="100%"
                      height="120px"
                      objectFit="cover"
                    />
                  </GridItem>
                ))}
              </Grid>
            </Box>
          ))}

          {/* Why We Use 20lb and 30lb Boxes Section */}
          <Box width="100%" mt={8}>
            <Heading size="md" mb={4}>
              Why We Use 20lb and 30lb Boxes
            </Heading>

            <Text fontSize="sm" color="gray.700" mb={4}>
              At AdamsFoods, our packaging is designed with customer convenience
              in mind.
            </Text>

            <VStack spacing={4} align="start">
              <Text fontSize="sm" color="gray.700">
                Marinated meats are packed in 30lb boxes, while raw or trimmed
                cuts are offered in 20lb sizes. These optimal weights chosen to
                make handling easier and safer.
              </Text>

              <Text fontSize="sm" color="gray.700">
                By offering both product type and ease of transport, we help
                reduce strain on your back and improve safety when handling our
                products.
              </Text>
            </VStack>

            <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={6} mb={4}>
              <GridItem>
                <Box textAlign="center">
                  <Image
                    src="/images/packing_pg_1.avif"
                    fallbackSrc="/images/packing_pg_1.jpg"
                    alt="20lb box"
                    borderRadius="md"
                    width="100%"
                    height="120px"
                    objectFit="cover"
                    mb={2}
                  />
                </Box>
              </GridItem>
              <GridItem>
                <Box textAlign="center">
                  <Image
                    src="/images/packing_pg_2.avif"
                    fallbackSrc="/images/packing_pg_2.jpg"
                    alt="30lb box"
                    borderRadius="md"
                    width="100%"
                    height="120px"
                    objectFit="cover"
                    mb={2}
                  />
                </Box>
              </GridItem>
            </Grid>
          </Box>
        </VStack>

        <Footer />
      </Container>
    </Sidebar>
  );
};

export default PackingPage;