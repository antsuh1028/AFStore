import React from "react";
import "./fonts.css"; // Import the font CSS
import {
  Box,
  Container,
  Flex,
  Heading,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Grid,
  GridItem,
  Circle,
  Button,
  IconButton,
  HStack,
  VStack,
  useColorModeValue,
  extendTheme,
  ChakraProvider,
  Divider,
} from "@chakra-ui/react";
import AdamsLogo from "../../public/MainLogo.png";

// Add custom font
const theme = extendTheme({
  fonts: {
    heading: "'SUIT-Regular', sans-serif",
    body: "'SUIT-Regular', sans-serif",
  },
});
import { SearchIcon, ChevronRightIcon } from "@chakra-ui/icons";
import AFCompany from "../components/home/AFCompany";
import Footer from "../components/Footer";
import Sidebar from "../components/SideBar";

// Icons (simplified versions using Chakra UI)
const PercentIcon = () => (
  <Text color="#ada59e" fontSize="lg">
    %
  </Text>
);
const ForkKnifeIcon = () => <Text fontSize="lg">🍴</Text>;
const LocationIcon = () => <Text fontSize="lg">📍</Text>;

const HomePage = () => {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("gray.100", "gray.700");

  return (
    <Sidebar>
      <ChakraProvider theme={theme}>
        <Container
          maxW={{ base: "100%", lg: "30%" }}
          p={0}
          bg="white"
          border={{ base: "none", lg: "1px" }}
          ml={{ base: 0, lg: "40%" }}
        >
          {" "}
          {/* Header */}
          <Flex p={4} justify="space-between" align="center">
            <Image
              src="../../grayAdams.png"
              alt="AdamsFoods Logo"
              width="40%"
            />
            <IconButton
              aria-label="Menu"
              icon={<Text>☰</Text>}
              variant="ghost"
            />
          </Flex>
          {/* Hero Section */}
          <Box px={4} py={6} textAlign="center">
            <Heading as="h1" size="xl">
              <Text as="span">MEAT</Text>{" "}
              <Text as="span" fontWeight="normal">
                WHOLESALE
              </Text>
            </Heading>
          </Box>
          {/* Main Image */}
          <Box px={4} mb={4}>
            <Box
              bg="tan.100"
              borderRadius="lg"
              overflow="hidden"
              height="45vh"
              position="relative"
              border="1px"
            >
              <Image
                src="/api/placeholder/400/200"
                alt="Various Meat Cuts"
                objectFit="cover"
                w="100%"
                h="100%"
              />
            </Box>
          </Box>
          {/* Search Bar */}
          <Box px={4} mb={6}>
            <InputGroup size="lg" bg="white" borderRadius="full" boxShadow="sm">
              <Input
                textAlign="center"
                placeholder="Search for..."
                borderRadius="full"
                py={6}
                bg="#f9f9f9"
              />
              <InputRightElement h="full" pr={2}>
                <SearchIcon color="gray.400" boxSize={5} />
              </InputRightElement>
            </InputGroup>
          </Box>
          {/* Categories */}
          <Grid templateColumns="repeat(3, 1fr)" gap={4} px={4} mb={6}>
            {["Marinated", "Processed", "Un processed"].map((category, idx) => (
              <GridItem key={idx}>
                <VStack spacing={2}>
                  <Circle size="60px" bg="#ada59e" overflow="hidden">
                    <Image src="/api/placeholder/60/60" alt={category} />
                  </Circle>
                  <Text fontSize="sm" fontWeight="medium">
                    {category}
                  </Text>
                </VStack>
              </GridItem>
            ))}
          </Grid>
          {/* Action Buttons */}
          <Grid templateColumns="repeat(3, 1fr)" gap={4} px={4} mb={6}>
            {[
              { name: "Deal", icon: <PercentIcon /> },
              { name: "Order", icon: <ForkKnifeIcon /> },
              {
                name: "Contact",
                icon: (
                  <Image
                    src={AdamsLogo}
                    boxSize="35px"
                    alt="Adams Logo"
                    filter="grayscale(100%)"
                  />
                ),
              },
            ].map((action, idx) => (
              <GridItem key={idx}>
                <VStack spacing={2}>
                  <Circle size="60px" bg="#494949" color="white">
                    {action.icon}
                  </Circle>
                  <Text fontSize="sm" fontWeight="medium">
                    {action.name}
                  </Text>
                </VStack>
              </GridItem>
            ))}
          </Grid>
          {/* Location */}
          <HStack px={4} mb={6} spacing={2}>
            <Image
              src="../../final/only here.png"
              h="20px"
              alt="Adams Logo"
              filter="grayscale(100%)"
            />
            <Text fontSize="19px" fontWeight="bold">
              Only Here
            </Text>
          </HStack>
          {/* Featured Product */}
          <Box px={4} position="relative" mb={6}>
            <Flex direction="row" justify="space-between" gap={6}>
              <Box flex="1" border="1px" height="20vh" borderRadius="lg">
                <Image
                  src="/api/placeholder/120/120"
                  alt="Brisket Slice"
                  borderRadius="full"
                  mb={2}
                />
              </Box>
              <VStack
                align="flex-start"
                flex="1"
                spacing={1}
                position="relative"
                pb="4"
              >
                <Divider
                  borderColor="#e9e8e8"
                  borderWidth="1px"
                  marginBottom={4}
                />
                <Heading fontSize="16px" mb={4}>
                  Brisket Slice
                </Heading>
                <Text fontSize="12px" width="100%">
                  A cut only AdamsFoods can make, crafted with precision,
                  delivered with pride.
                </Text>
                <IconButton
                  icon={
                    <ChevronRightIcon
                      w={6}
                      h={6}
                      fontWeight="sm"
                      color="#ada59e"
                    />
                  }
                  isRound
                  size="md"
                  alignSelf="flex-end"
                  position="relative"
                  bg="#474745"
                  color="white"
                />
                <Divider
                  borderColor="#e9e8e8"
                  borderWidth="1px"
                  position="absolute"
                  bottom="0"
                  width="100%"
                />
              </VStack>
            </Flex>
          </Box>

          {/*Why AdamsFoods*/}
          <Box px={4} mb={6} py={6} borderRadius="lg">
            <Heading size="md" mb={4}>
              Why AdamsFoods?
            </Heading>
            <Flex mb={4} gap={4}>
              <Button
                bg="#494949"
                width="50%"
                borderRadius="25px"
              ></Button>
              <VStack w="50%" justify="center">
                <Divider border="1px" color="#626262" />
                <Text fontSize="sm" color="gray.600">
                  SINCE 2012
                </Text>
                <Divider border="1px" color="#626262" />
              </VStack>
            </Flex>
            <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={8} mt={8}>
              <GridItem>
                <VStack align="center" spacing={2}>
                  <Circle size="30px" bg="white">
                    <Image
                      src="../../final/why adamsfoods-1.png"
                      alt="Korean-style cutting"
                      width="80%"
                    />
                  </Circle>
                  <Text fontWeight="bold" fontSize="sm">
                    "Korean-style cutting"
                  </Text>
                </VStack>
              </GridItem>
              <GridItem>
                <VStack align="center" spacing={2}>
                  <Circle size="30px" bg="white">
                    <Image
                      src="../../final/why adamsfoods-2.png"
                      alt="Trusted partner"
                      width="80%"
                    />
                  </Circle>
                  <Text fontWeight="bold" fontSize="sm">
                    "Trusted partner"
                  </Text>
                </VStack>
              </GridItem>
            </Grid>
            <VStack align="flex-start" spacing={4}>
              <Text fontSize="xs" color="gray.600">
                Founded in 2012, Adams Foods produces safe, tailored products in
                USDA-inspected facilities.
              </Text>
              <Text fontSize="xs" color="gray.600">
                Our exclusive Korean-style cutting has built strong
                partnerships, proudly representing K-BBQ.
              </Text>
              <Text fontSize="xs" color="gray.600">
                Through quality and reliability, we have become a trusted
                partner in LA and beyond.
              </Text>
            </VStack>
          </Box>
          <AFCompany />
          <Footer />
        </Container>
      </ChakraProvider>
    </Sidebar>
  );
};

export default HomePage;
