import { useState, useEffect, useRef } from "react";
import {
  Box,
  Heading,
  Text,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  VStack,
  Container,
  IconButton,
  useToast,
  useDisclosure,
  Flex,
  Divider,
} from "@chakra-ui/react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/SideBar";
import NavDrawer from "../components/NavDrawer";
import { useAuthContext } from "../hooks/useAuth"; // Import the auth context

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Get auth functions from context
  const { login, isAuthenticated, userId } = useAuthContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && userId) {
      navigate(`/profile/user/${userId}`);
    }
  }, [isAuthenticated, userId, navigate]);

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(!regex.test(value) ? "Invalid email address" : "");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (emailError) {
      toast({
        title: "Invalid email.",
        description: "Please check your email format.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Use the auth context login function instead of manual localStorage
        const result = await login(data.token);
        
        if (result.success) {
          toast({
            title: "Login successful.",
            description: `Welcome back, ${result.user.name}!`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          
          // Navigate to profile or home
          navigate(result.user.id ? `/profile/user/${result.user.id}` : "/");
        } else {
          toast({
            title: "Login failed.",
            description: result.error || "Unknown error occurred",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        }
      } else {
        toast({
          title: "Login failed.",
          description: data.message || "Invalid credentials",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      toast({
        title: "Server error.",
        description: err.message || "Unable to connect to server",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

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
        minH="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
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

        <Box
          px={6}
          py={4}
          flex="1"
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
        >
          <Heading mb={50} fontWeight="bold" fontSize="3xl" textAlign="center">
            Log in
          </Heading>

          <form onSubmit={handleLogin}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired isInvalid={emailError !== ""}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="Enter Email..."
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                  {...inputStyle}
                />
                {emailError && (
                  <FormErrorMessage>{emailError}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Enter Password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  {...inputStyle}
                />
              </FormControl>

              <Text
                mt={-3}
                ml={4}
                fontSize="sm"
                color="gray.600"
                textDecoration="underline"
                cursor="pointer"
                _hover={{ color: "#6AAFDB" }}
                onClick={() => navigate("/forgot-password")}
              >
                Forgot your password?
              </Text>

              <Box
                display="flex"
                justifyContent="center"
                width="100%"
                pt={4}
                mb={-4}
              >
                <Button
                  type="submit"
                  bg="#494949"
                  color="white"
                  isLoading={loading}
                  borderRadius="full"
                  size="lg"
                  width="100%"
                  _hover={{ bg: "#6AAFDB" }}
                  loadingText="Logging in..."
                >
                  LOG IN
                </Button>
              </Box>
              <Box pt={4} textAlign="center">
                <Text
                  fontSize="sm"
                  color="#494949"
                  fontWeight="bold"
                  textDecoration="underline"
                  cursor="pointer"
                  _hover={{ color: "#6AAFDB" }}
                  onClick={() => navigate("/signup/agreements")}
                >
                  Create Account
                </Text>
              </Box>
            </VStack>
          </form>

          <Box mt={2}></Box>
        </Box>
      </Container>
    </Sidebar>
  );
};

export default Login;