import {
  Center,
  Flex,
  Text,
  GridItem,
  SimpleGrid,
  Divider,
  Image,
} from "@chakra-ui/react";

const FeatureGrid = () => {
  return (
    <SimpleGrid columns={{ base: 2, md: 2 }} spacing={10} width="100%" mt={10}>
      {/* Feature 1 */}
      <GridItem>
        <Center flexDirection="column" h="100%">
          <Image
            src="/Main logo.png"
            alt="Wings Icon"
            width="40px"
            height="40px"
          />
          <Flex align="center" justify="center" py={4} width="100%">
            <Flex align="center" justify="center" maxW="md" position="relative">
              {/* Left bracket */}
              <Image
                src="/bracket_L.jpg"
                alt="Left Bracket"
                width={{ base: "10%", sm: "10%", md: "5%" }}
                height="10%"
                mb={4}
              />

              {/* Quote text */}
              <Text
                fontSize={{ base: "sm", sm: "xl" }}
                fontWeight="bold"
                textAlign="center"
                mx={2}
              >
                "Exclusive Korean-style cutting technique."
              </Text>

              {/* Right bracket */}
              <Image
                src="/bracket_R.jpg"
                alt="Right Bracket"
                width={{ base: "10%", sm: "10%", md: "5%" }}
                height="100%"
                mb={4}
              />
            </Flex>
          </Flex>
        </Center>
      </GridItem>

      {/* Feature 2 */}
      <GridItem>
        <Center flexDirection="column" h="100%">
          <Image
            src="/Main logo.png"
            alt="Wings Icon"
            width="40px"
            height="40px"
          />
          <Flex align="center" justify="center" py={4} width="100%">
            <Flex align="center" justify="center" maxW="md" position="relative">
              {/* Left bracket */}
              <Image
                src="/bracket_L.jpg"
                alt="Left Bracket"
                width={{ base: "10%", sm: "10%", md: "5%" }}
                height="100%"
                mb={4}
              />

              {/* Quote text */}
              <Text
                fontSize={{ base: "sm", sm: "xl" }}
                fontWeight="bold"
                textAlign="center"
                mx={2}
              >
                "USDA inspected and compliant."
              </Text>

              {/* Right bracket */}
              <Image
                src="/bracket_R.jpg"
                alt="Right Bracket"
                width={{ base: "10%", sm: "10%", md: "5%" }}
                height="100%"
                mb={4}
              />
            </Flex>
          </Flex>
        </Center>
      </GridItem>

      {/* Feature 3 */}
      <GridItem>
        <Center flexDirection="column" h="100%">
          <Image
            src="/Main logo.png"
            alt="Wings Icon"
            width="40px"
            height="40px"
          />
          <Flex align="center" justify="center" py={4} width="100%">
            <Flex align="center" justify="center" maxW="md" position="relative">
              {/* Left bracket */}
              <Image
                src="/bracket_L.jpg"
                alt="Left Bracket"
                width={{ base: "10%", sm: "10%", md: "5%" }}
                height="100%"
                mb={4}
              />

              {/* Quote text */}
              <Text
                fontSize={{ base: "sm", sm: "xl" }}
                fontWeight="bold"
                textAlign="center"
                mx={2}
              >
                "The Unrivaled Benchmark of Korean BBQ"
              </Text>

              {/* Right bracket */}
              <Image
                src="/bracket_R.jpg"
                alt="Right Bracket"
                width={{ base: "10%", sm: "10%", md: "5%" }}
                height="100%"
                mb={4}
              />
            </Flex>
          </Flex>
        </Center>
      </GridItem>

      {/* Feature 4 */}
      <GridItem>
        <Center flexDirection="column" h="100%">
          <Image
            src="/Main logo.png"
            alt="Wings Icon"
            width="40px"
            height="40px"
          />
          <Flex align="center" justify="center" py={4} width="100%">
            <Flex align="center" justify="center" maxW="md" position="relative">
              {/* Left bracket */}
              <Image
                src="/bracket_L.jpg"
                alt="Left Bracket"
                width={{ base: "10%", sm: "10%", md: "5%" }}
                height="100%"
                mb={4}
              />

              {/* Quote text */}
              <Text
                fontSize={{ base: "sm", sm: "xl" }}
                fontWeight="bold"
                textAlign="center"
                mx={2}
              >
                "We ensure reliable and timely delivery."
              </Text>

              {/* Right bracket */}
              <Image
                src="/bracket_R.jpg"
                alt="Right Bracket"
                width={{ base: "10%", sm: "10%", md: "5%" }}
                height="100%"
                mb={4}
              />
            </Flex>
          </Flex>
        </Center>
      </GridItem>
    </SimpleGrid>
  );
};

export default FeatureGrid;