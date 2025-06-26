import React, { useRef, useEffect, useState } from "react";
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

const ITEMS = [
  { label: "Marinated", to: "/wholesale/marinated", icon: "/icons/gray.avif" },
  { label: "Processed", to: "/wholesale/processed", icon: "/icons/gray.avif" },
  { label: "Unprocessed", to: "/wholesale/unprocessed", icon: "/icons/gray.avif" },
  { label: "Deal", to: "/wholesale/deal", icon: "/final/deal.png" },
  { label: "Order", to: "/wholesale/how-to-order", icon: "/final/order.png" },
  { label: "Contact", to: "/contact", icon: "/final/contact us.png" },
  { label: "Packing", to: "/wholesale/packing", icon: "/final/packing.png" },
  { label: "B2B", to: "/wholesale/b2b", icon: "/final/b2b.png" },
  { label: "FAQ", to: "/wholesale/faq", icon: "/final/FAQ.png" },
];

export default function NavDrawer({ isOpen, onClose, containerRef }){
  const [drawerWidth, setDrawerWidth] = useState("100%");
  const navigate = useNavigate();

  useEffect(() => {
    // Function to update drawer width based on container width
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
              icon={<Text fontSize="2xl" color="#8f8e8e">☰</Text>}
              variant="ghost"
              onClick={onClose}
              size="xs"
              p={5}
            />
          </Flex>
        </Flex>

        {/* Greeting */}
        <Box textAlign="center" mb={4}>
          <Heading as="h2" fontSize="2xl" fontWeight="semibold">
            <Text as="span" color="gray.500">Hello </Text>
            <Text as="span" color="black">User</Text>
          </Heading>
          <Box mt={2} fontSize="sm">
            <Link onClick={() => navigate("/login")} mr={2} color="gray.600">
              Login
            </Link>
            |{' '}
            <Link onClick={() => navigate("/signup")} color="gray.600">
              Sign up
            </Link>
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
            {ITEMS.map(({ label, to, icon }) => (
              <GridItem
                key={label}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <Circle
                  size="65px"
                  bg="#efedef"
                  cursor="pointer"
                  onClick={() => navigate(to)}
                >
                  <Image
                    src={icon}
                    fallbackSrc="/gray.avif"
                    boxSize="65px"
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