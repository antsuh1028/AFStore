import React, { useRef } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import NavDrawer from "../../components/NavDrawer";
import Sidebar from "../../components/SideBar";
import { ChevronLeft } from "lucide-react";
import Breadcrumbs from "../../components/BreadCrumbs.";
import B2BContent from "../../components/b2b/B2BComponent";
import Footer from "../../components/Footer";
import { ProductCard } from "../../components/shop/ProductCard";
import grayImage from "../../../public/gray.avif";

const MarinatedPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const dummyProducts = [
    {
      id: "1",
      name: "Beef Clod_Korean-Inspired Marinated Sliced Boneless Beef",
      species: "beef",
      description: "Delicious marinated sliced beef",
      images: [grayImage],
      price: 150,
      brand: "Korean BBQ",
      grade: "A",
      origin: "USA",
      spec: "30 lb – 5 lb × 6 packs",
      avg_weight: 30,
      style: "marinated",
    },
    {
      id: "2",
      name: "Pork Belly_Sliced Korean Style",
      species: "pork",
      description: "Premium sliced pork belly",
      images: [grayImage],
      price: 120,
      brand: "Pork King",
      grade: "A",
      origin: "Canada",
      spec: "24 lb – 4 lb × 6 packs",
      avg_weight: 24,
      style: "marinated",
    },
    {
      id: "3",
      name: "Pork Shoulder Marinated",
      species: "pork",
      description: "Tender marinated pork shoulder slices",
      images: [grayImage],
      price: 110,
      brand: "Pork King",
      grade: "A",
      origin: "Canada",
      spec: "28 lb – 7 lb × 4 packs",
      avg_weight: 28,
      style: "marinated",
    },
    {
      id: "4",
      name: "Bulgogi Beef Slices",
      species: "beef",
      description:
        "Thinly sliced marinated beef, traditional Korean bulgogi style",
      images: [grayImage],
      price: 32,
      brand: "Yukbul",
      grade: "Choice",
      origin: "USA",
      spec: "Paper thin, pre-marinated",
      avg_weight: 5,
      style: "marinated",
    },
    {
      id: "5",
      name: "Chicken Teriyaki Marinade",
      species: "poultry",
      description: "Juicy chicken with sweet teriyaki marinade",
      images: [grayImage],
      price: 45,
      brand: "Happy Hen",
      grade: "A",
      origin: "USA",
      spec: "20 lb – 5 lb × 4 packs",
      avg_weight: 20,
      style: "marinated",
    },
    {
      id: "6",
      name: "Spicy Marinated Chicken Wings",
      species: "poultry",
      description: "Wings marinated in spicy Korean sauce",
      images: [grayImage],
      price: 50,
      brand: "Happy Hen",
      grade: "A",
      origin: "USA",
      spec: "15 lb – 3 lb × 5 packs",
      avg_weight: 15,
      style: "marinated",
    },
    {
      id: "7",
      name: "Honey Garlic Pork Ribs",
      species: "pork",
      description: "Sweet and savory honey garlic marinated ribs",
      images: [grayImage],
      price: 130,
      brand: "Pork King",
      grade: "Choice",
      origin: "Canada",
      spec: "25 lb – 5 lb × 5 packs",
      avg_weight: 25,
      style: "marinated",
    },
    {
      id: "8",
      name: "Galbi Beef Short Ribs",
      species: "beef",
      description: "Marinated beef short ribs in traditional galbi style",
      images: [grayImage],
      price: 180,
      brand: "Yukbul",
      grade: "Prime",
      origin: "USA",
      spec: "40 lb – 8 lb × 5 packs",
      avg_weight: 40,
      style: "marinated",
    },
    {
      id: "10",
      name: "sweet soy pork loin",
      species: "pork",
      description: "tender pork loin marinated in sweet soy sauce",
      images: [grayImage],
      price: 125,
      brand: "sweet farm",
      grade: "choice",
      origin: "usa",
      spec: "22 lb – 4 lb × 6 packs",
      avg_weight: 22,
      style: "marinated",
    },
    {
      id: "11",
      name: "garlic herb pork chops",
      species: "pork",
      description: "pork chops marinated in garlic and herbs",
      images: [grayImage],
      price: 140,
      brand: "happy farm",
      grade: "a",
      origin: "usa",
      spec: "18 lb – 3 lb × 6 packs",
      avg_weight: 18,
      style: "marinated",
    },
    {
      id: "12",
      name: "bbq pork ribs",
      species: "pork",
      description: "classic bbq style pork ribs with smoky marinade",
      images: [grayImage],
      price: 135,
      brand: "smokey bbq",
      grade: "choice",
      origin: "usa",
      spec: "30 lb – 6 lb × 5 packs",
      avg_weight: 30,
      style: "marinated",
    },
  ];

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
        <Box>
          <Flex p={4} justify="space-between" align="center">
            <IconButton
              aria-label="Back"
              icon={<ChevronLeft size={24} />}
              variant="ghost"
              size="lg"
              colorScheme="gray"
              onClick={()=>{navigate("/")}}
            />
            <IconButton
              aria-label="Menu"
              icon={<Text>☰</Text>}
              variant="ghost"
              onClick={onOpen}
            />
          </Flex>
        </Box>

        {/* <Box py={3} px={4} display="flex" justifyContent="center">
          <Breadcrumbs
            listOfBreadCrumbs={[
              { label: "Home", url: "/" },
              { label: "Wholesale", url: "/wholesale" },
              { label: "B2B", url: "/wholesale/b2b" },
            ]}
          />
        </Box> */}

        <VStack>
          <Box fontSize="2xl" fontWeight="semibold">Marinated Meat</Box>
          <Tabs w="100%">
            <TabList justifyContent="center" gap={4}>
              {["pork", "beef", "poultry", "all"].map((label) => (
                <Tab
                  key={label}
                  _selected={{
                    fontWeight: "bold",
                    textDecoration: "underline",
                    bg: "transparent",
                  }}
                  _focus={{ boxShadow: "none" }}
                  p={0}
                >
                  <Box
                    border="1px"
                    borderColor="gray.300"
                    borderRadius="full"
                    px={4}
                    py={1}
                    my={4}
                    bg="#fafafa"
                    _selected={{
                      bg: "#fafafa",
                    }}
                    color="gray.600"
                    fontSize="small"
                  >
                    {label.charAt(0).toUpperCase() + label.slice(1)}
                  </Box>
                </Tab>
              ))}
            </TabList>

            <TabPanels>
              <TabPanel>
                <SimpleGrid columns={[1, 2]} spacing={4}>
                  {dummyProducts
                    .filter((p) => p.species === "pork")
                    .map((item) => (
                      <ProductCard key={item.id} {...item} />
                    ))}
                </SimpleGrid>
              </TabPanel>
              <TabPanel>
                <SimpleGrid columns={[1, 2]} spacing={4}>
                  {dummyProducts
                    .filter((p) => p.species === "beef")
                    .map((item) => (
                      <ProductCard key={item.id} {...item} />
                    ))}
                </SimpleGrid>
              </TabPanel>
              <TabPanel>
                <SimpleGrid columns={[1, 2]} spacing={4}>
                  {dummyProducts
                    .filter((p) => p.species === "poultry")
                    .map((item) => (
                      <ProductCard key={item.id} {...item} />
                    ))}
                </SimpleGrid>
              </TabPanel>
              <TabPanel>
                <SimpleGrid columns={[1, 2]} spacing={4}>
                  {dummyProducts.map((item) => (
                    <ProductCard key={item.id} {...item} />
                  ))}
                </SimpleGrid>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
        <Footer />
      </Container>
    </Sidebar>
  );
};

export default MarinatedPage;
