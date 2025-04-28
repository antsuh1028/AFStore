import { Box, VStack, Text, Link, useBreakpointValue } from "@chakra-ui/react";

const Sidebar = ({ children }) => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  return (
    <Box display="flex">
      {isDesktop && (
        <Box
          width="280px"
          bg="#f9f9f9"
          borderColor="gray.200"
          px={6}
          py={8}
          position="fixed"
          top="calc(20% - 140px)"
          left="calc(37% - 140px)"
          overflowY="auto"
        >
          <VStack align="flex-start" spacing={8}>
            {/* Logo */}
            <Text fontSize="2xl" fontWeight="normal" border="1px">
              <Box as="span" fontWeight="bold">
                Adams
              </Box>
              Foods
            </Text>
            <Box h="402px" w="100%" bg="white" border="1px" />

            {/* Menu Sections */}
            <VStack align="flex-start" spacing={6} width="100%">
              <Box
                width="100%"
                p={4}
                bg="white"
                borderRadius="md"
                boxShadow="sm"
                border="1px"
              >
                <Text fontSize="sm" color="black">
                  HOW TO{" "}
                  <Box as="span" fontWeight="bold">
                    ORDER
                  </Box>
                </Text>
                <Link
                  fontSize="xs"
                  color="black"
                  mt={1}
                  display="block"
                  textDecoration="underline"
                >
                  GO TO PAGES &gt;
                </Link>
              </Box>

              <Box
                width="100%"
                p={4}
                bg="white"
                borderRadius="md"
                boxShadow="sm"
                border="1px"
              >
                <Text fontSize="sm" color="black">
                  HOW TO{" "}
                  <Box as="span" fontWeight="bold">
                    CONTACT US
                  </Box>
                </Text>
                <Link
                  fontSize="xs"
                  color="black"
                  mt={1}
                  display="block"
                  textDecoration="underline"
                >
                  GO TO PAGES &gt;
                </Link>
              </Box>
            </VStack>
          </VStack>
        </Box>
      )}

      {/* Main content area */}
      <Box ml={isDesktop ? "280px" : "0"} width="100%">
        {children}
      </Box>
    </Box>
  );
};

export default Sidebar;
