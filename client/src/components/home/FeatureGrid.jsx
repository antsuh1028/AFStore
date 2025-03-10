import { Box, Flex, Grid, GridItem, Heading, Divider, Image } from "@chakra-ui/react";

const FeatureGrid = () => {
  return (
    <Flex 
      w="100%" 
      position="relative"
      px={4}
    >
      {/* Grid section */}
      <Box flex="1" width="100%">
        <Divider borderColor="gray.400" borderWidth="1px" mb={6} />
        
        <Grid templateColumns="repeat(2, 1fr)" gap={0}>
          <GridItem p={6} borderRight="1px solid" borderColor="gray.400">
            <Heading as="h3" size="md" textAlign="center">
              Adams Cutting Method
            </Heading>
          </GridItem>
          
          <GridItem p={6}>
            <Heading as="h3" size="md" textAlign="center">
              USDA Inspected
            </Heading>
          </GridItem>
        </Grid>
        
        <Divider borderColor="gray.400" borderWidth="1px" my={0} />
        
        <Grid templateColumns="repeat(2, 1fr)" gap={0}>
          <GridItem p={6} borderRight="1px solid" borderColor="gray.400">
            <Heading as="h3" size="md" textAlign="center">
              Korean BBQ
            </Heading>
          </GridItem>
          
          <GridItem p={6}>
            <Heading as="h3" size="md" textAlign="center">
              Guaranteed Taste
            </Heading>
          </GridItem>
        </Grid>
        
        <Divider borderColor="gray.400" borderWidth="1px" mt={6} />
      </Box>
      
      {/* Image positioned on the right side */}
      {/* <Box 
        position="absolute"
        right="0"
        top="50%"
        transform="translateY(-50%)"
        zIndex="1"
      >
        <Image
          src="/Meat1.png"
          alt="Meat1"
          h="auto"
          w={{ base: "150px", md: "250px", lg: "300px" }}
          objectFit="contain"
        />
      </Box> */}
    </Flex>
  );
};

export default FeatureGrid;