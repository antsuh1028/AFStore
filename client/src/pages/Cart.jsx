import { useRef, useState } from "react";
import Sidebar from "../components/SideBar";
import {
  Box,
  Button,
  Flex,
  Image,
  HStack,
  VStack,
  Container,
  Text,
  Heading,
  Divider,
} from "@chakra-ui/react";
import {
  addToCart,
  getCart,
  removeFromCart,
  subtractFromCart,
} from "../utils/cartActions";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useDisclosure } from "@chakra-ui/react";
import NavDrawer from "../components/NavDrawer";

const CartItem = ({
  id,
  name,
  price,
  images,
  spec,
  style,
  quantity,
  onAdd,
  onRemove,
  onSubtract,
}) => {
  const navigate = useNavigate();
  return (
    <Box
      border="1px"
      borderColor="gray.200"
      borderRadius="lg"
      p={4}
      mb={3}
      bg="white"
      boxShadow="sm"
    >
      <Flex gap={4} align="center">
        <Image
          src={images?.[0] || "/gray.avif"}
          alt={name}
          w="60px"
          h="60px"
          objectFit="cover"
          borderRadius="md"
        />

        <Box flex="1">
          <Text
            fontWeight="semibold"
            fontSize="sm"
            noOfLines={2}
            onClick={() => navigate(`/wholesale/product/${id}`)}
            cursor="pointer"
            _hover={{ textDecoration: "underline", color: "blue.600" }}
            mb={1}
          >
            {name}
          </Text>
          <Text fontSize="xs" color="gray.500" mb={2}>
            {spec}
          </Text>
          <Text fontWeight="bold" color="green.600" fontSize="md">
            ${price}
          </Text>
        </Box>

        <VStack spacing={2} align="center">
          <Text fontSize="sm" fontWeight="medium">
            Qty: {quantity}
          </Text>
          <HStack spacing={1}>
            <Button
              size="xs"
              onClick={() => onSubtract(id)}
              borderRadius="full"
              variant="outline"
            >
              -
            </Button>
            <Button
              size="xs"
              onClick={() => onAdd({ id, name, price, images, spec })}
              borderRadius="full"
              variant="outline"
            >
              +
            </Button>
            <Button
              size="xs"
              colorScheme="red"
              onClick={() => onRemove(id)}
              borderRadius="full"
              variant="outline"
            >
              ×
            </Button>
          </HStack>
        </VStack>
      </Flex>
    </Box>
  );
};

const CartPage = () => {
  const contentRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [cartItems, setCartItems] = useState(() => getCart());
  const navigate = useNavigate();

  const handleAdd = (product) => {
    addToCart(product);
    setCartItems(getCart());
  };
  const handleRemove = (product_id) => {
    removeFromCart(product_id);
    setCartItems(getCart());
  };
  const handleSubtract = (product_id) => {
    subtractFromCart(product_id);
    setCartItems(getCart());
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const dummyProduct = {
    id: 10,
    name: "Premium Beef Ribeye",
    species: "BEEF",
    description: "Premium ribeye steak, dry-aged for 21 days",
    images: ["/gray.avif"],
    price: 85,
    brand: "Prime Cuts",
    grade: "Prime",
    origin: "USA",
    spec: "12 oz steaks, 10 pack",
    avg_weight: 7.5,
    style: "marinated",
  };

  const dummyProduct2 = {
    id: "dummy-2",
    name: "Premium Pork Belly",
    species: "PORK",
    description: "Premium pork belly, perfect for Korean BBQ",
    images: ["/gray.avif"],
    price: 65,
    brand: "Pork King",
    grade: "Choice",
    origin: "Canada",
    spec: "5 lb packs",
    avg_weight: 5,
    style: "unprocessed",
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
        minHeight="100vh"
        position="relative"
      >
        <Navbar onOpen={onOpen} />

        <Box p={6}>
          <Heading as="h1" size="lg" mb={2} textAlign="center">
            Shopping Cart
          </Heading>
          <Text color="gray.600" textAlign="center" mb={6}>
            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
          </Text>

          {cartItems.length === 0 ? (
            <Box textAlign="center" py={12}>
              <Text color="gray.500" fontSize="lg" mb={4}>
                Your cart is empty
              </Text>
              <Button
                colorScheme="blue"
                onClick={() => navigate("/wholesale/shop-all")}
              >
                Continue Shopping
              </Button>
            </Box>
          ) : (
            <>
              <VStack spacing={3} mb={6}>
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    {...item}
                    onAdd={handleAdd}
                    onRemove={handleRemove}
                    onSubtract={handleSubtract}
                  />
                ))}
              </VStack>

              <Divider mb={4} />

              <Box bg="gray.50" p={4} borderRadius="lg" mb={6}>
                <Flex justify="space-between" mb={2}>
                  <Text fontWeight="medium">Total Items:</Text>
                  <Text>{totalItems}</Text>
                </Flex>
                <Flex justify="space-between" mb={4}>
                  <Text fontWeight="bold" fontSize="lg">
                    Total:
                  </Text>
                  <Text fontWeight="bold" fontSize="lg" color="green.600">
                    ${totalPrice.toFixed(2)}
                  </Text>
                </Flex>
                <Button
                  bg="#494949"
                  color="white"
                  size="lg"
                  w="100%"
                  borderRadius="full"
                  _hover={{ bg: "#6AAFDB" }}
                  onClick={() => {
                    navigate("/contact");
                  }}
                >
                  Contact Us
                </Button>
              </Box>
            </>
          )}

          <Divider my={6} />

          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={3}>
              Test Products:
            </Text>
            <HStack spacing={2} wrap="wrap">
              <Button
                size="sm"
                onClick={() => handleAdd(dummyProduct)}
                variant="outline"
              >
                Add Beef
              </Button>
              <Button
                size="sm"
                onClick={() => handleAdd(dummyProduct2)}
                variant="outline"
              >
                Add Pork
              </Button>
            </HStack>
          </Box>
        </Box>
      </Container>
    </Sidebar>
  );
};

export default CartPage;
