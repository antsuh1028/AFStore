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

const InquiryResponseModal = ({
  isOpen,
  onClose,
  request,
  onConfirmReject,
}) => {
  const [rejectReason, setRejectReason] = useState("");

  //TODO: Email Rejection with message

  const handleConfirm = () => {
    onConfirmReject(request, rejectReason);
    setRejectReason("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Reject Signup Request</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={4}>
            Are you sure you want to reject the signup request from{" "}
            <Text as="span" fontWeight="bold">
              {request?.first_name} {request?.last_name}
            </Text>
            ?
          </Text>
          <Text mb={2} fontSize="sm" fontWeight="bold">
            Reason for rejection (optional):
          </Text>
          <Textarea
            placeholder="Enter reason for rejection..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={handleConfirm}>
            Confirm Reject
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const RejectModal = ({ isOpen, onClose, request, onConfirmReject }) => {
  const [rejectReason, setRejectReason] = useState("");

  //TODO: Email Rejection with message

  const handleConfirm = () => {
    onConfirmReject(request, rejectReason);
    setRejectReason("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Reject Signup Request</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={4}>
            Are you sure you want to reject the signup request from{" "}
            <Text as="span" fontWeight="bold">
              {request?.first_name} {request?.last_name}
            </Text>
            ?
          </Text>
          <Text mb={2} fontSize="sm" fontWeight="bold">
            Reason for rejection (optional):
          </Text>
          <Textarea
            placeholder="Enter reason for rejection..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={handleConfirm}>
            Confirm Reject
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const Signups = ({
  signupRequests,
  token,
  setSignupRequests,
  toast,
}) => {
  const [expandedInquiries, setExpandedInquiries] = useState(new Set());
  const [selectedRequest, setSelectedRequest] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleAccept = async (request) => {
    try {
      const res = await fetch(
        `${API_CONFIG.BASE_URL}/api/users/approve-signup/${request.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.ok) {
        setSignupRequests((prev) => prev.filter((r) => r.id !== request.id));

        toast({
          title: "User Approved Successfully",
          description: `${request.first_name} ${request.last_name} has been approved and added to the system.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "User Approval Failed",
          description: `${request.first_name} ${request.last_name}'s email is already in the system`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        console.error("Failed to approve user");
      }
    } catch (err) {
      console.error("Error approving user:", err);
    }
  };

  const handleReject = (request) => {
    setSelectedRequest(request);
    onOpen();
  };

  const handleConfirmReject = async (request, reason) => {
    try {
      const res = await fetch(
        `${API_CONFIG.BASE_URL}/api/users/signup-requests/${request.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason }),
        }
      );

      if (res.ok) {
        setSignupRequests((prev) => prev.filter((r) => r.id !== request.id));

        toast({
          title: "Request Rejected",
          description: `Signup request from ${request.first_name} ${request.last_name} has been rejected.`,
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      } else {
        const errorData = await res
          .json()
          .catch(() => ({ error: "Unknown error" }));

        toast({
          title: "Failed to Reject Request",
          description:
            errorData.error ||
            errorData.message ||
            "An unexpected error occurred",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });

        console.error("Failed to reject request:", errorData);
      }
    } catch (err) {
      toast({
        title: "Error Rejecting Request",
        description:
          "Network error or server is unavailable. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });

      console.error("Error rejecting request:", err);
    }
  };

  const toggleInquiry = (inquiryId) => {
    const newExpanded = new Set(expandedInquiries);
    if (newExpanded.has(inquiryId)) {
      newExpanded.delete(inquiryId);
    } else {
      newExpanded.add(inquiryId);
    }
    setExpandedInquiries(newExpanded);
  };

  const handleRespondInquiry = (inquiry) => {
    // Implement respond to inquiry logic
    console.log("Responding to inquiry:", inquiry);
  };

  return (
    <Box>
      <RejectModal
        isOpen={isOpen}
        onClose={onClose}
        request={selectedRequest}
        onConfirmReject={handleConfirmReject}
      />

      <Box bg="white" borderRadius="2xl" p={6} boxShadow="sm" minH="500px">
        <Heading size="lg" fontWeight="bold" mb={6}>
          Signup Requests
        </Heading>

        {/* Stats */}
        <Box bg="gray.50" p={4} borderRadius="lg" mb={6}>
          <Text fontSize="sm" color="gray.600">
            Total Requests
          </Text>
          <Text fontSize="2xl" fontWeight="bold">
            {signupRequests?.length || 0}
          </Text>
        </Box>

        {/* Requests Table */}
        <Box overflow="auto" maxH="400px">
          <Table variant="simple" size="sm">
            <Thead position="sticky" top={0} bg="white" zIndex={1}>
              <Tr>
                <Th fontWeight="bold">Name</Th>
                <Th>Company</Th>
                <Th>Email</Th>
                <Th>License #</Th>
                <Th>Date</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {signupRequests?.length > 0 ? (
                signupRequests.map((request) => (
                  <Tr key={request.id}>
                    <Td fontWeight="bold">
                      {request.first_name} {request.last_name}
                    </Td>
                    <Td>{request.company}</Td>
                    <Td>{request.email}</Td>
                    <Td>{request.license_number}</Td>
                    <Td>
                      {request.timestamp
                        ? new Date(request.timestamp).toLocaleDateString()
                        : "N/A"}
                    </Td>
                    <Td>
                      <Button
                        size="xs"
                        colorScheme="green"
                        mr={2}
                        onClick={() => handleAccept(request)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="xs"
                        colorScheme="red"
                        onClick={() => handleReject(request)}
                      >
                        Reject
                      </Button>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={6} textAlign="center" py={8}>
                    <Text color="gray.500">No signup requests found</Text>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
};
