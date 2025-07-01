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
              Select the Product You Would Like to Order
            </Heading>
            <Text
              fontSize="xs"
              color={lightTextColor}
              lineHeight="1.6"
              width={{ base: "95%", md: "90%" }}
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
          <Box ml={4}>
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
              width={{ base: "95%", md: "90%" }}
            >
              Once you've selected your product(s), please contact us through
              the{" "}
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
          <Box ml={4}>
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
              width={{ base: "95%", md: "90%" }}
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
          <Box ml={4}>
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
              width={{ base: "95%", md: "90%" }}
            >
              After scheduling, please come to the designated location to pick
              up your order.
            </Text>
          </Box>
        </Flex>
      </VStack>

      {/* Payment Policy Section */}
      <Box mt={24} borderRadius="lg" >
        <Heading as="h2" size="md" mb={4}>
          Payment Policy
        </Heading>
        <Text fontSize="sm" my={6}>
          At AdamsFoods, we accept cash and credit card payments for all orders.
          Payment requirements vary by order type as follows:
        </Text>

        <VStack align="start" spacing={3} my={6}>
          <Text fontSize="sm">
            • Delivery Orders: Full prepayment is required before delivery.
          </Text>

          <Box>
            <Text fontSize="sm">
              • Pickup Orders: 50% prepayment is required, with the remaining balance payable at
              the time of pickup.
            </Text>
            <Text fontSize="sm" ml={4} mt={1}>
              ★ A 5% discount will be applied to the remaining balance if paid
              in cash at pickup.
            </Text>
          </Box>
        </VStack>

        <Text fontSize="sm" mb={6}>
          All prepayments are processed through secure invoicing systems such as
          Stripe or Square. An invoice will be sent to your email, allowing you
          to complete payment safely by entering your card information.
        </Text>

        <VStack align="start" spacing={2}>
          <Text fontSize="sm" fontWeight="semibold">
            ※ Applicable sales tax will be added to all credit card payments.
          </Text>
          <Text fontSize="sm" fontWeight="semibold">
            ※ Two or more missed pickups without notice may result in
            suspension. Refunds and future orders may be subject to policy and
            deposit requirements.
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default OrderContent;
