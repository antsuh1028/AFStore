import { Box, Flex, Grid, GridItem, Heading, Divider, Image } from "@chakra-ui/react";

const FeatureGrid = () => {
  return (
    <Flex 
      w="110%" 
      position="relative"
    
    >
      {/* Grid section */}
      <Box flex="1" width="50%"  >
        <Divider borderWidth="1px" mb={2} border="1px" w="150%"/>
        
        <Grid templateColumns="repeat(2, 1fr)" gap={0}>
          <GridItem p={6} borderRight="1px solid" borderColor="gray.400">
            <Heading as="h3" size="xs" textAlign="center">
              Adams Cutting Method
            </Heading>
          </GridItem>
          
          <GridItem p={6}>
            <Heading as="h3" size="xs" textAlign="center">
              USDA Inspected
            </Heading>
          </GridItem>
        </Grid>
        
        <Divider border="1px" borderWidth="1px" my={0} />
        
        <Grid templateColumns="repeat(2, 1fr)" gap={0}>
          <GridItem p={6} borderRight="1px solid" borderColor="gray.400">
            <Heading as="h3" size="xs" textAlign="center">
              Korean BBQ
            </Heading>
          </GridItem>
          
          <GridItem p={6}>
            <Heading as="h3" size="xs" textAlign="center">
              Guaranteed Taste
            </Heading>
          </GridItem>
        </Grid>
        
        <Divider border="1px" borderWidth="1px" mt={2} />
      </Box>
      
      {/* Image positioned on the right side */}
      <Box 
        position="relative"
        // rightx="0"
        // top="50%"
        transform="translateY(-8%)"
        // border="1px"
      >
        <Image
          src="/Meat1.png"
          alt="Meat1"
          h="auto"
          w={{ base: "200px", md: "250px", lg: "300px" }}
        />
      </Box>
    </Flex>
  );
};

export default FeatureGrid;