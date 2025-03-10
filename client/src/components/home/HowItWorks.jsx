import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";

const HowItWorks = () => {
  return (
    <Box maxW="container.xl" mx="auto" py={12} position="relative">
      {/* Title */}
      <Heading
        as="h2"
        textAlign="center"
        fontSize="3xl"
        fontWeight="bold"
        mb={12}
      >
        How It Works
      </Heading>

      {/* Content Container */}
      <Box position="relative" w="100%" overflow="visible">
        <Flex align="center" position="relative" zIndex="2" >
          {/* Left side - Meat Image */}
          <Box
            position="relative"
            width={{ base: "60%", md: "50%" }}
            left={{ base: "0", md: "0", lg: "-2vw", xl: "-4vw" }}
            // border="1px"
          >
            <Image
              src="/Meat222.png"
              alt="Steak with rosemary"
              width="100%"
              height="auto"
            />
          </Box>

          {/* Right side - Steps */}
          <Box
            flex="1"
            ml={{ base: "-2vw", md: "-4vw" }} // Add negative margin to pull steps closer to image
            
            borderColor="red"
          >
            {/* Step 1 */}
            <Box mb={10} position="relative" pt={2} pb={5} mt={6} >
              <Box
                p={4}
                bg="white"
                borderRadius="full"
                boxShadow="sm"
                border="1px solid"
                borderColor="gray.200"
                mb={3}
              >
                <Text fontSize="xl" fontWeight="bold" textAlign="center">
                  STEP 1
                </Text>
              </Box>
              <Text textAlign="center">
                You can choose a delicious product.
              </Text>
            </Box>

            {/* Step 2 */}
            <Box position="relative" pt={2} mb={5} >
              <Box
                p={4}
                bg="white"
                borderRadius="full"
                boxShadow="sm"
                border="1px solid"
                borderColor="gray.200"
                mb={3}
              >
                <Text fontSize="xl" fontWeight="bold" textAlign="center">
                  STEP 2
                </Text>
              </Box>
              <Text textAlign="center">
                Choose your meat and order via 'Contact Us'.
              </Text>
            </Box>
          </Box>
        </Flex>

        {/* Full-width gray backgrounds that go behind everything */}
        <Box
          position="absolute"
          bg="gray.100"
          left="50%"
          transform="translateX(-50%)"
          width="100vw"
          height="40%"
          top="5%"
          zIndex="1"
        />

        <Box
          position="absolute"
          bg="gray.100"
          left="50%"
          transform="translateX(-50%)"
          width="100vw"
          height="40%"
          bottom="5%"
          zIndex="1"
        />
      </Box>
    </Box>
  );
};

export default HowItWorks;
