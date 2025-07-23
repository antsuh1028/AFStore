import { useState, useRef } from "react";
import {
  Box,
  Button,
  VStack,
  Heading,
  Container,
  useDisclosure,
  Flex,
  Text,
} from "@chakra-ui/react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/SideBar";
import NavDrawer from "../components/NavDrawer";
import { COLORS } from "../constants";

const AgreementGate = () => {
  const [checked, setChecked] = useState({
    terms: false,
    privacy: false,
    returnPolicy: false,
    disclaimer: false,
  });

  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const contentRef = useRef(null);

  const allChecked = Object.values(checked).every(Boolean);

  const checkboxItems = [
    { key: "terms", label: "I have agreed to the Terms of Use" },
    { key: "privacy", label: "I agree to the Privacy Policy" },
    {
      key: "returnPolicy",
      label: "I acknowledge the Return and Refund Policy is final",
    },
    {
      key: "disclaimer",
      label:
        "I understand and accept the Disclaimer regarding product handling and use",
    },
  ];

  return (
    <Sidebar>
      <NavDrawer isOpen={isOpen} onClose={onClose} containerRef={contentRef} />
      <Box minH="100vh" display="flex" justifyContent="center" bg={COLORS.GRAY_LIGHT}>
        <Container
          ref={contentRef}
          maxW={{ base: "100%", lg: "30%" }}
          p={0}
          bg="white"
          border={{ base: "none", lg: "1px" }}
          borderColor="gray.200"
          ml={{ base: 0, lg: "40%" }}
          display="flex"
          flexDirection="column"
          flex="1"
        >
          <Box>
            <Flex p={4} justify="space-between" align="center">
              <Button
                leftIcon={<ChevronLeft size={20} />}
                variant="ghost"
                size="lg"
                colorScheme="gray"
                onClick={() => navigate(-1)}
              ></Button>
              <Button variant="ghost" size="lg" onClick={onOpen}>
                <Text fontSize="lg">☰</Text>
              </Button>
            </Flex>
          </Box>

          <Box px={6} py={4} flex="1">
            <Heading
              mb={12}
              fontWeight="bold"
              fontSize="2xl"
              textAlign="center"
            >
              Agreements
            </Heading>

            <VStack spacing={5} align="stretch">
              <Text textAlign='center' p={4} color="gray" fontSize="sm">Please check all statements before continuing </Text>
              {checkboxItems.map((item) => (
                <Box
                  key={item.key}
                  display="flex"
                  alignItems="center"
                  cursor="pointer"
                  onClick={() =>
                    setChecked((prev) => ({
                      ...prev,
                      [item.key]: !prev[item.key],
                    }))
                  }
                >
                  <Box
                    as="span"
                    display="inline-block"
                    width="20px"
                    height="20px"
                    minWidth="20px"
                    borderRadius="50%"
                    border="2px solid #494949"
                    bg="transparent"
                    mr={3}
                    position="relative"
                  >
                    {checked[item.key] && (
                      <Box
                        position="absolute"
                        top="2px"
                        left="2px"
                        margin="auto"
                        width="12px"
                        height="12px"
                        borderRadius="50%"
                        bg={COLORS.PRIMARY}
                        transition="background-color 0.2s ease-in-out"
                      />
                    )}
                  </Box>

                  <Text fontWeight="bold" fontSize="sm" color="gray.700">
                    {item.label}
                  </Text>
                </Box>
              ))}

              <Box textAlign="center" pt={2}>
                <Box
                  as="span"
                  color={COLORS.PRIMARY}
                  textDecoration="underline"
                  fontWeight="bold"
                  fontSize="sm"
                  cursor="pointer"
                  onClick={() => navigate("/terms-and-policies")}
                  _hover={{ color: COLORS.SECONDARY }}
                >
                  View Terms & Policies
                </Box>
              </Box>

              <Button
                mt={3}
                color="white"
                bg={COLORS.PRIMARY}
                borderRadius="full"
                _hover={{ bg: COLORS.SECONDARY }}
                isDisabled={!allChecked}
                onClick={() => navigate("/signup")}
              >
                Create Account
              </Button>
            </VStack>
          </Box>
        </Container>
      </Box>
    </Sidebar>
  );
};

export default AgreementGate;
