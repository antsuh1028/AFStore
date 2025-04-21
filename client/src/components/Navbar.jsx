import {
  Box,
  Flex,
  Link,
  Button,
  Heading,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  useDisclosure,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Divider,
  HStack,
  Container,
  Text,
  SimpleGrid,
  Image,
} from "@chakra-ui/react";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  return (
    <Box as="nav" py={4} px={6} boxShadow="sm" width="100%">
      <Flex
        justify="space-between"
        align="center"
        maxW="container.xl"
        mx="auto"
      >
        <Button variant="ghost" leftIcon={<Menu />} onClick={onOpen}>
          Menu
        </Button>

        <Box
          display={{ base: "none", md: "block" }}
          cursor="pointer"
          onClick={() => navigate("/")}
        >
          <Image src="/AdamsWings.png" alt="AdamsFoods" h="40px" />
        </Box>

        <Box w="75px" />

        {/* Drawer Menu - Works on all screens */}
        <Drawer placement="top" onClose={onClose} isOpen={isOpen} size="xl">
          <DrawerOverlay />
          <DrawerContent bg="white">
            <Box p={4} borderBottomWidth="1px" borderColor="gray.100">
              <Flex
                justify="space-between"
                align="center"
                maxW="container.xl"
                mx="auto"
                position="relative"
              >
                <Button
                  size="sm"
                  justifyContent="flex-start"
                  variant="ghost"
                  leftIcon={<Menu />}
                  onClick={onClose}
                >
                  Menu
                </Button>

                <Box
                  display={{ base: "none", md: "block" }}
                  position="absolute"
                  left="50%"
                  transform="translateX(-50%)"
                >
                  <Image src="/AdamsWings.png" alt="AdamsFoods" h="40px" />
                </Box>
              </Flex>
            </Box>

            <DrawerBody>
              <Container maxW="container.xl" py={4}>
                {/* Desktop View - Three Columns */}
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
                  <Box maxW={{ base: "100%" }} mt={8}>
                    <InputGroup>
                      <Input
                        placeholder="Search for..."
                        rounded="full"
                        bg="gray.50"
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label="Search"
                          icon={
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="11" cy="11" r="8" />
                              <path d="m21 21-4.3-4.3" />
                            </svg>
                          }
                          variant="ghost"
                          size="sm"
                          colorScheme="gray"
                        />
                      </InputRightElement>
                    </InputGroup>
                    <Text fontSize="xs" color="gray.500" mt={1} ml={4}>
                      (0 results)
                    </Text>
                  </Box>
                  {/* Shop Section */}
                  <Box w="100%">
                    <Heading
                      as="h2"
                      fontSize="xl"
                      fontWeight="bold"
                      mb={2}
                      px={4}
                    >
                      Shop
                    </Heading>
                    <Divider borderWidth="1px" borderColor="gray.900" mb={4} />
                    <VStack spacing={5} alignItems="flex-start">
                      <Link
                        href="/beef"
                        fontSize="md"
                        color="gray.700"
                        fontWeight="normal"
                        px={4}
                        _hover={{ textDecoration: "none", color: "blue.600" }}
                      >
                        Beef
                      </Link>
                      <Link
                        href="/pork"
                        fontSize="md"
                        color="gray.700"
                        fontWeight="normal"
                        px={4}
                        _hover={{ textDecoration: "none", color: "blue.600" }}
                      >
                        Pork
                      </Link>
                      <Link
                        href="/poultry"
                        fontSize="md"
                        color="gray.700"
                        fontWeight="normal"
                        px={4}
                        _hover={{ textDecoration: "none", color: "blue.600" }}
                      >
                        Poultry
                      </Link>
                      <Link
                        href="/shop-all"
                        fontSize="md"
                        color="gray.700"
                        fontWeight="normal"
                        px={4}
                        _hover={{ textDecoration: "none", color: "blue.600" }}
                      >
                        Shop all
                      </Link>
                    </VStack>
                  </Box>

                  <VStack>
                    {/* Wholesale Section */}
                    <Box w="100%">
                      <Heading
                        as="h2"
                        fontSize="xl"
                        fontWeight="bold"
                        mb={2}
                        px={4}
                      >
                        Wholesale Info
                      </Heading>
                      <Divider
                        borderWidth="1px"
                        borderColor="gray.900"
                        mb={4}
                      />
                      <VStack spacing={4} alignItems="flex-start">
                        <Link
                          href="/wholesale/packing"
                          fontSize="md"
                          color="gray.700"
                          fontWeight="normal"
                          px={4}
                          _hover={{ textDecoration: "none", color: "blue.600" }}
                        >
                          Packing
                        </Link>
                        <Link
                          href="/wholesale/faq"
                          fontSize="md"
                          color="gray.700"
                          fontWeight="normal"
                          px={4}
                          _hover={{ textDecoration: "none", color: "blue.600" }}
                        >
                          FAQ
                        </Link>
                        <VStack spacing={2} alignItems="flex-start" pl={4}>
                          <Text fontSize="md" color="gray.400">
                            • Delivery
                          </Text>
                          <Text fontSize="md" color="gray.400">
                            • Refund policy
                          </Text>
                          <Text fontSize="md" color="gray.400">
                            • Bulk Purchase
                          </Text>
                          <Text fontSize="md" color="gray.400">
                            • Cash & Carry
                          </Text>
                          <Text fontSize="md" color="gray.400">
                            • B2B
                          </Text>
                        </VStack>
                      </VStack>
                    </Box>

                    {/* Contact Section */}
                    <Box w="100%" py={16}>
                      <Heading
                        as="h2"
                        fontSize="xl"
                        fontWeight="bold"
                        mb={2}
                        px={4}
                      >
                        Contact
                      </Heading>
                      <Divider
                        borderWidth="1px"
                        borderColor="gray.900"
                        mb={4}
                      />
                      <VStack px={4} spacing={5} alignItems="flex-start">
                        <Link
                          href="/contact"
                          fontSize="md"
                          color="gray.700"
                          fontWeight="normal"
                          _hover={{ textDecoration: "none", color: "blue.600" }}
                        >
                          Contact
                        </Link>
                      </VStack>
                    </Box>
                  </VStack>
                </SimpleGrid>
              </Container>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>
    </Box>
  );
};

export default Navbar;
