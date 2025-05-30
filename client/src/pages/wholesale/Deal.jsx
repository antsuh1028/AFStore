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
import DealContent from "../../components/deal/DealComponent";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

const DealPage = () => {
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
        <Navbar onOpen={onOpen} />
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
          <DealContent />
        </Box>
        <Footer />
      </Container>
    </Sidebar>
  );
};

export default DealPage;
