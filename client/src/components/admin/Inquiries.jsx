import React, { useState, useMemo, useEffect } from "react";
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
import { inquiryResponseTemplate } from "../../constants/emailResponse";

const ResponseModal = ({ inquiryData = {}, isOpen, onClose, onEmailSent }) => {
  const toast = useToast();

  const handleEmailSend = async () => {
    try {
      if (!inquiryData.to_email) {
        throw new Error("Recipient email is missing");
      }

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/email/send-inquiry-response`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: inquiryData.to_email,
            customerName: inquiryData.customerName,
            responseMessage: inquiryData.responseMessage,
            responseType: "inquiry",
            originalMessage: inquiryData.originalMessage,
            companyName: inquiryData.companyName,
            inquiryDate: inquiryData.inquiryDate,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      toast({
        title: "Response Sent!",
        description: `Your response has been sent to ${inquiryData.to_email}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      onEmailSent?.();
      onClose();
    } catch (error) {
      console.error("Failed to send response:", error);
      toast({
        title: "Failed to Send",
        description:
          error.message ||
          "There was an error sending your response. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const generatePreview = () => {
    let preview = inquiryResponseTemplate;

    preview = preview.replace(
      /{{customerName}}/g,
      inquiryData.customerName || ""
    );
    preview = preview.replace(
      /{{responseMessage}}/g,
      inquiryData.responseMessage || ""
    );
    preview = preview.replace(
      /{{originalMessage}}/g,
      inquiryData.originalMessage || ""
    );
    preview = preview.replace(
      /{{companyName}}/g,
      inquiryData.companyName || ""
    );
    preview = preview.replace(
      /{{inquiryDate}}/g,
      inquiryData.inquiryDate || ""
    );

    return preview;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Email Preview</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div dangerouslySetInnerHTML={{ __html: generatePreview() }} />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleEmailSend}>
            Send Email
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const Inquiries = ({ inquiries = {}, setInquiries }) => {
  const [expandedInquiries, setExpandedInquiries] = useState(new Set());
  const [responses, setResponses] = useState({});
  const [inquiryData, setInquiryData] = useState({});
  const [statusFilter, setStatusFilter] = useState("all");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const filteredInquiries = useMemo(() => {
    if (statusFilter === "all") return inquiries;
    return inquiries.filter((inquiry) => inquiry.status === statusFilter);
  }, [inquiries, statusFilter]);

  const inquiryCounts = useMemo(() => {
    const counts = {
      all: inquiries.length,
      resolved: inquiries.filter((i) => i.status === "resolved").length,
      unresolved: inquiries.filter((i) => i.status === "unresolved").length,
    };
    return counts;
  }, [inquiries]);

  const toggleInquiry = (inquiryId) => {
    setExpandedInquiries((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(inquiryId)) {
        newExpanded.delete(inquiryId);
      } else {
        newExpanded.add(inquiryId);
      }
      return newExpanded;
    });
  };

  const updateInquiryStatus = async (inquiryId) => {
    try {
      const url = `${API_CONFIG.BASE_URL}/api/inquiries/${inquiryId}/status`;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const result = await response.json();
      const updatedStatus = result.data.status;

      setInquiries((prevInquiries) =>
        prevInquiries.map((inquiry) =>
          inquiry.id === inquiryId
            ? { ...inquiry, status: updatedStatus }
            : inquiry
        )
      );

      toast({
        title: "Status Updated",
        description: `Inquiry marked as ${updatedStatus}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to update inquiry status:", error);
      toast({
        title: "Error",
        description: "Failed to update inquiry status",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRespondInquiry = async (inquiry, message) => {
    if (!message.trim()) {
      toast({
        title: "Response Required",
        description: "Please enter a response message before sending.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const emailData = {
      to_email: inquiry.email,
      to_name: inquiry.name,

      customerName: inquiry.name,
      companyName: inquiry.company || "Not specified",
      responseMessage: message.trim(),
      originalMessage: inquiry.message || "No message provided",
      inquiryDate: inquiry.timestamp
        ? new Date(inquiry.timestamp).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "Not available",

      phone: inquiry.phone || "Not provided",
      licenseNumber: inquiry.license_number || "Not provided",
      californiaResale: inquiry.california_resale || "Not provided",

      responseType: "inquiry",
      showReference: true,

      inquiryId: inquiry.id,
      responseDate: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    setInquiryData(emailData);
    onOpen();
  };

  const handleEmailSent = () => {
    setResponses((prev) => ({
      ...prev,
      [inquiryData.id]: "",
    }));
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "resolved":
        return "green";
      case "unresolved":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <Box bg="white" borderRadius="2xl" p={6} boxShadow="sm" minH="600px" mt={8}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" fontWeight="bold">
          Inquiries - {filteredInquiries.length}
        </Heading>

        <HStack spacing={4}>
          <Text fontSize="sm" color="gray.600">
            Filter by status:
          </Text>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            size="sm"
            w="200px"
          >
            <option value="all">All ({inquiryCounts.all})</option>
            <option value="unresolved">
              Unresolved ({inquiryCounts.unresolved})
            </option>
            <option value="resolved">
              Resolved ({inquiryCounts.resolved})
            </option>
          </Select>
        </HStack>
      </Flex>

      <Box overflow="auto" maxH="600px">
        <Table variant="simple" size="sm">
          <Thead position="sticky" top={0} bg="white" zIndex={1}>
            <Tr>
              <Th fontWeight="bold">Status</Th>
              <Th fontWeight="bold">Name</Th>
              <Th>Company</Th>
              <Th>Email</Th>
              <Th>License #</Th>
              <Th>CA Resale</Th>
              <Th>Date</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredInquiries?.length > 0 ? (
              filteredInquiries.map((inquiry) => (
                <React.Fragment key={inquiry.id}>
                  <Tr>
                    <Td>
                      <Badge
                        colorScheme={getStatusBadgeColor(inquiry.status)}
                        variant="subtle"
                        fontSize="xs"
                      >
                        {inquiry.status || "unresolved"}
                      </Badge>
                    </Td>
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
                      <HStack spacing={2}>
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => toggleInquiry(inquiry.id)}
                          border="none"
                          _hover={{ bg: "transparent" }}
                        >
                          {expandedInquiries.has(inquiry.id) ? (
                            <ChevronUpIcon boxSize={6} />
                          ) : (
                            <ChevronDownIcon boxSize={6} />
                          )}
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                  {expandedInquiries.has(inquiry.id) && (
                    <Tr>
                      <Td colSpan={8} p={4}>
                        <Flex gap={6}>
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

                          <Box w="60%">
                            <VStack align="stretch" spacing={4}>
                              <Box>
                                <Text fontSize="sm" fontWeight="bold" mb={2}>
                                  Message:
                                </Text>
                                <Text
                                  fontSize="sm"
                                  bg="gray.50"
                                  p={3}
                                  borderRadius="md"
                                  border="1px solid"
                                  borderColor="gray.200"
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
                                  colorScheme="blue"
                                  mt={3}
                                  onClick={() =>
                                    handleRespondInquiry(
                                      inquiry,
                                      responses[inquiry.id] || ""
                                    )
                                  }
                                >
                                  Send Email
                                </Button>
                                <Button
                                  size="sm"
                                  mt={3}
                                  ml={2}
                                  colorScheme={
                                    inquiry.status === "resolved"
                                      ? "green"
                                      : "red"
                                  }
                                  variant="outline"
                                  onClick={() =>
                                    updateInquiryStatus(inquiry.id)
                                  }
                                >
                                  Mark{" "}
                                  {inquiry.status === "resolved"
                                    ? "Unresolved"
                                    : "Resolved"}
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
                <Td colSpan={8} textAlign="center" py={8}>
                  <Text color="gray.500">
                    {statusFilter === "all"
                      ? "No inquiries found"
                      : `No ${statusFilter} inquiries found`}
                  </Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
        <ResponseModal
          inquiryData={inquiryData}
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          onEmailSent={handleEmailSent}
        />
      </Box>
    </Box>
  );
};
