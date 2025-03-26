import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Grid,
  GridItem,
} from "@chakra-ui/react";

const HowItWorks = () => {
  return (
    <Box bg="white" py={{ base: 28, md: 32 }}>
      <Container maxW="container.xl">
        <Heading
          textAlign="center"
          fontSize="3xl"
          fontFamily="serif"
          fontWeight="bold"
          mb={16}
          color="#000"
        >
          How to Order
        </Heading>

        <Grid
          templateColumns={{ base: "1fr", md: "50% 40%" }}
          gap={10}
          alignItems="center"
          maxW="container.lg"
          mx="auto"
        >
          {/* Image column stays the same */}
          <GridItem>
            <Box maxW={{ base: "100%", md: "90%" }} mx="auto">
              <Box
                as="img"
                src="/meatSpices.png"
                alt="Raw meat with spices and herbs"
                w="100%"
                h="auto"
                objectFit="contain"
              />
            </Box>
          </GridItem>

          {/* Steps - right side on desktop, bottom on mobile */}
          <GridItem>
            <Flex direction="column" gap={12}>
              {/* Step 1 */}
              <Flex gap={8} alignItems="flex-start">
                <Text
                  fontSize="6xl"
                  fontFamily="serif"
                  fontWeight="light"
                  lineHeight="1"
                >
                  1
                </Text>
                <Box>
                  <Heading as="h3" fontSize="xl" fontWeight="bold" mb={2}>
                    Exclusively for vendors
                  </Heading>
                  <Text fontSize="md" lineHeight="tall">
                    We supply high-quality meat exclusively to wholesale
                    businesses, markets, and restaurants.
                  </Text>
                </Box>
              </Flex>

              {/* Step 2 */}
              <Flex gap={8} alignItems="flex-start">
                <Text
                  fontSize="6xl"
                  fontFamily="serif"
                  fontWeight="light"
                  lineHeight="1"
                >
                  2
                </Text>
                <Box>
                  <Heading as="h3" fontSize="xl" fontWeight="bold" mb={2}>
                    Order
                  </Heading>
                  <Text fontSize="md" lineHeight="tall">
                    If you want to order meat, please place your order on our
                    'Contact Us' page.
                  </Text>
                </Box>
              </Flex>

              {/* Step 3 */}
              <Flex gap={8} alignItems="flex-start">
                <Text
                  fontSize="6xl"
                  fontFamily="serif"
                  fontWeight="light"
                  lineHeight="1"
                >
                  3
                </Text>
                <Box>
                  <Heading as="h3" fontSize="xl" fontWeight="bold" mb={2}>
                    Schedule a Pick-Up
                  </Heading>
                  <Text fontSize="md" lineHeight="tall">
                    Easily choose your preferred pick-up date through our
                    website.
                  </Text>
                </Box>
              </Flex>

              {/* Step 4 */}
              <Flex gap={8} alignItems="flex-start">
                <Text
                  fontSize="6xl"
                  fontFamily="serif"
                  fontWeight="light"
                  lineHeight="1"
                >
                  4
                </Text>
                <Box>
                  <Heading as="h3" fontSize="xl" fontWeight="bold" mb={2}>
                    Pick Up Your Meat
                  </Heading>
                  <Text fontSize="md" lineHeight="tall">
                    Collect your order from our warehouse location.
                    <br />
                    '1805 Industrial St, Lo Angeles, CA 90021'
                  </Text>
                </Box>
              </Flex>
            </Flex>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default HowItWorks;
