import { useState, useRef } from "react";
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
  useToast,
} from "@chakra-ui/react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { API_CONFIG } from "../constants";
import Sidebar from "../components/SideBar";
import Footer from "../components/Footer";
import { ViewContainer } from "../components/ViewContainer";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const toast = useToast();
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
    setSuccess("");

    // Validation
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/users/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, token, newPassword }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(
          "Password reset successfully! You can now log in with your new password."
        );
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(data.message || "Failed to reset password");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sidebar>
      <ViewContainer contentRef={contentRef}>
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
                  Reset Your Password
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  Enter your new password below
                </Text>
              </VStack>

              {success && (
                <Alert status="success" borderRadius="lg" w="100%">
                  <AlertIcon />
                  <Text fontSize="sm">{success}</Text>
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
                      New Password
                    </FormLabel>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      {...inputStyle}
                      fontSize="sm"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel
                      fontWeight="semibold"
                      fontSize="sm"
                      color="gray.700"
                    >
                      Confirm Password
                    </FormLabel>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
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
                    loadingText="Resetting..."
                    borderRadius="full"
                    fontSize="sm"
                    fontWeight="semibold"
                    _hover={{ bg: "#6AAFDB" }}
                    _active={{ bg: "#5A9BC4" }}
                    isDisabled={!newPassword || !confirmPassword}
                  >
                    Reset Password
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
      </ViewContainer>
    </Sidebar>
  );
};

export default ResetPassword;
