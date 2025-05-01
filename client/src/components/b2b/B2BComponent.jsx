import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Flex,
  Divider,
  List,
  ListItem,
  ListIcon,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const B2BContent = () => {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const navigate = useNavigate();

  return (
    <Box width="100%">
      {/* Header Section */}
      <Box py={4} px={6} borderColor={borderColor} bg="white" mb={4}>
        <Heading as="h1" size="md" fontWeight="semibold" textAlign="center">
          Business to Business
        </Heading>
      </Box>

      <Divider />

      {/* B2B Introduction */}
      <Box p={7}>
        <Heading as="h2" size="md" mb={4} fontWeight="semibold" mt={4}>
          B2B
        </Heading>

        <Text fontSize="sm" color="gray.600" mb={4}>
          Partner with us for a reliable supply of fresh, good-quality meat.
        </Text>

        <Text fontSize="sm" color="gray.600" mb={12}>
          We offer customized meat solutions at competitive prices, fostering
          long-term relationships with many satisfied clients.
        </Text>

        {/* Why Choose Us Section */}
        <Heading as="h3" size="md" mb={5} fontWeight="semibold">
          Why Choose Us?
        </Heading>

        <VStack spacing={8} align="stretch" mb={6}>
          {/* Feature 1 */}
          <Box borderRadius={16} p={4} bg="#f9f9f9">
            <HStack mb={2}>
              <Text textColor="#b09e8c" fontWeight="semibold" fontSize="md">
                1.
              </Text>
              <Heading as="h4" size="xs" fontWeight="semibold">
                Fresh, Good-Quality Products
              </Heading>
            </HStack>
            <Text fontSize="sm" color="gray.600" mt={3}>
              We provide only the freshest, high-quality meat sourced with care.
              Our strict handling and storage standards ensure safety,
              freshness, and taste in every order.
            </Text>
          </Box>

          {/* Feature 2 */}
          <Box borderRadius={16} p={4} bg="#f9f9f9">
            <HStack mb={2}>
              <Text textColor="#b09e8c" fontWeight="semibold" fontSize="md">
                2.
              </Text>
              <Heading as="h4" size="xs" fontWeight="semibold">
                Tailored Solutions
              </Heading>
            </HStack>
            <Text fontSize="sm" color="gray.600" mt={3}>
              Your business is unique — and so are your needs. We offer
              customized meat cuts, packaging, and ordering options to match
              your exact requirements.
            </Text>
          </Box>

          {/* Feature 3 */}
          <Box borderRadius={16} p={4} bg="#f9f9f9">
            <HStack mb={2}>
              <Text textColor="#b09e8c" fontWeight="semibold" fontSize="md">
                3.
              </Text>
              <Heading as="h4" size="xs" fontWeight="semibold">
                Competitive Pricing
              </Heading>
            </HStack>
            <Text fontSize="sm" color="gray.600" mt={3}>
              We offer fair and competitive wholesale prices without
              compromising on quality. Our pricing structure is designed to
              support your bottom line.
            </Text>
          </Box>

          {/* Feature 4 */}
          <Box borderRadius={16} p={4} bg="#f9f9f9">
            <HStack mb={2}>
              <Text textColor="#b09e8c" fontWeight="semibold" fontSize="md">
                4.
              </Text>
              <Heading as="h4" size="xs" fontWeight="semibold">
                Excellent Customer Service
              </Heading>
            </HStack>
            <Text fontSize="sm" color="gray.600" mt={3}>
              Our responsive support team is here to assist you, whether you
              have questions, need assistance with orders, or require special
              arrangements.
            </Text>
          </Box>

          {/* Feature 5 */}
          <Box borderRadius={16} p={4} bg="#f9f9f9">
            <HStack mb={2}>
              <Text textColor="#b09e8c" fontWeight="semibold" fontSize="md">
                5.
              </Text>
              <Heading as="h4" size="xs" fontWeight="semibold">
                Flexibility in Order Sizes
              </Heading>
            </HStack>
            <Text fontSize="sm" color="gray.600" mt={3}>
              Whether you run a small kitchen or a large-scale operation, we
              customize order volumes to meet your scale and schedule.
            </Text>
          </Box>

          {/* Feature 6 */}
          <Box borderRadius={16} p={4} bg="#f9f9f9">
            <HStack mb={2}>
              <Text textColor="#b09e8c" fontWeight="semibold" fontSize="md">
                6.
              </Text>
              <Heading as="h4" size="xs" fontWeight="semibold">
                Quality Control & Certification
              </Heading>
            </HStack>
            <Text fontSize="sm" color="gray.600" mt={3}>
              All our meat products undergo strict quality control and are
              certified to meet local safety and industry standards. You can
              trust what you serve to your customers.
            </Text>
          </Box>

          {/* Feature 7 */}
          <Box borderRadius={16} p={4} bg="#f9f9f9">
            <HStack mb={2}>
              <Text textColor="#b09e8c" fontWeight="semibold" fontSize="md">
                7.
              </Text>
              <Heading as="h4" size="xs" fontWeight="semibold">
                Long-term Partnerships
              </Heading>
            </HStack>
            <Text fontSize="sm" color="gray.600" mt={3}>
              We're not just a supplier; we're a reliable business partner. We
              aim to build long-lasting relationships based on trust,
              consistency, and mutual success.
            </Text>
          </Box>
        </VStack>

        {/* Contact Button */}
        <Box display="flex" justifyContent="center" mt={8} mb={6}>
          <Button
            as="button"
            bg="#494949"
            color="white"
            py={3}
            px={6}
            borderRadius={24}
            fontWeight="medium"
            _hover={{ bg: "gray.800" }}
            width="90%"
            onClick={() => navigate("/contact")}
            fontSize="sm"
          >
            GO TO CONTACT US
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default B2BContent;
