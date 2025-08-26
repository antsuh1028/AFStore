import {
  Box,
  Flex,
  VStack,
  Text,
  Link,
  useBreakpointValue,
  Image,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const navigate = useNavigate();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Box display="flex">
      {isDesktop && (
        <Box
          width="295px"
          bg="#f9f9f9"
          borderColor="gray.50"
          px={6}
          py={24}
          position="fixed"
          top="calc(20% - 140px)"
          left="calc(37% - 140px)"
          overflowY="auto"
        >
          <VStack align="flex-start" spacing={4}>
            {/* Logo */}
            <Flex
              onClick={() => navigate("/")}
              cursor="pointer"
              _hover={{ opacity: 0.8 }}
              transition="opacity 0.2s"
              justifyContent={"center"}
            >
              <Image
              px={4}
                src="/images/gray_adams.png"
                alt="AdamsFoods Logo"
                fallbackSrc="/images/gray_adams.png"
                mr={2}
              />
              {/* <Image
                src="/images/main_logo.avif"
                alt="AdamsFoods Logo"
                boxSize="35px"
                fallbackSrc="/images/main_logo.png"
                mr={2}
              />
              <Text
                fontSize="2xl"
                fontWeight="normal"
                fontFamily="Arial, sans-serif"
              >
                <Box as="span" fontWeight="900">
                  Adams
                </Box>
                Foods
              </Text> */}
            </Flex>
            <Box
              h="402px"
              bg="white"
              border="1px"
              borderColor="gray.300"
              boxShadow="lg"
            >
              <Image
                src="/images/deal_pg_poster.avif"
                alt="AdamsFoods Logo"
                width="100%"
                height="100%"
                fallbackSrc="/images/deal_pg_poster.jpg"
              />
            </Box>

            {/* Menu Sections */}
            <VStack align="flex-start" spacing={4} width="100%">
              <Box
                width="100%"
                p={3}
                bg="white"
                borderRadius="md"
                boxShadow="lg"
                border="1px"
                borderColor="gray.300"
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
                boxShadow="lg"
                border="1px"
                borderColor="gray.300"
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

      <Box ml={isDesktop ? "280px" : "0"} width="100%">
        {children}
      </Box>
    </Box>
  );
};


export default Sidebar;
