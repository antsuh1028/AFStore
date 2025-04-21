import {
  Box,
  Container,
  Heading,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Grid,
  GridItem,
  Divider,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";

const FAQPage = () => {
  return (
    <Box bg="white">
      <Container maxW="container.xl" px={{ base: 4, md: 8 }} pt={8} pb={20}>
        {/* Breadcrumbs Navigation */}
        <Breadcrumb
          spacing="8px"
          separator={<ChevronRightIcon color="gray.500" />}
          mb={6}
          fontSize={{ base: "sm", md: "md" }}
        >
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href="/wholesale-info">Wholesale Info</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="#" fontWeight="semibold">
              FAQ
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Main FAQ Heading */}
        <Heading
          as="h1"
          fontSize={{ base: "3xl", md: "4xl" }}
          fontWeight="bold"
          mb={4}
          pl={{ base: 0, md: 4 }}
        >
          FAQ
        </Heading>

        {/* Horizontal Divider */}
        <Divider mb={10} borderColor="gray.300" />

        {/* FAQ Cards in Grid Layout */}
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
          gap={{ base: 8, md: 10 }}
          mx="auto"
          maxW="1000px"
        >
          {/* Delivery Card */}
          <GridItem>
            <Box>
              <Box bg="gray.100" borderRadius="lg" py={3} mb={5}>
                <Heading
                  as="h2"
                  size="md"
                  textAlign="center"
                >
                  Delivery
                </Heading>
              </Box>
              <Box px={3}>
                <Text fontSize="sm" lineHeight="1.8">
                  Orders above the minimum amount qualify for free delivery within Los Angeles. For orders below the minimum, a delivery fee applies. Alternatively, pickup is available at the address below.
                </Text>
                <Text fontSize="sm" mt={4} fontWeight="medium">
                  1805 Industrial St, Los Angeles, CA 90021
                </Text>
              </Box>
            </Box>
          </GridItem>

          {/* Refund Card */}
          <GridItem>
            <Box>
              <Box bg="gray.100" borderRadius="lg" py={3} mb={5}>
                <Heading
                  as="h2"
                  size="md"
                  textAlign="center"
                >
                  Refund
                </Heading>
              </Box>
              <Box px={3}>
                <Text fontSize="sm" lineHeight="1.8">
                  Exchanges are allowed within 24 hours if there's an issue with the product. Please provide a photo of the product if there is a defect.
                </Text>
                <Text color="red.500" fontSize="sm" mt={4} fontWeight="semibold">
                  Exchanges/returns are not possible in these cases:
                </Text>
                <Text fontSize="sm" lineHeight="1.8" mt={2}>
                  - Damage or value reduction due to buyer's actions
                  <br />
                  - Value decrease from use or consumption
                  <br />
                  - If the product's value decreases due to improper storage
                  <br />
                  - Buyer's change of mind, address errors, or loss of contact (except for product defects).
                </Text>
              </Box>
            </Box>
          </GridItem>

          {/* Bulk Purchase Card */}
          <GridItem>
            <Box>
              <Box bg="gray.100" borderRadius="lg" py={3} mb={5}>
                <Heading
                  as="h2"
                  size="md"
                  textAlign="center"
                >
                  Bulk Purchase
                </Heading>
              </Box>
              <Box px={3}>
                <Text fontSize="sm" lineHeight="1.8">
                  Get a 00% discount on bulk orders over $500.
                </Text>
              </Box>
            </Box>
          </GridItem>

          {/* Cash & Carry Card */}
          <GridItem>
            <Box>
              <Box bg="gray.100" borderRadius="lg" py={3} mb={5}>
                <Heading
                  as="h2"
                  size="md"
                  textAlign="center"
                >
                  Cash & Carry
                </Heading>
              </Box>
              <Box px={3}>
                <Text fontSize="sm" lineHeight="1.8">
                  Cash payments and pick-up orders get 00% off.
                </Text>
              </Box>
            </Box>
          </GridItem>

          {/* B2B Card */}
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <Box py={24}>
              <Box bg="gray.100" borderRadius="lg" py={3} mb={5}>
                <Heading
                  as="h2"
                  size="md"
                  textAlign="center"
                >
                  B2B
                </Heading>
              </Box>
              <Box px={3}>
                <Text fontSize="sm" lineHeight="1.8">
                  Partner with us for a reliable and fresh meat supply, ensuring top-quality products for your business. We offer competitive pricing, consistent inventory, and tailored solutions to meet your needs. Let's build a strong partnership for success in the meat industry.
                </Text>
              </Box>
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default FAQPage;

// import {
//   Box,
//   Container,
//   Heading,
//   SimpleGrid,
//   Text,
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
// } from "@chakra-ui/react";
// import { ChevronRightIcon } from "@chakra-ui/icons";


// const FAQPage = () => {
//   return (
//     <Box py={{ base: 8, md: 12 }} bg="white">
//       <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
//         {/* Reduced the vertical padding at the top */}
//         <Breadcrumb
//           spacing="8px"
//           separator={<ChevronRightIcon color="gray.500" />}
//           mb={8}
//           fontSize={{ base: "sm", md: "md" }}
//           mt={{ base: 4, md: 6 }}
//         >
//           <BreadcrumbItem>
//             <BreadcrumbLink href="/">Home</BreadcrumbLink>
//           </BreadcrumbItem>

//           <BreadcrumbItem>
//             <BreadcrumbLink>Wholesale Info</BreadcrumbLink>
//           </BreadcrumbItem>

//           <BreadcrumbItem isCurrentPage>
//             <BreadcrumbLink href="#" fontWeight="semibold">
//               FAQ
//             </BreadcrumbLink>
//           </BreadcrumbItem>
//         </Breadcrumb>

//         <Heading
//           textAlign="center"
//           fontSize={{ base: "2xl", md: "3xl" }}
//           fontFamily="serif"
//           fontWeight="bold"
//           mb={{ base: 8, md: 12 }}
//           color="#000"
//         >
//           FAQ
//         </Heading>

//         <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 6, md: 8 }} mb={{ base: 6, md: 8 }}>
//           <Box p={{ base: 4, md: 6 }} borderWidth="1px" borderRadius="md" boxShadow="sm">
//             <Heading as="h2" size="md" mb={3}>
//               Delivery
//             </Heading>
//             <Text fontSize="sm" lineHeight="1.6">
//               Orders above the minimum amount qualify for free delivery within
//               Los Angeles. For orders below the minimum, a delivery fee applies.
//               Alternatively, pickup is available at the address below.
//               <br /><br />
//               1805 Industrial St, Los Angeles, CA 90021
//             </Text>
//           </Box>

//           {/* Refund Card */}
//           <Box p={{ base: 4, md: 6 }} borderWidth="1px" borderRadius="md" boxShadow="sm">
//             <Heading as="h2" size="md" mb={3}>
//               Refund
//             </Heading>
//             <Text fontSize="sm" lineHeight="1.6">
//               Exchanges are allowed within 24 hours if there's an issue with the
//               product. Please provide a photo of the product if there is a
//               defect.
//               <br />
//               <br />
//               <Text as="span" color="red.500" fontWeight="bold">
//                 Exchanges/returns are NOT possible in these cases:
//               </Text>
//               <br />
//               - Damage or value reduction due to buyer's actions
//               <br />
//               - Value decrease from use or consumption
//               <br />
//               - If the product's value decreases due to improper storage
//               <br />
//               - Buyer's change of mind, address errors, or loss of contact
//               (except for product defects).
//             </Text>
//           </Box>

//           {/* Bulk Purchase Card */}
//           <Box p={{ base: 4, md: 6 }} borderWidth="1px" borderRadius="md" boxShadow="sm">
//             <Heading as="h2" size="md" mb={3}>
//               Bulk Purchase
//             </Heading>
//             <Text fontSize="sm" lineHeight="1.6">
//               Get a 00% discount on bulk orders over $500.
//             </Text>
//           </Box>
//         </SimpleGrid>

//         {/* Second Row: 2 Cards */}
//         <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 6, md: 8 }} mb={{ base: 8, md: 12 }}>
//           {/* Cash & Carry Card */}
//           <Box p={{ base: 4, md: 6 }} borderWidth="1px" borderRadius="md" boxShadow="sm">
//             <Heading as="h2" size="md" mb={3}>
//               Cash &amp; Carry
//             </Heading>
//             <Text fontSize="sm" lineHeight="1.6">
//               Cash payments and pick-up orders get 00% off.
//             </Text>
//           </Box>

//           {/* B2B Card */}
//           <Box p={{ base: 4, md: 6 }} borderWidth="1px" borderRadius="md" boxShadow="sm">
//             <Heading as="h2" size="md" mb={3}>
//               B2B
//             </Heading>
//             <Text fontSize="sm" lineHeight="1.6">
//               Partner with us for a reliable and fresh meat supply, ensuring
//               top-quality products for your business. We offer competitive
//               pricing, consistent inventory, and tailored solutions to meet your
//               needs. Let's build a strong partnership for success in the meat
//               industry.
//             </Text>
//           </Box>
//         </SimpleGrid>
//       </Container>
//     </Box>
//   );
// };

// export default FAQPage;