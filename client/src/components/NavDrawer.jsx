import React, { useRef, useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Circle,
  Drawer,
  DrawerBody,
  DrawerContent,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  IconButton,
  VStack,
  Divider,
  SimpleGrid,
  Link,
} from "@chakra-ui/react";
import { Menu } from "lucide-react";
// import AdamsLogo from "../../MainLogo.png";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NavDrawer = ({ isOpen, onClose, containerRef }) => {
  const [drawerWidth, setDrawerWidth] = useState("100%");
  const navigate = useNavigate();

  useEffect(() => {
    // Function to update drawer width based on container width
    const updateWidth = () => {
      if (containerRef && containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setDrawerWidth(`${width}px`);
      }
    };

    if (isOpen) {
      updateWidth();
    }

    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [isOpen, containerRef]);
  
  const handleNavigate = (path) => {
    if (path) {
      navigate(path);
    }
    onClose();
  };

  return (
    <Drawer
      placement="top"
      onClose={onClose}
      isOpen={isOpen}
      transitionDuration={{ enter: "0.1s", exit: "0.1s" }}
    >
      <DrawerContent
        bg="white"
        width={drawerWidth}
        ml={containerRef?.current?.offsetLeft || 0}
        position="absolute"
        boxShadow="md"
        transition="transform 0.1s ease, opacity 0.1s ease"
        height="100%"
      >
        <Box>
          <Flex
            justify="space-between"
            align="center"
            mx="auto"
            position="relative"
            mb={7}
          >
            <IconButton
              aria-label="Back"
              icon={<ChevronLeft size={36} color="#8f8e8e" />}
              variant="ghost"
              onClick={onClose}
              size="xl"
              ml={4}
            />
            <IconButton
              aria-label="Menu"
              icon={
                <Text fontSize="2xl" color="#8f8e8e">
                  ☰
                </Text>
              }
              variant="ghost"
              onClick={onClose}
              size="lg"
              p={5}
            />
          </Flex>
        </Box>

        <DrawerBody>
          <Box p={4}>
            {/* Shop Section */}
            <Box mb={20}>
              <Flex justify="space-between" align="center" mb={2}>
                <Heading
                  as="h2"
                  fontSize="sm"
                  fontWeight="extrabold"
                  marginLeft={4}
                >
                  Shop
                </Heading>
                <Link
                  fontSize="sm"
                  color="gray.700"
                  fontWeight="medium"
                  marginRight={4}
                  textDecoration="underline"
                  onClick={() => handleNavigate("/shop-all")}
                >
                  Shop all
                </Link>
              </Flex>
              <Divider mb={4} border="1px" borderColor="black" />

              <Grid templateColumns="repeat(3, 1fr)" gap={2} mb={4}>
                <GridItem>
                  <VStack
                    spacing={1}
                    cursor="pointer"
                    onClick={() => handleNavigate("/marinated")}
                  >
                    <Circle size="65px" bg="#efedef">
                      <Image src="/api/placeholder/50/50" alt="Marinated" />
                    </Circle>
                    <Text
                      fontSize="13px"
                      textAlign="center"
                      marginTop={2}
                      fontWeight="bold"
                    >
                      Marinated
                    </Text>
                  </VStack>
                </GridItem>
                <GridItem>
                  <VStack
                    spacing={1}
                    cursor="pointer"
                    onClick={() => handleNavigate("/processed")}
                  >
                    <Circle size="65px" bg="#efedef">
                      <Image src="/api/placeholder/50/50" alt="Processed" />
                    </Circle>
                    <Text
                      fontSize="13px"
                      textAlign="center"
                      marginTop={2}
                      fontWeight="bold"
                    >
                      Processed
                    </Text>
                  </VStack>
                </GridItem>
                <GridItem>
                  <VStack
                    spacing={1}
                    cursor="pointer"
                    onClick={() => handleNavigate("/unprocessed")}
                  >
                    <Circle size="65px" bg="#efedef">
                      <Image src="/api/placeholder/50/50" alt="Unprocessed" />
                    </Circle>
                    <Text
                      fontSize="13px"
                      textAlign="center"
                      marginTop={2}
                      fontWeight="bold"
                    >
                      Unprocessed
                    </Text>
                  </VStack>
                </GridItem>
              </Grid>
            </Box>

            {/* Wholesale Info Section */}
            <Box mb={8}>
              <Heading
                as="h2"
                fontSize="sm"
                fontWeight="extrabold"
                mb={2}
                ml={4}
              >
                Wholesale Info
              </Heading>
              <Divider mb={4} borderColor="black" border="1px" />

              <Grid templateColumns="repeat(3, 1fr)" gap={4} mb={8}>
                <GridItem>
                  <VStack
                    spacing={1}
                    cursor="pointer"
                    onClick={() => handleNavigate("/wholesale/deal")}
                  >
                    <Circle size="65px" bg="#494949">
                      <Image
                        src="/final/deal.png"
                        alt="Dealing"
                        objectFit="cover"
                        width="70%"
                        height="70%"
                        borderRadius="full"
                      />
                    </Circle>
                    <Text
                      fontSize="13px"
                      textAlign="center"
                      marginTop={2}
                      fontWeight="bold"
                    >
                      Deal
                    </Text>
                  </VStack>
                </GridItem>
                <GridItem>
                  <VStack
                    spacing={1}
                    cursor="pointer"
                    onClick={() => handleNavigate("/wholesale/how-to-order")}
                  >
                    <Circle size="65px" bg="#494949">
                      <Image
                        src="/final/order.png"
                        alt="Order"
                        objectFit="cover"
                        width="60%"
                        height="60%"
                        borderRadius="full"
                      />
                    </Circle>
                    <Text
                      fontSize="13px"
                      textAlign="center"
                      marginTop={2}
                      fontWeight="bold"
                    >
                      Order
                    </Text>
                  </VStack>
                </GridItem>
                <GridItem>
                  <VStack
                    spacing={1}
                    cursor="pointer"
                    onClick={() => handleNavigate("/contact")}
                  >
                    <Circle size="65px" bg="#494949">
                      <Image
                        src="/final/contact us.png"
                        alt="Packing"
                        objectFit="cover"
                        width="70%"
                        height="70%"
                        borderRadius="full"
                      />
                    </Circle>
                    <Text
                      fontSize="13px"
                      textAlign="center"
                      marginTop={2}
                      fontWeight="bold"
                    >
                      Contact
                    </Text>
                  </VStack>
                </GridItem>
              </Grid>

              <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                <GridItem>
                  <VStack
                    spacing={1}
                    cursor="pointer"
                    onClick={() => handleNavigate("/wholesale/packing")}
                  >
                    <Circle size="65px" bg="#494949">
                      <Image
                        src="/final/packing.png"
                        alt="Packing"
                        objectFit="cover"
                        width="70%"
                        height="70%"
                        borderRadius="full"
                      />
                    </Circle>
                    <Text
                      fontSize="13px"
                      textAlign="center"
                      marginTop={2}
                      fontWeight="bold"
                    >
                      Packing
                    </Text>
                  </VStack>
                </GridItem>
                <GridItem>
                  <VStack
                    spacing={1}
                    cursor="pointer"
                    onClick={() => handleNavigate("/wholesale/b2b")}
                  >
                    <Circle size="65px" bg="#494949">
                      <Image
                        src="/final/b2b.png"
                        alt="Processed"
                        objectFit="cover"
                        width="70%"
                        height="70%"
                        borderRadius="full"
                      />
                    </Circle>
                    <Text
                      fontSize="13px"
                      textAlign="center"
                      marginTop={2}
                      fontWeight="bold"
                    >
                      B2B
                    </Text>
                  </VStack>
                </GridItem>
                <GridItem>
                  <VStack
                    spacing={1}
                    cursor="pointer"
                    onClick={() => handleNavigate("/wholesale/faq")}
                  >
                    <Circle size="65px" bg="#494949">
                      <Image
                        src="/final/FAQ.png"
                        alt="FAQ"
                        objectFit="cover"
                        width="70%"
                        height="70%"
                        borderRadius="full"
                      />
                    </Circle>
                    <Text
                      fontSize="13px"
                      textAlign="center"
                      marginTop={2}
                      fontWeight="bold"
                    >
                      FAQ
                    </Text>
                  </VStack>
                </GridItem>
              </Grid>
            </Box>
            <Link href="/terms-and-policies">Terms and Policies</Link>
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default NavDrawer;
