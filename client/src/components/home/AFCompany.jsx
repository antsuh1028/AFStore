import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Image,
  Flex,
  Link,
} from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";
import { translator } from "../../utils/translator";
import { COLORS } from "../../constants";

const AFCompany = () => {
  const brands = [
    {
      name: translator("MEATPAPA", "미트파파"),
      image: "/images/MeatPapa.png",
      width: "30%"
    },
    {
      name: translator("ADAMS GOURMET BEEF", "아담스 고메 비프"),
      image: "/images/adams_gour.png",
      width: "40%"
    },
    {
      name: translator("YUK BUL", "육불"),
      image: "/images/Yukbul.png",
      width: "30%"
    }
  ];

  const containerRef = useRef(null);
  const [fontSize, setFontSize] = useState('10px');

  useEffect(() => {
    const updateFontSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // Calculate font size based on container width
        const baseFontSize = Math.max(8, Math.min(12, containerWidth * 0.025));
        setFontSize(`${baseFontSize}px`);
      }
    };

    updateFontSize();
    window.addEventListener('resize', updateFontSize);
    
    return () => window.removeEventListener('resize', updateFontSize);
  }, []);
  return (
    <Box bg="white" pt={6} >
      <Container maxW="container.sm" centerContent>
        <VStack align="flex-start" px={2} spacing={4}>
          <Text fontSize="sm" color="gray.600" lineHeight="tall">
            {translator(
              "Founded in 2012, AdamsFoods produces safe, tailored products in USDA inspected facilities.",
              "2012년에 설립된 AdamdFoods는 USDA에서 검사한 시설 (EST.51212) 에서 안전한 제품을 생산합니다."
            )}
          </Text>

          <Text fontSize="sm" color="gray.600" lineHeight="tall">
            {translator(
              "Our exclusive Korean style cutting has built strong partnerships, proudly representing K-BBQ.",
              "저희 회사만의 독창적인 한국식 고기 커팅 기술은 K-BBQ를 대표하는 강력한 파트너십을 구축해 왔습니다."
            )}
          </Text>

          <Text fontSize="sm" color="gray.600" lineHeight="tall">
            {translator(
              "Through quality and reliability, we have become a trusted partner in LA and beyond.",
              "품질과 신뢰를 바탕으로, 저희는 LA를 비롯해, 타 주까지 다양한 지역에서 믿을 수 있는 파트너로 자리매김했습니다."
            )}
          </Text>
        </VStack>
        {/* Company Website Link */}
        <VStack align="center" spacing={0} width="100%" my={16}>
          <Text
            fontWeight="extrabold"
            fontStyle="italic"
            textAlign="center"
            fontSize="sm"
            mb={0}
          >
            More Detail Information:
          </Text>
          <Link
            href="https://www.adamsfoods.us/"
            isExternal
            _hover={{ color: "blue.500" }}
            textDecoration="underline"
            color={COLORS.ACCENT}
            fontStyle="italic"
            textAlign="center"
          >
            https://www.adamsfoods.us/
          </Link>
        </VStack>
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

          <Text fontSize="sm" color="gray.600" lineHeight="tall" px={2} >
            {translator(
              "We source only fresh, high-quality raw materials to ensure consistent product quality and competitiveness.",
              "저희는 일관된 품질과 경쟁력을 유지하기 위해 신선하고 좋은 품질의 원자재만을 사용합니다."
            )}
          </Text>

          <Text fontSize="sm" color="gray.600" lineHeight="tall" px={2} mt={-4} >
            {translator(
              "Our trusted beef suppliers provide select cuts, processed carefully to AdamsFoods’ strict specifications.",
              "신뢰할 수 있는 고기 공급업체로부터, AdamsFoods 만의 엄격한 기준에 따라 공급 받습니다."
            )}
          </Text>

          <Text fontSize="sm" color="gray.600" lineHeight="tall" px={2}>
            {translator(
              "Items that clearly fail to meet high quality standards are immediately rejected—not sold or repurposed at all.",
              "저희 기준에 미치지 못하는 품목은 즉시 반품 처리하며, 판매 하거나 다른 용도로 전환하지 않습니다."
            )}
          </Text>

          <Text fontSize="sm" color="gray.600" lineHeight="tall" px={2} mb={2}>
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
          ref={containerRef}
          w="full"
          alignItems="center"
          justifyContent="space-between"
          mb={1}
          p={3}
          gap={2}
          borderColor="gray.300"
          position="relative"
        >
          {brands.map((brand) => (
            <VStack 
              key={brand.name}
              textAlign="center" 
              borderColor="gray.300" 
              w={brand.width} 
              h="100%"
            >
              <Box h={{ base: "5vh", sm: "6vh", md: "7vh" }} w="100%" position="relative">
                <Image
                  src={brand.image}
                  alt={`${brand.name} Logo`}
                  objectFit="contain"
                  w="100%"
                  h="100%"
                />
              </Box>
              <Text 
                fontWeight="semibold" 
                fontSize={fontSize}  // Use dynamic font size
                whiteSpace="nowrap"
                letterSpacing="-0.5px"
                transform="scale(0.95, 1)"
              >
                {brand.name}
              </Text>
            </VStack>
          ))}
        </Flex>

          {/* Brands Description */}
          <Text fontSize="sm" color="gray.600" lineHeight="tall" mt={2} px={2}>
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
