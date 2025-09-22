import {
  VStack,
  Text,
  Button,
  Box,
  Flex,
  Image,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCart,
  addToCart,
  removeFromCart,
  subtractFromCart,
} from "../../utils/cartActions";

import { COLORS } from "../../constants";

export const ShowCart = ({
  cartItems,
  setCartItems,
  totalPrice,
  identifier,
}) => {
  const navigate = useNavigate();

    const specs = {
    "30 lb - 5 lb x 6 packs": "/ 30 lb box",
    "20 lb - 10 lb x 2 packs": "/ 20 lb box",
    "50 lb - 50 lb x 1 box": "/ 50 lb box",
    "C.W. (Catch Weights)": "/ ~ 35 lb box",
    
  };

  // Ensure parent state synced with storage on mount / identifier change
  useEffect(() => {
    if (setCartItems) {
      setCartItems(getCart(identifier));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identifier]);

  const getImagePath = (name, style) => {
    if (style && name) {
      const safeName = name.replace(/[\/\\:*?"<>|]/g, "").trim();
      const safeStyle = style.replace(/[\/\\:*?"<>|]/g, "").trim();
      return `/products/${safeStyle}/${safeName}/01.jpg`;
    }
    return "/images/gray.avif";
  };

  const handleAdd = (product) => {
    addToCart(product, identifier);
    if (setCartItems) setCartItems(getCart(identifier));
  };

  const handleRemove = (product_id) => {
    removeFromCart(product_id, identifier);
    if (setCartItems) setCartItems(getCart(identifier));
  };

  const handleSubtract = (product_id) => {
    subtractFromCart(product_id, identifier);
    if (setCartItems) setCartItems(getCart(identifier));
  };

  const items =
    cartItems && Array.isArray(cartItems) ? cartItems : getCart(identifier);

  return items.length === 0 ? (
    <VStack py={8} spacing={4}>
      <Text color="gray.500">Your cart is empty</Text>
      <Button
        size="sm"
        bg={COLORS.GRAY_MEDIUM}
        onClick={() => navigate("/wholesale/shop-all")}
      >
        Browse Products
      </Button>
    </VStack>
  ) : (
    <VStack align="stretch">
      {items.map((item) => (
        <Box key={item.id} borderRadius="lg" p={2} pb={4} bg="white">
          <Flex gap={3} align="center">
            <Image
              src={getImagePath(item.name, item.style)}
              alt={item.name}
              w="130px"
              h="130px"
              objectFit="cover"
              borderRadius="md"
              fallbackSrc="/images/gray.avif"
              _hover={{ cursor: "pointer" }}
              onClick={() => navigate(`/wholesale/product/${item.id}`)}
            />
            <VStack align="stretch" flex="1">
              <Flex gap={8} justifyContent="space-between" width="100%" mb={1}>
                <Text
                  fontWeight="thin"
                  fontSize="13px"
                  color="gray"
                  noOfLines={1}
                  _hover={{ cursor: "pointer", textDecor: "underline" }}
                  onClick={() => navigate(`/wholesale/${item.style}`)}
                >
                  {item.style === "marinated"
                    ? "Marinated Meat"
                    : item.style === "processed"
                    ? "Prepped Meat"
                    : item.style === "unprocessed"
                    ? "Whole Meat"
                    : item.style}{" "}
                </Text>
                <Text
                  textDecor="underline"
                  onClick={() => handleRemove(item.id)}
                  textColor="gray.400"
                  fontWeight="light"
                  fontSize="13px"
                  cursor="pointer"
                >
                  Remove
                </Text>
              </Flex>

              <Text
                fontSize="15px"
                pr={6}
                textAlign="left"
                whiteSpace="pre-line"
                lineHeight="1.2"
                _hover={{ cursor: "pointer", textDecor: "underline" }}
                onClick={() => navigate(`/wholesale/product/${item.id}`)}
              >
                {item.name} {"\n"} {item.spec}
              </Text>

              <Flex justifyContent="space-between" width="100%" align="center">
                <Text fontSize="16px" color="black" fontWeight="bold">
                  $
                  {(
                    (Number(item.discounted_price) || 0) *
                    (Number(item.quantity) || 0)
                  ).toFixed(2)}
                </Text>
                <Text fontSize="11px" color="gray.500" ml={2}>
                  {specs[item.spec]}
                </Text>
                <HStack spacing={2}>
                  <Button
                    size="xs"
                    onClick={() => handleSubtract(item.id)}
                    variant="outline"
                    border="none"
                  >
                    -
                  </Button>
                  <Text>{item.quantity}</Text>
                  <Button
                    size="xs"
                    onClick={() => handleAdd(item)}
                    variant="outline"
                    border="none"
                  >
                    +
                  </Button>
                </HStack>
              </Flex>
            </VStack>
          </Flex>
          <Divider mt={6} borderColor={COLORS.GRAY_MEDIUM} borderWidth="1px" />
        </Box>
      ))}
    </VStack>
  );
};
