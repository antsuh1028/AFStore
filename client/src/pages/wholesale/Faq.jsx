import { 
    Box, 
    Container, 
    Heading, 
    SimpleGrid, 
    Text 
  } from "@chakra-ui/react";
  
  const FAQPage = () => {
    return (
      <Box py={{ base: 28, md: 32 }} bg="white">
        <Container maxW="container.xl">
          <Heading 
            textAlign="center"
            fontSize="3xl"
            fontFamily="serif"
            fontWeight="bold"
            mb={16}
            color="#000"
          >
            FAQ
          </Heading>
  
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
            <Box 
              p={6} 
              borderWidth="1px" 
              borderRadius="md" 
              boxShadow="sm"
            >
              <Heading as="h2" size="md" mb={2}>
                Delivery
              </Heading>
              <Text fontSize="sm">
              Orders above the minimum amount qualify for 
              free delivery within Los Angeles.For orders below 
              the minimum, a delivery fee applies. Alternatively, 
              pickup is available at the address below.
              <br />
              1805 Industrial St, Los Angeles, CA 90021
              </Text>
            </Box>
  
            {/* Refund Card */}
            <Box 
              p={6} 
              borderWidth="1px" 
              borderRadius="md" 
              boxShadow="sm"
            >
              <Heading as="h2" size="md" mb={2}>
                Refund
              </Heading>
              <Text fontSize="sm">
              Exchanges are allowed within 24 hours if there’s an
              issue with the product. Please provide a photo of
              the product if there is a defect.
              <br />
              <br />
              <Text as="span" color="red.500" fontWeight="bold">
                Exchanges/returns are NOT possible in these cases:
              </Text>
              <br />
              -Damage or value reduction due to buyer's actions
              <br />
              -Value decrease from use or consumption
              <br />
              -If the product’s value decreases due to improper storage
              <br />
              -Buyer’s change of mind, address errors, or loss of
              contact (except for product defects).
              </Text>
            </Box>
  
            {/* Bulk Purchase Card */}
            <Box 
              p={6} 
              borderWidth="1px" 
              borderRadius="md" 
              boxShadow="sm"
            >
              <Heading as="h2" size="md" mb={2}>
                Bulk Purchase
              </Heading>
              <Text fontSize="sm">
              Get a 00% discount on bulk orders over $500.
              </Text>
            </Box>
          </SimpleGrid>
  
          {/* Second Row: 2 Cards */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {/* Cash & Carry Card */}
            <Box 
              p={6} 
              borderWidth="1px" 
              borderRadius="md" 
              boxShadow="sm"
            >
              <Heading as="h2" size="md" mb={2}>
                Cash &amp; Carry
              </Heading>
              <Text fontSize="sm">
              Cash payments and pick-up orders get 00% off.
              </Text>
            </Box>
  
            {/* Etc Card */}
            <Box 
              p={6} 
              borderWidth="1px" 
              borderRadius="md" 
              boxShadow="sm"
            >
              <Heading as="h2" size="md" mb={2}>
                B2B
              </Heading>
              <Text fontSize="sm">
              Partner with us for a reliable and fresh meat supply, ensuring top-
              quality products for your business. We offer competitive pricing,
              consistent inventory, and tailored solutions to meet your needs.
              Let’s build a strong partnership for success in the meat industry.
              </Text>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>
    );
  };
  
  export default FAQPage;
  