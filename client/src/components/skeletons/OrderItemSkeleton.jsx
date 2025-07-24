import React from 'react';
import { Box, Skeleton, SkeletonText, VStack, HStack } from '@chakra-ui/react';

const OrderItemSkeleton = () => (
  <VStack
    bg="white"
    borderRadius="xl"
    p={2}
    alignItems="center"
    spacing={2}
  >
    <Skeleton boxSize="175px" borderRadius="md" />
    
    <Box flex="1" width="100%">
      <SkeletonText noOfLines={2} spacing="2" skeletonHeight="3" />
      <Skeleton height="12px" width="60%" mt="2" />
      <Skeleton height="12px" width="40%" mt="1" />
    </Box>
  </VStack>
);

export default OrderItemSkeleton;