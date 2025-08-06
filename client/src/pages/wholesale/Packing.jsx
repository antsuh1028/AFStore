import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  Box,
  Container,
  Heading,
  Image,
  Text,
  VStack,
  Divider,
  Grid,
  GridItem,
  useDisclosure,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import NavDrawer from "../../components/NavDrawer";
import Sidebar from "../../components/SideBar";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import Breadcrumbs from "../../components/Breadcrumbs";

const PackingPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);

  const criticalImages = useMemo(() => [
    "/images/packing1.jpg",
    "/images/packing2.jpg",
    "/images/packing3.jpg",
    "/images/packing_pg_1.jpg",
    "/images/packing_pg_2.jpg",
    "/images/meat_browning_1.jpg",
    "/images/meat_browning_2.jpg"
  ], []);

  const preloadImages = async (imageUrls) => {
    const preloadPromises = imageUrls.map((url) => {
      return new Promise((resolve) => {
        const img = document.createElement('img');
        img.onload = () => resolve({ url, success: true });
        img.onerror = () => resolve({ url, success: false });
        img.src = url;
      });
    });

    return Promise.allSettled(preloadPromises);
  };

  useEffect(() => {
    const initializePage = async () => {
      const imagePreloading = preloadImages(criticalImages);
      
      const [, imageResults] = await Promise.all([
        new Promise(resolve => setTimeout(resolve, 200)),
        imagePreloading
      ]);

      setImagesPreloaded(true);
      setPageLoading(false);
    };

    initializePage();
  }, [criticalImages]);

  const OptimizedImage = ({ src, alt, ...props }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageSrc, setImageSrc] = useState(src);

    useEffect(() => {
      if (imagesPreloaded && criticalImages.includes(src)) {
        setImageLoaded(true);
        return;
      }

      const img = document.createElement('img');
      img.onload = () => {
        setImageSrc(src);
        setImageLoaded(true);
      };
      img.onerror = () => {
        setImageLoaded(true);
      };
      img.src = src;
    }, [src, imagesPreloaded]);

    return (
      <Image
        {...props}
        src={imageSrc}
        alt={alt}
        opacity={imageLoaded ? 1 : 0.7}
        transition="opacity 0.3s ease"
        onLoad={() => setImageLoaded(true)}
      />
    );
  };

  const sectionData = [
    {
      heading: "Vacuum Packaging",
      text: "Our vacuum packaging removes air to prevent oxidation, extending freshness and shelf life while maintaining flavor and texture.",
      images: ["/images/packing1.jpg", "/images/packing2.jpg"],
    },
    {
      heading: "Specialized Packaging for Safety",
      text: "We invest in advanced packaging to preserve freshness, extend shelf life, and ensure safety, while preventing contamination and maintaining quality during storage and transport.",
      images: ["/images/packing2.jpg", "/images/packing3.jpg"],
    },
    {
      heading: "Meat Browning",
      text: "The browning happens because myoglobin in the meat doesn't bind with oxygen. Once exposed to air, the meat will return to a reddish color within 15 to 30 minutes.",
      note: "This is a natural process, and the meat is safe.",
      images: ["/images/meat_browning_1.jpg", "/images/meat_browning_2.jpg"],
    },
  ];

  if (pageLoading) {
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
          <Center h="100vh">
            <VStack spacing={4}>
              <Spinner size="lg" color="gray.500" thickness="3px" />
              <Text fontSize="sm" color="gray.500">
                {imagesPreloaded ? "Almost ready..." : "Loading..."}
              </Text>
            </VStack>
          </Center>
        </Container>
      </Sidebar>
    );
  }

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
                {section.images.map((src, i) => (
                  <GridItem key={i}>
                    <OptimizedImage
                      src={src}
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
                  <OptimizedImage
                    src="/images/packing_pg_1.jpg"
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
                  <OptimizedImage
                    src="/images/packing_pg_2.jpg"
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