import React from "react";
import {
  Box,
  Heading,
  Text,
  Link,
  VStack,
  Flex,
  Circle,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";

const OrderContent = () => {
  const accentColor = useColorModeValue("#b09e8c", "#d6c8bc");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const lightTextColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Box width="100%" py={6} px={12}>
      <Heading
        as="h1"
        size="md"
        fontWeight="semibold"
        textAlign="center"
        mb={6}
      >
        How To Order
      </Heading>
      <Divider mb={14} />
      <VStack spacing={0} align="stretch" position="relative">
        {/* Vertical line connecting steps with gradient */}
        <Box
          position="absolute"
          left={{ base: "8px", md: "9px" }}
          top={{ base: "-10px", md: "-15px" }}
          bottom={{ base: "-10px", md: "-15px" }}
          width="4px"
          bgGradient={`linear(to-b, ${accentColor}, ${accentColor}80, ${accentColor}60)`}
          zIndex={1}
        />

        {/* Step 1 */}
        <Flex mb={{ base: 8, md: 10 }} position="relative">
          <Circle
            size={{ base: "22px", md: "24px" }}
            bg={"#b09e8c"}
            border="1px solid"
            borderColor={accentColor}
            mr={{ base: 3, md: 4 }}
            zIndex={2}
          >
            <CheckIcon color={"white"} fontSize={"14px"} />
          </Circle>
          <Box ml={4}>
            <Heading
              as="h3"
              size="sm"
              fontWeight="bold"
              color={textColor}
              mb={1}
            >
              Select the Meat You Want
            </Heading>
            <Text
              fontSize="xs"
              color={lightTextColor}
              lineHeight="1.6"
              width={{base:"95%", md:"90%"}}
            >
              We sell wholesale meat, so please make your order accordingly.
            </Text>
          </Box>
        </Flex>

        {/* Step 2 */}
        <Flex mb={{ base: 8, md: 10 }} position="relative">
          <Circle
            size={{ base: "22px", md: "24px" }}
            bg={"#b09e8c"}
            border="1px solid"
            borderColor={accentColor}
            mr={{ base: 3, md: 4 }}
            zIndex={2}
          >
            <CheckIcon color={"white"} fontSize={"14px"} />
          </Circle>
          <Box  ml={4}>
            <Heading
              as="h3"
              size="sm"
              fontWeight="bold"
              color={textColor}
              mb={1}
            >
              Place Your Order
            </Heading>
            <Text
              fontSize="xs"
              color={lightTextColor}
              lineHeight="1.6"
              width={{base:"95%", md:"90%"}}
            >
              Once you've selected your product(s), please contact us through the{" "}
              <Link
                href="/contact"
                color={accentColor}
                fontWeight="medium"
                textDecoration="none"
                _hover={{ textDecoration: "underline" }}
              >
                'Contact Us'
              </Link>{" "}
              page.
            </Text>
          </Box>
        </Flex>

        {/* Step 3 */}
        <Flex mb={{ base: 8, md: 10 }} position="relative">
          <Circle
            size={{ base: "22px", md: "24px" }}
            bg={"#b09e8c"}
            border="1px solid"
            borderColor={accentColor}
            mr={{ base: 3, md: 4 }}
            zIndex={2}
          >
            <CheckIcon color={"white"} fontSize={"14px"} />
          </Circle>
          <Box  ml={4}>
            <Heading
              as="h3"
              size="sm"
              fontWeight="bold"
              color={textColor}
              mb={1}
            >
              Pickup Schedule
            </Heading>
            <Text
              fontSize="xs"
              color={lightTextColor}
              lineHeight="1.6"
              width={{base:"95%", md:"90%"}}
            >
              We will coordinate a suitable pickup time for both parties.
            </Text>
          </Box>
        </Flex>

        {/* Step 4 */}
        <Flex position="relative">
          <Circle
            size={{ base: "22px", md: "24px" }}
            bg={"#b09e8c"}
            border="1px solid"
            borderColor={accentColor}
            mr={{ base: 3, md: 4 }}
            zIndex={2}
          >
            <CheckIcon color={"white"} fontSize={"14px"} />
          </Circle>
          <Box  ml={4}>
            <Heading
              as="h3"
              size="sm"
              fontWeight="bold"
              color={textColor}
              mb={1}
            >
              Pick Up Your Order
            </Heading>
            <Text
              fontSize="xs"
              color={lightTextColor}
              lineHeight="1.6"
              width={{base:"95%", md:"90%"}}
            >
              After scheduling, please come to the designated location to pick
              up your order.
            </Text>
          </Box>
        </Flex>
      </VStack>
    </Box>
  );
};

export default OrderContent;
