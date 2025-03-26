import React, { useRef, useState, useEffect } from 'react';
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
} from '@chakra-ui/react';
import emailjs from 'emailjs-com';

const ContactPage = () => {
  const form = useRef();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(!regex.test(value) ? 'Invalid email address' : '');
  };

  const inputStyle = {
    borderRadius: '999px',
    bg: 'gray.50',
    border: '1px solid',
    borderColor: 'gray.400',
    px: 4,
    py: 2,
    _focus: {
      borderColor: 'blue.400',
      boxShadow: '0 0 0 1px blue.400',
    },
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    if (emailError) {
      setLoading(false);
      toast({
        title: 'Invalid email address.',
        description: 'Please fix your email and try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    emailjs
      .sendForm(
        'your_service_id',     // Replace this
        'your_template_f1qt8xitemplate_id',    // Replace this
        form.current,
        'your_public_key'      // Replace this
      )
      .then(
        () => {
          setLoading(false);
          toast({
            title: 'Message sent!',
            description: "We've received your inquiry.",
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
        },
        () => {
          setLoading(false);
          toast({
            title: 'Error sending message.',
            description: 'Please try again later.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      );
  };

  return (
    <Box p={8} maxW="700px" mx="auto" textAlign="center">
      <Heading mb={3} fontWeight="bold" fontSize="3xl">
        Contact
      </Heading>
      <Text mb={4} color="gray.500" fontSize="md">
        We look forward to hearing from you
      </Text>
      <Divider mb={6} borderColor="gray.300" />

      <Heading as="h4" size="md" mb={1} fontWeight="bold" textAlign="left">
        Inquiries
      </Heading>

      <Text fontSize="sm" mb={2} textAlign="left">
        To ensure we can address your enquiry correctly, please provide a detailed message. <br />
      </Text>

      <Text fontSize="sm" mb={2} textAlign="left">
        <b>Support hours:</b> Mon–Fri, 8:00AM–4:30PM
      </Text>

  
      <form ref={form} onSubmit={sendEmail}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input type="text" name="user_name" {...inputStyle} />
          </FormControl>

          <FormControl isRequired isInvalid={emailError !== ''}>
            <FormLabel>Email</FormLabel>
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
            <FormLabel>Phone Number</FormLabel>
            <Input type="tel" name="user_phone" {...inputStyle} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Message</FormLabel>
            <Textarea
              name="message"
              rows={5}
              borderRadius="lg"
              bg="gray.50"
              borderColor="gray.400"
              _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px blue.400' }}
            />
          </FormControl>

          <Button type="submit" colorScheme="blue" isLoading={loading} borderRadius="full">
            SEND
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default ContactPage;
