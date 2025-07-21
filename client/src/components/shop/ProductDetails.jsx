import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { addToCart, getCart } from "../../utils/cartActions";
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Image,
  VStack,
  HStack,
  Button,
  IconButton,
  Grid,
  GridItem,
  Spinner,
  Alert,
  AlertIcon,
  useDisclosure,
  Collapse,
  List,
  ListItem,
} from "@chakra-ui/react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { FiPackage, FiThermometer, FiTruck } from "react-icons/fi";

import NavDrawer from "../NavDrawer";
import Sidebar from "../SideBar";
import Breadcrumbs from "../Breadcrumbs";
import Footer from "../Footer";

import { useAuthContext } from "../../hooks/useAuth";

const API_URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_URL
    : import.meta.env.VITE_API_URL_DEV;

const ProductImageCarousel = ({ productName, productStyle }) => {
  const [imagePage, setImagePage] = useState(1);

  const imagePaths = useMemo(() => {
    if (!productName || !productStyle) return ["/gray.avif"];

    const basePath = `/products/${productStyle}/${productName}`;
    return [
      `${basePath}/01.jpg`,
      `${basePath}/02.jpg`,
      `${basePath}/03.jpg`,
      `${basePath}/04.jpg`,
    ];
  }, [productName, productStyle]);

  const currentImage = imagePaths[imagePage - 1] || "/gray.avif";
  const hasMultipleImages = imagePaths.length > 1;

  const nextImage = () => {
    if (imagePage < imagePaths.length) {
      setImagePage((prev) => prev + 1);
    }
  };

  const prevImage = () => {
    if (imagePage > 1) {
      setImagePage((prev) => prev - 1);
    }
  };

  const goToImage = (index) => {
    setImagePage(index + 1);
  };

  return (
    <Box position="relative" w="100%">
      <Image
        src={currentImage}
        alt={productName}
        w="100%"
        h="280px"
        objectFit="cover"
        borderRadius="lg"
        fallbackSrc="/gray.avif"
      />

      {hasMultipleImages && (
        <>
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
            onClick={prevImage}
            _disabled={{
              color: "whiteAlpha.300",
              cursor: "not-allowed",
              opacity: 0.4,
              bg: "blackAlpha.400",
            }}
          />

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
            disabled={imagePage >= imagePaths.length}
            onClick={nextImage}
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
            {imagePaths.map((_, index) => (
              <Box
                key={index}
                w="8px"
                h="8px"
                borderRadius="full"
                bg={imagePage === index + 1 ? "white" : "whiteAlpha.500"}
                cursor="pointer"
                onClick={() => goToImage(index)}
                transition="all 0.2s"
                _hover={{ bg: "white" }}
              />
            ))}
          </HStack>
        </>
      )}

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
        {imagePage}/{imagePaths.length}
      </Box>
    </Box>
  );
};

const CollapsibleSection = ({ title, isOpen, onToggle, children }) => (
  <Box w="100%" border="1px" borderColor="gray.100" borderRadius="md">
    <Button
      w="100%"
      justifyContent="space-between"
      variant="ghost"
      onClick={onToggle}
      rightIcon={isOpen ? <ChevronUp /> : <ChevronDown />}
      fontWeight="bold"
      py={4}
    >
      {title}
    </Button>
    <Collapse in={isOpen}>
      <Box px={4} pb={4} py={4}>
        {children}
      </Box>
    </Collapse>
  </Box>
);

const ProductDetailPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const { productId } = useParams();
  const contentRef = useRef(null);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCartAlert, setShowCartAlert] = useState(false);
  const [showCartReject, setShowCartReject] = useState(false);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isIngredientsOpen, setIsIngredientsOpen] = useState(false);

  const { userInfo, isAuthenticated, logout, userName, userId, userEmail } =
    useAuthContext();

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const productResponse = await fetch(`${API_URL}/api/items/${productId}`, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!productResponse.ok) {
        const errorData = await productResponse.json();
        throw new Error(errorData.error || "Product not found");
      }

      const productData = await productResponse.json();

      setProduct({
        ...productData.data,
        ingredients: productData.data.ingredients || [],
        allergens: productData.data.allergens || [],
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [fetchProduct]);

  const handleContactForOrder = useCallback(() => {
    navigate("/contact", { state: product });
  }, [navigate, product]);

  const handleAcceptCookies = useCallback(() => {
    localStorage.setItem("cookieAgreement", "accepted");
    setShowCartReject(false);
    addToCart(product);
    getCart();
    setShowCartAlert(true);
    setTimeout(() => setShowCartAlert(false), 5000);
  }, [product]);

  const handleAddToCart = useCallback(() => {
    if (localStorage.getItem("cookieAgreement") === "accepted") {
      addToCart(product);
      getCart();
      setShowCartAlert(true);
      setTimeout(() => setShowCartAlert(false), 5000);
    } else {
      setShowCartReject(true);
      setTimeout(() => setShowCartReject(false), 10000);
    }
  }, [product]);

  const handleBackNavigation = useCallback(() => {
    navigate(`/wholesale/${product.style}`);
  }, [navigate, product?.style]);

  const breadcrumbs = useMemo(
    () => [
      { label: "Home", url: "/" },
      {
        label:
          product?.style === "processed"
            ? "Prepped"
            : product?.style === "unprocessed"
            ? "Untrimmed"
            : product?.style?.charAt(0).toUpperCase() +
              product?.style?.slice(1),
        url: `/wholesale/${product?.style}`,
      },
      { label: (product?.name || "Product").substring(0, 30) + "..." },
    ],
    [product?.style, product?.name]
  );

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
        boxShadow="xl"
        ml={{ base: 0, lg: "40%" }}
        minHeight="100vh"
      >
        <Box>
          <Flex p={4} justify="space-between" align="center">
            <IconButton
              aria-label="Back"
              icon={<ChevronLeft size={24} />}
              variant="ghost"
              size="sm"
              colorScheme="gray"
              onClick={handleBackNavigation}
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

        <Box py={3} px={4} display="flex" justifyContent="center">
          <Breadcrumbs listOfBreadCrumbs={breadcrumbs} />
        </Box>

        {/* Alerts*/}
        {showCartAlert && (
          <Box px={4} mb={4}>
            <Alert status="success" borderRadius="md">
              <AlertIcon />
              <Box flex="1">
                <Text fontWeight="bold">Added to Cart!</Text>
                <Text>{product.name} has been added to your cart.</Text>
                <Text
                  textDecor="underline"
                  _hover={{ cursor: "pointer" }}
                  onClick={() => {
                    navigate(`/profile/user/${userId}`, {
                      state: { activeTab: 1 },
                    });
                    setShowCartAlert(false);
                  }}
                >
                  View in Cart.
                </Text>
              </Box>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowCartAlert(false)}
              >
                ×
              </Button>
            </Alert>
          </Box>
        )}

        {showCartReject && (
          <Box px={4} mb={4}>
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <Box flex="1">
                <Text fontWeight="bold">Failed Adding to Cart!</Text>
                <Text>
                  Cart functionality requires cookies.
                  <Button
                    variant="link"
                    colorScheme="blue"
                    ml={1}
                    onClick={handleAcceptCookies}
                  >
                    Accept Cookies & Add to Cart
                  </Button>
                </Text>
              </Box>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowCartReject(false)}
              >
                ×
              </Button>
            </Alert>
          </Box>
        )}

        <VStack spacing={4} px={4} pb={8}>
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

          <ProductImageCarousel
            productName={product.name}
            productStyle={product.style}
          />

          <HStack
            w="100%"
            spacing={0}
            px={4}
            align="center"
            justify="space-between"
          >
            <HStack overflow="auto">
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
              {isAuthenticated && (
                <IconButton
                  icon={<ShoppingCart size={20} />}
                  aria-label="Add to cart"
                  colorScheme="gray"
                  size="md"
                  bg="white"
                  borderRadius="full"
                  onClick={handleAddToCart}
                />
              )}
            </HStack>
            <Text fontSize="xl" fontWeight="bold" color="black">
              ${product.price}/lb
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

          <CollapsibleSection
            title="DETAIL"
            isOpen={isDetailOpen}
            onToggle={() => setIsDetailOpen(!isDetailOpen)}
          >
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
          </CollapsibleSection>

          <CollapsibleSection
            title="INFORMATION"
            isOpen={isInfoOpen}
            onToggle={() => setIsInfoOpen(!isInfoOpen)}
          >
            <Text fontSize="sm" color="gray.700" lineHeight="tall">
              {product.description}
            </Text>
            <Box mt={4}>
              <Text fontSize="sm" fontWeight="semibold" mb={2}>
                Storage Instructions:
              </Text>
              <List spacing={1} fontSize="sm" color="gray.600">
                <ListItem>• Keep frozen until ready to use</ListItem>
                <ListItem>• Thaw in refrigerator before cooking</ListItem>
                <ListItem>• Cook thoroughly before consumption</ListItem>
                <ListItem>• Do not refreeze once thawed</ListItem>
              </List>
            </Box>
          </CollapsibleSection>

          <CollapsibleSection
            title="INGREDIENTS"
            isOpen={isIngredientsOpen}
            onToggle={() => setIsIngredientsOpen(!isIngredientsOpen)}
          >
            <Text fontSize="sm" color="gray.700" lineHeight="tall">
              {product.ingredients?.join(", ") || "Ingredients Here"}
            </Text>
            <Box mt={4}>
              <Text fontSize="sm" fontWeight="semibold" mb={2}>
                Allergen Information:
              </Text>
              <Text fontSize="sm" color="gray.600">
                {product.allergens?.join(", ") ||
                  "Allergen information not provided."}
              </Text>
            </Box>
          </CollapsibleSection>

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
