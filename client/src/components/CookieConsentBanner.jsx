import React from "react";
import { Box, Text, Button, HStack, VStack, Heading } from "@chakra-ui/react";
import { COLORS } from "../constants";
import { useNavigate } from "react-router-dom";

const CookieConsentBanner = ({ onAccept }) => {

  const navigate = useNavigate()
  const handleAccept = () => {
    localStorage.setItem("cookieAgreement", "accepted");
    onAccept();
  };

  const handleReject = () => {
    localStorage.setItem("cookieAgreement", "rejected");
    onAccept();
  };

  return (
    <Box
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      boxShadow="lg"
      p={4}
      zIndex={9999}
      opacity={0.9}
    >
      <VStack spacing={3} maxW="600px" mx="auto">
        <Heading fontSize="lg" fontWeight="extrabold">COOKIE POLICY</Heading>
        <Text fontSize="sm" textAlign="center" color="gray.700">
          We use cookies to enhance your browsing experience and analyze site
          traffic. By continuing to use our site, you agree to our use of
          cookies.
        </Text>

        <HStack spacing={3}>
          <Button
            bg={COLORS.PRIMARY}
            color="white"
            size="sm"
            borderRadius="full"
            _hover={{ bg: COLORS.SECONDARY }}
            onClick={handleAccept}
          >
            Accept
          </Button>
          <Button
            variant="outline"
            borderColor={COLORS.PRIMARY}
            color={COLORS.PRIMARY}
            size="sm"
            borderRadius="full"
            _hover={{ bg: "gray.50" }}
            onClick={()=>navigate("/cookie")}
          >
            Learn More
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default CookieConsentBanner;
