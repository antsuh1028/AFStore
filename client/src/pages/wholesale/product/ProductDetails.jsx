import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { addToCart, getCart, subtractFromCart, removeFromCart } from "../../../utils/cartActions";
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Image,
  VStack,
  HStack,
  Badge,
  Button,
  IconButton,
  Divider,
  Grid,
  GridItem,
  Spinner,
  Alert,
  AlertIcon,
  useDisclosure,
  Collapse,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  MapPin,
  Clock,
  Thermometer,
  Package,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { FiPackage, FiThermometer, FiTruck, FiClock } from "react-icons/fi";

import NavDrawer from "../../../components/NavDrawer";
import Sidebar from "../../../components/SideBar";
import Breadcrumbs from "../../../components/BreadCrumbs.";
import Footer from "../../../components/Footer";

const ProductDetailPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const { productId } = useParams();
  const contentRef = useRef(null);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isIngredientsOpen, setIsIngredientsOpen] = useState(false);

  const [imagePage, setImagePage] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3001/api/items/${productId}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Product not found");
        }

        setProduct(data.data);
        const imageResponse = await fetch(
          `http://localhost:3001/api/s3/item/${productId}/images`
        );
        const imageData = await imageResponse.json();

        if (!imageResponse.ok) {
          throw new Error(imageData.error || "Failed to fetch images");
        }
        // If images are returned as URLs, set them directly
        if (imageData.images && imageData.images.length > 0) {
          setProduct((prevProduct) => ({
            ...prevProduct,
            images: imageData.images,
          }));
        }

        // If images are returned as keys, construct URLs
      } catch (err) {
        setError(err.message);
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [productId]);

  const handleContactForOrder = () => {
    navigate("/contact", {
      state: product,
    });
  };

  if (loading) {
    return (
      <Sidebar>
        <NavDrawer
          isOpen={isOpen}
          onClose={onClose}
          containerRef={contentRef}
        />
        <Container
          ref={contentRef}
          maxW={{ base: "100%", lg: "30%" }}
          p={0}
          bg="white"
          border={{ base: "none", lg: "1px" }}
          ml={{ base: 0, lg: "40%" }}
          minHeight="100vh"
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minH="400px"
          >
            <VStack spacing={4}>
              <Spinner size="xl" color="blue.500" />
              <Text>Loading product...</Text>
            </VStack>
          </Box>
        </Container>
      </Sidebar>
    );
  }

  if (error) {
    return (
      <Sidebar>
        <NavDrawer
          isOpen={isOpen}
          onClose={onClose}
          containerRef={contentRef}
        />
        <Container
          ref={contentRef}
          maxW={{ base: "100%", lg: "30%" }}
          p={0}
          bg="white"
          border={{ base: "none", lg: "1px" }}
          ml={{ base: 0, lg: "40%" }}
          minHeight="100vh"
        >
          <Box p={8}>
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <Box>
                <Text fontWeight="bold">Error!</Text>
                <Text>{error}</Text>
              </Box>
            </Alert>
            <Button mt={4} onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </Box>
        </Container>
      </Sidebar>
    );
  }

  if (!product) {
    return (
      <Sidebar>
        <NavDrawer
          isOpen={isOpen}
          onClose={onClose}
          containerRef={contentRef}
        />
        <Container
          ref={contentRef}
          maxW={{ base: "100%", lg: "30%" }}
          p={0}
          bg="white"
          border={{ base: "none", lg: "1px" }}
          ml={{ base: 0, lg: "40%" }}
          minHeight="100vh"
        >
          <Box p={8} textAlign="center">
            <Heading mb={4}>Product Not Found</Heading>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </Box>
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
        border={{ base: "none", lg: "1px" }}
        ml={{ base: 0, lg: "40%" }}
        minHeight="100vh"
      >
        {/* Header */}
        <Box>
          <Flex p={4} justify="space-between" align="center">
            <IconButton
              aria-label="Back"
              icon={<ChevronLeft size={24} />}
              variant="ghost"
              size="sm"
              colorScheme="gray"
              onClick={() => navigate(`/wholesale/${product.style}`)}
            />
            <IconButton
              aria-label="Menu"
              size="sm"
              icon={<Text>☰</Text>}
              variant="ghost"
              onClick={onOpen}
            />
          </Flex>
        </Box>

        {/* Breadcrumbs */}
        <Box py={3} px={4} display="flex" justifyContent="center">
          <Breadcrumbs
            listOfBreadCrumbs={[
              { label: "Home", url: "/" },
              {
                label:
                  product.style.charAt(0).toUpperCase() +
                  product.style.slice(1),
                url: `/wholesale/${product.style}`,
              },
              { label: (product?.name || "Product").substring(0, 30) + "..." },
            ]}
          />
        </Box>

        {/* Product Content */}
        <VStack spacing={4} px={4} pb={8}>
          {/* Product Title */}
          <Heading
            as="h1"
            size="md"
            textAlign="left"
            w="100%"
            lineHeight="1.3"
            mt={8}
            mb={2}
            ml={4}
          >
            {product.name}
          </Heading>

          <Box position="relative" w="100%">
            <Image
              src={product.images?.[imagePage - 1] || "/gray.avif"}
              alt={product.name}
              w="100%"
              h="280px"
              objectFit="cover"
              borderRadius="lg"
            />

            {product.images && product.images.length > 1 && (
              <>
                {/* Left Arrow */}
                <IconButton
                  aria-label="previous-image"
                  icon={<ChevronLeft size={20} />}
                  variant="ghost"
                  size="sm"
                  position="absolute"
                  left="2"
                  top="50%"
                  transform="translateY(-50%)"
                  bg="blackAlpha.600"
                  color="white"
                  borderRadius="full"
                  _hover={{ bg: "blackAlpha.800" }}
                  disabled={imagePage <= 1}
                  onClick={() => {
                    if (imagePage > 1) {
                      setImagePage(imagePage - 1);
                    }
                  }}
                  _disabled={{
                    color: "whiteAlpha.300",
                    cursor: "not-allowed",
                    opacity: 0.4,
                    bg: "blackAlpha.400",
                  }}
                />

                {/* Right Arrow */}
                <IconButton
                  aria-label="next-image"
                  icon={<ChevronRight size={20} />}
                  variant="ghost"
                  size="sm"
                  position="absolute"
                  right="2"
                  top="50%"
                  transform="translateY(-50%)"
                  bg="blackAlpha.600"
                  color="white"
                  borderRadius="full"
                  _hover={{ bg: "blackAlpha.800" }}
                  disabled={imagePage >= product.images.length}
                  onClick={() => {
                    if (imagePage < product.images.length) {
                      setImagePage(imagePage + 1);
                    }
                  }}
                  _disabled={{
                    color: "whiteAlpha.300",
                    cursor: "not-allowed",
                    opacity: 0.4,
                    bg: "blackAlpha.400",
                  }}
                />

                <HStack
                  position="absolute"
                  bottom="4"
                  left="50%"
                  transform="translateX(-50%)"
                  spacing={2}
                >
                  {product.images.map((_, index) => (
                    <Box
                      key={index}
                      w="8px"
                      h="8px"
                      borderRadius="full"
                      bg={imagePage === index + 1 ? "white" : "whiteAlpha.500"}
                      cursor="pointer"
                      onClick={() => setImagePage(index + 1)}
                      transition="all 0.2s"
                      _hover={{ bg: "white" }}
                    />
                  ))}
                </HStack>
              </>
            )}

            {/* Image counter in top right */}
            <Box
              position="absolute"
              top="4"
              right="4"
              bg="blackAlpha.700"
              color="white"
              px={2}
              py={1}
              borderRadius="md"
              fontSize="xs"
            >
              {imagePage}/{product.images?.length || 1}
            </Box>
          </Box>

          {/* Contact and Price Section */}
          <HStack
            w="100%"
            spacing={0}
            px={4}
            align="center"
            justify="space-between"
          >
            <HStack>
              <Button
                bg="#494949"
                color="white"
                size="md"
                onClick={handleContactForOrder}
                _hover={{ bg: "#6AAFDB" }}
                borderRadius="full"
                px={8}
              >
                CONTACT US
              </Button>
              <IconButton
                icon={<ShoppingCart size={20} />}
                aria-label="Add to cart"
                colorScheme="gray"
                size="md"
                bg="white"
                borderRadius="full"
                onClick={()=>{console.log("Product Info:", product); addToCart(product); getCart();}}
              />
            </HStack>
            <Text fontSize="xl" fontWeight="bold" color="black">
              ${product.price}
            </Text>
          </HStack>

          <VStack spacing={2} align="stretch" w="100%">
            <Box bg="#f9f9f9" p={4} borderRadius="md">
              <HStack spacing={2}>
                <CheckCircleIcon color="green.500" />
                <VStack align="flex-start" spacing={0}>
                  <Text fontSize="sm" fontWeight="medium">
                    Pick up available at DTLA Warehouse
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Usually ready in 24 hours
                  </Text>
                </VStack>
              </HStack>
            </Box>

            <VStack align="flex-start" px={8} spacing={3}>
              <HStack>
                <FiThermometer />
                <Text fontSize="sm">Keep frozen</Text>
              </HStack>
              <HStack>
                <FiTruck />
                <Text fontSize="sm">
                  Free local shipping in orders over $3000
                </Text>
              </HStack>
              <HStack>
                <WarningIcon />
                <Text fontSize="sm">Cook thoroughly before consumption</Text>
              </HStack>
              <HStack>
                <FiPackage />
                <Text fontSize="sm">
                  Pack Date: See package label for details
                </Text>
              </HStack>
            </VStack>
          </VStack>

          {/* Collapsible Sections */}

          {/* DETAIL Section */}
          <Box w="100%" border="1px" borderColor="gray.100" borderRadius="md">
            <Button
              w="100%"
              justifyContent="space-between"
              variant="ghost"
              onClick={() => setIsDetailOpen(!isDetailOpen)}
              rightIcon={isDetailOpen ? <ChevronUp /> : <ChevronDown />}
              fontWeight="bold"
              py={4}
            >
              DETAIL
            </Button>
            <Collapse in={isDetailOpen}>
              <Box px={4} pb={4}>
                <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4}>
                  <GridItem>
                    <Text fontSize="sm" color="gray.500">
                      Brand
                    </Text>
                    <Text fontWeight="medium">{product.brand}</Text>
                  </GridItem>
                  <GridItem>
                    <Text fontSize="sm" color="gray.500">
                      Grade
                    </Text>
                    <Text fontWeight="medium">{product.grade}</Text>
                  </GridItem>
                  <GridItem>
                    <Text fontSize="sm" color="gray.500">
                      Origin
                    </Text>
                    <Text fontWeight="medium">{product.origin}</Text>
                  </GridItem>
                  <GridItem>
                    <Text fontSize="sm" color="gray.500">
                      Weight
                    </Text>
                    <Text fontWeight="medium">{product.avg_weight} lbs</Text>
                  </GridItem>
                </Grid>
                <Text fontSize="sm" color="gray.600">
                  Specifications: {product.spec}
                </Text>
              </Box>
            </Collapse>
          </Box>

          {/* INFORMATION Section */}
          <Box w="100%" border="1px" borderColor="gray.100" borderRadius="md">
            <Button
              w="100%"
              justifyContent="space-between"
              variant="ghost"
              onClick={() => setIsInfoOpen(!isInfoOpen)}
              rightIcon={isInfoOpen ? <ChevronUp /> : <ChevronDown />}
              fontWeight="bold"
              py={4}
            >
              INFORMATION
            </Button>
            <Collapse in={isInfoOpen}>
              <Box px={4} pb={4}>
                <Text fontSize="sm" color="gray.700" lineHeight="tall">
                  {product.description}
                </Text>
                <Box mt={4}>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Storage Instructions:
                  </Text>
                  <List spacing={1} fontSize="sm" color="gray.600">
                    <ListItem>• Keep frozen until ready to use</ListItem>
                    <ListItem>• Thaw in refrigerator before cooking</ListItem>
                    <ListItem>• Cook thoroughly before consumption</ListItem>
                    <ListItem>• Do not refreeze once thawed</ListItem>
                  </List>
                </Box>
              </Box>
            </Collapse>
          </Box>

          {/* INGREDIENTS Section */}
          <Box w="100%" border="1px" borderColor="gray.100" borderRadius="md">
            <Button
              w="100%"
              justifyContent="space-between"
              variant="ghost"
              onClick={() => setIsIngredientsOpen(!isIngredientsOpen)}
              rightIcon={isIngredientsOpen ? <ChevronUp /> : <ChevronDown />}
              fontWeight="bold"
              py={4}
            >
              INGREDIENTS
            </Button>
            <Collapse in={isIngredientsOpen}>
              <Box px={4} pb={4}>
                <Text fontSize="sm" color="gray.700" lineHeight="tall">
                  {product.ingredients || "Ingredients Here"}
                </Text>
                <Box mt={4}>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Allergen Information:
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {/* Contains: Soy, Sesame. May contain traces of wheat and nuts. */}
                    Allergen Info Here
                  </Text>
                </Box>
              </Box>
            </Collapse>
          </Box>

          {/* Additional Info */}
          <Box bg="gray.50" p={4} borderRadius="md" w="100%">
            <Text fontSize="sm" color="gray.600" textAlign="center">
              <strong>Wholesale Only:</strong> This product is available
              exclusively for wholesale customers with valid licensing.
            </Text>
          </Box>
        </VStack>

        <Footer />
      </Container>
    </Sidebar>
  );
};

export default ProductDetailPage;
