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
  return (
    <Box bg="white" pt={6} pb={10}>
      <Container maxW="container.sm" centerContent>
        <VStack spacing={4} w="full">
          {/* Company Title */}
          <Heading
            as="h1"
            fontWeight="bold"
            fontSize="19px"
            mb={1}
            alignSelf="flex-start"
            px={2}
          >
            AdamsFoods Company
          </Heading>

          <Box
            w="full"
            h="180px"
            borderRadius="lg"
            overflow="hidden"
            bg="gray.100"
          >
            <Image
              src="/images/Adams_entrance.png"
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
          <Text fontWeight="bold" fontSize="sm" px={2} alignSelf="flex-start">
            We are proudly growing our brands:
          </Text>

          {/* Brands Section */}
          <Flex
            w="full"
            alignItems="center"
            justifyContent="space-between"
            mb={1}
            p={3}
            gap={2}
            borderColor="gray.300"
            position="relative"
          >
            <VStack textAlign="center" borderColor="gray.300" w="30%" h="100%">
              <Box h="7vh" w="100%" position="relative">
                <Image
                  src="/images/MeatPapa.png"
                  alt="Meat Papa Logo"
                  objectFit="contain"
                  w="100%"
                  h="100%"
                />
              </Box>
              <Text fontWeight="semibold" fontSize="11px" whiteSpace="nowrap">
                MEAT PAPA
              </Text>
            </VStack>
            <VStack textAlign="center" borderColor="gray.300" w="40%" h="100%">
              <Box h="7vh" w="100%" position="relative">
                <Image
                  src="/images/adams_gour.png"
                  alt="Adams Gourmet Beef Logo"
                  objectFit="contain"
                  w="100%"
                  h="100%"
                />
              </Box>
              <Text fontWeight="semibold" fontSize="11px" whiteSpace="nowrap">
                ADAMS GOURMET BEEF
              </Text>
            </VStack>
            <VStack textAlign="center" borderColor="gray.300" w="30%" h="100%">
              <Box h="7vh" w="100%" position="relative">
                <Image
                  src="/images/Yukbul.png"
                  alt="Yuk Bul Logo"
                  objectFit="contain"
                  w="100%"
                  h="100%"
                />
              </Box>
              <Text fontWeight="semibold" fontSize="11px" whiteSpace="nowrap">
                YUK BUL
              </Text>
            </VStack>
          </Flex>

          {/* Brands Description */}
          <Text fontSize="sm" color="gray.600" lineHeight="tall" mt={2} px={2}>
            Meat Papa, Adams Gourmet Beef, and Yukbul together. Each brand has
            its own unique identity, sharing authentic K-BBQ in diverse ways.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default AFCompany;
