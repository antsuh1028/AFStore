import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  List,
  ListItem,
  Divider,
  Flex,
  Image,
  Stack,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import Footer from "../../components/Footer";

const PackingPage = () => {
  return (
    <Box py={12} bg="white">
      <Container maxW="container.lg" px={{ base: 4, md: 6 }}>
        <Breadcrumb
          spacing="8px"
          separator={<ChevronRightIcon color="gray.500" />}
          mb={8}
          fontSize={{ base: "sm", md: "md" }}
        >
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink>Wholesale Info</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="#" fontWeight="semibold">
              Packing
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <VStack spacing={8} align="stretch">
          {/* Packing Section */}
          <Heading
            as="h2"
            size={{ base: "lg", md: "xl" }}
            textAlign="left"
            fontFamily="serif"
            fontWeight="bold"
          >
            Packing
          </Heading>

          <Divider borderColor="gray.700" />

          {/* Images and List Section - Responsive Layout */}
          <Stack
            direction={{ base: "column", lg: "row" }}
            spacing={{ base: 8, lg: 6 }}
            align="start"
          >
            {/* Left image - Full width on mobile */}
            <Box width={{ base: "100%", lg: "40%" }}>
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

            {/* List items with images - Full width on mobile */}
            <Box width={{ base: "100%", lg: "60%" }}>
              <List spacing={6} styleType="none">
                <ListItem>
                  <Stack
                    direction={{ base: "column", sm: "row" }}
                    spacing={4}
                    align="start"
                  >
                    <Image
                      src="/placeholder2.jpg"
                      alt="USDA Certification"
                      w={{ base: "100%", sm: "120px" }}
                      h="auto"
                      objectFit="cover"
                      borderRadius="md"
                      fallbackSrc="https://via.placeholder.com/60x40?text=USDA+Certified"
                    />
                    <Box>
                      <Flex align="center" mb={1}>
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
                          border="1px solid"
                          borderColor="gray.300"
                        >
                          1
                        </Box>
                        <Text
                          fontWeight="bold"
                          fontSize={{ base: "md", md: "lg" }}
                        >
                          USDA Certified: Quality Guaranteed
                        </Text>
                      </Flex>
                      <Text fontSize={{ base: "sm", md: "md" }}>
                        Only meat that meets strict USDA standards is served.
                      </Text>
                    </Box>
                  </Stack>
                </ListItem>

                <ListItem>
                  <Stack
                    direction={{ base: "column", sm: "row" }}
                    spacing={4}
                    align="start"
                  >
                    <Image
                      src="/placeholder2.jpg"
                      alt="Cutting Technique"
                      w={{ base: "100%", sm: "120px" }}
                      h="auto"
                      objectFit="cover"
                      borderRadius="md"
                      fallbackSrc="https://via.placeholder.com/60x40?text=Cutting+Technique"
                    />
                    <Box>
                      <Flex align="center" mb={1}>
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
                          border="1px solid"
                          borderColor="gray.300"
                        >
                          2
                        </Box>
                        <Text
                          fontWeight="bold"
                          fontSize={{ base: "md", md: "lg" }}
                        >
                          Cutting with AdamsFoods Exclusive Technique
                        </Text>
                      </Flex>
                      <Text fontSize={{ base: "sm", md: "md" }}>
                        We offer USDA-certified, Korean-style trimmed meat.
                      </Text>
                    </Box>
                  </Stack>
                </ListItem>

                <ListItem>
                  <Stack
                    direction={{ base: "column", sm: "row" }}
                    spacing={4}
                    align="start"
                  >
                    <Image
                      src="/placeholder2.jpg"
                      alt="Double-Sealed Packaging"
                      w={{ base: "100%", sm: "120px" }}
                      h="auto"
                      objectFit="cover"
                      borderRadius="md"
                      fallbackSrc="https://via.placeholder.com/60x40?text=Double+Sealed"
                    />
                    <Box>
                      <Flex align="center" mb={1}>
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
                          border="1px solid"
                          borderColor="gray.300"
                        >
                          3
                        </Box>
                        <Text
                          fontWeight="bold"
                          fontSize={{ base: "md", md: "lg" }}
                        >
                          Double-Sealed for Ultimate Freshness
                        </Text>
                      </Flex>
                      <Text fontSize={{ base: "sm", md: "md" }}>
                        Vacuum-packed and tray-sealed to lock in freshness.
                      </Text>
                    </Box>
                  </Stack>
                </ListItem>
              </List>
            </Box>
          </Stack>

          {/* Meat Browning Section - Made Responsive */}
          <Box mt={{ base: 10, md: 12 }}>
            <Heading
              as="h2"
              size={{ base: "lg", md: "xl" }}
              textAlign="left"
              fontFamily="serif"
              fontWeight="bold"
            >
              Meat Browning
            </Heading>

            <Divider borderColor="gray.700" my={{ base: 4, md: 6 }} />

            <Box display="flex" justifyContent="center">
              <Stack
                direction={{ base: "column", md: "row" }}
                w={{ base: "100%", md: "80%" }}
                spacing={{ base: 6, md: 8 }}
                alignItems="center"
              >
                <Box width={{ base: "100%", md: "50%" }}>
                  <Image
                    src="/placeholder3.jpg"
                    alt="Meat color change demonstration"
                    w="full"
                    h="auto"
                    objectFit="cover"
                    borderRadius="md"
                    fallbackSrc="https://via.placeholder.com/60x40?text=Meat+Browning"
                  />
                  <Text fontStyle="italic" mt={2} textAlign="center">
                    30 Min later
                  </Text>
                </Box>

                <Box width={{ base: "100%", md: "50%" }}>
                  <Text mb={4} fontSize={{ base: "sm", md: "md" }}>
                    This phenomenon occurs because the myoglobin in the meat is
                    unable to bind directly with oxygen. Once the packaging is
                    opened and the meat comes into contact with oxygen, it will
                    gradually return to a reddish color within 15 to 30 minutes.
                  </Text>
                  <Text fontSize={{ base: "sm", md: "md" }}>
                    <Text as="span" bg="yellow.100" px={1} fontWeight="bold">
                      This browning is a completely normal process
                    </Text>
                    , so you can rest assured that the meat is safe to eat.
                  </Text>
                </Box>
              </Stack>
            </Box>
          </Box>
        </VStack>
      </Container>

      <Box p={{ base: 8, md: 12 }}></Box>

      <Footer />
    </Box>
  );
};

export default PackingPage;
