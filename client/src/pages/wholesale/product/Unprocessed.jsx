import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Container,
  Flex,
  IconButton,
  useDisclosure,
  Text,
  VStack,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  SimpleGrid,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import NavDrawer from "../../../components/NavDrawer";
import Sidebar from "../../../components/SideBar";
import Footer from "../../../components/Footer";
import { ProductCard } from "../../../components/shop/ProductCard";
import Navbar from "../../../components/Navbar";

const API_URL = import.meta.env.MODE === 'production' 
  ? import.meta.env.VITE_API_URL 
  : import.meta.env.VITE_API_URL_DEV;

const UnprocessedPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch unprocessed products
  useEffect(() => {
    const fetchUnprocessedProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_URL}/api/items/style/unprocessed`
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

  // Render product grid with consistent height
  const renderProductGrid = (filteredProducts, emptyMessage) => (
    <Box minHeight="400px">
      {filteredProducts.length === 0 ? (
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
        <SimpleGrid columns={2} spacing={4} pb={8}>
          {filteredProducts
            .filter((item) => item.show)
            .map((item) => (
              <ProductCard key={item.id} {...item} />
            ))}
        </SimpleGrid>
      )}
    </Box>
  );

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
              <Text>Loading untrimmed products...</Text>
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
            Untrimmed Meat
          </Box>

          <Tabs w="100%" variant="unstyled" isFitted={false}>
            <TabList justifyContent="center" gap={4} mb={6}>
              {["all", "beef", "pork", "poultry"].map((label) => (
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
                  >
                    {label.charAt(0).toUpperCase() + label.slice(1)}
                  </Box>
                </Tab>
              ))}
            </TabList>

            <TabPanels minHeight="500px">
              <TabPanel p={0}>
                {renderProductGrid(products, "No untrimmed products found")}
              </TabPanel>

              <TabPanel p={0}>
                {renderProductGrid(
                  getProductsByType("beef"),
                  "No untrimmed beef products found"
                )}
              </TabPanel>

              <TabPanel p={0}>
                {renderProductGrid(
                  getProductsByType("pork"),
                  "No untrimmed pork products found"
                )}
              </TabPanel>

              <TabPanel p={0}>
                {renderProductGrid(
                  getProductsByType("chicken"),
                  "No untrimmed poultry products found"
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>

        <Footer />
      </Container>
    </Sidebar>
  );
};

export default UnprocessedPage;
