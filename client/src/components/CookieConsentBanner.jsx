import React from 'react';
import { Box, Text, Button, HStack, VStack } from '@chakra-ui/react';
import { COLORS } from '../constants';

const CookieConsentBanner = ({ onAccept }) => {
  const handleAccept = () => {
    localStorage.setItem('cookieAgreement', 'accepted');
    onAccept();
  };

  const handleReject = () => {
    localStorage.setItem('cookieAgreement', 'rejected');
    onAccept();
  };

  return (
    <Box
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      bg="gray.100"
      border="1px solid"
      borderColor="gray.200"
      boxShadow="lg"
      p={4}
      zIndex={9999}
      opacity={0.9}
    >
      <VStack spacing={3} maxW="600px" mx="auto">
        <Text fontSize="sm" textAlign="center" color="gray.700">
          To add items to your cart, we need to store them using cookies. No
          personal information is collected. By clicking "Accept", you agree to
          the use of cookies for this purpose.
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
            onClick={handleReject}
          >
            Reject
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default CookieConsentBanner;