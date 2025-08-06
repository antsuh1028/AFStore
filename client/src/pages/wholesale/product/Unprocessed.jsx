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

const UnprocessedPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUnprocessedProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/api/items/style/unprocessed`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch products");
        }

        setProducts(data.data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching untrimmed products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUnprocessedProducts();
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
          <Navbar onOpen={onOpen} home={true} />
          <VStack spacing={0}>
            <Box fontSize="2xl" fontWeight="semibold" mb={4}>
              Untrimmed Meat
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
        <Navbar onOpen={onOpen} home={true} />
        <VStack spacing={0}>
          <Box fontSize="2xl" fontWeight="semibold" mb={4}>
            Untrimmed Meat
          </Box>

          <ProductTabs
            products={products}
            getProductsByType={getProductsByType}
            productType="untrimmed"
          />
        </VStack>

        <Footer />
      </Container>
    </Sidebar>
  );
};

export default UnprocessedPage;
