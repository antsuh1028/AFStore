import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  Button,
  VStack,
  useToast,
  FormErrorMessage,
  Divider,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import emailjs from "emailjs-com";
import Footer from "../components/Footer";

const ContactPage = () => {
  const form = useRef();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(!regex.test(value) ? "Invalid email address" : "");
  };

  const inputStyle = {
    borderRadius: "999px",
    bg: "gray.50",
    border: "1px solid",
    borderColor: "gray.400",
    px: 4,
    py: 2,
    _focus: {
      borderColor: "blue.400",
      boxShadow: "0 0 0 1px blue.400",
    },
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    if (emailError) {
      setLoading(false);
      toast({
        title: "Invalid email address.",
        description: "Please fix your email and try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    emailjs
      .sendForm(
        "your_service_id", // Replace this
        "your_template_f1qt8xitemplate_id", // Replace this
        form.current,
        "your_public_key" // Replace this
      )
      .then(
        () => {
          setLoading(false);
          toast({
            title: "Message sent!",
            description: "We've received your inquiry.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        },
        () => {
          setLoading(false);
          toast({
            title: "Error sending message.",
            description: "Please try again later.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      );
  };

  return (
    <Box p={12} maxW="700px" mx="auto" textAlign="center">

      <Breadcrumb
        spacing="8px"
        separator={<ChevronRightIcon color="gray.500" />}
        mb={8}
        fontSize={{ base: "sm", md: "md" }}
      >
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href="#" fontWeight="semibold">
            Contact
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Heading mb={3} fontWeight="bold" fontSize="3xl">
        Contact
      </Heading>
      <Text mb={4} color="gray.500" fontSize="md">
        We look forward to hearing from you
      </Text>
      <Divider mb={6} borderColor="gray.300" />

      <Heading as="h4" size="md" mb={4} fontWeight="bold" textAlign="left">
        Inquiries
      </Heading>

      <Text fontSize="sm" mb={5} textAlign="left">
        To ensure we can address your enquiry correctly, please provide a
        detailed message. <br />
      </Text>

      <Text fontSize="sm" mb={6} textAlign="left">
        <b>Support hours:</b> Mon–Fri, 8:00AM–4:30PM
      </Text>

      <form ref={form} onSubmit={sendEmail}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel> Name</FormLabel>
            <Input
              type="text"
              name="user_name"
              {...inputStyle}
              placeholder="Enter Name..."
            />
          </FormControl>

          <FormControl isRequired isInvalid={emailError !== ""}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="user_email"
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

          <FormControl>
            <FormLabel>Phone Number</FormLabel>
            <Input
              type="tel"
              name="user_phone"
              {...inputStyle}
              placeholder="Enter Phone #..."
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Wholesale license numbers</FormLabel>
            <Input
              type="password"
              name="license_number"
              placeholder="Enter License #..."
              {...inputStyle}
            />
          </FormControl>

          <FormControl>
            <FormLabel>
              Attached file{" "}
              <Text as="span" color="gray.500" fontSize="sm">
                (Please attach the wholesale license)
              </Text>
            </FormLabel>
            <Box display="flex" alignItems="center">
              <Box position="relative" width="fit-content">
                <Button
                  as="label"
                  htmlFor="license-file-upload"
                  size="sm"
                  bg="gray.200"
                  color="black"
                  borderRadius="sm"
                  border="1px solid"
                  borderColor="gray.300"
                  _hover={{ bg: "gray.300" }}
                  mr={2}
                >
                  Choose File
                </Button>
                <Input
                  id="license-file-upload"
                  name="license_file"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  position="absolute"
                  top="0"
                  left="0"
                  opacity="0"
                  width="0.1px"
                  height="0.1px"
                  overflow="hidden"
                  zIndex="-1"
                  onChange={(e) => {
                    setFileName(e.target.files[0]?.name || "No file chosen");
                  }}
                />
              </Box>
              <Text color="gray.600">{fileName || "No file chosenn"}</Text>
            </Box>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Message</FormLabel>
            <Textarea
              name="message"
              rows={5}
              borderRadius="lg"
              bg="gray.50"
              borderColor="gray.400"
              _focus={{
                borderColor: "blue.400",
                boxShadow: "0 0 0 1px blue.400",
              }}
              placeholder="Include product name..."
            />
          </FormControl>

          <Box display="flex" justifyContent="center" width="100%" p={12}>
            <Button
              type="submit"
              bg="#7CBFE3"
              color="white"
              isLoading={loading}
              borderRadius="full"
              size="sm"
              width="120px"
              _hover={{ bg: "#6AAFDB" }}
            >
              SEND
            </Button>
          </Box>
        </VStack>
      </form>

      <Box mt={16}></Box>

      <Footer />
    </Box>
  );
};

export default ContactPage;
