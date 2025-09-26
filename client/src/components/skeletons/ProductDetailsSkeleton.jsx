import React from 'react';
import { 
  Box, 
  Skeleton, 
  SkeletonText, 
  VStack, 
  HStack,
  Container 
} from '@chakra-ui/react';
import Sidebar from '../SideBar';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { ViewContainer } from '../ViewContainer';

const ProductDetailSkeleton = ({ isOpen, onOpen, onClose, contentRef }) => {
  return (
    <Sidebar>
      <ViewContainer contentRef={contentRef}>
        <Navbar onOpen={onOpen} />

        {/* Breadcrumbs skeleton */}
        <Box p={4}>
          <HStack spacing={2}>
            <Skeleton height="12px" width="40px" />
            <Skeleton height="12px" width="8px" />
            <Skeleton height="12px" width="60px" />
            <Skeleton height="12px" width="8px" />
            <Skeleton height="12px" width="80px" />
          </HStack>
        </Box>

        <VStack spacing={6} px={4} pb={8}>
          <Box position="relative" w="100%" bg="gray.100" borderRadius="lg">
            <Skeleton height="280px" borderRadius="lg" />
            
            <HStack
              position="absolute"
              bottom="4"
              left="50%"
              transform="translateX(-50%)"
              spacing={2}
            >
              {Array(3).fill().map((_, i) => (
                <Skeleton key={i} w="8px" h="8px" borderRadius="full" />
              ))}
            </HStack>

            <Skeleton
              position="absolute"
              top="4"
              right="4"
              height="24px"
              width="30px"
              borderRadius="md"
            />
          </Box>

          <VStack spacing={4} align="stretch" w="100%">
            <SkeletonText noOfLines={2} spacing="3" skeletonHeight="4" />
            
            <Skeleton height="24px" width="80px" />

            <Box>
              <Skeleton height="16px" width="60px" mb={2} />
              <SkeletonText noOfLines={3} spacing="2" skeletonHeight="3" />
            </Box>

            <VStack spacing={3} w="100%">
              <Skeleton height="48px" width="100%" borderRadius="full" />
              <Skeleton height="40px" width="100%" borderRadius="full" />
            </VStack>
          </VStack>

          <VStack spacing={4} w="100%">
            {Array(3).fill().map((_, i) => (
              <Box key={i} w="100%" border="1px" borderColor="gray.100" borderRadius="md">
                <Skeleton height="48px" borderRadius="md" />
              </Box>
            ))}
          </VStack>
        </VStack>

        <Footer />
      </ViewContainer>
    </Sidebar>
  );
};

export default ProductDetailSkeleton;