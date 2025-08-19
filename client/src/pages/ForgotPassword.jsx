// ForgotPassword.jsx
import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  Alert,
  AlertIcon,
  Link,
  Heading,
  Icon,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { API_CONFIG } from "../constants";
import Sidebar from "../components/SideBar";
import Footer from "../components/Footer";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const inputStyle = {
    borderRadius: "999px",
    bg: "#f9f9f9",
    border: "1px solid",
    borderColor: "gray.300",
    px: 4,
    py: 2,
    _focus: {
      borderColor: "blue.400",
      boxShadow: "0 0 0 1px blue.400",
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(
          "Password reset email sent! Check your inbox for instructions."
        );
      } else {
        setError(data.message || "Failed to send reset email");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const ThunderIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path
        d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
        fill="#b3967f"
        stroke="#b3967f"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <Sidebar>
      <Container
        ref={contentRef}
        maxW={{ base: "100%", lg: "30%" }}
        p={0}
        bg="white"
        // boxShadow="lg"
        ml={{ base: 0, lg: "40%" }}
        minH="100vh"
        display="flex"
        flexDirection="column"
      >
        <Box
          flex="1"
          display="flex"
          alignItems="center"
          justifyContent="center"
          py={20}
        >
          <Box w="100%" maxW="400px" px={8}>
            <VStack
              spacing={8}
              bg="white"
              borderRadius="20px"
              p={10}
              // boxShadow="0 8px 32px rgba(0,0,0,0.1)"
              border="1px solid"
              borderColor="gray.100"
            >
              <VStack spacing={4} textAlign="center">
                <Box>
                  <img
                    src="/images/gray_adams_wings.png"
                    alt="Adams Foods"
                    style={{ width: "40px", height: "auto", margin: "0 auto" }}
                  />
                </Box>
                <Heading size="lg" fontWeight="semibold" color="gray.800">
                  Forgot Password?
                </Heading>
              </VStack>

              {message && (
                <Alert status="success" borderRadius="lg" w="100%">
                  <AlertIcon />
                  <Text fontSize="sm">{message}</Text>
                </Alert>
              )}

              {error && (
                <Alert status="error" borderRadius="lg" w="100%">
                  <AlertIcon />
                  <Text fontSize="sm">{error}</Text>
                </Alert>
              )}

              <Box as="form" onSubmit={handleSubmit} w="100%">
                <VStack spacing={6}>
                  <FormControl isRequired>
                    <FormLabel
                      fontWeight="semibold"
                      fontSize="sm"
                      color="gray.700"
                    >
                      Email Address
                    </FormLabel>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      {...inputStyle}
                      fontSize="sm"
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    bg="#494949"
                    color="white"
                    w="100%"
                    h="45px"
                    isLoading={isLoading}
                    loadingText="Sending..."
                    borderRadius="full"
                    fontSize="sm"
                    fontWeight="semibold"
                    _hover={{ bg: "#6AAFDB" }}
                    _active={{ bg: "#5A9BC4" }}
                  >
                    Send Reset Link
                  </Button>

                  <Link
                    color="#b3967f"
                    fontWeight="semibold"
                    fontSize="sm"
                    textDecoration="underline"
                    _hover={{ color: "#494949" }}
                    onClick={() => navigate("/login")}
                  >
                    Back to Login
                  </Link>
                </VStack>
              </Box>
            </VStack>
          </Box>
        </Box>

        <Box pb={8}>
          <Footer />
        </Box>
      </Container>
    </Sidebar>
  );
};

export default ForgotPassword;
