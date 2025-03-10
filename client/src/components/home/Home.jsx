// HomePage.jsx
import React from "react";
import {
  Box,
  Container,
  Image,
  Heading,
  Text,
  VStack,
  HStack,
  Flex,
  SimpleGrid,
  GridItem,
  Divider,
  Button,
  Center,
  Stack,
  Icon,
  Link,
} from "@chakra-ui/react";

import { Dot } from "lucide-react";

import FeatureGrid from "./FeatureGrid";
import HowItWorks from "./HowItWorks";

const HomePage = () => {
  return (
    <Box>
      {/* Hero Section with gray background */}
      <Box bg="gray.50" py={10} position="relative" h="60vh">
        <Container maxW="container.xl">
          <VStack spacing={6} align="center">
            <Image
              src="/MainLogo.png"
              alt="Adams Foods Logo"
              h={{ base: "60px", md: "80px" }}
              mb={4}
            />

            <Heading
              as="h1"
              fontSize={{ base: "3xl", md: "5xl" }}
              color="gray.700"
            >
              Wholesale
            </Heading>

            <HStack justify="center" pt={4} pb={8}>
              <Link href="#" fontWeight="medium">
                Pork
              </Link>
              <Dot size={24} color="currentColor" />
              <Link href="#" fontWeight="medium">
                Beef
              </Link>
              <Dot size={24} color="currentColor" />
              <Link href="#" fontWeight="medium">
                Poultry
              </Link>
            </HStack>
          </VStack>
        </Container>
      </Box>
      
      {/* Image positioned to overlap between sections */}
      <Box 
        position="relative" 
        zIndex="2"
        mt="-18vh" // Pull the image up to overlap with gray section
        textAlign="center"
      >
        <Image
          src="/MeatM.png"
          alt="Adams Foods Logo"
          h={{ base: "200px", sm:"300px", md: "400px" }}
          w={{ base: "200px", sm:"300px", md: "400px" }}
          display="inline-block"
          borderRadius="100%"
        />
      </Box>
      
      {/* Why AdamsFoods Section */}
      <Box py={12} mt="-150px" pt="200px" bg="white">
        <Container maxW="container.lg">
          <VStack spacing={8} align="center">
            <Heading as="h2" size="xl" color="blue.600">
              Why AdamsFoods?
            </Heading>

            <Text textAlign="center" maxW="800px" fontSize="lg">
              Founded in 2002, AdamsFoods continues to live by our to serve the
              needs of every single customer by providing the highest quality
              products and services. Featured USDA inspected establishments.
            </Text>

            <FeatureGrid />

            {/* How It Works Section */}
            <HowItWorks />
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;