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
} from "@chakra-ui/react";
import { ChevronLeft, ShoppingCart, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuth";

const ITEMS = [
  {
    label: "Marinated",
    to: "/wholesale/marinated",
    icon: "/products/home/marinated.jpg",
    color: "white",
  },
  {
    label: "Processed",
    to: "/wholesale/processed",
    icon: "/products/home/processed.webp",
    color: "white",
  },
  {
    label: "Unprocessed",
    to: "/wholesale/unprocessed",
    icon: "/products/home/unprocessed.jpg",
    color: "white",
  },
  {
    label: "Deal",
    to: "/wholesale/deal",
    icon: "/final/deal.png",
    color: "#484849",
  },
  {
    label: "Order",
    to: "/wholesale/how-to-order",
    icon: "/final/order.png",
    color: "#484849",
  },
  {
    label: "Contact",
    to: "/contact",
    icon: "/final/contact us.png",
    color: "#484849",
  },
  {
    label: "Packing",
    to: "/wholesale/packing",
    icon: "/final/packing.png",
    color: "#484849",
  },
  {
    label: "B2B",
    to: "/wholesale/b2b",
    icon: "/final/b2b.png",
    color: "#484849",
  },
  {
    label: "FAQ",
    to: "/wholesale/faq",
    icon: "/final/FAQ.png",
    color: "#484849",
  },
];

export default function NavDrawer({ isOpen, onClose, containerRef }) {
  const [drawerWidth, setDrawerWidth] = useState("100%");
  const navigate = useNavigate();
  
  // Use the shared auth context instead of individual hook
  const { 
    userInfo, 
    isAuthenticated, 
    logout, 
    userName, 
    userId, 
    loading,
    error 
  } = useAuthContext(); // This is the key change!

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
    onClose(); 
    navigate("/");
  };

  const handleProfileClick = () => {
    
    if (isAuthenticated && userId) {
      navigate(`/profile/user/${userId}`);
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
            <IconButton
              aria-label="Cart"
              icon={<ShoppingCart size={24} />}
              variant="ghost"
              onClick={() => {
                navigate("/cart");
                onClose();
              }}
              _hover={{ bg: "gray.100" }}
            />
            <IconButton
              aria-label="Close menu"
              icon={
                <Text fontSize="2xl" color="#8f8e8e">
                  ☰
                </Text>
              }
              variant="ghost"
              onClick={onClose}
              size="xs"
              p={5}
            />
          </Flex>
        </Flex>

        {/* Greeting Section */}
        <Box textAlign="center" mb={4}>
          {loading ? (
            <VStack spacing={2}>
              <Spinner size="sm" />
              <Text fontSize="sm" color="gray.500">Loading...</Text>
            </VStack>
          ) : (
            <>
              <Heading as="h2" fontSize="2xl" fontWeight="semibold">
                <Text as="span" color="gray.500">
                  Hello{" "}
                </Text>
                <Text as="span" color="black">
                  {isAuthenticated ? userName : "Guest"}
                </Text>
              </Heading>
              
              <Box mt={2} fontSize="sm">
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
        <DrawerBody p={4}>
          <Grid
            templateColumns="repeat(3, 1fr)"
            gap={6}
            justifyItems="center"
            alignItems="center"
          >
            {ITEMS.map(({ label, to, icon, color }) => (
              <GridItem
                key={label}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <Circle
                  size="65px"
                  bg={color}
                  cursor="pointer"
                  onClick={() => {
                    navigate(to);
                    onClose(); // Close drawer after navigation
                  }}
                  _hover={{ 
                    transform: "scale(1.05)",
                    transition: "transform 0.2s"
                  }}
                >
                  <Image
                    src={icon}
                    fallbackSrc="/gray.avif"
                    boxSize="50px"
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
        </DrawerBody>

        {/* Footer Link */}
        <Box position="absolute" bottom="4" left="4" p={4}>
          <Link
            onClick={() => {
              navigate("/terms-and-policies");
              onClose(); // Close drawer after navigation
            }}
            fontSize="xs"
            textDecoration="underline"
            cursor="pointer"
            _hover={{ color: "blue.500" }}
          >
            Terms & Policies
          </Link>
        </Box>
      </DrawerContent>
    </Drawer>
  );
}