import {
  Box,
  Container,
  Divider,
  Flex,
  HStack,
  Link,
  Text,
  VStack,
  Image,
} from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box as="footer" py={8} px={4}>
      <Container maxW="container.lg">
        {/* Divider */}
        <Divider borderColor="gray.700" mb={8} w="100%" />

        {/* Social Media Icons */}
        <Flex justifyContent="center" mb={12}>
          <HStack width="50%">
            <Link href="#" aria-label="Instagram">
              <Image
                src="/IG.png"
                alt="Instagram Icon"
                width="45%"
                height="45%"
              />
            </Link>
            <Link href="#" aria-label="TikTok">
              <Image
                src="/Tiktok.png"
                alt="TikTok Icon"
                width="45%"
                height="45%"
              />
            </Link>
            <Link href="#" aria-label="YouTube">
              <Image
                src="/Youtube.png"
                alt="YouTube Icon"
                width="45%"
                height="45%"
              />
            </Link>
          </HStack>
        </Flex>

        {/* Contact and Location */}
        <Flex justifyContent="center" mb={4} textAlign="center" gap={4}>
          {/* Get in touch */}
          <VStack align="center" mb={0} w="50%" spacing={0.5}>
            <Text fontWeight="bold" fontSize="md" textDecoration="underline" mb={2}>
              Get in touch
            </Text>
            <Text color="gray.600" fontSize="xs" noOfLines={1}>
              Monday to Friday
            </Text>
            <Text color="gray.600" fontSize="xs" noOfLines={1}>
              8am - 4pm PST
            </Text>
          </VStack>

          {/* Location */}
          <VStack align="center" spacing={0.5} w="50%">
            <Text fontWeight="bold" fontSize="md" textDecoration="underline" mb={2}>
              Location
            </Text>
            <Text color="gray.600" fontSize="xs" noOfLines={1}>
              DTLA-1805 Industrial St,
            </Text>
            <Text color="gray.600" fontSize="xs" noOfLines={1}>
              Los Angeles, CA 90021
            </Text>
          </VStack>
        </Flex>

        {/* Language and Currency */}
        {/* <Flex
            justifyContent="space-between"
            alignItems="center"
          >
            <Box
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="full"
              px={4}
              py={2}
              width={{ base: "full", md: "auto" }}
              maxW={{ base: "200px", md: "auto" }}
            >
              <Flex alignItems="center" justifyContent="space-between">
                <Text>English</Text>
                <Box as="span" ml={2}>
                  <svg
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1.5L6 6.5L11 1.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Box>
              </Flex>
            </Box>
  
            <Flex alignItems="center">
              <Box
                width="24px"
                height="24px"
                borderRadius="full"
                overflow="hidden"
                mr={2}
              >
                <Image
                  src="https://flagcdn.com/w20/us.png"
                  alt="US Flag"
                  width="100%"
                  height="100%"
                  objectFit="cover"
                />
              </Box>
              <Text>United States (USD $)</Text>
            </Flex>
          </Flex> */}
      </Container>
    </Box>
  );
};

export default Footer;
