import React, { useRef, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

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
  HStack,
  useToast,
  FormErrorMessage,
  Divider,
  Container,
  IconButton,
  useDisclosure,
  Flex,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";
import { Info } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";
import { getCart } from "../utils/cartActions";

import Footer from "../components/Footer";
import Sidebar from "../components/SideBar";
import Breadcrumbs from "../components/BreadCrumbs.";
import NavDrawer from "../components/NavDrawer";
import Navbar from "../components/Navbar";

const ContactPage = () => {
  const form = useRef();
  const toast = useToast();
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [fileName, setFileName] = useState("");
  const [cartItems, setCartItems] = useState(() => getCart());
  const [userInfo, setUserInfo] = useState({});
  const [token, setToken] = useState("");
  const [currUser, setCurrUser] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        
        if (decoded.exp > Date.now() / 1000) {
          setToken(storedToken);
          setCurrUser(decoded);
          setIsAuthenticated(true);
          
          // Fetch user info and update state
          fetch(`http://localhost:3001/api/users/${decoded.userId}`)
            .then((response) => response.json())
            .then((data) => {
              setUserInfo(data.user);
            })
            .catch((error) => {
              console.error("Error fetching user info:", error);
            });
        } else {
          localStorage.removeItem("token");
        }
      } catch (error) {
        localStorage.removeItem("token");
      }
    }
    
    window.scrollTo(0, 0);
  }, []);

  // Separate useEffect to populate form when userInfo updates
  useEffect(() => {
    if (form.current && userInfo && Object.keys(userInfo).length > 0) {
      if (form.current.user_name) form.current.user_name.value = userInfo.name || "";
      if (form.current.user_email) form.current.user_email.value = userInfo.email || "";
      if (form.current.user_phone) form.current.user_phone.value = userInfo.phone_number || "";
      if (form.current.license_number) form.current.license_number.value = userInfo.license_number || "";
    }
  }, [userInfo]);

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(!regex.test(value) ? "Invalid email address" : "");
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

  const sendEmail = async (e) => {
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

    const formData = new FormData(form.current);

    const inquiryData = {
      name: formData.get("user_name"),
      email: formData.get("user_email"),
      phone: formData.get("user_phone"),
      license_number: formData.get("license_number"),
      message: formData.get("message"),
      cart_items: cartItems,
      cart_total: cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
    };

    try {
      // Add inquiry to database
      const response = await fetch("http://localhost:3001/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inquiryData),
      });

      if (response.ok) {
        toast({
          title: "Inquiry submitted!",
          description: "We've received your inquiry and will respond soon.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // Reset form
        form.current.reset();
        setEmail("");
      } else {
        throw new Error("Failed to submit inquiry");
      }
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast({
        title: "Error submitting inquiry.",
        description: "Please try again later.",
        status: "error",
        duration: 5000,
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
        boxShadow="xl"
        ml={{ base: 0, lg: "40%" }}
      >
        <Navbar onOpen={onOpen} />

        <Box py={3} px={4} display="flex" justifyContent="center">
          <Breadcrumbs
            listOfBreadCrumbs={[
              { label: "Home", url: "/" },
              { label: "Contact", url: "/contact" },
            ]}
          />
        </Box>

        <Box px={6} py={4}>
          <Heading mb={3} fontWeight="medium" fontSize="3xl" textAlign="center">
            Contact Us
          </Heading>
          <Text mb={4} color="gray.500" fontSize="md" textAlign="center">
            We look forward to hearing from you
          </Text>
          <Divider mb={6} borderColor="gray.300" />

          <form ref={form} onSubmit={sendEmail}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel fontWeight="semibold" fontSize="sm">Name</FormLabel>
                <Input
                  type="text"
                  name="user_name"
                  {...inputStyle}
                  placeholder="Name"
                />
              </FormControl>

              <FormControl isRequired isInvalid={emailError !== ""}>
                <FormLabel fontWeight="semibold" fontSize="sm">Email</FormLabel>
                <Input
                  type="email"
                  name="user_email"
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

              <FormControl>
                <FormLabel fontWeight="semibold" fontSize="sm">Phone Number</FormLabel>
                <Input
                  type="tel"
                  name="user_phone"
                  {...inputStyle}
                  placeholder="123-456-7890"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold" fontSize="sm">Company Address line 1</FormLabel>
                <Input
                  type="text"
                  name="company_address_1"
                  {...inputStyle}
                  placeholder="1805 Industrial St"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold" fontSize="sm">Company Address line 2</FormLabel>
                <Input
                  type="text"
                  name="company_address_2"
                  {...inputStyle}
                  placeholder="Suite 100"
                />
              </FormControl>

              <HStack spacing={4}>
                <FormControl>
                  <FormLabel fontWeight="semibold" fontSize="sm">Zip code</FormLabel>
                  <Input
                    type="text"
                    name="zip_code"
                    {...inputStyle}
                    placeholder="90021"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontWeight="semibold" fontSize="sm">City</FormLabel>
                  <Input
                    type="text"
                    name="city"
                    {...inputStyle}
                    placeholder="City"
                  />
                </FormControl>
              </HStack>

              <HStack spacing={4}>
                <FormControl>
                  <FormLabel fontWeight="semibold" fontSize="sm">State</FormLabel>
                  <Input
                    type="text"
                    name="state"
                    {...inputStyle}
                    placeholder="CA"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontWeight="semibold" fontSize="sm">Phone</FormLabel>
                  <Input
                    type="tel"
                    name="phone_2"
                    {...inputStyle}
                    placeholder="(123) 456-7890"
                  />
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel fontWeight="semibold" fontSize="sm">Business License</FormLabel>
                <Input
                  type="text"
                  name="business_license"
                  {...inputStyle}
                  placeholder="LA-1234567 or 2025-000123"
                />
                <Box mt={2}>
                  <Button
                    as="label"
                    htmlFor="business-license-upload"
                    fontSize="sm"
                    color="blue.500"
                    textDecoration="underline"
                    cursor="pointer"
                    bg="none"
                    p={0}
                    h="auto"
                    minW="unset"
                  >
                    Attached file
                  </Button>
                  <Input
                    id="business-license-upload"
                    name="business_license_file"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    display="none"
                  />
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    *Please attach the Business License
                  </Text>
                </Box>
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold" fontSize="sm">California Resale Certificate</FormLabel>
                <Input
                  type="text"
                  name="california_resale"
                  {...inputStyle}
                  placeholder="# 123-456789"
                />
                <Box mt={2}>
                  <Button
                    as="label"
                    htmlFor="resale-cert-upload"
                    fontSize="sm"
                    color="blue.500"
                    textDecoration="underline"
                    cursor="pointer"
                    bg="none"
                    p={0}
                    h="auto"
                    minW="unset"
                  >
                    Attached file
                  </Button>
                  <Input
                    id="resale-cert-upload"
                    name="resale_cert_file"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    display="none"
                  />
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    *Please attach the California Resale Certificate
                  </Text>
                </Box>
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold" fontSize="sm">Message</FormLabel>
                <Textarea
                  name="message"
                  rows={5}
                  borderRadius="lg"
                  bg="#f9f9f9"
                  borderColor="gray.300"
                  borderWidth="1px"
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 1px blue.400",
                  }}
                  placeholder="Your Message here"
                  resize="vertical"
                />
              </FormControl>

              <Input
                type="hidden"
                name="cart_items"
                value={cartItems
                  .map(
                    (item) =>
                      `${item.name} (Qty: ${item.quantity}) - $${(
                        item.price * item.quantity
                      ).toFixed(2)}`
                  )
                  .join("\n")}
              />

              <Input
                type="hidden"
                name="cart_total"
                value={cartItems
                  .reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                  )
                  .toFixed(2)}
              />

              {/* <Box mb={6} p={4} bg="gray.50" borderRadius="lg">
                <Heading as="h4" size="sm" mb={3}>
                  Current Cart ({cartItems.length} items)
                </Heading>
                {cartItems.length === 0 ? (
                  <Text fontSize="sm" color="gray.500">
                    No items in cart
                  </Text>
                ) : (
                  <VStack spacing={2} align="stretch">
                    {cartItems.map((item) => (
                      <Flex
                        key={item.id}
                        justify="space-between"
                        align="center"
                        p={2}
                        bg="white"
                        borderRadius="md"
                      >
                        <Box>
                          <Text fontSize="sm" fontWeight="medium">
                            {item.name}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            Qty: {item.quantity}
                          </Text>
                        </Box>
                        <Text fontSize="sm" fontWeight="bold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </Text>
                      </Flex>
                    ))}
                    <Divider />
                    <Flex justify="space-between">
                      <Text fontWeight="bold">Total:</Text>
                      <Text fontWeight="bold" color="green.600">
                        $
                        {cartItems
                          .reduce(
                            (sum, item) =>
                              sum + item.price * item.quantity,
                            0
                          )
                          .toFixed(2)}
                      </Text>
                    </Flex>
                  </VStack>
                )}
              </Box> */}

              <Box
                display="flex"
                justifyContent="center"
                width="100%"
                pt={4}
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
                >
                  SEND
                </Button>
              </Box>
            </VStack>
          </form>

          <Footer />
        </Box>
      </Container>
    </Sidebar>
  );
};

export default ContactPage;