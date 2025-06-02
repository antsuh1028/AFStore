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
} from "@chakra-ui/react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/SideBar";
import NavDrawer from "../components/NavDrawer";
import Breadcrumbs from "../components/BreadCrumbs.";

const Signup = () => {
  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [licenseError, setLicenseError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreementChecked, setAgreementChecked] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(!regex.test(value) ? "Invalid email address" : "");
  };

  const validateLicense = (value) => {
    const regex = /^C-\d{7}$/;
    setLicenseError(value && !regex.test(value) ? "License must be in format C-1234567" : "");
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

  const handleSignup = async (e) => {
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

    if (!agreementChecked) {
        toast({
          title: "Agreement required.",
          description: "You must acknowledge the wholesale eligibility note.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        return;
    }
      
  
    setLoading(true);
    try {
      const fullName = `${firstName} ${lastName}`.trim();
  
      const res = await fetch("http://localhost:3001/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
          license_number: licenseNumber,
        }),
      });
  
      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Signup successful.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/"); // or redirect elsewhere
      } else {
        toast({
          title: "Signup failed.",
          description: data.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: "Server error.",
        description: err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
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
        border={{ base: "none", lg: "1px" }}
        ml={{ base: 0, lg: "40%" }}
        pt={8}
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

        <Box px={6} py={4}>
          <Heading mb={6} fontWeight="semibold" fontSize="3xl" textAlign="center">
            Sign Up
          </Heading>

          <form onSubmit={handleSignup}>
            <VStack spacing={4} align="stretch">
            <FormControl isRequired>
                <FormLabel>First Name</FormLabel>
                <Input
                    type="text"
                    placeholder="Enter First Name..."
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    {...inputStyle}
                />
                </FormControl>

                <FormControl isRequired>
                <FormLabel>Last Name</FormLabel>
                <Input
                    type="text"
                    placeholder="Enter Last Name..."
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    {...inputStyle}
                />
                </FormControl>

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
                {emailError && <FormErrorMessage>{emailError}</FormErrorMessage>}
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

                <FormControl isInvalid={licenseError !== ""}>
                <FormLabel>Wholesale License (optional)</FormLabel>
                <Input
                    type="text"
                    placeholder="C-1234567"
                    value={licenseNumber}
                    onChange={(e) => {
                    setLicenseNumber(e.target.value);
                    validateLicense(e.target.value);
                    }}
                    {...inputStyle}
                />
                {licenseError && <FormErrorMessage>{licenseError}</FormErrorMessage>}
                </FormControl>

                <Box display="flex" alignItems="flex-start" mt={2}>
                <Box
                    as="label"
                    display="flex"
                    alignItems="flex-start"
                    cursor="pointer"
                    mt="4px"
                >
                    <input
                    type="checkbox"
                    checked={agreementChecked}
                    onChange={(e) => setAgreementChecked(e.target.checked)}
                    style={{ display: "none" }}
                    />
                    <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="50%"
                    width="18px"
                    height="18px"
                    minWidth="18px"
                    border="2px solid #494949"
                    bg={agreementChecked ? "#494949" : "white"}
                    mr={3}
                    transition="background-color 0.2s ease-in-out"
                    >
                    {agreementChecked && (
                <svg
                    width="10"
                    height="10"
                    viewBox="0 0 12 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                    d="M1 5L4 8L11 1"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    />
                </svg>
                )}

                    </Box>
                </Box>

                <Text fontSize="sm" color="gray.700">
                    To ensure wholesale eligibility, please upload your license number and a copy
                    during sign-up. Approval details will be sent via email.
                </Text>
                </Box>



              <Button
                type="submit"
                bg="#494949"
                color="white"
                isLoading={loading}
                borderRadius="full"
                size="lg"
                width="100%"
                _hover={{ bg: "#6AAFDB" }}
              >
                CREATE ACCOUNT
              </Button>
              <Box textAlign="center" pt={3} mb={5}>
                <Text
                    fontSize="sm"
                    fontWeight='bold'
                    color="#494949"
                    textDecoration="underline"
                    cursor="pointer"
                    onClick={() => navigate("/login")}
                    _hover={{ color: "#c1ab8f" }}
                >
                    Already have an account? Sign in
                </Text>
              </Box>


            </VStack>
          </form>
        </Box>
      </Container>
    </Sidebar>
  );
};

export default Signup;
