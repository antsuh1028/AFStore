import React, { useRef, useState, useEffect } from "react";
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
  List,
  ListItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { SearchIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { ShoppingCart, UserRound } from "lucide-react";

import { useNavigate } from "react-router-dom";
import NavDrawer from "../components/NavDrawer";
import AFCompany from "../components/home/AFCompany";
import Footer from "../components/Footer";
import Sidebar from "../components/SideBar";
import { useAuthContext } from "../hooks/useAuth"; // Import auth context
import ImageCarousel from "../components/home/ImageCarousel";

const API_URL = import.meta.env.MODE === 'production' 
  ? import.meta.env.VITE_API_URL 
  : import.meta.env.VITE_API_URL_DEV;

const HomePage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isSearchOpen,
    onOpen: onSearchOpen,
    onClose: onSearchClose,
  } = useDisclosure();
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const { isAuthenticated, userId, loading } = useAuthContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [apiStatus, setApiStatus] = useState("unknown");
  const [pageLoading, setPageLoading] = useState(true);

  // Simulate page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim().length > 1) {
        searchItems();
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const searchItems = async () => {
    setIsLoading(true);
    try {
      const url = `${API_URL}/api/items`;
      const response = await fetch(url);

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          if (data.data && Array.isArray(data.data)) {
            const filteredItems = data.data.filter(
              (item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.species
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                item.description
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
            );
            setSearchResults(filteredItems.slice(0, 10));
            setShowDropdown(true);
            setApiStatus("connected");
            return;
          }
        }
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = (item) => {
    setShowDropdown(false);
    setSearchQuery("");
    navigate(`wholesale/product/${item.id}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchOpen();
    }
  };

  const handleUserIconClick = () => {
    if (loading) {
      return;
    }

    if (isAuthenticated && userId) {
      navigate(`/profile/user/${userId}`);
    } else {
      navigate("/login");
    }
  };

  // Loading screen
  if (pageLoading) {
    return (
      <Center h="100vh" bg="white">
        <VStack spacing={4}>
          <Image 
            src="/grayAdams.png" 
            alt="AdamsFoods Logo" 
            width="150px"
            opacity={0.8}
          />
          <Spinner size="lg" color="gray.500" thickness="3px" />
          <Text fontSize="sm" color="gray.500">Loading...</Text>
        </VStack>
      </Center>
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
        {/* Header */}
        <Flex p={4} justify="space-between" align="center">
          <Image src="/grayAdams.png" alt="AdamsFoods Logo" width="40%" />
          <Flex>
            <IconButton
              aria-label="Profile"
              icon={<UserRound size={24} />}
              variant="ghost"
              onClick={handleUserIconClick}
              isLoading={loading}
              _hover={{ bg: "gray.100" }}
            />
            {isAuthenticated && (
              <IconButton
                aria-label="Cart"
                icon={<ShoppingCart size={24} />}
                variant="ghost"
                onClick={() => {
                  navigate(`/profile/user/${userId}`, {
                    state: { activeTab: 1 },
                  });
                }}
                _hover={{ bg: "gray.100" }}
              />
            )}
            <IconButton
              aria-label="Menu"
              icon={<Text fontSize={24}>☰</Text>}
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
        <ImageCarousel />

        {/* Enhanced Search Bar */}
        <Box px={4} mb={6} position="relative" pt={2}>
          <form onSubmit={handleSearchSubmit}>
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length > 2 && setShowDropdown(true)}
              />
              <InputRightElement h="full" pr={2}>
                <IconButton
                  aria-label="Search"
                  icon={<SearchIcon color="gray.400" boxSize={5} />}
                  variant="ghost"
                  type="submit"
                  isLoading={isLoading}
                />
              </InputRightElement>
            </InputGroup>
          </form>

          {/* API Status Indicator */}
          {apiStatus === "disconnected" && (
            <Text fontSize="xs" color="orange.600" textAlign="center" mt={2}>
              API disconnected - showing sample data
            </Text>
          )}

          {/* Search Dropdown Results */}
          {showDropdown && searchResults.length > 0 && (
            <Box
              position="absolute"
              top="100%"
              left={4}
              right={4}
              bg="white"
              borderRadius="md"
              boxShadow="lg"
              zIndex={1000}
              maxH="300px"
              overflowY="auto"
              border="1px"
              borderColor="gray.200"
            >
              <List spacing={0}>
                {searchResults.map((item) => (
                  <ListItem
                    key={item.id}
                    p={3}
                    cursor="pointer"
                    _hover={{ bg: "gray.50" }}
                    onClick={() => handleResultClick(item)}
                    borderBottom="1px"
                    borderColor="gray.100"
                  >
                    <Flex align="center" gap={3}>
                      {item.images > 0 && (
                        <Image
                          src={`/products/${item.style}/${item.name}/01.avif`}
                          fallbackSrc={`/products/${item.style}/${item.name}/01.jpg`}
                          alt={item.name}
                          boxSize="40px"
                          objectFit="cover"
                          borderRadius="md"
                        />
                      )}
                      {item.images === 0 && (
                        <Image
                          src="gray.avif"
                          alt={item.name}
                          boxSize="40px"
                          objectFit="cover"
                          borderRadius="md"
                        />
                      )}
                      <VStack align="start" spacing={1} flex={1}>
                        <Text fontWeight="semibold" fontSize="sm">
                          {item.name}
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                          {item.species} • ${item.price}
                        </Text>
                      </VStack>
                    </Flex>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>

        {/* Search Results Modal */}
        <Modal isOpen={isSearchOpen} onClose={onSearchClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Search Results for "{searchQuery}"</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {searchResults.length > 0 ? (
                <Grid
                  templateColumns="repeat(1, 1fr)"
                  gap={4}
                  overflowY="auto"
                  maxH="80vh"
                >
                  {searchResults.map((item) => (
                    <GridItem key={item.id}>
                      <Flex
                        p={4}
                        border="1px"
                        borderColor="gray.200"
                        borderRadius="md"
                        cursor="pointer"
                        _hover={{ bg: "gray.50" }}
                        onClick={() => {
                          handleResultClick(item);
                          onSearchClose();
                        }}
                      >
                        <Image
                          src={
                            item.images > 0
                              ? `/products/${item.style}/${item.name}/01.avif`
                              : "/gray.avif"
                          }
                          fallbackSrc={
                            item.images > 0
                              ? `/products/${item.style}/${item.name}/01.jpg`
                              : "/gray.avif"
                          }
                          alt={item.name}
                          w="25%"
                          objectFit="cover"
                          borderRadius="md"
                          mr={4}
                        />
                        <VStack align="start" spacing={2} flex={1}>
                          <Text fontWeight="bold">{item.name}</Text>
                          <Text fontSize="sm" color="gray.600">
                            {item.description}
                          </Text>
                          <HStack>
                            <Text fontSize="sm" color="blue.600">
                              {item.species}
                            </Text>
                            <Text fontSize="sm" fontWeight="bold">
                              ${item.price}
                            </Text>
                          </HStack>
                        </VStack>
                      </Flex>
                    </GridItem>
                  ))}
                </Grid>
              ) : (
                <Text textAlign="center" color="gray.500">
                  No products found for "{searchQuery}"
                </Text>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Categories */}
        <Grid templateColumns="repeat(3, 1fr)" gap={4} px={4} mb={8} overflowX="auto">
          {[
            {
              name: "Marinated",
              url: "/wholesale/marinated",
              image: "/products/home/marinated.avif",
              fallback: "/products/home/marinated.jpg",
            },
            {
              name: "Prepped",
              url: "/wholesale/processed",
              image: "/products/home/processed.avif",
              fallback: "/products/home/processed.jpg",
            },
            {
              name: "Untrimmed",
              url: "/wholesale/unprocessed",
              image: "/products/home/unprocessed.avif",
              fallback: "/products/home/unprocessed.jpg",
            },
          ].map((category, idx) => (
            <GridItem key={idx}>
              <VStack
                spacing={2}
                cursor="pointer"
                onClick={() => navigate(category.url)}
              >
                <Circle
                  size="75px"
                  bg="white"
                  border="1px"
                  borderColor="gray.100"
                  overflow="hidden"
                >
                  <Image
                    src={category.image}
                    fallbackSrc={category.fallback}
                    alt={category.name}
                    width="75px"
                    height="75px"
                    objectFit="cover"
                  />
                </Circle>
                <Text fontSize="sm" fontWeight="semibold">
                  {category.name}
                </Text>
              </VStack>
            </GridItem>
          ))}
        </Grid>

        {/* Action Buttons */}
        <Grid templateColumns="repeat(3, 1fr)" gap={4} px={4} mb={12} overflowX="auto">
          {[
            {
              name: "Deal",
              icon: (
                <Image
                  src="/products/home/Deal.avif"
                  fallbackSrc="/products/home/Deal.jpg"
                  alt="Order"
                  objectFit="cover"
                  width="100%"
                  height="100%"
                  borderRadius="full"
                />
              ),
              url: "/wholesale/deal",
            },
            {
              name: "How to Order",
              icon: (
                <Image
                  src="/products/home/How to order.avif"
                  fallbackSrc="/products/home/How to order.jpg"
                  alt="Order"
                  objectFit="cover"
                  width="100%"
                  height="100%"
                  borderRadius="full"
                />
              ),
              url: "/wholesale/how-to-order",
            },
            {
              name: "Contact",
              icon: (
                <Image
                  src="/products/home/Contact.avif"
                  fallbackSrc="/products/home/Contact.jpg"
                  alt="Order"
                  objectFit="cover"
                  width="100%"
                  height="100%"
                  borderRadius="full"
                />
              ),
              url: "/contact",
            },
          ].map((action, idx) => (
            <GridItem key={idx}>
              <VStack spacing={2}>
                <Circle
                  size="75px"
                  bg="#ECECEC"
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
        <HStack px={6} mb={3} spacing={2} ml={2}>
          <Image
            src="/Final_pic/only here.png"
            h="20px"
            alt="Adams Logo"
            filter="grayscale(100%)"
          />
          <Text fontSize="19px" fontWeight="extrabold">
            Only Here
          </Text>
        </HStack>

        {/* Featured Product */}
        <Box px={4} position="relative" mb={6}>
          <Flex direction="row" justify="space-between" gap={6}>
            <Box flex="1" w="190px" h="190px" borderRadius="xl">
              <Image
                src="/products/home/marinated.avif"
                fallbackSrc="/products/home/marinated.jpg"
                alt="Brisket Slice"
                borderRadius="xl"
                objectFit="cover"
                width="100%"
                height="100%"
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
                Chuck Slice (Bulgogi)
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
                mt={4}
                onClick={() => navigate("/wholesale/product/1")}
              >
                <Image
                  src="/Final_pic/button.png"
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
          <Heading size="md" mb={8} fontWeight="extrabold" ml={2}>
            Why AdamsFoods?
          </Heading>
          <Flex mb={4} gap={4} align="center">
            <Image
              src="/final/why adamsfoods.png"
              alt="Why AdamsFoods"
              objectFit="contain"
              width="50%"
              borderRadius="full"
            />
            <VStack w="50%" justify="center" spacing={2}>
              <Divider borderColor="#626262" borderWidth="1px" />
              <Text fontSize="sm" color="gray.600" fontWeight="bold">
                SINCE 2012
              </Text>
              <Divider borderColor="#626262" borderWidth="1px" />
            </VStack>
          </Flex>
          <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={8} mt={8}>
            <GridItem>
              <VStack align="center" spacing={2}>
                <Circle size="30px" bg="white">
                  <Image
                    src="/Final_pic/why adamsfoods-1.png"
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
                    src="/Final_pic/why adamsfoods-2.png"
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
          <VStack align="flex-start" spacing={4} p={2}>
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
        <VStack align="center" spacing={0} mb={10} width="100%">
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
            color="#CA3836"
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