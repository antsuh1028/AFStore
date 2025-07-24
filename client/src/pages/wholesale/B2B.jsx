import React, { useRef } from "react";
import {
  Box,
  Container,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import NavDrawer from "../../components/NavDrawer";
import Sidebar from "../../components/SideBar";
import Breadcrumbs from "../../components/Breadcrumbs";
import B2BContent from "../../components/b2b/B2BComponent";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

const B2BPage = () => {
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
        boxShadow="xl"
        ml={{ base: 0, lg: "40%" }}
      >
        <Navbar onOpen={onOpen} />

        <Box py={3} px={4} display="flex" justifyContent="center">
          <Breadcrumbs
            listOfBreadCrumbs={[
              { label: "Home", url: "/" },
              { label: "Wholesale", url: "/" },
              { label: "B2B", url: "/wholesale/b2b" },
            ]}
          />
        </Box>

        <Box>
          <B2BContent />
        </Box>
        <Footer />
      </Container>
    </Sidebar>
  );
};

export default B2BPage;
