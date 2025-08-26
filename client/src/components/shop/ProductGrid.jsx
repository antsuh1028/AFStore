import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Container,
  Text,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Image,
  Button,
  VStack,
  Heading,
} from "@chakra-ui/react";
import { ProductCard } from "./ProductCard";
import ProductCardSkeleton from "../skeletons/ProductCardSkeleton";
import Sidebar from "../SideBar";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../../constants";

export const ErrorMessage = ({ error, onOpen }) => {
  const navigate = useNavigate();

  return (
    <Sidebar>
      <Container
        maxW={{ base: "100%", lg: "30%" }}
        p={0}
        bg="white"
        boxShadow="xl"
        ml={{ base: 0, lg: "40%" }}
        minHeight="100vh"
      >
        <Navbar onOpen={onOpen} home={true} />

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
                Something went wrong
              </Heading>
              <Text
                fontSize="sm"
                color="gray.600"
                maxW="280px"
                textAlign="center"
              >
                {error ||
                  "We're having trouble loading this page. Please try again."}
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
                onClick={() => window.location.reload()}
              >
                Try Again
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
};

const renderProductGrid = (
  filteredProducts,
  emptyMessage,
  isLoading = false,
) => {
  const visibleProducts = filteredProducts.filter(
    (item) => item.show && item.images > 0
  );

  return (
    <Box minHeight="400px">
      {isLoading ? (
        <SimpleGrid columns={2} spacing={2} pb={8}>
          {Array(6)
            .fill()
            .map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
        </SimpleGrid>
      ) : visibleProducts.length === 0 ? (
        <Box
          textAlign="center"
          py={8}
          display="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="300px"
        >
          <Text color="gray.500">{emptyMessage}</Text>
        </Box>
      ) : (
        <SimpleGrid columns={2} spacing={2} pb={8}>
          {visibleProducts.map((item) => (
            <ProductCard key={item.id} {...item}/>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export const ProductTabs = ({
  products,
  getProductsByType,
  productType,
  loading = false,
}) => {
  const [preloadedTabs, setPreloadedTabs] = useState(new Set([0]));
  const [imagePreloadCache, setImagePreloadCache] = useState(new Set());

  const tabData = useMemo(
    () => [
      { key: "all", products: products, label: "All" },
      { key: "beef", products: getProductsByType("beef"), label: "Beef" },
      { key: "pork", products: getProductsByType("pork"), label: "Pork" },
      {
        key: "chicken",
        products: getProductsByType("chicken"),
        label: "Poultry",
      },
    ],
    [products, getProductsByType]
  );

  const preloadTabImages = useCallback(
    (tabProducts, tabIndex) => {
      if (preloadedTabs.has(tabIndex)) return;

      const imageUrls = tabProducts
        .filter((item) => item.show && item.name && item.style)
        .slice(0, 8)
        .map((product) => ({
          avif: `/products/${product.style}/${product.name}/01.avif`,
          jpg: `/products/${product.style}/${product.name}/01.jpg`,
          id: `${product.style}-${product.name}`,
        }));

      imageUrls.forEach(({ avif, jpg, id }) => {
        if (imagePreloadCache.has(id)) return;

        const preloadImage = () => {
          const img = document.createElement("img");

          img.onload = () => {
            setImagePreloadCache((prev) => new Set([...prev, id]));
          };

          img.onerror = () => {
            const fallbackImg = document.createElement("img");
            fallbackImg.onload = () => {
              setImagePreloadCache((prev) => new Set([...prev, id]));
            };
            fallbackImg.onerror = () => {
              setImagePreloadCache(
                (prev) => new Set([...prev, id + "-failed"])
              );
            };
            fallbackImg.src = jpg;
          };

          img.src = avif;
        };

        setTimeout(preloadImage, 100);
      });

      setPreloadedTabs((prev) => new Set([...prev, tabIndex]));
    },
    [preloadedTabs, imagePreloadCache]
  );

  useEffect(() => {
    if (tabData[0]?.products.length > 0) {
      preloadTabImages(tabData[0].products, 0);
    }
  }, [tabData, preloadTabImages]);

  const handleTabChange = useCallback(
    (index) => {
      const selectedTabData = tabData[index];
      if (selectedTabData && !preloadedTabs.has(index)) {
        preloadTabImages(selectedTabData.products, index);
      }
    },
    [tabData, preloadTabImages, preloadedTabs]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const tabIndex = parseInt(entry.target.dataset.tabIndex);
            if (!isNaN(tabIndex) && !preloadedTabs.has(tabIndex)) {
              preloadTabImages(tabData[tabIndex]?.products || [], tabIndex);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const tabPanels = document.querySelectorAll("[data-tab-index]");
    tabPanels.forEach((panel) => observer.observe(panel));

    return () => observer.disconnect();
  }, [tabData, preloadTabImages, preloadedTabs]);

  return (
    <Tabs
      w="100%"
      variant="unstyled"
      isFitted={false}
      onChange={handleTabChange}
    >
      <TabList justifyContent="center" gap={4} mb={6} overflowX="auto">
        {tabData.map(({ label }, index) => (
          <Tab
            key={label}
            _selected={{
              fontWeight: "bold",
              textDecoration: "underline",
              bg: "transparent",
            }}
            _focus={{ boxShadow: "none" }}
            p={0}
            transition="none"
          >
            <Box
              border="1px"
              borderColor="gray.300"
              borderRadius="full"
              px={4}
              py={1}
              bg="#fafafa"
              color="gray.600"
              fontSize="small"
              transition="none"
              position="relative"
            >
              {label}
            </Box>
          </Tab>
        ))}
      </TabList>

      <TabPanels minHeight="500px">
        {tabData.map(({ key, products: tabProducts, label }, index) => (
          <TabPanel key={key} p={2} data-tab-index={index}>
            {renderProductGrid(
              tabProducts,
              `No ${productType} ${key === "all" ? "" : key} products found`,
              loading,
            )}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};
