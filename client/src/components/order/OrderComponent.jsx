import {
  Box,
  Heading,
  Text,
  VStack,
  Flex,
  Circle,
  List,
  ListItem,
} from "@chakra-ui/react";
import { COLORS } from "../../constants";

const OrderContent = () => {

  return (
    <Box width="100%" py={6} px={6}>
      <Heading
        as="h1"
        size="md"
        fontWeight="bold"
        textAlign="center"
        mb={6}
      >
        Sign up to unlock exclusive deals and extra perks!
      </Heading>

      {/* Step 1 - Create an Account */}
      <Flex align="center" mb={4}>
        <Circle size="24px" bg="black" color="white" mr={3}>
          <Text fontSize="sm" fontWeight="bold">1</Text>
        </Circle>
        <Text fontSize="md" fontWeight="bold">
          Create an Account
        </Text>
      </Flex>

      {/* Requirements Section */}
      <Box mb={12} p={4} pb={8} borderRadius="xl" bg={COLORS.GRAY_MEDIUM}>
        <Text fontSize="sm" fontWeight="extrabold" color={COLORS.ACCENT}>
          Requirements:
        </Text>
        <List spacing={1} fontSize="xs">
          <ListItem>•{"\u00A0\u00A0"}Wholesale License</ListItem>
          <ListItem>•{"\u00A0\u00A0"}ID (Passport, Driver License, Real ID)</ListItem>
          <ListItem>•{"\u00A0\u00A0"}Business License or Reseller Permit</ListItem>
        </List>

        <Text fontSize="xs" mt={4} color="gray.600" >
          •{"\u00A0\u00A0"}AdamsFoods sells at wholesale prices, so these {"\u00A0\u00A0"}documents are required.
        </Text>
      </Box>

      {/* Step 2 */}
      <Flex align="center" mb={6}>
        <Circle size="24px" bg="black" color="white" mr={3}>
          <Text fontSize="sm" fontWeight="bold">2</Text>
        </Circle>
        <Text fontSize="md" fontWeight="bold">
          After internal review, you will receive an approval email.
        </Text>
      </Flex>

      {/* Step 3 */}
      <Flex align="center" mb={6}>
        <Circle size="24px" bg="black" color="white" mr={3}>
          <Text fontSize="sm" fontWeight="bold">3</Text>
        </Circle>
        <Text fontSize="md" fontWeight="bold">
          Choose your meats and select Pick-Up or Delivery.
        </Text>
      </Flex>

      {/* Step 4 */}
      <Flex align="center" mb={6}>
        <Circle size="24px" bg="black" color="white" mr={3}>
          <Text fontSize="sm" fontWeight="bold">4</Text>
        </Circle>
        <Text fontSize="md" fontWeight="bold">
          An invoice will be sent along with the approval email.
        </Text>
      </Flex>

      {/* Pick-up Section */}
      <Box mb={2} p={4} pb={8} borderRadius="xl" bg={COLORS.GRAY_MEDIUM}>
        <Text fontSize="sm" fontWeight="bold" color={COLORS.ACCENT} mb={2}>
          PICK-UP
        </Text>
        <List spacing={1} fontSize="xs" ml={4}>
          <ListItem>• {"\u00A0\u00A0"}Pay half the balance upfront.</ListItem>
          <ListItem>• {"\u00A0\u00A0"}Pay the remaining balance at pick-up.</ListItem>
        </List>
        <Text fontSize="sm" fontWeight="bold" color={COLORS.ACCENT} mt={4}>
          DELIVERY
        </Text>
        <List spacing={1} fontSize="xs" ml={4}mb={4}>
          <ListItem>• {"\u00A0\u00A0"}Full payment is required upfront.</ListItem>
        </List>
      </Box>

      {/* Payment Methods */}
      <Box mb={8} px={4}>
        <Text fontSize="xs" color="gray.600">
          * {"\u00A0\u00A0"}Cash or Card Only (Without AMEX Card)
        </Text>
      </Box>

      {/* Payment Policy Section */}
      <Box mt={12} p={6} borderRadius="lg">
        <Heading as="h2" size="md" mb={4} fontWeight="bold">
          Payment Policy
        </Heading>
        <Text fontSize="sm" mb={4}>
          At AdamsFoods, we accept cash and credit card payments for all orders.
          Payment requirements vary by order type as follows:
        </Text>

        <VStack align="start"  mb={4} ml={4}>
          <Text fontSize="sm">
            • {"\u00A0\u00A0"}Delivery Orders: Full prepayment is required before delivery.
          </Text>

          <Box >
            <Text fontSize="sm">
              • {"\u00A0\u00A0"}Pickup Orders: 50% prepayment is required, with the remaining balance payable at
              the time of pickup.
            </Text>
            <Text fontSize="sm" ml={2}>
              ★ A 5% discount will be applied to the remaining balance if paid
              in cash at pickup.
            </Text>
          </Box>
        </VStack>

        <Text fontSize="sm" mb={4}>
          All prepayments are processed through secure invoicing systems such as
          Stripe or Square. An invoice will be sent to your email, allowing you
          to complete payment safely by entering your card information.
        </Text>

        <Text fontSize="sm" fontWeight="semibold" mb={2} ml={1}>
          ※ Applicable sales tax will be added to all credit card payments.
        </Text>
        
        <Text fontSize="sm" fontWeight="semibold" ml={1}>
          ※ Two or more missed pickups without notice may result in
          suspension. Refunds and future orders may be subject to policy and
          deposit requirements.
        </Text>
      </Box>
    </Box>
  );
};

export default OrderContent;