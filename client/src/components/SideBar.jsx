import { Box, VStack, Text, Link, useBreakpointValue } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ children }) => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const navigate = useNavigate();

  return (
    <Box display="flex">
      {isDesktop && (
        <Box
          width="280px"
          bg="#f9f9f9"
          borderColor="gray.200"
          px={6}
          py={24}
          position="fixed"
          top="calc(20% - 140px)"
          left="calc(37% - 140px)"
          overflowY="auto"
        >
          <VStack align="flex-start" spacing={4}>
            {/* Logo */}
            <Box
              onClick={() => navigate("/")}
              cursor="pointer"
              _hover={{ opacity: 0.8 }}
              transition="opacity 0.2s"
            >
              <Text fontSize="2xl" fontWeight="normal">
                <Box as="span" fontWeight="bold">
                  Adams
                </Box>
                Foods
              </Text>
            </Box>
            <Box h="45vh" w="100%" bg="white" border="1px" />

            {/* Menu Sections */}
            <VStack align="flex-start" spacing={4} width="100%">
              <Box
                width="100%"
                p={3}
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
                  href="/wholesale/how-to-order"
                >
                  GO TO PAGE &gt;
                </Link>
              </Box>

              <Box
                width="100%"
                p={3}
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
                  href="/contact"
                >
                  GO TO PAGE &gt;
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
