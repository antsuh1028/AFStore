import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Image,
  Flex,
  HStack,
  Divider,
} from "@chakra-ui/react";

const AFCompany = () => {
  const logoSize = "35%";
  const brandFontSize = "15px";
  return (
    <Box bg="white" pt={6} pb={10}>
      <Container maxW="container.sm" centerContent>
        <VStack spacing={4} align="center" w="full">
          {/* Company Title */}
          <Heading as="h1" fontWeight="bold" fontSize="xl" mb={2} textAlign="left">
            AdamsFoods Company
          </Heading>

          <Divider borderColor="gray.200" />

          {/* Image Placeholder */}
          <Box
            w="full"
            h="180px"
            borderRadius="lg"
            overflow="hidden"
            bg="gray.100"
          >
            <Image
              src="/api/placeholder/400/180"
              alt="AdamsFoods Company"
              w="full"
              h="full"
              objectFit="cover"
            />
          </Box>

          {/* First Paragraph */}
          <Text fontSize="sm" color="gray.600" lineHeight="tall" px={2} mt={2}>
            We source only fresh, high-quality raw materials to ensure
            consistent product quality and competitiveness. Our trusted beef
            suppliers provide select cuts, processed carefully to Adams Foods'
            strict specifications.
          </Text>

          {/* Second Paragraph */}
          <Text fontSize="sm" color="gray.600" lineHeight="tall" px={2}>
            Items that clearly fail to meet high quality standards are
            immediately rejected—not sold or repurposed at all.
          </Text>

          {/* Third Paragraph */}
          <Text fontSize="sm" color="gray.600" lineHeight="tall" px={2} mb={2}>
            We envision a future full of bold, endless possibility, driven
            always by consistency, passion, and care.
          </Text>

          {/* Brands Title */}
          <Text fontWeight="bold" fontSize="sm" textAlign="center">
            We are proudly growing our brands:
          </Text>

          {/* Brands Section */}
          <VStack spacing={2}>
            <Flex
              justifyContent="space-around"
              w="full"
              alignItems="center"
              mb={1}
            >
              <Box w="70px" textAlign="center">
                <Image
                  src="/MeatPapa.png"
                  alt="Meat Papa Logo"
                  w="60px"
                  objectFit="contain"
                  mx="auto"
                />
              </Box>
              <Box w="70px" textAlign="center">
                <Image
                  src="/AdamsGour.png"
                  alt="Adams Gourmet Beef Logo"
                  w="60px"
                  objectFit="contain"
                  mx="auto"
                />
              </Box>
              <Box w="70px" textAlign="center">
                <Image
                  src="/Yukbul.png"
                  alt="Yuk Bul Logo"
                  w="60px"
                  objectFit="contain"
                  mx="auto"
                />
              </Box>
            </Flex>
            <Flex
              w="full"
              alignItems="center"
              justify="center"
              color="gray.700"
            >
              <Box position="relative" display="flex" alignItems="center">
                <Text fontWeight="semibold" fontSize="12px" whiteSpace="nowrap">
                  MEAT PAPA
                </Text>
              </Box>
              <Text fontSize="sm" mx={2} color="gray.500">
                •
              </Text>
              <Text fontWeight="semibold" fontSize="12px" whiteSpace="nowrap">
                ADAMS GOURMET BEEF
              </Text>
              <Text fontSize="sm" mx={2} color="gray.500">
                •
              </Text>
              <Text fontWeight="semibold" fontSize="12px" whiteSpace="nowrap">
                YUK BUL
              </Text>
            </Flex>
          </VStack>

          {/* Brands Description */}
          <Text
            fontSize="sm"
            color="gray.600"
            textAlign="center"
            lineHeight="tall"
            px={4}
            mt={2}
          >
            Meat Papa, Adams Gourmet Beef, and Yukbul together. Each brand has
            its own unique identity, sharing authentic K-BBQ in diverse ways.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default AFCompany;
