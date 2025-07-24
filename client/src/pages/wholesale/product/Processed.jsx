import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Container,
  useDisclosure,
  Text,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import NavDrawer from "../../../components/NavDrawer";
import Sidebar from "../../../components/SideBar";
import Footer from "../../../components/Footer";
import Navbar from "../../../components/Navbar";
import {
  ProductTabs,
  ErrorMessage,
} from "../../../components/shop/ProductGrid";
import { API_CONFIG } from "../../../constants";

const ProcessedPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Preload thumbnail images
  const preloadImages = (products) => {
    return new Promise((resolve) => {
      const imageUrls = products.map(
        (product) => `/products/processed/${product.name}/01.avif`
      );

      let loadedCount = 0;
      const totalImages = imageUrls.length;

      if (totalImages === 0) {
        resolve();
        return;
      }

      imageUrls.forEach((url) => {
        const img = new Image();
        img.onload = img.onerror = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            resolve();
          }
        };
        img.src = url;
      });
    });
  };

  // Fetch processed products
  useEffect(() => {
    const fetchProcessedProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/api/items/style/processed`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch products");
        }

        setProducts(data.data);

        // Preload thumbnail images
        await preloadImages(data.data);
        setImagesLoaded(true);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching prepped products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProcessedProducts();
  }, []);

  // Filter products by type
  const getProductsByType = (type) => {
    if (type === "all") return products;
    return products.filter(
      (product) => product.species?.toLowerCase() === type.toLowerCase()
    );
  };

  if (loading) {
    return (
      <Sidebar>
        <Container
          ref={contentRef}
          maxW={{ base: "100%", lg: "30%" }}
          p={0}
          bg="white"
          boxShadow="xl"
          ml={{ base: 0, lg: "40%" }}
          minHeight="100vh"
          position="relative"
        >
          <Navbar onOpen={onOpen} />
          <VStack spacing={0}>
            <Box fontSize="2xl" fontWeight="semibold" mb={4}>
              Prepped Meat
            </Box>
            <ProductTabs
              products={[]}
              getProductsByType={() => []}
              productType="unprocessed"
              loading={true}
            />
          </VStack>
          <Footer />
        </Container>
      </Sidebar>
    );
  }

  if (error) {
    return <ErrorMessage error={error} />;
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
        position="relative"
      >
        <Navbar onOpen={onOpen} />

        <VStack spacing={0}>
          <Box fontSize="2xl" fontWeight="semibold" mb={4}>
            Prepped Meat
          </Box>

          <ProductTabs
            products={products}
            getProductsByType={getProductsByType}
            productType="prepped"
          />
        </VStack>

        <Footer />
      </Container>
    </Sidebar>
  );
};

export default ProcessedPage;
