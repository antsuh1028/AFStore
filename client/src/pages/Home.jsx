import React, { useRef, useState, useEffect, useMemo } from "react";
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
  IconButton,
  HStack,
  VStack,
  Divider,
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
} from "@chakra-ui/react";
import { SearchIcon, } from "@chakra-ui/icons";
import { ShoppingCart, UserRound } from "lucide-react";

import { useNavigate } from "react-router-dom";
import NavDrawer from "../components/NavDrawer";
import AFCompany from "../components/home/AFCompany";
import Footer from "../components/Footer";
import Sidebar from "../components/SideBar";
import { useAuthContext } from "../hooks/useAuth";
import ImageCarousel from "../components/home/ImageCarousel";
import { API_CONFIG, COLORS } from "../constants";
import HomeSkeleton from "../components/skeletons/HomeSkeleton";

const HomePage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isSearchOpen,
    onOpen: onSearchOpen,
    onClose: onSearchClose,
  } = useDisclosure();
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const searchRef = useRef(null);

  const { isAuthenticated, userId, loading } = useAuthContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [apiStatus, setApiStatus] = useState("unknown");
  const [pageLoading, setPageLoading] = useState(true);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);

  const criticalImages = useMemo(
    () => [
      "/images/gray_adams.png",
      "/images/marinated_button.avif",
      "/images/processed_button.avif",
      "/images/wholesale_button.avif",
      "/images/home_icons/marinated.avif",
      "/images/why_adamsfoods.png",
      "/images/only_here.png",
    ],
    []
  );

  const secondaryImages = useMemo(
    () => [
      "/images/home_icons/deal.avif",
      "/images/home_icons/how_to_order.avif",
      "/images/home_icons/contact.avif",
      "/images/why_adamsfoods-1.png",
      "/images/why_adamsfoods-2.png",
      "/images/button.png",
    ],
    []
  );

  const preloadImages = async (imageUrls, priority = "high") => {
    const preloadPromises = imageUrls.map((url, index) => {
      return new Promise((resolve) => {
        const img = document.createElement("img");

        img.onload = () => resolve({ url, success: true });
        img.onerror = () => {
          if (url.includes(".avif")) {
            const fallbackUrl = url
              .replace(".avif", ".jpg")
              .replace(".avif", ".png");
            const fallbackImg = document.createElement("img");
            fallbackImg.onload = () =>
              resolve({ url: fallbackUrl, success: true });
            fallbackImg.onerror = () => resolve({ url, success: false });
            fallbackImg.src = fallbackUrl;
          } else {
            resolve({ url, success: false });
          }
        };

        if (priority === "low") {
          setTimeout(() => {
            img.src = url;
          }, index * 50);
        } else {
          img.src = url;
        }
      });
    });

    return Promise.allSettled(preloadPromises);
  };

  useEffect(() => {
    const initializePage = async () => {
      const criticalPreloading = preloadImages(criticalImages, "high");

      const [, criticalResults] = await Promise.all([
        new Promise((resolve) => setTimeout(resolve, 300)),
        criticalPreloading,
      ]);

      setImagesPreloaded(true);

      preloadImages(secondaryImages, "low");

      setPageLoading(false);
    };

    initializePage();
  }, [criticalImages, secondaryImages]);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const searchItems = async () => {
    setIsLoading(true);
    try {
      const url = `${API_CONFIG.BASE_URL}/api/items`;
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

  const OptimizedImage = ({ src, fallbackSrc, alt, ...props }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageSrc, setImageSrc] = useState(src);

    useEffect(() => {
      if (imagesPreloaded && criticalImages.includes(src)) {
        setImageLoaded(true);
        return;
      }

      const img = document.createElement("img");
      img.onload = () => {
        setImageSrc(src);
        setImageLoaded(true);
      };
      img.onerror = () => {
        if (fallbackSrc) {
          setImageSrc(fallbackSrc);
        }
        setImageLoaded(true);
      };
      img.src = src;
    }, [src, fallbackSrc, imagesPreloaded]);

    return (
      <Image
        {...props}
        src={imageSrc}
        alt={alt}
        opacity={imageLoaded ? 1 : 0.7}
        transition="opacity 0.3s ease"
        fallbackSrc={fallbackSrc}
        onLoad={() => setImageLoaded(true)}
      />
    );
  };
  if (pageLoading) {
    return (
      <HomeSkeleton isOpen={isOpen} onClose={onClose} contentRef={contentRef} />
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
          <OptimizedImage
            src="/images/gray_adams.png"
            alt="AdamsFoods Logo"
            width="40%"
          />
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
        <Box px={4} mb={6} position="relative" pt={2} ref={searchRef}>
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
                  _hover={{cursor:"pointer"}}
                />
              </InputRightElement>
            </InputGroup>
          </form>

          {/* API Status Indicator
          {apiStatus === "disconnected" && (
            <Text fontSize="xs" color="orange.600" textAlign="center" mt={2}>
              API disconnected - showing sample data
            </Text>
          )} */}

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
                {searchResults.map(
                  (item) =>
                    item.show && (
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
                              src="images/gray.avif"
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
                    )
                )}
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
                  {searchResults.map(
                    (item) =>
                      item.show && (
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
                            <OptimizedImage
                              src={
                                item.images > 0
                                  ? `/products/${item.style}/${item.name}/01.avif`
                                  : "/images/gray.avif"
                              }
                              fallbackSrc={
                                item.images > 0
                                  ? `/products/${item.style}/${item.name}/01.jpg`
                                  : "/images/gray.avif"
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
                      )
                  )}
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
        <Grid
          templateColumns="repeat(3, 1fr)"
          gap={4}
          px={4}
          mb={8}
          overflowX="auto"
        >
          {[
            {
              name: "Marinated",
              url: "/wholesale/marinated",
              image: "/images/marinated_button.avif",
              fallback: "images/marinated_button.png",
            },
            {
              name: "Prepped",
              url: "/wholesale/processed",
              image: "/images/processed_button.avif",
              fallback: "images/processed_button.png",
            },
            {
              name: "Untrimmed",
              url: "/wholesale/unprocessed",
              image: "/images/wholesale_button.avif",
              fallback: "/images/wholesale_button.png",
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
                  <OptimizedImage
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

          {[
            {
              name: "Deal",
              icon: (
                <OptimizedImage
                  src="/images/home_icons/deal.avif"
                  fallbackSrc="/images/home_icons/deal.jpg"
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
                <OptimizedImage
                  src="/images/home_icons/how_to_order.avif"
                  fallbackSrc="/images/home_icons/how_to_order.jpg"
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
                <OptimizedImage
                  src="/images/home_icons/contact.avif"
                  fallbackSrc="/images/home_icons/contact.jpg"
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
              <VStack spacing={2} my={4}>
                <Circle
                  size="75px"
                  bg={COLORS.GRAY_MEDIUM}
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
        {/* Categories */}
        {/* <Grid
          templateColumns="repeat(2, 1fr)"
          templateRows="repeat(2, 1fr)"
          gap={4}
          px={4}
          mb={8}
          overflowX="auto"
        >
          {[
            {
              name: "Marinated",
              url: "/wholesale/marinated",
              image: "/images/marinated_button.avif",
              fallback: "images/marinated_button.png",
            },
            {
              name: "Premium",
              url: "/wholesale/unprocessed",
              image: "/images/gray.avif",
              fallback: "/images/wholesale_button.png",
            },
            {
              name: "Prepped",
              url: "/wholesale/processed",
              image: "/images/processed_button.avif",
              fallback: "images/processed_button.png",
            },
            {
              name: "Untrimmed",
              url: "/wholesale/unprocessed",
              image: "/images/wholesale_button.avif",
              fallback: "/images/wholesale_button.png",
            },
          ].map((category, idx) => (
            <GridItem key={idx}>
              <Flex
                border="1px"
                spacing={2}
                cursor="pointer"
                onClick={() => navigate(category.url)}
                alignContent="center"
                borderRadius="full"
              >
                <Box
                  size="75px"
                  bg="white"
                  border="1px"
                  borderColor="gray.100"
                  overflow="hidden"
                  borderRadius="full"
                >
                  <OptimizedImage
                    src={category.image}
                    fallbackSrc={category.fallback}
                    alt={category.name}
                    width="75px"
                    height="75px"
                    // objectFit="cover"
                  />
                </Box>
                <Text fontSize="sm" fontWeight="semibold">
                  {category.name}
                </Text>
              </Flex>
            </GridItem>
          ))}
        </Grid>
        <Grid
          templateColumns="repeat(3, 1fr)"
          gap={4}
          px={4}
          mb={8}
          overflowX="auto"
        >
          {[
            {
              name: "Deal",
              icon: (
                <OptimizedImage
                  src="/images/home_icons/deal.avif"
                  fallbackSrc="/images/home_icons/deal.jpg"
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
                <OptimizedImage
                  src="/images/home_icons/how_to_order.avif"
                  fallbackSrc="/images/home_icons/how_to_order.jpg"
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
                <OptimizedImage
                  src="/images/home_icons/contact.avif"
                  fallbackSrc="/images/home_icons/contact.jpg"
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
              <VStack spacing={2} my={4}>
                <Circle
                  size="75px"
                  bg={COLORS.GRAY_MEDIUM}
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
        </Grid> */}

        {/* Location */}
        <HStack px={6} mb={3} spacing={2} ml={2}>
          <OptimizedImage
            src="/images/only_here.png"
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
              <OptimizedImage
                src="/images/home_icons/marinated.avif"
                fallbackSrc="/images/home_icons/marinated.jpg"
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
                Marinated Sliced Boneless Beef Chuck (Beef Bulgogi)
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
                <OptimizedImage
                  src="/images/button.png"
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
            <OptimizedImage
              src="/images/why_adamsfoods.png"
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
                  <OptimizedImage
                    src="/images/why_adamsfoods-1.png"
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
                  <OptimizedImage
                    src="/images/why_adamsfoods-2.png"
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
            color={COLORS.ACCENT}
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
