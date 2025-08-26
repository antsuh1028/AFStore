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
  Center,
  Link,
} from "@chakra-ui/react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  InfoIcon,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { FiPackage, FiThermometer, FiTruck } from "react-icons/fi";

import NavDrawer from "../NavDrawer";
import Sidebar from "../SideBar";
import Breadcrumbs from "../Breadcrumbs";
import Footer from "../Footer";
import ProductDetailSkeleton from "../skeletons/ProductDetailsSkeleton";

import { useAuthContext } from "../../hooks/useAuth";
import { COLORS, API_CONFIG } from "../../constants";
import Navbar from "../Navbar";
import { useLanguage } from "../../hooks/LanguageContext";
import { translator } from "../../utils/translator";

const ProductImageCarousel = ({ productName, productStyle, productImages }) => {
  const [imagePage, setImagePage] = useState(1);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [failedImages, setFailedImages] = useState(new Set());
  const [isCurrentImageLoading, setIsCurrentImageLoading] = useState(true);

  // Touch/swipe state
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const imagePaths = useMemo(() => {
    if (!productName || !productStyle || !productImages) {
      return [{ primary: "/images/gray.avif", fallback: "/images/gray.avif" }];
    }

    const basePath = `/products/${productStyle}/${productName}`;
    const paths = [];

    for (let i = 1; i <= productImages; i++) {
      const imageNumber = i.toString().padStart(2, "0");
      paths.push({
        primary: `${basePath}/${imageNumber}.avif`,
        fallback: `${basePath}/${imageNumber}.jpg`,
        id: `${productName}-${i}`,
      });
    }

    return paths.length > 0
      ? paths
      : [{ primary: "/images/gray.avif", fallback: "/images/gray.avif" }];
  }, [productName, productStyle, productImages]);

  useEffect(() => {
    const preloadImage = (imagePath, imageId) => {
      return new Promise((resolve) => {
        const img = document.createElement("img");

        img.onload = () => {
          setLoadedImages((prev) => new Set([...prev, imageId + "-primary"]));
          resolve({ success: true, type: "primary" });
        };

        img.onerror = () => {
          const fallbackImg = document.createElement("img");
          fallbackImg.onload = () => {
            setLoadedImages(
              (prev) => new Set([...prev, imageId + "-fallback"])
            );
            resolve({ success: true, type: "fallback" });
          };
          fallbackImg.onerror = () => {
            setFailedImages((prev) => new Set([...prev, imageId]));
            resolve({ success: false });
          };
          fallbackImg.src = imagePath.fallback;
        };

        img.src = imagePath.primary;
      });
    };

    const currentImagePath = imagePaths[imagePage - 1];
    if (currentImagePath) {
      preloadImage(currentImagePath, currentImagePath.id).then(() => {
        setIsCurrentImageLoading(false);
      });

      const adjacentIndices = [imagePage - 2, imagePage].filter(
        (index) => index >= 0 && index < imagePaths.length
      );

      adjacentIndices.forEach((index) => {
        const imagePath = imagePaths[index];
        if (imagePath) {
          preloadImage(imagePath, imagePath.id);
        }
      });
    }
  }, [imagePaths, imagePage]);

  const getCurrentImageSrc = useCallback(() => {
    const currentImagePath = imagePaths[imagePage - 1];
    if (!currentImagePath) return "/images/gray.avif";

    const { id, primary, fallback } = currentImagePath;

    if (loadedImages.has(id + "-primary")) {
      return primary;
    } else if (loadedImages.has(id + "-fallback")) {
      return fallback;
    } else if (failedImages.has(id)) {
      return "/images/gray.avif";
    }

    return primary;
  }, [imagePaths, imagePage, loadedImages, failedImages]);

  const hasMultipleImages = imagePaths.length > 1;

  const nextImage = useCallback(() => {
    if (imagePage < imagePaths.length) {
      setImagePage((prev) => prev + 1);
      setIsCurrentImageLoading(true);
    }
  }, [imagePage, imagePaths.length]);

  const prevImage = useCallback(() => {
    if (imagePage > 1) {
      setImagePage((prev) => prev - 1);
      setIsCurrentImageLoading(true);
    }
  }, [imagePage]);

  const goToImage = useCallback((index) => {
    setImagePage(index + 1);
    setIsCurrentImageLoading(true);
  }, []);

  // Touch handlers for swipe functionality
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50; // Swipe left (next image)
    const isRightSwipe = distance < -50; // Swipe right (previous image)

    if (isLeftSwipe && hasMultipleImages) {
      nextImage();
    } else if (isRightSwipe && hasMultipleImages) {
      prevImage();
    }
  };

  const currentImagePath = imagePaths[imagePage - 1];
  const isCurrentImageReady =
    currentImagePath &&
    (loadedImages.has(currentImagePath.id + "-primary") ||
      loadedImages.has(currentImagePath.id + "-fallback") ||
      failedImages.has(currentImagePath.id));

  return (
    <Box
      position="relative"
      w="100%"
      bg="gray.50"
      borderRadius="lg"
      overflow="hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Loading overlay */}
      {isCurrentImageLoading && !isCurrentImageReady && (
        <Center
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="gray.100"
          zIndex={2}
        >
          <Spinner size="lg" color="gray.500" />
        </Center>
      )}

      <Image
        src={getCurrentImageSrc()}
        alt={productName}
        w="100%"
        h="280px"
        objectFit="cover"
        opacity={isCurrentImageReady ? 1 : 0}
        transition="opacity 0.3s ease"
        onLoad={() => setIsCurrentImageLoading(false)}
        onError={() => setIsCurrentImageLoading(false)}
        fallbackSrc="/images/gray.avif"
      />

      {/* Navigation controls */}
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

          {/* Dot indicators */}
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
                boxShadow={
                  imagePage === index + 1
                    ? "0 0 0 2px rgba(255,255,255,0.8)"
                    : "none"
                }
              />
            ))}
          </HStack>
        </>
      )}

      {/* Image counter */}
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
        fontWeight="medium"
      >
        {imagePage}/{imagePaths.length}
      </Box>
    </Box>
  );
};

