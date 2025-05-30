import React, { useRef } from "react";
import {
  Box,
  Button,
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
  IconButton,
  HStack,
  VStack,
  Divider,
  SimpleGrid,
  Link,
  useDisclosure,
} from "@chakra-ui/react";
import { SearchIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { ShoppingCart, UserRound } from "lucide-react";

import { useNavigate } from "react-router-dom";
import NavDrawer from "../components/NavDrawer";
import AFCompany from "../components/home/AFCompany";
import Footer from "../components/Footer";
import Sidebar from "../components/SideBar";

const HomePage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const contentRef = useRef(null);

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
        {/* Header */}
        <Flex p={4} justify="space-between" align="center">
          <Image src="../../grayAdams.png" alt="AdamsFoods Logo" width="40%" />
          <Flex>
            <IconButton
              aria-label="Menu"
              icon={<UserRound size={24} />}
              variant="ghost"
              onClick={onClose}
            />
            <IconButton
              aria-label="Menu"
              icon={<ShoppingCart size={24} />}
              variant="ghost"
              onClick={onClose}
            />
            <IconButton
              aria-label="Menu"
              icon={<Text>☰</Text>}
              variant="ghost"
              onClick={onOpen}
            />
          </Flex>
        </Flex>

        {/* Hero Section */}
        <Box px={4} py={8} textAlign="center">
          <Heading as="h1" size="lg">
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
              src="../../public/gray.avif"
              alt="Various Meat Cuts"
              // objectFit="cover"
              w="100%"
              h="100%"
            />
          </Box>
        </Box>

        {/* Search Bar */}
        <Box px={4} mb={6}>
          <InputGroup
            size="lg"
            bg="white"
            borderRadius="full"
            boxShadow="sm"
            mt={4}
            mb={8}
          >
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
        <Grid templateColumns="repeat(3, 1fr)" gap={4} px={4} mb={8}>
          {[
            { name: "Marinated", url: "/wholesale/marinated" },
            { name: "Processed", url: "/wholesale/processed" },
            { name: "Unprocessed", url: "/wholesale/unprocessed" },
          ].map((category, idx) => (
            <GridItem key={idx}>
              <VStack
                spacing={2}
                cursor="pointer"
                onClick={() => navigate(category.url)}
              >
                <Circle size="60px" bg="#efeeee" overflow="hidden">
                  <Image src="../../public/gray.avif" alt={category.name} />
                </Circle>
                <Text fontSize="sm" fontWeight="semibold">
                  {category.name}
                </Text>
              </VStack>
            </GridItem>
          ))}
        </Grid>

        {/* Action Buttons */}
        <Grid templateColumns="repeat(3, 1fr)" gap={4} px={4} mb={12}>
          {[
            {
              name: "Deal",
              icon: (
                <Image
                  src="/final/deal.png"
                  alt="Order"
                  objectFit="cover"
                  width="60%"
                  height="60%"
                  borderRadius="full"
                />
              ),
              url: "/wholesale/deal",
            },
            {
              name: "Order",
              icon: (
                <Image
                  src="/final/order.png"
                  alt="Order"
                  objectFit="cover"
                  width="60%"
                  height="60%"
                  borderRadius="full"
                />
              ),
              url: "/wholesale/how-to-order",
            },
            {
              name: "Contact",
              icon: (
                <Image
                  src="/final/contact us.png"
                  alt="Order"
                  objectFit="cover"
                  width="60%"
                  height="60%"
                  borderRadius="full"
                />
              ),
              url: "/contact",
            },
          ].map((action, idx) => (
            <GridItem key={idx}>
              <VStack spacing={2}>
                <Circle
                  size="65px"
                  bg="#494949"
                  color="white"
                  onClick={() => {
                    navigate(`${action.url}`);
                  }}
                  cursor="pointer"
                >
                  {action.icon}
                </Circle>
                <Text fontSize="sm" fontWeight="semibold">
                  {action.name}
                </Text>
              </VStack>
            </GridItem>
          ))}
        </Grid>

        {/* Location */}
        <HStack px={6} mb={3} spacing={2}>
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
            <Box flex="1" border="1px" height="100%" borderRadius="xl">
              <Image
                src="../../public/gray.avif"
                alt="Brisket Slice"
                borderRadius="xl"
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
              <Box
                width="40px"
                height="40px"
                borderRadius="50%"
                bg="#474745"
                alignSelf="flex-end"
                position="relative"
                cursor="pointer"
                display="flex"
                alignItems="center"
                justifyContent="center"
                onClick={() => console.log("Circle clicked")}
              >
                <Image
                  src="/final/button.png"
                  alt="Order"
                  width="60%"
                  height="60%"
                  objectFit="cover"
                />
              </Box>
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
        <Box px={4} mb={6} py={4} borderRadius="lg">
          <Heading size="md" mb={8}>
            Why AdamsFoods?
          </Heading>
          <Flex mb={4} gap={4}>
            <Button bg="#494949" width="50%" borderRadius="25px">
              <Image
                src="/final/why adamsfoods.png"
                alt="button"
                objectFit="cover"
                width="100%"
                height="100%"
                borderRadius="full"
              />
            </Button>
            <VStack w="50%" justify="center">
              <Divider border="1px" color="#626262" />
              <Text fontSize="sm" color="gray.600" fontWeight="medium">
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
            <Text fontSize="sm" color="gray.600" lineHeight="tall">
              Founded in 2012, Adams Foods produces safe, tailored products in
              USDA-inspected facilities.
            </Text>
            <Text fontSize="sm" color="gray.600" lineHeight="tall">
              Our exclusive Korean-style cutting has built strong partnerships,
              proudly representing K-BBQ.
            </Text>
            <Text fontSize="sm" color="gray.600" lineHeight="tall">
              Through quality and reliability, we have become a trusted partner
              in LA and beyond.
            </Text>
          </VStack>
        </Box>
        {/* Company Website Link */}
        <VStack align="center" spacing={0} py={12} width="100%">
          <Text
            fontWeight="extrabold"
            fontStyle="italic"
            textAlign="center"
            fontSize="sm"
            mb={0}
          >
            More Detail Information:
          </Text>
          <Link
            href="https://www.adamsfoods.us/"
            isExternal
            _hover={{ color: "blue.500" }}
            textDecoration="underline"
            color="#b2a796"
            fontStyle="italic"
            textAlign="center"
          >
            https://www.adamsfoods.us/
          </Link>
        </VStack>
        <AFCompany />
        <Footer />
      </Container>
    </Sidebar>
  );
};

export default HomePage;
