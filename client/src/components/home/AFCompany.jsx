import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Image,
  Flex,
} from "@chakra-ui/react";
import { translator } from "../../utils/translator";

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
              src="/images/af_company.avif"
              alt="AdamsFoods Company"
              w="full"
              h="full"
              fallbackSrc="/images/af_company.jpg"
              objectFit="cover"
            />
          </Box>

          <Text
            fontSize="sm"
            color="gray.600"
            lineHeight="tall"
            px={2}
            mt={2}
          >
            {translator(
              "We carefully source fresh, high quality raw materials to deliver consistent premium products. Working with trusted beef suppliers, we select the finest cuts and process them with precision according to AdamsFoods' strict standards.",
              "저희는 일관된 품질과 경쟁력을 유지하기 위해 신선하고 좋은 품질의 원자재만을 사용합니다. 신뢰할 수 있는 고기 공급업체로부터, AdamsFoods 만의 엄격한 기준에 따라 공급 받습니다."
            )}
          </Text>

          <Text fontSize="sm" color="gray.600" lineHeight="tall" px={2}>
            {translator(
              "Items that fail to meet our high quality standards are promptly rejected, never sold or repurposed.",
              "저희 기준에 미치지 못하는 품목은 즉시 반품 처리하며, 판매 하거나 다른 용도로 전환하지 않습니다."
            )}
          </Text>

          <Text
            fontSize="sm"
            color="gray.600"
            lineHeight="tall"
            px={2}
            mb={2}
          >
            {translator(
              "We envision a future full of bold, endless possibility, driven always by consistency, passion, and care.",
              "저희는 언제나 일관성, 열정, 사소한 디테일을 바탕으로 하여, 대담하고 무한한 가능성으로 가득한 미래를 그립니다."
            )}
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
                  alt="MeatPapa Logo"
                  objectFit="contain"
                  w="100%"
                  h="100%"
                />
              </Box>
              <Text fontWeight="semibold" fontSize="11px" whiteSpace="nowrap">
                MEATPAPA
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
          <Text
            fontSize="sm"
            color="gray.600"
            lineHeight="tall"
            mt={2}
            px={2}
          >
            {translator(
              "MeatPapa, Adams Gourmet Beef, and Yukbul each bring their own unique identity, sharing authentic K-BBQ in diverse and flavorful ways.",
              "MeatPapa, Adams Gourmet Beef, 그리고 Yukbul. 각 브랜드는 고유한 정체성을 가지고 있으며, 다양한 방식으로 진정한 K-bbq를 선사합니다."
            )}
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default AFCompany;