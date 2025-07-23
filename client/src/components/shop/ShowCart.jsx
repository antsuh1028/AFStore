import React from 'react';
import {
 VStack,
 Text,
 Button,
 Box,
 Flex,
 Image,
 HStack,
 Divider
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  getCart,
  addToCart,
  removeFromCart,
  subtractFromCart,
} from "../../utils/cartActions";

export const ShowCart = ({ cartItems, setCartItems, totalPrice}) => {
 const navigate = useNavigate();

  
  

   const getImagePath = (name, style) => {
    if (style && name) {
      const safeName = name.replace(/[^a-zA-Z0-9-_]/g, " ");
      const safeStyle = style.replace(/[^a-zA-Z0-9-_]/g, " ");
      return `/products/${safeStyle}/${safeName}/01.jpg`;
    }
    return "/images/gray.avif";
  };

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
 
 return cartItems.length === 0 ? (
   <VStack py={8} spacing={4}>
     <Text color="gray.500">Your cart is empty</Text>
     <Button
       size="sm"
       bg="#ECECEC"
       onClick={() => navigate("/wholesale/shop-all")}
     >
       Browse Products
     </Button>
   </VStack>
 ) : (
   <VStack align="stretch">
     {cartItems.map((item) => (
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
           />
           <VStack>
             <Flex gap={8} justifyContent="space-between" width="100%" mb={1}>
               <Text
                 fontWeight="thin"
                 fontSize="13px"
                 color="gray"
                 noOfLines={1}
               >
                 {item.style === "marinated"
                   ? "Marinated Meat"
                   : item.style === "processed"
                   ? "Prepped Meat"
                   : item.style === "unprocessed"
                   ? "Untrimmed Meat"
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

             <VStack align="start" width="100%" spacing={1}>
               <Text
                 fontSize="15px"
                 pr={6}
                 textAlign="left"
                 whiteSpace="pre-line"
                 lineHeight="1.2"
               >
                 {item.name} {"\n"} {item.spec}
               </Text>
             </VStack>

             <Flex justifyContent="space-between" width="100%" align="center">
               <Text fontSize="16px" color="black" fontWeight="bold">
                 ${item.price * item.quantity}
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
         <Divider mt={6} borderColor="#ECECEC" borderWidth="1px" />
       </Box>
     ))}

     
   </VStack>
 );
};