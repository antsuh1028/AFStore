import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Image,
  Flex,
  useBreakpointValue,
} from "@chakra-ui/react";

const AFCompany = () => {
  // Responsive font size for brand names
  const brandFontSize = useBreakpointValue({ base: "xs", md: "sm" });
  // Responsive image size
  const logoSize = useBreakpointValue({ base: "60px", md: "80px" });

  return (
    <Box py={10} bg="white">
      <Container maxW="container.md" centerContent>
        <VStack spacing={8} align="center" w="full">
          {/* Company Title */}
          <Heading
            as="h1"
            fontFamily="serif"
            fontWeight="bold"
            fontSize={{ base: "2xl", md: "3xl" }}
            textAlign="center"
          >
            AdamsFoods Company
          </Heading>

          {/* Image Placeholder */}
          <Box
            w="full"
            h={{ base: "200px", md: "320px" }}
            border="1px solid #e2e2e2"
            borderRadius="sm"
          >
            <Image
              src="/placeholder.jpg"
              alt="AdamsFoods Company"
              w="full"
              h="full"
              objectFit="cover"
              fallback={<Box w="full" h="full" />}
            />
          </Box>

          {/* First Paragraph */}
          <Text
            fontFamily="serif"
            fontSize={{ base: "sm", md: "md" }}
            textAlign="center"
            lineHeight="tall"
            px={4}
          >
            Our raw materials are sourced out daily, ensuring quality and price
            competitiveness. Our suppliers make raw materials available to us
            which are then processed according to AdamsFoods specifications.
            Products that do not meet our strict quality control standards are
            not accepted nor sold to our competitors.
          </Text>

          {/* Second Paragraph */}
          <Text
            fontFamily="serif"
            fontSize={{ base: "sm", md: "md" }}
            textAlign="center"
            lineHeight="tall"
            px={4}
          >
            Envision the future with endless possibility and constant devotion.
            Our products are only made from raw materials that we choose to use
            and not from leftover scraps in our plant.
          </Text>

          {/* Brands Section */}
          <VStack spacing={6} mt={8} w="full">
            {/* Brand Logos - Side by Side Layout */}
            <Flex
              w="full"
              justifyContent="center"
              alignItems="center"
              flexWrap="nowrap"
              gap={{ base: 2, md: 4 }}
            >
              {/* Meat Papa */}
              <VStack spacing={2} flex="1">
                <Box w={logoSize} h={logoSize}>
                  <Image
                    src="/MeatPapa.png"
                    alt="Meat Papa Logo"
                    w="full"
                    h="full"
                    objectFit="contain"
                  />
                </Box>
                <Text
                  fontWeight="bold"
                  fontSize={brandFontSize}
                  textAlign="center"
                >
                  MEAT PAPA
                </Text>
              </VStack>

              {/* Dot Separator */}
              <Text fontSize="xl" fontWeight="bold" alignSelf="center">
                •
              </Text>

              {/* Adams Gourmet Beef */}
              <VStack spacing={2} flex="1">
                <Box w={logoSize} h={logoSize}>
                  <Image
                    src="/AdamsGour.png"
                    alt="Adams Gourmet Beef Logo"
                    w="full"
                    h="full"
                    objectFit="contain"
                  />
                </Box>
                <Text
                  fontWeight="bold"
                  fontSize={brandFontSize}
                  textAlign="center"
                >
                  ADAMS GOURMET BEEF
                </Text>
              </VStack>

              {/* Dot Separator */}
              <Text fontSize="xl" fontWeight="bold" alignSelf="center">
                •
              </Text>

              {/* Yuk Bul */}
              <VStack spacing={2} flex="1">
                <Box w={logoSize} h={logoSize}>
                  <Image
                    src="/Yukbul.png"
                    alt="Yuk Bul Logo"
                    w="full"
                    h="full"
                    objectFit="contain"
                  />
                </Box>
                <Text
                  fontWeight="bold"
                  fontSize={brandFontSize}
                  textAlign="center"
                >
                  YUK BUL
                </Text>
              </VStack>
            </Flex>

            {/* Brands Description */}
            <Text
              fontFamily="serif"
              fontSize={{ base: "sm", md: "md" }}
              textAlign="center"
              lineHeight="tall"
              px={4}
              mt={2}
            >
              We are growing our brands Meat Papa, Adams Gourmet Beef, and
              Yukbul. Each has its own identity and market focus, helping us
              provide high-quality meat and expand our reach.
            </Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default AFCompany;
