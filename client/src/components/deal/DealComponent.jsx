import React from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Flex,
  Badge,
  Spacer,
  useColorModeValue,
} from "@chakra-ui/react";

const DealContent = () => {
  const textColor = useColorModeValue("gray.700", "gray.200");
  const lightTextColor = useColorModeValue("#696969", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box width="100%" py={6} px={4}>
      <Heading as="h1" size="md" fontWeight="bold" textAlign="center" mb={6}>
        Deal
      </Heading>

      <VStack spacing={8} align="stretch">
        {/* Deal 1 - Points & Rewards System */}
        <Box>
          <Flex align="center" mb={4}>
            <Badge
              bg="#494949"
              color="white"
              px={3}
              py={1}
              borderRadius="full"
              mr={3}
            >
              Deal 1
            </Badge>
            <Heading as="h2" size="sm" fontWeight="bold" color={textColor}>
              Points & Rewards System
            </Heading>
          </Flex>

          <VStack
            align="start"
            spacing={3}
            p={6}
            bg="#f9f9f9"
            borderRadius={24}
          >
            <Box>
              <Text fontSize="sm" fontWeight="semibold" color="#b3967f">
                Earn Points with Every Order:
              </Text>
              <Text fontSize="sm" color={lightTextColor}>
                Get points on every new and repeat order.
              </Text>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="semibold" color="#b3967f">
                Redeem Anytime:
              </Text>
              <Text fontSize="sm" color={lightTextColor}>
                Use points for discounts or free shipping.
              </Text>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="semibold" color="#b3967f">
                No Limit on Points:
              </Text>
              <Text fontSize="sm" color={lightTextColor}>
                Earn and use as many points as you like.
              </Text>
            </Box>
          </VStack>
        </Box>

        {/* Deal 2 - New Customer Offers */}
        <Box>
          <Flex align="center" justifyContent="flex-end" mb={4}>
            <Heading as="h2" size="sm" fontWeight="bold" color={textColor}>
              New Customer Offers
            </Heading>
            <Badge
              bg="#494949"
              color="white"
              px={3}
              py={1}
              borderRadius="full"
              ml={3}
            >
              Deal 2
            </Badge>
          </Flex>

          <VStack align="end" spacing={3} p={6} bg="#f9f9f9" borderRadius={24}>
            <Box textAlign="right">
              <Text fontSize="sm" fontWeight="semibold" color="#b3967f">
                10% Off First Order:
              </Text>
              <Text fontSize="sm" color={lightTextColor}>
                Enjoy savings on your first purchase.
              </Text>
            </Box>

            <Box textAlign="right">
              <Text fontSize="sm" fontWeight="semibold" color="#b3967f">
                Seasonal Promotions:
              </Text>
              <Text fontSize="sm" color={lightTextColor}>
                Access limited-time offers year-round.
              </Text>
            </Box>

            <Box textAlign="right">
              <Text fontSize="sm" fontWeight="semibold" color="#b3967f">
                Subscription Discounts:
              </Text>
              <Text fontSize="sm" color={lightTextColor}>
                Save more with recurring deliveries.
              </Text>
            </Box>
          </VStack>
        </Box>

        {/* Deal 3 - Loyalty Program */}
        <Box>
          <Flex align="center" mb={4}>
            <Badge
              bg="#494949"
              color="white"
              px={3}
              py={1}
              borderRadius="full"
              mr={3}
            >
              Deal 3
            </Badge>
            <Heading as="h2" size="sm" fontWeight="bold" color={textColor}>
              Loyalty Program
            </Heading>
          </Flex>

          <VStack
            align="start"
            spacing={3}
            p={6}
            bg="#f9f9f9"
            borderRadius={24}
          >
            <Box>
              <Text fontSize="sm" fontWeight="semibold" color="#b3967f">
                VIP Membership:
              </Text>
              <Text fontSize="sm" color={lightTextColor}>
                Unlock perks like faster delivery and discounts.
              </Text>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="semibold" color="#b3967f">
                Tiered Benefits:
              </Text>
              <Text fontSize="sm" color={lightTextColor}>
                Level up based on your order history.
              </Text>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="semibold" color="#b3967f">
                Annual Rewards:
              </Text>
              <Text fontSize="sm" color={lightTextColor}>
                Receive gifts or extra discounts yearly.
              </Text>
            </Box>
          </VStack>
        </Box>

        {/* Deal 4 - Referral Program */}
        <Box>
          <Flex align="center" justifyContent="flex-end" mb={4}>
            <Heading as="h2" size="sm" fontWeight="bold" color={textColor}>
              Referral Program
            </Heading>
            <Badge
              bg="#494949"
              color="white"
              px={3}
              py={1}
              borderRadius="full"
              ml={3}
            >
              Deal 4
            </Badge>
          </Flex>

          <VStack align="end" spacing={3} p={6} bg="#f9f9f9" borderRadius={24}>
            <Box textAlign="right">
              <Text fontSize="sm" fontWeight="semibold" color="#b3967f">
                Referral Bonus:
              </Text>
              <Text fontSize="sm" color={lightTextColor}>
                You and your friend earn rewards.
              </Text>
            </Box>

            <Box textAlign="right">
              <Text fontSize="sm" fontWeight="semibold" color="#b3967f">
                Product Rewards:
              </Text>
              <Text fontSize="sm" color={lightTextColor}>
                Earn credit when your picks are purchased.
              </Text>
            </Box>

            <Box textAlign="right">
              <Text fontSize="sm" fontWeight="semibold" color="#b3967f">
                Ongoing Benefits:
              </Text>
              <Text fontSize="sm" color={lightTextColor}>
                Get more rewards as you refer more.
              </Text>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default DealContent;
