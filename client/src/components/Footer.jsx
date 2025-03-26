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
          <Divider borderColor="gray.900" mb={8} />
  
          {/* Social Media Icons */}
          <Flex justifyContent="center" mb={12}>
            <HStack spacing={8}>
              <Link href="#" aria-label="Instagram">
                <Image
                  src="/IG.png"
                  alt="Instagram Icon"
                  width="40px"
                  height="40px"
                />
              </Link>
              <Link href="#" aria-label="TikTok">
                <Image
                  src="/Tiktok.png"
                  alt="TikTok Icon"
                  width="40px"
                  height="40px"
                />
              </Link>
              <Link href="#" aria-label="YouTube">
                <Image
                  src="/Youtube.png"
                  alt="YouTube Icon"
                  width="40px"
                  height="40px"
                />
              </Link>
            </HStack>
          </Flex>
  
          {/* Contact and Location */}
          <Flex
            justifyContent="space-between"
            mb={16} // Increased bottom margin for more space before language/currency
            textAlign={{ base: "center", md: "left" }}
          >
            {/* Get in touch */}
            <VStack
              align={{ base: "center", md: "flex-start" }}
              mb={{ base: 4, md: 0 }}
              spacing={0} // Reduced spacing between items in the VStack
            >
              <Text
                fontWeight="medium"
                fontSize="lg"
                mb={2}
                textDecoration="underline"
              >
                Get in touch
              </Text>
              <Text color="gray.600" fontSize="sm">
                Monday to Friday
              </Text>
              <Text color="gray.600" fontSize="sm" mt={0}>
                8am - 4pm PST
              </Text>
            </VStack>
  
            {/* Location */}
            <VStack 
              align={{ base: "center", md: "flex-start" }}
              spacing={0} // Reduced spacing between items in the VStack
            >
              <Text
                fontWeight="medium"
                fontSize="lg"
                mb={2}
                textDecoration="underline"
              >
                Location
              </Text>
              <Text color="gray.600" fontSize="sm">
                DTLA-1805 Industrial St,
              </Text>
              <Text color="gray.600" fontSize="sm" mt={0}>
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