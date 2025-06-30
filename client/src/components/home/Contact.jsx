import React, { useRef, useState } from "react";
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
} from "@chakra-ui/react";
import emailjs from "emailjs-com";
import Footer from "../Footer";

const Contact = () => {
  const form = useRef();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) {
      setEmailError("Invalid email address");
    } else {
      setEmailError("");
    }
  };

  const inputStyle = {
    borderRadius: "999px", // hemispherical ends
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
        "your_service_id",
        "your_template_id",
        form.current,
        "your_public_key"
      )
      .then(
        (result) => {
          setLoading(false);
          toast({
            title: "Message sent!",
            description: "We've received your inquiry.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        },
        (error) => {
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
    <Box p={8} maxW="700px" mx="auto" textAlign="center">
      <Heading mb={4} fontFamily="serif" fontWeight="bold" fontSize="3xl">
        Contact
      </Heading>
      <Text fontFamily="serif" mb={2} fontSize="lg">
        We look forward to hearing from you.
      </Text>
      <Divider mb={6} borderColor="gray.300" />

      <Text fontFamily="serif" fontSize="sm" color="gray.600" mb={6}>
        To ensure we can address your enquiry correctly, please provide a
        detailed message. <br />
        <b>Support hours: Mon–Fri, 8:00AM–4:30PM </b>
      </Text>

      <Heading
        fontFamily="serif"
        as="h3"
        size="md"
        mb={4}
        fontWeight="bold"
        textAlign="left"
      >
        Inquiries
      </Heading>

      <form ref={form} onSubmit={sendEmail}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel fontFamily="serif">Name</FormLabel>
            <Input type="text" name="user_name" {...inputStyle} />
          </FormControl>

          <FormControl isRequired isInvalid={emailError !== ""}>
            <FormLabel fontFamily="serif">Email</FormLabel>
            <Input
              type="email"
              name="user_email"
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
            <FormLabel fontFamily="serif">Phone Number</FormLabel>
            <Input type="tel" name="user_phone" {...inputStyle} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontFamily="serif">Message</FormLabel>
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
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            isLoading={loading}
            borderRadius="full"
          >
            SEND
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default Contact;
