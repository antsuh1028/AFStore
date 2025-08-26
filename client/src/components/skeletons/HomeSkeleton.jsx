import { 
  Box, 
  Container, 
  Flex, 
  Skeleton, 
  SkeletonText,
  Grid,
  GridItem,
  VStack,
  HStack,
  Divider
} from '@chakra-ui/react';
import Sidebar from '../SideBar';
import NavDrawer from '../NavDrawer';
import Footer from '../Footer';

const HomeSkeleton = ({ isOpen, onClose, contentRef }) => {
  return (
    <Sidebar>
      <NavDrawer isOpen={isOpen} onClose={onClose} containerRef={contentRef} />
      <Container
        ref={contentRef}
        maxW={{ base: "100%", lg: "30%" }}
        p={0}
        bg="white"
        boxShadow="xl"
        ml={{ base: 0, lg: "40%" }}
      >
        {/* Header Skeleton */}
        <Flex p={4} justify="space-between" align="center">
          <Skeleton height="40px" width="40%" />
          <Flex gap={2}>
            <Skeleton boxSize="40px" borderRadius="md" />
            <Skeleton boxSize="40px" borderRadius="md" />
            <Skeleton boxSize="40px" borderRadius="md" />
          </Flex>
        </Flex>

        {/* Hero Section Skeleton */}
        <Box px={4} py={8} textAlign="center">
          <SkeletonText noOfLines={2} spacing="4" skeletonHeight="6" />
        </Box>

        {/* Main Image Carousel Skeleton */}
        <Box px={4} mb={6}>
          <Skeleton height="200px" borderRadius="lg" />
        </Box>

        {/* Search Bar Skeleton */}
        <Box px={4} mb={6}>
          <Skeleton height="56px" borderRadius="full" mt={4} mb={8} />
        </Box>

        {/* Categories Grid Skeleton */}
        <Grid templateColumns="repeat(3, 1fr)" gap={4} px={4} mb={8}>
          {Array(6).fill().map((_, idx) => (
            <GridItem key={idx}>
              <VStack spacing={2}>
                <Skeleton boxSize="75px" borderRadius="full" />
                <Skeleton height="16px" width="60px" />
              </VStack>
            </GridItem>
          ))}
        </Grid>

        {/* Location Section Skeleton */}
        <HStack px={6} mb={3} spacing={2} ml={2}>
          <Skeleton boxSize="20px" />
          <Skeleton height="20px" width="80px" />
        </HStack>

        {/* Featured Product Skeleton */}
        <Box px={4} mb={6}>
          <Flex direction="row" justify="space-between" gap={6}>
            <Skeleton flex="1" height="190px" borderRadius="xl" />
            <VStack align="flex-start" flex="1" spacing={4}>
              <Divider borderColor="gray.200" />
              <SkeletonText noOfLines={1} skeletonHeight="4" />
              <SkeletonText noOfLines={3} spacing="2" skeletonHeight="3" />
              <Box alignSelf="flex-end">
                <Skeleton boxSize="40px" borderRadius="full" />
              </Box>
            </VStack>
          </Flex>
        </Box>

        {/* Why AdamsFoods Section Skeleton */}
        <Box px={4} mb={6} py={4}>
          <Skeleton height="24px" width="160px" mb={8} ml={2} />
          
          <Flex mb={4} gap={4} align="center">
            <Skeleton width="50%" height="80px" borderRadius="full" />
            <VStack w="50%" spacing={2}>
              <Divider borderColor="gray.200" />
              <Skeleton height="16px" width="80px" />
              <Divider borderColor="gray.200" />
            </VStack>
          </Flex>

          <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={8} mt={8}>
            {Array(2).fill().map((_, i) => (
              <GridItem key={i}>
                <VStack align="center" spacing={2}>
                  <Skeleton boxSize="30px" borderRadius="full" />
                  <Skeleton height="14px" width="80px" />
                </VStack>
              </GridItem>
            ))}
          </Grid>

          <VStack align="flex-start" spacing={4} p={2}>
            <SkeletonText noOfLines={3} spacing="3" />
          </VStack>
        </Box>

        {/* Company Link Skeleton */}
        <VStack align="center" spacing={2} mb={10}>
          <Skeleton height="14px" width="150px" />
          <Skeleton height="14px" width="200px" />
        </VStack>

        <Footer />
      </Container>
    </Sidebar>
  );
};

export default HomeSkeleton;