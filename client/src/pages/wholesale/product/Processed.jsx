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
import { ProductTabs } from "../../../components/shop/ProductGrid";

const API_URL = import.meta.env.MODE === 'production' 
  ? import.meta.env.VITE_API_URL 
  : import.meta.env.VITE_API_URL_DEV;

const ProcessedPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch processed products
  useEffect(() => {
    const fetchProcessedProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_URL}/api/items/style/processed`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch products");
        }

        setProducts(data.data);
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
              <Text>Loading prepped products...</Text>
            </VStack>
          </Box>
        </Container>
      </Sidebar>
    );
  }

  if (error) {
    return (
      <Sidebar>
        <Container
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
              <Text>{error}</Text>
            </Alert>
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
        position="relative"
      >
        <Navbar onOpen={onOpen} />

        <VStack spacing={0}>
          <Box fontSize="2xl" fontWeight="semibold" mb={4}>
            Prepped Meat
          </Box>

          <ProductTabs products={products} getProductsByType={getProductsByType} productType="prepped"/>

        </VStack>

        <Footer />
      </Container>
    </Sidebar>
  );
};

export default ProcessedPage;
