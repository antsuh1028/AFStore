import React, { useRef, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; 
import {
  Box,
  Button,
  Container,
  Circle,
  Drawer,
  DrawerBody,
  DrawerContent,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  IconButton,
  VStack,
  Divider,
  SimpleGrid,
  Link,
} from "@chakra-ui/react";
import { ChevronLeft, ShoppingCart, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { color } from "framer-motion";

const ITEMS = [
  {
    label: "Marinated",
    to: "/wholesale/marinated",
    icon: "/products/marinated.jpg",
    color: "white",
  },
  {
    label: "Processed",
    to: "/wholesale/processed",
    icon: "/products/processed.webp",
    color: "white",
  },
  {
    label: "Unprocessed",
    to: "/wholesale/unprocessed",
    icon: "/products/unprocessed.jpg",
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
  const [currUser, setCurrUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  const getUserInfo = (userId) => {
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
    // console.log("Stored token:", storedToken);
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        // console.log(decoded);
        getUserInfo(decoded.userId);

        if (decoded.exp > Date.now() / 1000) {
          setToken(storedToken);
          setCurrUser(decoded);
          setIsAuthenticated(true);
        } else {
          // Token expired, remove it
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

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
    localStorage.removeItem("token");
    setToken(null);
    setCurrUser(null);
    setUserInfo(null);
    setIsAuthenticated(false);
    navigate("/");
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
              variant="ghost"
            />
            <IconButton
              aria-label="Cart"
              icon={<ShoppingCart size={24} />}
              variant="ghost"
              onClick={() => navigate("/cart")}
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

        <Box textAlign="center" mb={4}>
          <Heading as="h2" fontSize="2xl" fontWeight="semibold">
            <Text as="span" color="gray.500">
              Hello{" "}
            </Text>
            <Text as="span" color="black">
              {userInfo?.name?.split(" ")[0] || "User"}
            </Text>
          </Heading>
          <Box mt={2} fontSize="sm">
            {isAuthenticated ? (
              <Link onClick={handleLogout} color="gray.600">
                Logout
              </Link>
            ) : (
              <>
                <Link
                  onClick={() => navigate("/login")}
                  mr={2}
                  color="gray.600"
                >
                  Login
                </Link>
                |{" "}
                <Link onClick={() => navigate("/signup")} color="gray.600">
                  Sign up
                </Link>
              </>
            )}
          </Box>
        </Box>

        <Divider mb={4} />

        {/* Grid*/}
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
                  onClick={() => navigate(to)}
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
            onClick={() => navigate("/terms-and-policies")}
            fontSize="xs"
            textDecoration="underline"
          >
            Terms & Policies
          </Link>
        </Box>
      </DrawerContent>
    </Drawer>
  );
}
