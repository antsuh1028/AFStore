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

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [licenseError, setLicenseError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreementChecked, setAgreementChecked] = useState(false);

  // File upload states
  const [licenseFileName, setLicenseFileName] = useState("");
  const [govIdFileName, setGovIdFileName] = useState("");
  const [businessFileName, setBusinessFileName] = useState("");

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
    setLicenseError(
      value && !regex.test(value) ? "License must be in format C-1234567" : ""
    );
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

  const FileUploadField = ({ id, name, fileName, setFileName, helpText }) => (
    <Box mb={2}>
      <input
        id={id}
        name={name}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        style={{ display: "none" }}
        onChange={(e) => {
          setFileName(e.target.files[0]?.name || "");
        }}
      />
      <Flex>
        <Button
          as="label"
          htmlFor={id}
          variant="link"
          fontSize="sm"
          color="gray.700"
          textDecoration="underline"
          cursor="pointer"
          p={0}
          h="auto"
          fontWeight="normal"
          mx={2}
        >
          Attached file
        </Button>
        <Text fontSize="sm" color="gray.500" mt={1}>
          {helpText}
        </Text>
      </Flex>
    </Box>
  );

  const CustomCheckbox = ({ checked, onChange, children }) => (
    <Box
      display="flex"
      alignItems="flex-start"
      cursor="pointer"
      onClick={onChange}
      mb={4}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius="50%"
        width="18px"
        height="18px"
        minWidth="18px"
        border="2px solid"
        borderColor="#494949"
        bg={checked ? "#494949" : "white"}
        mr={3}
        mt={1}
        transition="all 0.2s"
      >
        {checked && (
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
      <Text fontSize="sm" color="gray.700" lineHeight="1.4">
        {children}
      </Text>
    </Box>
  );

  const handleSignup = async (e) => {
    e.preventDefault();

    if (emailError || licenseError) {
      toast({
        title: "Please fix form errors.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    if (!agreementChecked) {
      toast({
        title: "Agreement required.",
        description:
          "You must acknowledge the wholesale eligibility requirements.",
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
          title: "Account created successfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate("/login");
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
        description: "Please try again later.",
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
        {/* Header */}
        <Box>
          <Flex p={4} justify="space-between" align="center">
            <IconButton
              aria-label="Back"
              icon={<ChevronLeft size={24} />}
              variant="ghost"
              size="lg"
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
          <Heading
            mb={8}
            fontWeight="semibold"
            fontSize="3xl"
            textAlign="center"
          >
            Create Account
          </Heading>

          <form onSubmit={handleSignup}>
            <VStack spacing={5} align="stretch">
              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="semibold">
                  First Name
                </FormLabel>
                <Input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  {...inputStyle}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="semibold">
                  Last Name
                </FormLabel>
                <Input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  {...inputStyle}
                />
              </FormControl>

              <FormControl isRequired isInvalid={emailError !== ""}>
                <FormLabel fontSize="sm" fontWeight="semibold">
                  Email
                </FormLabel>
                <Input
                  type="email"
                  placeholder="Email"
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
                <FormLabel fontSize="sm" fontWeight="semibold">
                  Password
                </FormLabel>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  {...inputStyle}
                />
              </FormControl>

              <FormControl isRequired isInvalid={licenseError !== ""}>
                <FormLabel fontSize="sm" fontWeight="semibold">
                  Wholesale license numbers
                </FormLabel>
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
                {licenseError && (
                  <FormErrorMessage>{licenseError}</FormErrorMessage>
                )}

                <FileUploadField
                  id="license-file-upload"
                  name="license_file"
                  fileName={licenseFileName}
                  setFileName={setLicenseFileName}
                  helpText="*Please attach the wholesale license."
                />
              </FormControl>

              <CustomCheckbox checked={true}>
                To ensure wholesale eligibility, please provide your license
                number and upload a copy during sign-up.
              </CustomCheckbox>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="semibold">
                  Government issued ID (e.g., Driver's License)
                </FormLabel>
                <FileUploadField
                  id="gov-id-file-upload"
                  name="gov_id_file"
                  fileName={govIdFileName}
                  setFileName={setGovIdFileName}
                  helpText="*Please attach the wholesale license."
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="semibold">
                  Business License or Reseller Permit
                </FormLabel>
                <FileUploadField
                  id="business-file-upload"
                  name="business_file"
                  fileName={businessFileName}
                  setFileName={setBusinessFileName}
                  helpText="*Please attach the wholesale license."
                />
              </FormControl>

              <Box
                display="flex"
                alignItems="center"
                bg="gray.50"
                p={4}
                borderRadius="md"
              >
                <CustomCheckbox checked={true} onChange={() => {}}>
                  Please allow 24 - 48 hours for account review and
                  verification. Accounts that do not meet our criteria may be
                  declined without notice. Providing complete and accurate
                  documentation helps speed up the approval process.
                </CustomCheckbox>
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
                mt={4}
              >
                CREATE ACCOUNT
              </Button>

              <Box textAlign="center" pt={4}>
                <Button
                  variant="link"
                  color="#494949"
                  fontWeight="bold"
                  textDecoration="underline"
                  onClick={() => navigate("/login")}
                  _hover={{ color: "#6AAFDB" }}
                >
                  Already have an account? Login
                </Button>
              </Box>
            </VStack>
          </form>
        </Box>
      </Container>
    </Sidebar>
  );
};

export default Signup;
