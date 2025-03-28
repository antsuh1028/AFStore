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

  Link,
} from "@chakra-ui/react";

import FeatureGrid from "../components/home/FeatureGrid";
import HowItWorks from "../components/home/HowItWorks";
import AFCompany from "../components/home/AFCompany";
import Footer from "../components/Footer";
import Contact from "./Contact.jsx"
import FAQPage from "./wholesale/Faq.jsx";
import { FaQ } from "react-icons/fa6";

const HomePage = () => {
  const fontFace2 = {
    "@font-face": {
      fontFamily: "HSBomBaram",
      src: `url('../fonts/HSBomBaram 2.0 Regular.ttf') format('truetype')`,
      fontWeight: "100",
      fontStyle: "normal",
    },
  };
  const fontFace = {
    "@font-face": {
      fontFamily: "Million Asteroids",
      src: `url('../fonts/times.ttf') format('truetype')`,
      fontWeight: "100",
      fontStyle: "normal",
    },
  };
  return (
    <Box>
      {/* Hero Section with gray background */}
      <Box>
        <Box
          bg="gray.50"
          py={10}
          position="relative"
          h={{ base: "70vh", md: "80vh", lg: "80vh" }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          pt={{ base: "35%", sm: "70px", md: "80px" }} // Offset for navbar height
        >
          {/* Mobile Layout (shows on small screens) */}
          <Container
            display={{ base: "block", lg: "none" }}
            maxW="container.xl"
            position="relative"
            mt={4}
          >
            <VStack spacing={6} align="center" width="100%">
              <Image
                src="/MainLogo.png"
                alt="Adams Foods Logo"
                h={{ base: "40px", sm: "80px" }}
                mt={4}
              />

              <Box position="relative" width="100%" textAlign="center">
                <VStack spacing={0} align="center">
                  <Flex justifyContent="center" alignItems="baseline">
                    <Text
                      as="span"
                      fontSize={{ base: "50px", sm: "70px" }}
                      fontFamily="Times"
                      fontWeight="bold"
                      color="gray.700"
                      sx={fontFace}
                      lineHeight="1"
                    >
                      WHOLESALE
                    </Text>
                  </Flex>

                  <Text
                    fontSize={{ base: "2xs", sm: "xs" }}
                    fontStyle="italic"
                    color="gray.500"
                    mt={{ base: "-3px", sm: "-3px" }}
                    px={4}
                    maxW="100%"
                  >
                    "Envision the future with endless possibility and constant
                    devotion"
                  </Text>
                </VStack>
              </Box>

              {/* Navigation Links */}
              <HStack spacing={3} width="100%" justifyContent="center">
                <Link
                  href="#"
                  fontWeight="bold"
                  fontSize={{ base: "lg", sm: "xl" }}
                  fontFamily="Times New Roman"
                  color="black"
                >
                  Pork
                </Link>
                <Text fontSize={{ base: "lg", sm: "xl" }} color="black">
                  •
                </Text>
                <Link
                  href="#"
                  fontWeight="bold"
                  fontSize={{ base: "lg", sm: "xl" }}
                  fontFamily="Times New Roman"
                  color="black"
                >
                  Beef
                </Link>
                <Text fontSize={{ base: "lg", sm: "xl" }} color="black">
                  •
                </Text>
                <Link
                  href="#"
                  fontWeight="bold"
                  fontSize={{ base: "lg", sm: "xl" }}
                  fontFamily="Times New Roman"
                  color="black"
                >
                  Poultry
                </Link>
              </HStack>

              {/* Shop Now button */}
              <Box
                position="relative"
                width="100%"
                textAlign="right"
                pr={6}
                mt={-4}
                mb={4}
              >
                <Link
                  href="#"
                  display="inline-flex"
                  alignItems="center"
                  fontWeight="medium"
                  textDecoration="underline"
                  fontSize={{ base: "md", sm: "lg" }}
                >
                  Shop Now <span style={{ marginLeft: "4px" }}>→</span>
                </Link>
              </Box>

              {/* Central Image */}
              <Box position="relative" width="100%" textAlign="center">
                <Image
                  src="MeatM.png"
                  alt="Meat plate"
                  width={{ base: "260px", sm: "280px" }}
                  height={{ base: "260px", sm: "280px" }}
                  borderRadius="full"
                  mx="auto"
                />
              </Box>
            </VStack>
          </Container>

          {/* Desktop Layout */}
          <Container
            display={{ base: "none", lg: "block" }}
            maxW="container.xl"
            position="relative"
            pt={16}
          >
            <VStack>
              <Box
                position="absolute"
                top="-350%"
                width="100%"
                textAlign="center"
              >
                <VStack align="center">
                  <Text
                    as="span"
                    fontSize="110px"
                    fontFamily="Times"
                    color="gray.700"
                    sx={fontFace}
                  >
                    WHOLESALE
                  </Text>
                  <Text
                    mt="-10"
                    ml="48"
                    fontSize="sm"
                    fontStyle="italic"
                    color="gray.500"
                  >
                    "Envision the future with endless possibility and constant
                    devotion"
                  </Text>
                </VStack>
              </Box>

              {/* Image + Navigation */}
              <Flex width="60%">
                <Box
                  position="absolute"
                  left="50%"
                  top="-80%"
                  transform="translate(-50%, -0%)"
                  width="550px"
                  height="550px"
                >
                  <Image
                    src="MeatM.png"
                    alt="Meat plate"
                    width="100%"
                    height="100%"
                    borderRadius="full"
                  />
                </Box>

                <VStack
                  position="absolute"
                  left="53%"
                  top="-75%"
                  transform="translate(150%, -0%)"
                >
                  <Box textAlign="left" py={24} px={16}>
                    <VStack spacing={2} width="100%">
                      <Link
                        href="#"
                        fontWeight="bold"
                        fontSize="2xl"
                        fontFamily="Times New Roman"
                      >
                        Pork
                      </Link>
                      <Flex justify="center" width="100%">
                        <Text fontSize="2xl" fontFamily="Times New Roman">
                          •
                        </Text>
                      </Flex>
                      <Link
                        href="#"
                        fontWeight="bold"
                        fontSize="2xl"
                        fontFamily="Times New Roman"
                      >
                        Beef
                      </Link>
                      <Flex justify="center" width="100%">
                        <Text fontSize="2xl" fontFamily="Times New Roman">
                          •
                        </Text>
                      </Flex>
                      <Link
                        href="#"
                        fontWeight="bold"
                        fontSize="2xl"
                        fontFamily="Times New Roman"
                      >
                        Poultry
                      </Link>
                    </VStack>
                  </Box>

                  {/* Shop Now button */}
                  <Box position="relative" mt={-16} >
                    <Link
                      href="#"
                      display="inline-flex"
                      alignItems="center"
                      fontWeight="medium"
                      textDecoration="underline"
                      fontSize="lg"
                    >
                      Shop Now <span style={{ marginLeft: "4px" }}>→</span>
                    </Link>
                  </Box>
                </VStack>
              </Flex>
            </VStack>
          </Container>
        </Box>
      </Box>

      {/* Why AdamsFoods Section */}
      <Box bg="white" width="100%" mt={{ base: "30%", md: "15%" }}>
      <Container maxW="container.lg">
          <VStack spacing={4} align="center">
            <Heading
              as="h2"
              size="xl"
              fontFamily="Times New Roman"
              fontWeight="bold"
              textAlign="center"
            >
              Why AdamsFoods?
            </Heading>

            <Text
              textAlign="center"
              maxW="700px"
              fontSize="lg"
              fontWeight="medium"
              px={4}
            >
              Founded in 2012, AdamsFoods continues to do the best to serve the
              needs of every single customer. Most importantly, we produce safe
              products in our Federal USDA inspected establishment.
            </Text>

            <FeatureGrid/>
          </VStack>
        </Container>
      </Box>
      {/* How It Works Section */}
      <HowItWorks />
      {/*Adam's Company*/}
      <AFCompany/>
      {/*Contact Us Section w/ Email*/}
      <Contact/>
      {/*FAQ Section */}
      <FAQPage />
      <Footer/>
    </Box>
  );
};

export default HomePage;
