import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Heading,
  SimpleGrid,
  Button,
  IconButton,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  HStack,
  Divider,
  Grid,
  GridItem,
  Wrap,
  WrapItem,
  Select,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
  Textarea,
  Input,
  Center,
} from "@chakra-ui/react";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@chakra-ui/icons";
import { API_CONFIG } from "../../constants";
import { useToast } from "@chakra-ui/react";
// import { ChevronUpIcon } from "lucide-react";


export const Inquiries = ({ inquiries }) => {
  const [expandedInquiries, setExpandedInquiries] = useState(new Set());
  const [responses, setResponses] = useState({});
  const toggleInquiry = (inquiryId) => {
    const newExpanded = new Set(expandedInquiries);
    if (newExpanded.has(inquiryId)) {
      newExpanded.delete(inquiryId);
    } else {
      newExpanded.add(inquiryId);
    }
    setExpandedInquiries(newExpanded);
  };

  const handleRespondInquiry = (inquiry, message) => {
    // TODO SEND EMAIL THROUGH EMAILJS
    console.log("Responding to inquiry:", inquiry);
    console.log("Message:", message);
  };
  return (
    <Box bg="white" borderRadius="2xl" p={6} boxShadow="sm" minH="600px" mt={8}>
      <Heading size="lg" fontWeight="bold" mb={6}>
        Inquiries - {inquiries.length}
      </Heading>
      <Box overflow="auto" maxH="600px">
        <Table variant="simple" size="sm">
          <Thead position="sticky" top={0} bg="white" zIndex={1}>
            <Tr>
              <Th fontWeight="bold">Name</Th>
              <Th>Company</Th>
              <Th>Email</Th>
              <Th>License #</Th>
              <Th>CA Resale</Th>
              <Th>Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {inquiries?.length > 0 ? (
              inquiries.map((inquiry) => (
                <React.Fragment key={inquiry.id}>
                  <Tr>
                    <Td fontWeight="bold">{inquiry.name}</Td>
                    <Td>{inquiry.company}</Td>
                    <Td>{inquiry.email}</Td>
                    <Td>{inquiry.license_number}</Td>
                    <Td>{inquiry.california_resale}</Td>
                    <Td>
                      {inquiry.timestamp
                        ? new Date(inquiry.timestamp).toLocaleDateString()
                        : "N/A"}
                    </Td>
                    <Td>
                      <Button
                        size="xs"
                        variant="outline"
                        mr={2}
                        onClick={() => toggleInquiry(inquiry.id)}
                        border="none"
                        _hover={{ bg: "transparent" }}
                      >
                        {expandedInquiries.has(inquiry.id) ? (
                          <ChevronUpIcon boxSize={8} />
                        ) : (
                          <ChevronDownIcon boxSize={8} />
                        )}
                      </Button>
                    </Td>
                  </Tr>
                  {expandedInquiries.has(inquiry.id) && (
                    <Tr>
                      <Td colSpan={7} p={4}>
                        <Flex gap={6}>
                          {/* Left - Contact Info */}
                          <Box w="25%">
                            <VStack align="start" spacing={3}>
                              <Box>
                                <Text fontSize="sm" fontWeight="bold" mb={2}>
                                  Phone:
                                </Text>
                                <Text fontSize="sm" ml={1}>
                                  {inquiry.phone}
                                </Text>
                              </Box>
                              <Box>
                                <Text fontSize="sm" fontWeight="bold" mb={2}>
                                  Address:
                                </Text>
                                <Text fontSize="sm" ml={1}>
                                  {inquiry.company_address_1}
                                  {inquiry.company_address_2 &&
                                    `, ${inquiry.company_address_2}`}
                                  <br />
                                  {inquiry.city}, {inquiry.state}{" "}
                                  {inquiry.zip_code}
                                </Text>
                              </Box>
                            </VStack>
                          </Box>

                          {/* Right - Message & Response */}
                          <Box w="60%">
                            <VStack align="stretch" spacing={4}>
                              <Box>
                                <Text fontSize="sm" fontWeight="bold" mb={2}>
                                  Message:
                                </Text>
                                <Text
                                  fontSize="sm"
                                  bg="white"
                                  p={3}
                                  borderRadius="md"
                                >
                                  {inquiry.message}
                                </Text>
                              </Box>
                              <Box>
                                <Text fontSize="sm" fontWeight="bold" mb={2}>
                                  Response:
                                </Text>
                                <Textarea
                                  name="response"
                                  fontSize="sm"
                                  bg="white"
                                  placeholder="Type your response..."
                                  rows={4}
                                  value={responses[inquiry.id] || ""}
                                  onChange={(e) =>
                                    setResponses((prev) => ({
                                      ...prev,
                                      [inquiry.id]: e.target.value,
                                    }))
                                  }
                                />
                                <Button
                                  size="sm"
                                  my={4}
                                  onClick={() =>
                                    handleRespondInquiry(
                                      inquiry,
                                      responses[inquiry.id] || ""
                                    )
                                  }
                                >
                                  Send Email
                                </Button>
                              </Box>
                            </VStack>
                          </Box>
                        </Flex>
                      </Td>
                    </Tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <Tr>
                <Td colSpan={7} textAlign="center" py={8}>
                  <Text color="gray.500">No inquiries found</Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};
