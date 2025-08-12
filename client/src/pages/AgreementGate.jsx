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
import { useLanguage } from "../hooks/LanguageContext";
import Navbar from "../components/Navbar";

const AgreementGate = () => {
  const [checked, setChecked] = useState({
    terms: false,
    privacy: false,
    returnPolicy: false,
    disclaimer: false,
    ageCheck: false,
  });

  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const contentRef = useRef(null);
  const { selectedLanguage } = useLanguage();

  const allChecked = Object.values(checked).every(Boolean);

  const checkboxItems =
    selectedLanguage.code === "en"
      ? [
          { key: "terms", label: "I agree to the Terms of Service" },
          { key: "privacy", label: "I agree to the Privacy Policy" },
          {
            key: "returnPolicy",
            label: "I acknowledge the Return & Refund Policy",
          },
          {
            key: "disclaimer",
            label: "I understand that risk transfers upon pickup or delivery",
          },
          {
            key: "ageCheck",
            label:
              "I am over 18 years old and an authorized representative of my business",
          },
        ]
      : [
          { key: "terms", label: "이용약관에 동의합니다." },
          { key: "privacy", label: "개인정보 처리방침에 동의합니다." },
          { key: "returnPolicy", label: "반품 및 환불 정책을 확인하였습니다." },
          {
            key: "disclaimer",
            label: "제품 인도 또는 배송 시 위험이 이전됨을 이해합니다.",
          },
          {
            key: "ageCheck",
            label:
              "본인은 만 18세 이상이며, 사업체의 공식 대표자임을 확인합니다.",
          },
        ];

  return (
    <Sidebar>
      
      <NavDrawer isOpen={isOpen} onClose={onClose} containerRef={contentRef} />
      <Box
        minH="100vh"
        display="flex"
        justifyContent="center"
        bg={COLORS.GRAY_LIGHT}
      >
        
        <Container
          ref={contentRef}
          maxW={{ base: "100%", lg: "30%" }}
          p={0}
          bg="white"
          boxShadow="xl"
          ml={{ base: 0, lg: "40%" }}
        >
          <Navbar onOpen={onOpen} />

          {/* Content */}
          <Box px={12} py={8} flex="1">
            <Heading
              mb={24}
              fontWeight="bold"
              fontSize="2xl"
              textAlign="center"
              color="black"
            >
              Create Account
            </Heading>

            <VStack spacing={4} align="stretch">
              {/* Checkbox Items */}
              {checkboxItems.map((item) => (
                <Box
                  key={item.key}
                  display="flex"
                  alignItems="flex-start"
                  cursor="pointer"
                  onClick={() =>
                    setChecked((prev) => ({
                      ...prev,
                      [item.key]: !prev[item.key],
                    }))
                  }
                  // py={2}
                >
                  {/* Custom Radio Button */}
                  <Box
                    as="span"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    boxSize={5} 
                    borderRadius="50%"
                    border="2px solid"
                    borderColor={COLORS.PRIMARY}
                    bg="transparent"
                    mr={3}
                    transition="all 0.2s ease"
                  >
                    {checked[item.key] && (
                      <Box
                        width="70%"
                        height="70%"
                        borderRadius="50%"
                        bg={COLORS.PRIMARY}
                      />
                    )}
                  </Box>

                  {/* Label Text */}
                  <Text
                    fontSize="sm"
                    color="black"
                    lineHeight="1.4"
                    fontWeight="medium"
                    flex="1"
                  >
                    {item.label}
                  </Text>
                </Box>
              ))}

              {/* Terms Link */}
              <Box textAlign="left" py={10}>
                <Text
                  color="gray.500"
                  textDecoration="underline"
                  fontSize="sm"
                  cursor="pointer"
                  onClick={() => navigate("/terms-and-policies")}
                  _hover={{ color: "gray.700" }}
                >
                  View Terms & Policies
                </Text>
              </Box>

              {/* Create Account Button */}
              <Button
                w="full"
                py={6}
                color="white"
                bg={COLORS.PRIMARY}
                borderRadius="full"
                fontSize="sm"
                fontWeight="bold"
                textTransform="uppercase"
                letterSpacing="wider"
                _hover={{ bg: "gray.800" }}
                _disabled={{
                  bg: "gray.300",
                  color: "gray.500",
                  cursor: "not-allowed",
                }}
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
