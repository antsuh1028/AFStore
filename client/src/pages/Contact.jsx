import React, { useRef, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

import {
  Box,
  Flex,
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
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCart } from "../utils/cartActions";

import Footer from "../components/Footer";
import Sidebar from "../components/SideBar";
import Breadcrumbs from "../components/Breadcrumbs";
import NavDrawer from "../components/NavDrawer";
import Navbar from "../components/Navbar";
import { COLORS, API_CONFIG } from "../constants";
import { useLanguage } from "../hooks/LanguageContext";
import { translator } from "../utils/translator";

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
  const [userAddress, setUserAddress] = useState(null);

  const location = useLocation();
  const { selectedLanguage } = useLanguage();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);

        if (decoded.exp > Date.now() / 1000) {
          setToken(storedToken);
          setCurrUser(decoded);
          setIsAuthenticated(true);

          fetch(`${API_CONFIG.BASE_URL}/api/users/${decoded.userId}`)
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

  useEffect(() => {
    const fetchUserAddress = async () => {
      if (isAuthenticated && currUser.userId) {
        try {
          const response = await fetch(
            `${API_CONFIG.BASE_URL}/api/addresses/user/${currUser.userId}`
          );

          const data = await response.json();
          if (data.success && data.data.length > 0) {
            console.log(data.data);
            setUserAddress(data.data[0]);
          }
        } catch (error) {
          console.error("Error fetching address:", error);
        }
      }
    };

    fetchUserAddress();
  }, [isAuthenticated, currUser.userId]);

  useEffect(() => {
    if (form.current && userInfo && Object.keys(userInfo).length > 0) {
      if (form.current.user_name)
        form.current.user_name.value = userInfo.name || "";
      if (form.current.user_email)
        form.current.user_email.value = userInfo.email || "";
      if (form.current.user_phone)
        form.current.user_phone.value = userInfo.phone_number || "";
      if (form.current.company)
        form.current.company.value = userInfo.company || "";
      if (form.current.business_license)
        form.current.business_license.value = userInfo.license_number || "";
      if (form.current.california_resale)
        form.current.california_resale.value = userInfo.california_resale || "";

      if (userAddress) {
        if (form.current.company_address_1)
          form.current.company_address_1.value =
            userAddress.address_line_1 || "";
        if (form.current.company_address_2)
          form.current.company_address_2.value =
            userAddress.address_line_2 || "";
        if (form.current.zip_code)
          form.current.zip_code.value = userAddress.zip_code || "";
        if (form.current.city) form.current.city.value = userAddress.city || "";
        if (form.current.state)
          form.current.state.value = userAddress.state || "";
      }
    }
  }, [userInfo, userAddress]);

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(!regex.test(value) ? "Invalid email address" : "");
  };

  const inputStyle = {
    borderRadius: "999px",
    bg: COLORS.GRAY_LIGHT,
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
      company: formData.get("company"),
      license_number: formData.get("business_license"),
      message: formData.get("message"),
      cart_items: cartItems,
      cart_total: cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      company_address_1: userAddress?.address_line_1,
      company_address_2: userAddress?.address_line_2,
      city: userAddress?.city,
      state: userAddress?.state,
      zip_code: userAddress?.zip_code,
      business_license: userInfo?.license_number,
      california_resale: userInfo?.california_resale,
    };

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/inquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inquiryData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit inquiry");
      }

      toast({
        title: "Inquiry submitted!",
        description: "We've received your inquiry and will respond soon.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      form.current.reset();
      setEmail("");
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
        <Navbar onOpen={onOpen} home={true} />

        <Box py={3} px={4} display="flex" justifyContent="center">
          <Breadcrumbs
            listOfBreadCrumbs={[
              { label: "Home", url: "/" },
              { label: "Contact", url: "/contact" },
            ]}
          />
        </Box>

        <Box px={6} py={4}>
          <Heading mb={3} fontWeight="bold" fontSize="3xl" textAlign="center">
            Contact Us
          </Heading>
          <Text mb={4} color="gray.500" fontSize="md" textAlign="center">
            We look forward to hearing from you
          </Text>

          <Divider mb={6} borderColor="gray.300" />

          <Box mb={6}>
            <VStack spacing={3} align="stretch">
              <Text fontSize="sm" fontWeight="bold" color="black">
                {translator("Inquiries", "문의 사항")}
              </Text>

              <Text fontSize="sm" color="gray.600" lineHeight="1.5">
                {translator(
                  "To ensure we can address your enquiry correctly, please provide a detailed message.",
                  "정확한 답변을 위해 상세한 내용을 작성해 주세요."
                )}
              </Text>

              <Text fontSize="sm" color="black" fontWeight="semibold">
                {translator(
                  "Support hours : Mon~Fri, 8:00AM~2:30PM",
                  "운영 시간: 월~금, 오전 8시 ~ 오후 2시 30분"
                )}
              </Text>

              <Text fontSize="sm" color="gray.600" lineHeight="1.5">
                {translator(
                  "Please make sure to specify the exact title of the meat!",
                  "고기 명칭을 정확히 기재해 주시기 바랍니다!"
                )}
              </Text>
            </VStack>
          </Box>

          <form ref={form} onSubmit={sendEmail}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel fontWeight="semibold" fontSize="sm">
                  Name
                </FormLabel>
                <Input
                  type="text"
                  name="user_name"
                  {...inputStyle}
                  placeholder="Name"
                />
              </FormControl>

              <FormControl isRequired isInvalid={emailError !== ""}>
                <FormLabel fontWeight="semibold" fontSize="sm">
                  Email
                </FormLabel>
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
                <FormLabel fontWeight="semibold" fontSize="sm">
                  Phone Number
                </FormLabel>
                <Input
                  type="tel"
                  name="user_phone"
                  {...inputStyle}
                  placeholder="123-456-7890"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold" fontSize="sm">
                  Company Name
                </FormLabel>
                <Input
                  type="text"
                  name="company"
                  {...inputStyle}
                  placeholder="AdamsFoods"
                />
              </FormControl>

              {!isAuthenticated && (
                <>
                  <FormControl>
                    <FormLabel fontWeight="semibold" fontSize="sm">
                      Company Address line 1
                    </FormLabel>
                    <Input
                      type="text"
                      name="company_address_1"
                      {...inputStyle}
                      placeholder="1805 Industrial St"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontWeight="semibold" fontSize="sm">
                      Company Address line 2
                    </FormLabel>
                    <Input
                      type="text"
                      name="company_address_2"
                      {...inputStyle}
                      placeholder="Suite 100"
                    />
                  </FormControl>
                  <HStack spacing={4}>
                    <FormControl>
                      <FormLabel fontWeight="semibold" fontSize="sm">
                        City
                      </FormLabel>
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
                      <FormLabel fontWeight="semibold" fontSize="sm">
                        Zip code
                      </FormLabel>
                      <Input
                        type="text"
                        name="zip_code"
                        {...inputStyle}
                        placeholder="90021"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontWeight="semibold" fontSize="sm">
                        State
                      </FormLabel>
                      <Input
                        type="text"
                        name="state"
                        {...inputStyle}
                        placeholder="CA"
                      />
                    </FormControl>
                  </HStack>
                  <FormControl>
                    <FormLabel fontWeight="semibold" fontSize="sm">
                      Business License
                    </FormLabel>
                    <Input
                      type="text"
                      name="business_license"
                      {...inputStyle}
                      placeholder="LA-1234567 or 2025-000123"
                    />
                    <Flex mt={2}>
                      <Button
                        as="label"
                        htmlFor="business-license-upload"
                        fontSize="xs"
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
                      <Text fontSize="2xs" color="gray.500" mt={1} ml={2}>
                        {translator(
                          "*Please attach the Business License",
                          "*사업자 등록증을 첨부해 주세요"
                        )}
                      </Text>
                    </Flex>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontWeight="semibold" fontSize="sm">
                      California Resale Certificate
                    </FormLabel>
                    <Input
                      type="text"
                      name="california_resale"
                      {...inputStyle}
                      placeholder="#123-456789"
                    />
                    <Flex mt={2}>
                      <Button
                        as="label"
                        htmlFor="resale-cert-upload"
                        fontSize="xs"
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
                      <Text fontSize="2xs" color="gray.500" mt={1} ml={2}>
                        {translator(
                          "*Please attach the California Resale Certificate",
                          "*캘리포니아 재판매 증명서를 첨부해 주세요"
                        )}
                      </Text>
                    </Flex>
                  </FormControl>{" "}
                </>
              )}

              <FormControl>
                <FormLabel fontWeight="semibold" fontSize="sm">
                  Message
                </FormLabel>
                <Textarea
                  name="message"
                  rows={5}
                  borderRadius="lg"
                  bg={COLORS.GRAY_LIGHT}
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
                  .reduce((sum, item) => sum + item.price * item.quantity, 0)
                  .toFixed(2)}
              />

              <Box display="flex" justifyContent="center" width="100%" pt={4}>
                <Button
                  type="submit"
                  bg={COLORS.PRIMARY}
                  color="white"
                  isLoading={loading}
                  borderRadius="full"
                  size="lg"
                  width="100%"
                  _hover={{ bg: COLORS.SECONDARY }}
                >
                  SEND
                </Button>
              </Box>
            </VStack>
          </form>
        </Box>
        <Footer />
      </Container>
    </Sidebar>
  );
};

export default ContactPage;