const CollapsibleSection = ({ title, isOpen, onToggle, children }) => (
  <Box w="100%" borderColor="gray.100" borderRadius="md">
    <Button
      w="100%"
      justifyContent="space-between"
      variant="ghost"
      onClick={onToggle}
      rightIcon={isOpen ? <ChevronUp /> : <ChevronDown />}
      fontWeight="extrabold"
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
  const { selectedLanguage } = useLanguage();
  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const productResponse = await fetch(
        `${API_CONFIG.BASE_URL}/api/items/${productId}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

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
            ? "Whole Meat"
            : product?.style === "premium"
            ? "Adams Gourmet"
            : product?.style?.charAt(0).toUpperCase() +
              product?.style?.slice(1),
        url: `/wholesale/${
          product?.style === "premium" ? "adams-gourmet" : product?.style
        }`,
      },
      { label: (product?.name || "Product").substring(0, 30) + "..." },
    ],
    [product?.style, product?.name]
  );

  if (loading) {
    return (
      <ProductDetailSkeleton
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        contentRef={contentRef}
      />
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
          boxShadow="xl"
          ml={{ base: 0, lg: "40%" }}
          minHeight="100vh"
        >
          <Navbar onOpen={onOpen} />
          <Box p={8} textAlign="center">
            <VStack spacing={6}>
              {/* Logo */}
              <Image
                src="/images/gray_adams.png"
                alt="AdamsFoods Logo"
                width="120px"
                opacity={0.8}
                mt={4}
              />

              {/* Error Message */}
              <VStack spacing={2}>
                <Heading size="md" color={COLORS.PRIMARY}>
                  Product Not Found
                </Heading>
                <Text
                  fontSize="sm"
                  color="gray.600"
                  maxW="280px"
                  textAlign="center"
                >
                  We couldn't find the product you're looking for. It may no
                  longer be available. We apologize for the inconvenience.
                </Text>
              </VStack>

              {/* Action Buttons */}
              <VStack spacing={3} w="full" maxW="200px">
                <Button
                  bg={COLORS.PRIMARY}
                  color="white"
                  borderRadius="full"
                  size="md"
                  width="100%"
                  _hover={{ bg: COLORS.SECONDARY }}
                  onClick={() => navigate(-1)}
                >
                  Go Back
                </Button>

                <Button
                  variant="outline"
                  borderColor={COLORS.PRIMARY}
                  color={COLORS.PRIMARY}
                  borderRadius="full"
                  size="md"
                  width="100%"
                  _hover={{ bg: "gray.50" }}
                  onClick={() => navigate("/")}
                >
                  Go Home
                </Button>
              </VStack>
            </VStack>
          </Box>

          <Footer />
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
        <Navbar onOpen={onOpen} />

        <Box py={3} px={4} display="flex" justifyContent="center">
          <Breadcrumbs listOfBreadCrumbs={breadcrumbs} />
        </Box>

        {/* Alerts*/}
        {/* Cart Success Alert */}
        <Box
          position="fixed"
          top={showCartAlert ? "20px" : "-100px"}
          left="50%"
          transform="translateX(-50%)"
          zIndex={9999}
          transition="all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
          opacity={showCartAlert ? 1 : 0}
          w="90%"
          maxW="400px"
        >
          <Alert
            status="success"
            borderRadius="lg"
            boxShadow="0 10px 30px rgba(0, 0, 0, 0.2)"
            bg="white"
            border="1px"
            borderColor="green.200"
          >
            <AlertIcon color="green.500" />
            <Box flex="1">
              <Text fontWeight="bold" color="green.800">
                Added to Cart!
              </Text>
              <Text fontSize="sm" color="gray.700">
                {product?.name} has been added to your cart.
              </Text>
              <Text
                fontSize="sm"
                color="green.600"
                textDecor="underline"
                cursor="pointer"
                _hover={{ color: "green.800" }}
                onClick={() => {
                  navigate(`/profile/user/${userId}`, {
                    state: { activeTab: 1 },
                  });
                  setShowCartAlert(false);
                }}
              >
                View in Cart →
              </Text>
            </Box>
            <IconButton
              size="sm"
              variant="ghost"
              icon="×"
              onClick={() => setShowCartAlert(false)}
              _hover={{ bg: "green.100" }}
            />
          </Alert>
        </Box>

        {/*Cart Reject Alert */}
        <Box
          position="fixed"
          top={showCartReject ? "20px" : "-100px"}
          left="50%"
          transform="translateX(-50%)"
          zIndex={9999}
          transition="all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
          opacity={showCartReject ? 1 : 0}
          w="90%"
          maxW="400px"
        >
          <Alert
            status="error"
            borderRadius="lg"
            boxShadow="0 10px 30px rgba(0, 0, 0, 0.2)"
            bg="white"
            border="1px"
            borderColor="red.200"
          >
            <AlertIcon color="red.500" />
            <Box flex="1">
              <Text fontWeight="bold" color="red.800">
                Failed Adding to Cart!
              </Text>
              <Text fontSize="sm" color="gray.700" mb={2}>
                Cart functionality requires cookies.
              </Text>
              <Button
                size="sm"
                colorScheme="red"
                variant="outline"
                onClick={handleAcceptCookies}
                _hover={{ bg: "red.50" }}
              >
                Accept Cookies & Add to Cart
              </Button>
            </Box>
            <IconButton
              size="sm"
              variant="ghost"
              icon="×"
              onClick={() => setShowCartReject(false)}
              _hover={{ bg: "red.100" }}
            />
          </Alert>
        </Box>

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
            productImages={product.images}
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
                bg={COLORS.PRIMARY}
                color="white"
                size="md"
                onClick={handleContactForOrder}
                _hover={{ bg: COLORS.SECONDARY }}
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
            {isAuthenticated ? (
              <Text fontSize="xl" fontWeight="bold" color="black">
                ${product.price}/lb
              </Text>
            ) : (
              <Link
                fontSize="sm"
                fontWeight="bold"
                color="black"
                p={2}
                textAlign="center "
                href="/login"
              >
                Login to see prices
              </Link>
            )}
          </HStack>

          <VStack spacing={2} align="stretch" w="100%" mb={4}>
            <Box bg={COLORS.GRAY_LIGHT} p={4} borderRadius="md">
              <HStack spacing={2}>
                <CheckCircleIcon color="green.500" />
                <VStack align="flex-start" spacing={0}>
                  {selectedLanguage.code === "en" ? (
                    <>
                      <Text fontSize="sm" fontWeight="medium">
                        Pick up available at DTLA Warehouse
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Usually ready in 24 hours
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text fontSize="sm" fontWeight="medium">
                        픽업은 DTLA DTLA Warehouse에서 가능합니다.
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        보통 24시간 내에 준비됩니다.
                      </Text>
                    </>
                  )}
                </VStack>
              </HStack>
            </Box>

            <VStack align="flex-start" px={8} spacing={3}>
              <HStack>
                <FiThermometer />
                <Text fontSize="sm">
                  {translator("Keep frozen", "냉동 보관해 주세요.")}
                </Text>
              </HStack>
              <HStack>
                <WarningIcon />
                <Text fontSize="sm">
                  {translator(
                    "Cook thoroughly before consumption",
                    "섭취 전에는 충분히 익혀서 드시기 바랍니다."
                  )}
                </Text>
              </HStack>
              <HStack>
                <FiPackage />
                <Text fontSize="sm">
                  {translator(
                    "Pack Date: See package label for details",
                    "포장일자는 패키지 라벨을 참고해 주세요."
                  )}
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
                <Text fontWeight="medium">{product.avg_weight} lbs / pack</Text>
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
            title="INGREDIENTS & ALLERGENS"
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
            <Box
              mt={4}
              p={3}
              bg="yellow.50"
              border="1px"
              borderColor="yellow.200"
              borderRadius="md"
            >
              <Flex
                fontSize="xs"
                color="gray.700"
                lineHeight="1.4"
                align="flex-start"
              >
                <Box mr={2} mt="1px">
                  <InfoIcon size={16} />
                </Box>
                <Box>
                  <Text as="span" fontWeight="semibold">
                    Important:
                  </Text>
                  <Text as="span">
                    {" "}
                    All products are processed in facilities that handle soy,
                    wheat, sesame, and other major allergens. Always verify
                    current allergen information on product packaging before
                    use.
                  </Text>
                </Box>
              </Flex>
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
