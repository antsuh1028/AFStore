import React, { useRef, useEffect, useState } from "react";
import {
  Box,
  Circle,
  Drawer,
  DrawerBody,
  DrawerContent,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Text,
  IconButton,
  Divider,
  Link,
  Spinner,
  VStack,
  Badge,
  HStack,
} from "@chakra-ui/react";
import { ChevronLeft, ShoppingCart, UserRound, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuth";
import { COLORS } from "../constants";
import { API_CONFIG } from "../constants";
import { encodeUserId } from "../utils/urlEncryption";

const ITEMS = [
  {
    label: "Marinated",
    to: "/wholesale/marinated",
    icon: "/images/marinated_button.avif",
    fallback: "/images/marinated_button.png",
    color: COLORS.GRAY_MEDIUM,
  },
  {
    label: "Prepped",
    to: "/wholesale/processed",
    icon: "/images/processed_button.avif",
    fallback: "/images/processed_button.png",
    color: COLORS.GRAY_MEDIUM,
  },
  {
    label: "Whole Meat",
    to: "/wholesale/unprocessed",
    icon: "/images/wholesale_button.avif",
    fallback: "/images/wholesale_button.png",
    color: COLORS.GRAY_MEDIUM,
  },
  {
    label: "Adams",
    to: "/wholesale/adams-gourmet",
    icon: "/images/home_icons/adams.avif",
    fallback: "/images/home_icons/adams.jpg",
    color: COLORS.GRAY_MEDIUM,
  },
  {
    label: "Deal",
    to: "/wholesale/deal",
    icon: "/images/home_icons/deal.avif",
    fallback: "/images/home_icons/deal.jpg",
    color: COLORS.GRAY_MEDIUM,
  },
  {
    label: "How to Order",
    to: "/wholesale/how-to-order",
    icon: "/images/home_icons/how_to_order.avif",
    fallback: "/images/home_icons/how_to_order.jpg",
    color: COLORS.GRAY_MEDIUM,
  },
  {
    label: "Contact",
    to: "/contact",
    icon: "/images/home_icons/contact.avif",
    fallback: "/images/home_icons/contact.jpg",
    color: COLORS.GRAY_MEDIUM,
  },
  {
    label: "Packing",
    to: "/wholesale/packing",
    icon: "/images/home_icons/packing.avif",
    fallback: "/images/home_icons/packing.png",
    color: COLORS.GRAY_MEDIUM,
  },
  {
    label: "B2B",
    to: "/wholesale/b2b",
    icon: "/images/home_icons/b2b.avif",
    fallback: "/images/home_icons/b2b.png",
    color: COLORS.GRAY_MEDIUM,
  },
  {
    label: "FAQ",
    to: "/wholesale/faq",
    icon: "/images/home_icons/faq.avif",
    fallback: "/images/home_icons/faq.png",
    color: COLORS.GRAY_MEDIUM,
  },
];

export default function NavDrawer({ isOpen, onClose, containerRef }) {
  const [drawerWidth, setDrawerWidth] = useState("100%");
  const [points, setPoints] = useState(0);
  const [pointsLoading, setPointsLoading] = useState(false);
  const [pointsError, setPointsError] = useState(null);
  const navigate = useNavigate();

  const {
    userInfo,
    isAuthenticated,
    logout,
    userName,
    userId,
    loading,
    error,
  } = useAuthContext();

  // Fetch user points
  useEffect(() => {
    const fetchUserPoints = async () => {
      if (!isAuthenticated || !userId) {
        setPoints(0);
        return;
      }

      setPointsLoading(true);
      setPointsError(null);

      try {
        const res = await fetch(
          `${API_CONFIG.BASE_URL}/api/points/user/${userId}/total`
        );
        const data = await res.json();

        if (data.success) {
          setPoints(data.data.total_points || 0);
        } else {
          setPointsError("Failed to load points");
        }
      } catch (err) {
        console.error("Error fetching points:", err);
        setPointsError("Failed to load points");
        setPoints(0);
      } finally {
        setPointsLoading(false);
      }
    };

    if (isOpen) {
      fetchUserPoints();
    }
  }, [isOpen, isAuthenticated, userId]);

  // Handle drawer width
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef && containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setDrawerWidth(`${width}px`);
      }
    };

    if (isOpen) {
      updateWidth();
    }

    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [isOpen, containerRef]);

  const handleLogout = () => {
    logout();
    setPoints(0); // Reset points on logout
    onClose();
    navigate("/");
  };

  const handleProfileClick = () => {
    if (isAuthenticated && userId) {
      const encryptedUserId = encodeUserId(userId);
      navigate(`/profile/user/${encryptedUserId}`);
      onClose();
    } else {
      navigate("/login");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Drawer
      placement="top"
      onClose={onClose}
      isOpen={isOpen}
      transitionDuration={{ enter: "0.1s", exit: "0.1s" }}
    >
      <DrawerContent
        bg="white"
        width={drawerWidth}
        ml={containerRef?.current?.offsetLeft || 0}
        height="100%"
      >
        {/* Top controls */}
        <Flex justify="space-between" align="center" p={4}>
          <IconButton
            aria-label="Back"
            icon={<ChevronLeft size={36} color="#8f8e8e" />}
            variant="ghost"
            onClick={onClose}
          />
          <Flex>
            <IconButton
              aria-label="Profile"
              icon={<UserRound size={24} />}
              onClick={handleProfileClick}
              variant="ghost"
              _hover={{ bg: "gray.100" }}
            />
            {isAuthenticated && (
              <IconButton
                aria-label="Cart"
                icon={<ShoppingCart size={24} />}
                variant="ghost"
                onClick={() => {
                  const encryptedUserId = encodeUserId(userId);
                  navigate(`/profile/user/${encryptedUserId}`, {
                    state: { activeTab: 1 },
                  });
                  onClose();
                }}
                _hover={{ bg: "gray.100" }}
              />
            )}
            <IconButton
              aria-label="Close menu"
              icon={<Text fontSize="2xl">☰</Text>}
              variant="ghost"
              onClick={onClose}
              size="xs"
              py={5}
              px={2}
            />
          </Flex>
        </Flex>

        {/* Greeting Section */}
        <Box textAlign="center" mb={4}>
          {loading ? (
            <VStack spacing={2}>
              <Spinner size="sm" />
              <Text fontSize="sm" color="gray.500">
                Loading...
              </Text>
            </VStack>
          ) : (
            <>
              <Heading as="h2" fontSize="2xl" fontWeight="semibold" mb={4}>
                <Text as="span" color="gray.500">
                  Hello{" "}
                </Text>
                <Text as="span" color="black">
                  {isAuthenticated ? userName : "Guest"}
                </Text>
              </Heading>

              {/* Points Display for Authenticated Users */}
              {isAuthenticated && (
                <Box mb={4}>
                  <HStack justify="center" spacing={2}>
                    <Star size={16} color="#b3967f" fill="#b3967f" />
                    <Text fontSize="sm" color="gray.600">
                      Rewards Points:
                    </Text>
                    {pointsLoading ? (
                      <Spinner size="xs" />
                    ) : pointsError ? (
                      <Text fontSize="xs" color="red.500">
                        Error loading points
                      </Text>
                    ) : (
                      <Badge
                        colorScheme="yellow"
                        variant="solid"
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontWeight="bold"
                      >
                        {points.toLocaleString()}
                      </Badge>
                    )}
                  </HStack>
                  <Text fontSize="xs" color="gray.400" mt={1}>
                    Earned in last 6 months
                  </Text>
                </Box>
              )}

              <Box my={6} fontSize="sm">
                {isAuthenticated ? (
                  <>
                    <Link
                      onClick={handleLogout}
                      mr={2}
                      color="gray.600"
                      cursor="pointer"
                      _hover={{ color: "blue.500" }}
                    >
                      Logout
                    </Link>
                    |{" "}
                    <Link
                      onClick={handleProfileClick}
                      color="gray.600"
                      cursor="pointer"
                      _hover={{ color: "blue.500" }}
                    >
                      Profile
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      onClick={() => {
                        navigate("/login");
                        onClose();
                      }}
                      mr={2}
                      color="gray.600"
                      cursor="pointer"
                      _hover={{ color: "blue.500" }}
                    >
                      Login
                    </Link>
                    |{" "}
                    <Link
                      onClick={() => {
                        navigate("/signup");
                        onClose();
                      }}
                      color="gray.600"
                      cursor="pointer"
                      _hover={{ color: "blue.500" }}
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </Box>

              {/* Show error if any */}
              {error && (
                <Text fontSize="xs" color="red.500" mt={1}>
                  {error}
                </Text>
              )}
            </>
          )}
        </Box>

        <Divider mb={4} />

        {/* Navigation Grid */}
        <DrawerBody p={4} overflow="auto">
          <Grid
            templateColumns="repeat(3, 1fr)"
            gap={4}
            justifyItems="center"
            alignItems="center"
          >
            {ITEMS.map(({ label, to, icon, fallback, color }) => (
              <GridItem
                key={label}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <Circle
                  size="75px"
                  bg={color}
                  cursor="pointer"
                  onClick={() => {
                    navigate(to);
                    onClose();
                  }}
                  _hover={{
                    transform: "scale(1.05)",
                    transition: "transform 0.2s",
                  }}
                >
                  <Image
                    src={icon}
                    fallbackSrc={fallback}
                    boxSize="75px"
                    objectFit="cover"
                    borderRadius="full"
                    alt={label}
                  />
                </Circle>
                <Text fontSize="13px" fontWeight="bold" mt={2}>
                  {label}
                </Text>
              </GridItem>
            ))}
          </Grid>
          <Flex pt={24}>
            <Link
              onClick={() => {
                navigate("/terms-and-policies");
                onClose();
              }}
              fontSize="xs"
              textDecoration="underline"
              cursor="pointer"
              color={COLORS.PRIMARY}
              _hover={{ color: COLORS.SECONDARY }}
            >
              Terms & Policies
            </Link>
            <Link
              onClick={() => {
                navigate("/cookies");
                onClose();
              }}
              fontSize="xs"
              textDecoration="underline"
              cursor="pointer"
              color={COLORS.PRIMARY}
              _hover={{ color: "blue.500" }}
              ml={4}
            >
              Cookies Policy
            </Link>
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
