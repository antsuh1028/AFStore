import { useState, useRef } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  IconButton,
  Input,
  Button,
  VStack,
  Heading,
  Text,
  useToast,
  Container,
} from "@chakra-ui/react";

import Sidebar from "../components/SideBar";
import NavDrawer from "../components/NavDrawer";
import Navbar from "../components/Navbar";
import { API_CONFIG } from "../constants";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleRequest = async () => {
    try {
      const res = await fetch(
        `${API_CONFIG.BASE_URL}/api/users/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Check your inbox!", status: "success" });
      } else {
        toast({ title: "Error", description: data.message, status: "error" });
      }
    } catch (err) {
      toast({
        title: "Server error",
        description: err.message,
        status: "error",
      });
    }
  };

  return (
    <Sidebar>
      <NavDrawer isOpen={isOpen} onClose={onClose} containerRef={contentRef} />
      <Container
        ref={contentRef}
        maxW={{ base: "100%", lg: "30%" }}
        p={0}
        bg="white"
        h="100vh"
        boxShadow="xl"
        ml={{ base: 0, lg: "40%" }}
      >
        <Navbar onOpen={onOpen} />
        <VStack spacing={4} py={32} px={16}>
          <Heading size="md">Forgot Password</Heading>
          <Input
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={handleRequest} colorScheme="blue">
            Send Reset Link
          </Button>
        </VStack>
      </Container>
    </Sidebar>
  );
};

export default ForgotPassword;
