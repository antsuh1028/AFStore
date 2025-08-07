import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Image,
  Flex,
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
              src="/images/adams_entrance.png"
              alt="AdamsFoods Company"
              w="full"
              h="full"
              objectFit="cover"
            />
          </Box>

          {/* First Paragraph */}
          <Text fontSize="sm" color="gray.600" lineHeight="tall" px={2} mt={2}>
            We carefully source fresh, high quality raw materials to deliver
            consistent premium products. Working with trusted beef suppliers, we
            select the finest cuts and process them with precision according to
            AdamsFoods' strict standards.
          </Text>
          {/* <Text fontSize="sm" color="gray.600" lineHeight="tall" px={2} mt={2}>
            {" "}
            우리는 신선하고 고품질의 원재료만을 엄선하여 제품의 일관된 품질과
            경쟁력을 보장합니다. 신뢰받는 소고기 공급업체들이 AdamsFoods의
            엄격한 기준에 따라 정성스럽게 가공한 특선 부위를 제공합니다.
          </Text> */}

          {/* Second Paragraph */}
          <Text fontSize="sm" color="gray.600" lineHeight="tall" px={2}>
            Items that fail to meet our high quality standards are promptly
            rejected, never sold or repurposed.
          </Text>

          {/* <Text fontSize="sm" color="gray.600" lineHeight="tall" px={2}>
            품질 기준을 명백히 충족하지 못하는 제품은 즉시 폐기되며, 판매되거나
            재활용되지 않습니다.
          </Text> */}

          {/* Third Paragraph */}
          <Text fontSize="sm" color="gray.600" lineHeight="tall" px={2} mb={2}>
            We envision a future full of bold, endless possibility, driven
            always by consistency, passion, and care.
          </Text>
          {/* <Text fontSize="sm" color="gray.600" lineHeight="tall" px={2} mb={2}>
            우리는 항상 일관성, 열정, 그리고 정성을 바탕으로 대담하고 무한한
            가능성으로 가득한 미래를 꿈꿉니다.
          </Text> */}

          {/* Brands Title */}
          <Text fontWeight="bold" fontSize="sm" px={2} alignSelf="flex-start">
            We are proudly growing our brands:
          </Text>
          {/* <Text fontWeight="bold" fontSize="sm" px={2} alignSelf="flex-start">
            우리는 자사 브랜드를 자랑스럽게 성장시키고 있습니다:{" "}
          </Text> */}

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
            Meat Papa, Adams Gourmet Beef, and Yukbul each bring their own
            unique identity, sharing authentic K-BBQ in diverse and
            flavorful ways.
          </Text>
          {/* <Text fontSize="sm" color="gray.600" lineHeight="tall" mt={2} px={2}>
            Meat Papa, Adams Gourmet Beef, 그리고 육불은 각기 고유한 정체성을
            지닌 브랜드로, 진정한 K-BBQ의 맛을 다양한 방식으로 전달합니다.
          </Text> */}
        </VStack>
      </Container>
    </Box>
  );
};

export default AFCompany;
