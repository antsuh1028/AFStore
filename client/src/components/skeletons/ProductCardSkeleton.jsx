import React from 'react';
import { Box, Skeleton, SkeletonText } from '@chakra-ui/react';

const ProductCardSkeleton = () => (
  <Box
    borderRadius="xl"
    overflow="hidden"
    width="100%"
    bg="white"
    p={2}
    maxW="180px"
    mx="auto"
  >
    <Skeleton height="180px" borderRadius="md" mb={2} />
    
    <SkeletonText mt="2" noOfLines={2} spacing="2" skeletonHeight="3" />
    
    <Skeleton height="12px" width="70%" mt="2" />
    
    <Skeleton height="16px" width="50%" mt="1" />
  </Box>
);

export default ProductCardSkeleton;