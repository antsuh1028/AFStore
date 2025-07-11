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

  // useEffect(() => {

  //   // console.log("location:", state);
  // }, []);

  const getUserInfo = (userId) => {
    window.scrollTo(0, 0);
    const state = location.state;

    // console.log("Fetching user info for userId:", userId);
    fetch(`http://localhost:3001/api/users/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setUserInfo(data.user);
        // console.log("Current user:", data.user);
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
      });
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        getUserInfo(decoded.userId);

        if (decoded.exp > Date.now() / 1000) {
          setToken(storedToken);
          setCurrUser(decoded);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("token");
        }
      } catch (error) {
        localStorage.removeItem("token");
      }
    }
  }, []);

  useEffect(() => {
    if (form.current && userInfo) {
      form.current.user_name.value = userInfo.name || "";
      form.current.user_email.value = userInfo.email || "";
      form.current.user_phone.value = userInfo.phone_number || "";
      form.current.license_number.value = userInfo.license_number || "";
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
        border={{ base: "none", lg: "1px" }}
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

          <Tabs variant="enclosed" colorScheme="gray">
            <TabList justifyContent="center">
              <Tab>Contact Form</Tab>
              <Tab>Order Now</Tab>
            </TabList>

            <TabPanels>
              <TabPanel p={0} pt={6}>
                <Heading
                  as="h4"
                  size="sm"
                  mb={4}
                  fontWeight="extrabold"
                  textAlign="left"
                >
                  Inquiries
                </Heading>

                <Text
                  fontSize="sm"
                  mb={2}
                  textAlign="left"
                  fontWeight="hairline"
                >
                  To ensure we can address your enquiry correctly, please
                  provide a detailed message.
                </Text>

                <Text fontSize="sm" mb={4} textAlign="left" fontWeight="bold">
                  Support hours: Mon–Fri, 8:00AM–4:30PM
                </Text>

                <Text fontSize="sm" mb={4} textAlign="left" fontWeight="bold">
                  Please make sure to specify the exact title of the meat!
                </Text>

                <form ref={form} onSubmit={sendEmail}>
                  <VStack spacing={4} align="stretch">
                    <FormControl isRequired>
                      <FormLabel>Name:</FormLabel>
                      <Input
                        type="text"
                        name="user_name"
                        {...inputStyle}
                        placeholder="Enter Name..."
                      />
                    </FormControl>

                    <FormControl isRequired isInvalid={emailError !== ""}>
                      <FormLabel>Email:</FormLabel>
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
                      {emailError && (
                        <FormErrorMessage>{emailError}</FormErrorMessage>
                      )}
                    </FormControl>

                    <FormControl>
                      <FormLabel>Phone Number:</FormLabel>
                      <Input
                        type="tel"
                        name="user_phone"
                        {...inputStyle}
                        placeholder="Enter Phone #..."
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Company:</FormLabel>
                      <Input
                        type="company"
                        name="company"
                        {...inputStyle}
                        placeholder="Enter Company Name..."
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <Flex>
                        <FormLabel>Wholesale License #:</FormLabel>
                        <Popover>
                          <PopoverTrigger>
                            <IconButton
                              icon={<Info size={16} color="gray" />}
                              bg="none"
                              size="xs"
                              borderRadius="full"
                              aria-label="License information"
                            />
                          </PopoverTrigger>
                          <PopoverContent>
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverBody>
                              <Text fontSize="sm">
                                Upload your valid wholesale license document.
                                Accepted formats: PDF, JPG, PNG. A picture is
                                also valid
                              </Text>
                            </PopoverBody>
                          </PopoverContent>
                        </Popover>
                      </Flex>
                      <Input
                        type="text"
                        name="license_number"
                        placeholder="C-1234567"
                        {...inputStyle}
                        isReadOnly={false}
                      />
                      <Box display="flex" alignItems="center" mt={2}>
                        <Button
                          as="label"
                          htmlFor="license-file-upload"
                          fontSize="sm"
                          color="gray.500"
                          textDecoration="underline"
                          cursor="pointer"
                          bg="none"
                          mx={2}
                          minW="unset"
                          p={0}
                          h="auto"
                          lineHeight="1"
                        >
                          Attached file
                        </Button>
                        <Input
                          id="license-file-upload"
                          name="license_file"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          position="absolute"
                          top="0"
                          left="0"
                          opacity="0"
                          width="0.1px"
                          height="0.1px"
                          overflow="hidden"
                          zIndex="-1"
                          onChange={(e) => {
                            setFileName(
                              e.target.files[0]?.name || "No file chosen"
                            );
                          }}
                        />
                        <Text color="gray.500" fontSize="sm" ml={2}>
                          *Please attach the wholesale license.
                        </Text>
                      </Box>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Message</FormLabel>
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
                        placeholder="Include Message here..."
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

                    <Box mb={6} p={4} bg="gray.50" borderRadius="lg">
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
                    </Box>

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
              </TabPanel>

              <TabPanel p={0} pt={6}>
                <VStack spacing={6} align="center" py={12}>
                  <Text fontSize="lg" textAlign="center">
                    Need to place an order or have questions?
                  </Text>
                  <Button
                    size="lg"
                    bg="#494949"
                    color="white"
                    onClick={() => navigate("/wholesale/shop-all")}
                    _hover={{ bg: "#6AAFDB" }}
                  >
                    Go to Orders
                  </Button>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>

          <Footer />
        </Box>
      </Container>
    </Sidebar>
  );
};

export default ContactPage;
