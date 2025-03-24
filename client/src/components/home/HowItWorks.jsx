import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  Image,
} from "@chakra-ui/react";

const HowItWorks = () => {
  return (
    <Box bg="white">
      <Container w="75%">
        <Heading
          textAlign="center"
          fontSize="3xl"
          fontFamily="serif"
          fontWeight="bold"
          mb={10}
          color="#000"
        >
          How It Works
        </Heading>
        <VStack spacing={16} align="flex-start">
          <Image src="/meatSpices.png" alt="Adams Foods Logo" h="50%" mt={4} />
          {/* Step 1 */}
          <Flex>
            <Text fontSize="5xl" fontFamily="serif" fontWeight="light" mr={8}>
              1
            </Text>
            <Box>
              <Heading
                as="h3"
                size="md"
                fontFamily="sans-serif"
                // whiteSpace="nowrap"
                overflow="hidden"
                mb={4}
              >
                Exclusively for vendors
              </Heading>
              <Text fontSize="md">
                We supply high-quality meat exclusively to wholesale businesses,
                markets, and restaurants.
              </Text>
            </Box>
          </Flex>

          {/* Step 2 */}
          <Flex>
            <Text fontSize="5xl" fontFamily="serif" fontWeight="light" mr={8}>
              2
            </Text>
            <Box>
              <Heading
                as="h3"
                size="md"
                fontFamily="sans-serif"
                // whiteSpace="nowrap"
                overflow="hidden"
                mb={4}
              >
                Order
              </Heading>
              <Text fontSize="md">
                "If you want to order meat, please place your order on our
                'Contact Us' page.
              </Text>
            </Box>
          </Flex>

          {/* Step 3 */}
          <Flex>
            <Text fontSize="5xl" fontFamily="serif" fontWeight="light" mr={8}>
              3
            </Text>
            <Box>
              <Heading
                as="h3"
                size="md"
                fontFamily="sans-serif"
                // whiteSpace="nowrap"
                overflow="hidden"
                mb={4}
              >
                Schedule a Pick-Up
              </Heading>
              <Text fontSize="md">
                Easily choose your preferred pick-up date through our website.
              </Text>
            </Box>
          </Flex>

          {/* Step 4 */}
          <Flex>
            <Text fontSize="5xl" fontFamily="serif" fontWeight="light" mr={8}>
              4
            </Text>
            <Box>
              <Heading
                as="h3"
                size="md"
                fontFamily="sans-serif"
                // whiteSpace="nowrap"
                overflow="hidden"
                mb={4}
              >
                Pick Up Your Meat
              </Heading>
              <Text fontSize="md">
                Collect your order from our warehouse location.
                <br />
                '1805 Industrial St,
                <br />
                Lo Angeles, CA 90021'
              </Text>
            </Box>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
};

export default HowItWorks;
