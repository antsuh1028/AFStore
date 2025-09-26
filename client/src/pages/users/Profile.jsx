import React, { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Container,
  useDisclosure,
  Flex,
  IconButton,
  Text,
  Heading,
  VStack,
  useToast,
  Alert,
  AlertIcon,
  Spinner,
  Center,
  Button,
  Grid,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,
  TabList,
  Divider,
} from "@chakra-ui/react";
import Sidebar from "../../components/SideBar";
import NavDrawer from "../../components/NavDrawer";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Filter } from "lucide-react";
import { useAuthContext } from "../../hooks/useAuth";
import Footer from "../../components/Footer";
import { getCart } from "../../utils/cartActions";
import { ShowCart } from "../../components/profile/ShowCart";
import MyRewards from "../../components/profile/MyRewards";
import { myPages } from "../../components/profile/ProfileComponents";
import { API_CONFIG, COLORS } from "../../constants";
import { useLanguage } from "../../hooks/LanguageContext";
import { decodeUserId } from "../../utils/urlEncryption";
import { CircleCheck } from "lucide-react";
import { ViewContainer } from "../../components/ViewContainer";

const UserProfile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const toast = useToast();
  const [currPage, setCurrPage] = useState("all");
  const location = useLocation();
  const defaultTabIndex = location.state?.activeTab || 0;
  const deleteModalDisclosure = useDisclosure();

  const {
    userInfo,
    isAuthenticated,
    logout,
    userName,
    userId,
    loading,
    error,
    userEmail,
    updateUserInfo,
    refreshUserInfo,
  } = useAuthContext();
  const { selectedLanguage } = useLanguage();

  const [orders, setOrders] = useState([]);
  const [cartItems, setCartItems] = useState(() => getCart());
  const [userAddress, setUserAddress] = useState([]);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [userInformation, setUserInformation] = useState({});
  const [userPoints, setUserPoints] = useState([]);
  const [userTotalPoints, setUserTotalPoints] = useState(0);
  const { encryptedUserId } = useParams();
  const actualUserId = decodeUserId(encryptedUserId);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.discounted_price * item.quantity,
    0
  );

  const formatAddress = (addressData) => {
    if (!addressData) return "—"; // Handle null/undefined

    if (Array.isArray(addressData) && addressData.length === 0) return "—";

    const addr = Array.isArray(addressData) ? addressData[0] : addressData;

    if (!addr) return "—";

    const parts = [
      addr.address_line_1,
      addr.address_line_2,
      `${addr.city}, ${addr.state} ${addr.zip_code}`,
    ].filter(Boolean);

    return parts.join(", "); // Added space after comma for better formatting
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/api/orders/user/${userId}`
        );
        const data = await response.json();
        if (data.success) {
          setOrders(data.data);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  useEffect(() => {
    if (userInfo) {
      setUserInformation({
        name: userInfo.name || "",
        email: userInfo.email || "",
        phone_number: userInfo.phone_number || "",
        california_resale: userInfo.california_resale || false,
        license_number: userInfo.license_number || "",
      });
    }
  }, [userInfo]);

  useEffect(() => {
    const fetchAddress = async () => {
      if (!userId) return;

      try {
        const addressResponse = await fetch(
          `${API_CONFIG.BASE_URL}/api/addresses/user/${userId}`
        );

        if (addressResponse.status === 404) {
          setUserAddress(null);
          return;
        }

        const address = await addressResponse.json();
        if (address.success && address.data && address.data.length > 0) {
          setUserAddress(address.data[0]);
        } else {
          setUserAddress(null);
        }
      } catch (err) {
        console.error("Error fetching address:", err);
        setUserAddress(null); // Set to null on error
      }
    };

    if (userId) {
      fetchAddress();
    }
  }, [userId]);

  useEffect(() => {
    const fetchPoints = async () => {
      if (!userId) return;

      try {
        const pointsResponse = await fetch(
          `${API_CONFIG.BASE_URL}/api/points/user/${userId}`
        );

        if (pointsResponse.status === 404) {
          setUserPoints(null);
          return;
        }

        const points = await pointsResponse.json();
        if (points.success && points.data && points.data.length > 0) {
          setUserPoints(points.data);
        } else {
          setUserPoints(null);
        }
        const pointsTotalResponse = await fetch(
          `${API_CONFIG.BASE_URL}/api/points/user/${userId}/total`
        );
        const total = await pointsTotalResponse.json();
        if (total.success && total.data) {
          setUserTotalPoints(total.data.total_points);
        } else {
          setUserTotalPoints(null);
        }
      } catch (err) {
        console.error("Error fetching points:", err);
        setUserPoints(null);
      }
    };

    if (userId) {
      fetchPoints();
    }
  }, [userId]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    navigate("/");
  };

  if (loading) {
    return (
      <Sidebar>
        <Container
          maxW={{ base: "100%", lg: "30%" }}
          p={0}
          bg="white"
          border={{ base: "none", lg: "1px" }}
          ml={{ base: 0, lg: "40%" }}
        >
          <Center h="100vh">
            <VStack spacing={4}>
              <Spinner size="xl" />
              <Text>Loading profile...</Text>
            </VStack>
          </Center>
        </Container>
      </Sidebar>
    );
  }

  if (error) {
    return (
      <Sidebar>
        <Container
          maxW={{ base: "100%", lg: "30%" }}
          p={0}
          bg="white"
          border={{ base: "none", lg: "1px" }}
          ml={{ base: 0, lg: "40%" }}
          minH="100vh"
        >
          <Box p={6}>
            <Alert status="error" mb={4}>
              <AlertIcon />
              Error loading profile: {error}
            </Alert>
            <Button onClick={() => navigate("/")}>Go Home</Button>
          </Box>
        </Container>
      </Sidebar>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!userInfo) {
    return (
      <Sidebar>
        <Container
          maxW={{ base: "100%", lg: "30%" }}
          p={0}
          bg="white"
          border={{ base: "none", lg: "1px" }}
          ml={{ base: 0, lg: "40%" }}
          minH="100vh"
        >
          <Center h="100vh">
            <VStack spacing={4}>
              <Spinner size="xl" />
              <Text>Loading user info...</Text>
            </VStack>
          </Center>
        </Container>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <NavDrawer isOpen={isOpen} onClose={onClose} containerRef={contentRef} />
      <ViewContainer contentRef={contentRef}>
        <Flex p={4} justify="space-between" align="center">
          <IconButton
            aria-label="Back"
            icon={<ChevronLeft size={24} />}
            variant="ghost"
            size="lg"
            colorScheme="gray"
            onClick={() => {
              if (currPage === "all" || currPage === "cart") {
                navigate("/");
              } else {
                setCurrPage("all");
              }
            }}
          />
          <IconButton
            aria-label="Menu"
            icon={<Text>☰</Text>}
            variant="ghost"
            onClick={onOpen}
          />
        </Flex>

        <Box textAlign="center" mb={6}>
          <Heading as="h1" size="lg" mb={8}>
            <Text as="span" color="gray.500" fontWeight="normal">
              Hello,{" "}
            </Text>
            <Text as="span" color="black" fontWeight="medium">
              {userName}
            </Text>
          </Heading>

          {userInfo.is_admin ? (
            <Tabs colorScheme="gray" align="center">
              <TabList
                gap={0}
                borderBottom="none"
                justifyContent="center"
                alignItems="center"
              >
                <Tab
                  fontWeight="medium"
                  px={2}
                  py={1}
                  fontSize="md"
                  border="none"
                  _selected={{
                    color: "black",
                    fontWeight: "bold",
                    border: "none",
                  }}
                  onClick={() => setCurrPage("all")}
                  color="gray.600"
                >
                  Profile
                </Tab>
                <Text
                  mx={2}
                  color="gray.400"
                  fontWeight="normal"
                  fontSize="lg"
                  userSelect="none"
                >
                  |
                </Text>
                <Tab
                  fontWeight="medium"
                  px={2}
                  py={1}
                  fontSize="md"
                  border="none"
                  _selected={{
                    color: "black",
                    fontWeight: "bold",
                    border: "none",
                  }}
                  color="gray.600"
                  onClick={() => navigate("/admin/dashboard")}
                >
                  Admin Dashboard
                </Tab>
              </TabList>
              <TabPanels my={12}>
                <TabPanel p={4}>
                  <Flex
                    p={4}
                    bg={COLORS.PRIMARY}
                    borderRadius="full"
                    align="center"
                    justify="space-between"
                    h="45px"
                    mb={2}
                  >
                    <Text color="white" fontWeight="bold" ml={2}>
                      Profile
                    </Text>
                  </Flex>
                  <VStack p={2} my={4} align="stretch">
                    <Box px={4} py={2}>
                      <Grid templateColumns="90px 1fr" rowGap={4} columnGap={2}>
                        <Text
                          fontWeight="bold"
                          textTransform="uppercase"
                          textAlign="left"
                          fontSize="sm"
                          mr={2}
                        >
                          Name :
                        </Text>
                        <Text fontSize="sm" textAlign="left">
                          {userName || "—"}
                        </Text>
                        <Text
                          fontWeight="bold"
                          textTransform="uppercase"
                          textAlign="left"
                          fontSize="sm"
                          mr={2}
                        >
                          Email :
                        </Text>
                        <Text fontSize="sm" textAlign="left">
                          {userEmail || "—"}
                        </Text>
                        <Text
                          fontWeight="bold"
                          textTransform="uppercase"
                          textAlign="left"
                          fontSize="sm"
                          mr={2}
                        >
                          Phone :
                        </Text>
                        <Text fontSize="sm" textAlign="left">
                          {userInfo?.phone_number || "—"}
                        </Text>
                        <Text
                          fontWeight="bold"
                          textTransform="uppercase"
                          textAlign="left"
                          fontSize="sm"
                          mr={2}
                        >
                          Address :
                        </Text>
                        <Text
                          fontSize="sm"
                          textAlign="left"
                          whiteSpace="pre-line"
                        >
                          {formatAddress(userAddress) || "—"}
                        </Text>
                      </Grid>
                    </Box>
                    <Flex my={4} justify="center" width="100%">
                      <Button
                        bg="none"
                        size="xs"
                        textDecoration="underline"
                        color="#b8b7b7"
                        _hover={{ bg: "none", color: "black" }}
                        onClick={handleLogout}
                      >
                        Log out
                      </Button>
                    </Flex>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          ) : (
            <Tabs
              colorScheme="gray"
              align="center"
              defaultIndex={defaultTabIndex}
            >
              <TabList
                gap={0}
                borderBottom="none"
                justifyContent="center"
                alignItems="center"
              >
                <Tab
                  fontWeight="medium"
                  px={2}
                  py={1}
                  fontSize="md"
                  border="none"
                  _selected={{
                    color: "black",
                    fontWeight: "bold",
                    border: "none",
                  }}
                  onClick={() => setCurrPage("all")}
                  color="gray.600"
                >
                  My Pages
                </Tab>
                <Text
                  mx={2}
                  color="gray.400"
                  fontWeight="normal"
                  fontSize="lg"
                  userSelect="none"
                >
                  |
                </Text>
                <Tab
                  fontWeight="medium"
                  px={2}
                  py={1}
                  fontSize="md"
                  border="none"
                  _selected={{
                    color: "black",
                    fontWeight: "bold",
                    border: "none",
                  }}
                  color="gray.600"
                >
                  Cart
                </Tab>
                {/* <Text
                  mx={2}
                  color="gray.400"
                  fontWeight="normal"
                  fontSize="lg"
                  userSelect="none"
                >
                  |
                </Text>
                <Tab
                  fontWeight="medium"
                  px={2}
                  py={1}
                  fontSize="md"
                  border="none"
                  _selected={{
                    color: "black",
                    fontWeight: "bold",
                    border: "none",
                  }}
                  color="gray.600"
                >
                  Rewards
                </Tab> */}
              </TabList>
              <TabPanels my={8}>
                <TabPanel>
                  {myPages(currPage, selectedLanguage, {
                    userInformation,
                    setUserInformation,
                    updateUserInfo,
                    handleLogout,
                    setCurrPage,
                    orders,
                    address: formatAddress(userAddress),
                    refreshUserInfo,
                    toast,
                    deleteModalDisclosure,
                  })}
                </TabPanel>
                <TabPanel>
                  <Flex
                    p={4}
                    bg={COLORS.PRIMARY}
                    borderRadius="full"
                    align="center"
                    justify="space-between"
                    h="45px"
                    mb={8}
                  >
                    <Text color="white" fontWeight="bold" ml={2}>
                      Cart
                    </Text>
                    <Text color="white" fontWeight="normal" fontSize="14px">
                      {totalItems} item(s)
                    </Text>
                  </Flex>
                  <ShowCart
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                    totalPrice={totalPrice}
                    identifier={userId}
                  />

                  <VStack spacing={3} w="100%" mt={4} mb={24} px={6}>
                    <Flex
                      bg={COLORS.GRAY_LIGHT}
                      p={2}
                      borderRadius="md"
                      align="flex-start"
                      w="100%"
                    >
                      <Box mr={3}>
                        <CircleCheck size={16} color="#494949" />
                      </Box>
                      <Text fontSize="13px" color="gray.600" lineHeight="1.4">
                        The minimum order amount is $250.
                      </Text>
                    </Flex>

                    <Flex
                      bg={COLORS.GRAY_LIGHT}
                      p={2}
                      borderRadius="md"
                      align="flex-start"
                      w="100%"
                    >
                      <Box mr={3} >
                        <CircleCheck size={16} color="#494949" />
                      </Box>
                      <Text fontSize="13px" color="gray.600" lineHeight="1.4" textAlign={"left"}>
                        In light of current market challenges, including cattle
                        shortages, facility pressures, and U.S. tariffs, certain
                        items have already incurred price increases without
                        prior notice. Additional adjustments may take effect
                        immediately and vary by customer. Thank you for your
                        understanding and continued support.
                      </Text>
                    </Flex>
                  </VStack>

                  {cartItems.length !== 0 && (
                    <Button
                      size="sm"
                      bg={COLORS.GRAY_MEDIUM}
                      color={COLORS.PRIMARY}
                      _hover={{ bg: COLORS.SECONDARY }}
                      onClick={() => navigate("/order-summary")}
                      borderRadius="full"
                      h="45px"
                      w="100%"
                    >
                      CHECK OUT ${totalPrice.toFixed(2)}
                    </Button>
                  )}
                </TabPanel>
                <TabPanel>
                  <Flex
                    p={4}
                    bg={COLORS.PRIMARY}
                    borderRadius="full"
                    align="center"
                    justify="space-between"
                    h="45px"
                    mb={8}
                  >
                    <Text color="white" fontWeight="bold" ml={2}>
                      My Rewards
                    </Text>
                    <Text
                      color="white"
                      fontWeight="normal"
                      fontSize="14px"
                      mr={2}
                    >
                      Points: {userTotalPoints || 0}
                    </Text>
                  </Flex>
                  <Box
                    maxH="60vh"
                    overflow="auto"
                    sx={{
                      "&::webkitScrollbar": {
                        display: "none",
                      },
                      msOverflowStyle: "none",
                      scrollbarWidth: "none",
                    }}
                    p={2}
                    border="1px"
                    borderColor="gray.200"
                  >
                    <MyRewards rewards={userPoints} />
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          )}
        </Box>
        <Footer />
      </ViewContainer>
    </Sidebar>
  );
};

export default UserProfile;
