import { Box, Container, Heading, Text, VStack, List, ListItem, ListIcon, Divider, Flex, Image } from "@chakra-ui/react";

const PackingPage = () => {
  return (
    <Box py={12} bg="white">
      <Container maxW="container.lg">
        <VStack spacing={8} align="stretch">
          {/* Packing Section */}
          <Heading as="h2" size="xl" textAlign="left" fontFamily="serif" fontWeight="bold">
            Packing
          </Heading>

          <Divider borderColor="gray.300" />

          {/* Images */}
          <Flex direction={{ base: "column", md: "row" }} gap={6}>
            <Box flex={1}>
              <Image 
                src="/placeholder1.jpg" 
                alt="Packing process example 1"
                w="full"
                h="auto"
                objectFit="cover"
                borderRadius="md"
                fallbackSrc="https://via.placeholder.com/60x40?text=Packing+Process+1"
              />
            </Box>
            <Box flex={1}>
              <Image 
                src="/placeholder2.jpg" 
                alt="Packing process example 2"
                w="full"
                h="auto"
                objectFit="cover"
                borderRadius="md"
                fallbackSrc="https://via.placeholder.com/60x40?text=Packing+Process+2"
              />
            </Box>
          </Flex>

          <VStack spacing={6} align="stretch">
          <List spacing={4} styleType="none">
            <ListItem>
              <Flex align="flex-start">
                <Box
                  color="black"
                  borderRadius="full"
                  w={6}
                  h={6}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mr={3}
                  flexShrink={0}
                >
                  1
                </Box>
                <Box>
                  <Text fontWeight="bold" fontSize="lg">USDA Certified: Quality Guaranteed</Text>
                  <Text>Only meat that meets strict USDA standards is served.</Text>
                </Box>
              </Flex>
            </ListItem>
            
            <ListItem>
              <Flex align="flex-start">
                <Box
                  color="black"
                  borderRadius="full"
                  w={6}
                  h={6}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mr={3}
                  flexShrink={0}
                >
                  2
                </Box>
                <Box>
                  <Text fontWeight="bold" fontSize="lg">Cutting with AdamsFoods Exclusive Technique</Text>
                  <Text>We offer USDA-certified, Korean-style trimmed meat.</Text>
                </Box>
              </Flex>
            </ListItem>
            
            <ListItem>
              <Flex align="flex-start">
                <Box
                  color="black"
                  borderRadius="full"
                  w={6}
                  h={6}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mr={3}
                  flexShrink={0}
                >
                  3
                </Box>
                <Box>
                  <Text fontWeight="bold" fontSize="lg">Double-Sealed for Ultimate Freshness</Text>
                  <Text>Vacuum-packed and tray-sealed to lock in freshness.</Text>
                </Box>
              </Flex>
            </ListItem>
          </List>
          </VStack>



          {/* Meat Browning Section */}
          <Box mt={8}>  {/* Added top margin to match main header spacing */}
            <Heading as="h2" size="xl" textAlign="left" fontFamily="serif" fontWeight="bold">
              Meat Browning
            </Heading>

            <Divider borderColor="gray.300" my={6} />

            <Image src="/placeholder3.jpg" alt="Packing process example 3" h="50%" mt={4} />

            <Text fontStyle="italic" mb={2}>30 Min later</Text>
            <Text mb={4}>
            This phenomenon occurs because the myoglobin in the
            meat is unable to bind directly with oxygen. Once the
            packaging is opened and the meat comes into contact with
            oxygen, it will gradually return to a reddish color
            within 15 to 30 minutes.
            </Text>
            <Text>
            This browning is a completely normal process, so you can rest assured that the meat is safe to eat.
            </Text>
          </Box>

        </VStack>
      </Container>
    </Box>
  );
};

export default PackingPage;