import React, { useState, useEffect, useRef } from "react";
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
  ChevronDown,
  ChevronUp,
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

  // Collapsible sections
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isIngredientsOpen, setIsIngredientsOpen] = useState(false);

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
      state: {
        productName: product.name,
        productId: product.id,
        quantity: quantity,
      },
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
              size="lg"
              colorScheme="gray"
              onClick={() => navigate(-1)}
            />
            <IconButton
              aria-label="Menu"
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
              { label: "Marinated", url: "/wholesale/marinated" },
              { label: (product?.name || "Product").substring(0, 30) + "..." },
            ]}
          />
        </Box>

        {/* Product Content */}
        <VStack spacing={4} px={4} pb={8}>
          {/* Product Title */}
          <Heading as="h1" size="md" textAlign="left" w="100%" lineHeight="1.3">
            {product.name}
          </Heading>

          {/* Product Image with overlay info */}
          <Box position="relative" w="100%">
            <Image
              src={product.images?.[0] || "/gray.avif"}
              alt={product.name}
              w="100%"
              h="280px"
              objectFit="cover"
              borderRadius="lg"
            />

            {/* Image overlay - quantity indicator */}
            <Box
              position="absolute"
              bottom="4"
              right="4"
              bg="blackAlpha.700"
              color="white"
              px={2}
              py={1}
              borderRadius="md"
              fontSize="sm"
            >
              1/3
            </Box>
          </Box>

          {/* Contact and Price Section */}
          <HStack w="100%" spacing={4} gap={24} px={4} align="center">
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
          <Box w="100%" border="1px" borderColor="gray.200" borderRadius="md">
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
          <Box w="100%" border="1px" borderColor="gray.200" borderRadius="md">
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
          <Box w="100%" border="1px" borderColor="gray.200" borderRadius="md">
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
                  {/* {product.type} ({product.origin}), Marinade (Soy Sauce, Sugar,
                  Garlic, Ginger, Sesame Oil, Rice Wine, Korean Chili Paste),
                  Natural Flavoring, Preservatives (Sodium Benzoate). */}
                  Ingredients Here
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
