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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import NavDrawer from "../../components/NavDrawer";
import Sidebar from "../../components/SideBar";
import { ChevronLeft } from "lucide-react";
import Breadcrumbs from "../../components/BreadCrumbs.";
import OrderContent from "../../components/order/OrderComponent";
import Footer from "../../components/Footer";

const HowToOrderPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const contentRef = useRef(null);
  
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
      >
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

        <Box py={3} px={4} display="flex" justifyContent="center">
          <Breadcrumbs
            listOfBreadCrumbs={[
              { label: "Home", url: "/" },
              { label: "Wholesale", url: "/wholesale" },
              { label: "Order", url: "/wholesale/how-to-order" },
            ]}
          />
        </Box>

        <Box>
          <OrderContent />
        </Box>
        <Footer />
      </Container>
    </Sidebar>
  );
};

export default HowToOrderPage;