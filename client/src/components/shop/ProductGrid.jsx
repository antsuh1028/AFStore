import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Text,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { ProductCard } from "./ProductCard";

const renderProductGrid = (filteredProducts, emptyMessage) => (
  <Box minHeight="400px">
    {filteredProducts.filter((item) => item.show).length === 0 ? (
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
        {filteredProducts
          .filter((item) => item.show)
          .map((item) => (
            <ProductCard key={item.id} {...item} />
          ))}
      </SimpleGrid>
    )}
  </Box>
);

export const ProductTabs = ({ products, getProductsByType, productType }) => {
  const [preloadedTabs, setPreloadedTabs] = useState(new Set([0])); // All tab is preloaded initially
  const [imagePreloadCache, setImagePreloadCache] = useState(new Set());

  // Memoize tab data to avoid recalculation
  const tabData = useMemo(() => [
    { key: "all", products: products, label: "All" },
    { key: "beef", products: getProductsByType("beef"), label: "Beef" },
    { key: "pork", products: getProductsByType("pork"), label: "Pork" },
    { key: "chicken", products: getProductsByType("chicken"), label: "Poultry" }
  ], [products, getProductsByType]);

  // Smart image preloading function
  const preloadTabImages = useCallback((tabProducts, tabIndex) => {
    if (preloadedTabs.has(tabIndex)) return;

    const imageUrls = tabProducts
      .filter(item => item.show && item.name && item.style)
      .slice(0, 8) // Only preload first 8 images per tab
      .map(product => ({
        avif: `/products/${product.style}/${product.name}/01.avif`,
        jpg: `/products/${product.style}/${product.name}/01.jpg`,
        id: `${product.style}-${product.name}`
      }));
    
    // Preload images asynchronously
    imageUrls.forEach(({ avif, jpg, id }) => {
      if (imagePreloadCache.has(id)) return;

      const preloadImage = () => {
        const img = document.createElement('img');
        
        img.onload = () => {
          setImagePreloadCache(prev => new Set([...prev, id]));
        };
        
        img.onerror = () => {
          // Try JPG fallback
          const fallbackImg = document.createElement('img');
          fallbackImg.onload = () => {
            setImagePreloadCache(prev => new Set([...prev, id]));
          };
          fallbackImg.onerror = () => {
            // Mark as failed but still cache to avoid retries
            setImagePreloadCache(prev => new Set([...prev, id + '-failed']));
          };
          fallbackImg.src = jpg;
        };
        
        img.src = avif;
      };

      // Delay preloading slightly to not block main thread
      setTimeout(preloadImage, 100);
    });

    setPreloadedTabs(prev => new Set([...prev, tabIndex]));
  }, [preloadedTabs, imagePreloadCache]);

  // Preload visible tab images on mount
  useEffect(() => {
    if (tabData[0]?.products.length > 0) {
      preloadTabImages(tabData[0].products, 0);
    }
  }, [tabData, preloadTabImages]);

  const handleTabChange = useCallback((index) => {
    const selectedTabData = tabData[index];
    if (selectedTabData && !preloadedTabs.has(index)) {
      preloadTabImages(selectedTabData.products, index);
    }
  }, [tabData, preloadTabImages, preloadedTabs]);

  // Intersection Observer for lazy loading when tabs come into view
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

    // Observe tab panels
    const tabPanels = document.querySelectorAll('[data-tab-index]');
    tabPanels.forEach(panel => observer.observe(panel));

    return () => observer.disconnect();
  }, [tabData, preloadTabImages, preloadedTabs]);

  return (
    <Tabs w="100%" variant="unstyled" isFitted={false} onChange={handleTabChange}>
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
              `No ${productType} ${key === 'all' ? '' : key} products found`
            )}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};