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
  Collapse,
  Spinner,
  Link,
  useToast,
} from "@chakra-ui/react";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@chakra-ui/icons";
import { API_CONFIG } from "../../constants";

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
  const [expandedRequests, setExpandedRequests] = useState(new Set());
  const [userDocuments, setUserDocuments] = useState({});
  const [loadingDocuments, setLoadingDocuments] = useState({});
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [viewingDocument, setViewingDocument] = useState(null);
  const [documentViewUrl, setDocumentViewUrl] = useState(null);
  const [loadingView, setLoadingView] = useState(false);
  const [showRejected, setShowRejected] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();

  const fetchUserDocuments = async (userEmail) => {
    if (userDocuments[userEmail]) {
      return; // Already fetched
    }

    setLoadingDocuments((prev) => ({ ...prev, [userEmail]: true }));

    try {
      const encodedEmail = encodeURIComponent(userEmail);
      const res = await fetch(
        `${API_CONFIG.BASE_URL}/api/users/${encodedEmail}/documents`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setUserDocuments((prev) => ({
          ...prev,
          [userEmail]: data.documents || [],
        }));
      } else {
        console.error("Failed to fetch user documents");
        setUserDocuments((prev) => ({
          ...prev,
          [userEmail]: [],
        }));
      }
    } catch (err) {
      console.error("Error fetching user documents:", err);
      setUserDocuments((prev) => ({
        ...prev,
        [userEmail]: [],
      }));
    } finally {
      setLoadingDocuments((prev) => ({ ...prev, [userEmail]: false }));
    }
  };

  const filteredRequests =
    signupRequests?.filter((request) =>
      showRejected ? true : request.show !== false
    ) || [];

  const toggleRequestExpansion = async (request) => {
    const newExpanded = new Set(expandedRequests);

    if (newExpanded.has(request.id)) {
      newExpanded.delete(request.id);
    } else {
      newExpanded.add(request.id);
      // Fetch documents when expanding
      await fetchUserDocuments(request.email);
    }

    setExpandedRequests(newExpanded);
  };

  const viewDocument = async (
    userEmail,
    documentId,
    filename,
    documentType
  ) => {
    setLoadingView(true);
    try {
      const encodedEmail = encodeURIComponent(userEmail);
      const res = await fetch(
        `${API_CONFIG.BASE_URL}/api/users/${encodedEmail}/documents/${documentId}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setViewingDocument({
          filename,
          documentType,
          userEmail,
        });
        setDocumentViewUrl(data.downloadUrl);
        onViewOpen();
      } else {
        toast({
          title: "View Failed",
          description: "Unable to load document for viewing. Please try again.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error("Error viewing document:", err);
      toast({
        title: "View Error",
        description: "Network error while loading document.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoadingView(false);
    }
  };

  const downloadDocument = async (userEmail, documentId, filename) => {
    try {
      const encodedEmail = encodeURIComponent(userEmail);
      const res = await fetch(
        `${API_CONFIG.BASE_URL}/api/users/${encodedEmail}/documents/${documentId}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        // Open download URL in new tab
        window.open(data.downloadUrl, "_blank");
      } else {
        toast({
          title: "Download Failed",
          description: "Unable to download document. Please try again.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error("Error downloading document:", err);
      toast({
        title: "Download Error",
        description: "Network error while downloading document.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleViewClose = () => {
    onViewClose();
    setViewingDocument(null);
    setDocumentViewUrl(null);
  };

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
          description: `${request.first_name} ${request.last_name} has been approved and can now access the platform.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "User Approval Failed",
          description: "Failed to approve user. Please try again.",
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

const handleRevert = async (request) => {
  try {
    const res = await fetch(
      `${API_CONFIG.BASE_URL}/api/users/signup-requests/revert/${request.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (res.ok) {
      // Update the specific request in the list instead of removing it
      setSignupRequests((prev) =>
        prev.map((r) =>
          r.id === request.id ? { ...r, show: true } : r
        )
      );

      toast({
        title: "User Signup Request Reverted Successfully",
        description: `${request.first_name} ${request.last_name}'s rejection has been reverted.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: "User Revert Failed",
        description: "Failed to revert user. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Failed to revert user");
    }
  } catch (err) {
    console.error("Error revert user:", err);
  }
};

const handleConfirmReject = async (request, reason) => {
  try {
    const res = await fetch(
      `${API_CONFIG.BASE_URL}/api/users/reject-signup/${request.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      }
    );

    if (res.ok) {
      // Update the request to show as rejected instead of removing it
      setSignupRequests((prev) =>
        prev.map((r) =>
          r.id === request.id ? { ...r, show: false } : r
        )
      );

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

  return (
    <Box>
      <RejectModal
        isOpen={isOpen}
        onClose={onClose}
        request={selectedRequest}
        onConfirmReject={handleConfirmReject}
      />

      {/* Document Viewer Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={handleViewClose}
        size="6xl"
        isCentered
      >
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent maxW="90vw" maxH="90vh" bg="white">
          <ModalHeader>
            <VStack align="stretch" spacing={1}>
              <Text fontSize="lg" fontWeight="bold">
                Document Viewer
              </Text>
              {viewingDocument && (
                <VStack align="stretch" spacing={0}>
                  <Text fontSize="sm" color="gray.600">
                    {viewingDocument.documentType
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {viewingDocument.filename}
                  </Text>
                </VStack>
              )}
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={0}>
            {documentViewUrl ? (
              <Box
                w="100%"
                h="70vh"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="gray.50"
              >
                {viewingDocument?.filename?.toLowerCase().endsWith(".pdf") ? (
                  <iframe
                    src={documentViewUrl}
                    width="100%"
                    height="100%"
                    style={{ border: "none" }}
                    title="Document Viewer"
                  />
                ) : (
                  <img
                    src={documentViewUrl}
                    alt={viewingDocument?.filename}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                )}
              </Box>
            ) : (
              <Center h="70vh">
                <VStack>
                  <Spinner size="lg" />
                  <Text>Loading document...</Text>
                </VStack>
              </Center>
            )}
          </ModalBody>
          <ModalFooter bg="white" borderBottomRadius="md" p={4}>
            <HStack spacing={3} w="100%" justify="flex-end">
              <Button
                colorScheme="blue"
                variant="outline"
                onClick={() =>
                  downloadDocument(
                    viewingDocument?.userEmail,
                    viewingDocument?.documentId,
                    viewingDocument?.filename
                  )
                }
              >
                Download
              </Button>
              <Button colorScheme="gray" onClick={handleViewClose}>
                Close
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Box bg="white" borderRadius="2xl" p={6} boxShadow="sm" minH="700px">
        <Flex>
          <Heading size="lg" fontWeight="bold" mb={6}>
            Signup Requests
          </Heading>
          <Button
            size="xs"
            onClick={() => setShowRejected(!showRejected)}
            ml={4}
            mt={2}
            variant="outline"
          >
            {showRejected ? "Hide Rejected" : "Show Rejected"}
          </Button>
        </Flex>

        {/* Stats */}
        <Box bg="gray.50" p={4} borderRadius="lg" mb={6}>
          <Text fontSize="sm" color="gray.600">
            Total Requests
          </Text>
          <Text fontSize="2xl" fontWeight="bold">
            {filteredRequests?.length || 0}
          </Text>
        </Box>

        {/* Requests Table */}
        <Box
          overflow="auto"
          maxH="500px"
          sx={{
            "&::webkitScrollbar": {
              display: "none",
            },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {" "}
          <Table variant="simple" size="sm">
            <Thead position="sticky" top={0} bg="white" zIndex={1}>
              <Tr>
                <Th fontWeight="bold">Name</Th>
                <Th>Company</Th>
                <Th>Email</Th>
                <Th>License #</Th>
                <Th>Date</Th>
                <Th>Actions</Th>
                <Th fontWeight="bold">Expand</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredRequests?.length > 0 ? (
                filteredRequests.map((request) => (
                  <React.Fragment key={request.id}>
                    <Tr bg={request.show === false ? "gray.50" : "transparent"}>
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
                        {request.show ? (
                          <>
                            <Button
                              size="xs"
                              colorScheme="green"
                              variant="outline"
                              mr={2}
                              onClick={() => handleAccept(request)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="xs"
                              colorScheme="red"
                              variant="outline"
                              onClick={() => handleReject(request)}
                            >
                              Reject
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="xs"
                            colorScheme="red"
                            variant="outline"
                            mr={2}
                            onClick={() => handleRevert(request)}
                          >
                            Revert Rejection
                          </Button>
                        )}
                      </Td>
                      <Td>
                        <IconButton
                          size="xs"
                          variant="ghost"
                          icon={
                            expandedRequests.has(request.id) ? (
                              <ChevronUpIcon />
                            ) : (
                              <ChevronDownIcon />
                            )
                          }
                          onClick={() => toggleRequestExpansion(request)}
                          aria-label="Expand details"
                        />
                      </Td>
                    </Tr>
                    {expandedRequests.has(request.id) && (
                      <Tr>
                        <Td colSpan={7} p={0}>
                          <Collapse
                            in={expandedRequests.has(request.id)}
                            animateOpacity
                            unmountOnExit={false}
                          >
                            <Box
                              bg="gray.50"
                              p={4}
                              borderRadius="md"
                              mx={4}
                              my={2}
                            >
                              <VStack align="stretch" spacing={4}>
                                {/* User Details */}
                                <Box>
                                  <Text fontWeight="bold" mb={2}>
                                    User Details:
                                  </Text>
                                  <Grid
                                    templateColumns="repeat(2, 1fr)"
                                    gap={4}
                                  >
                                    <Box>
                                      <Text fontSize="sm" color="gray.600">
                                        Restaurant/Company:
                                      </Text>
                                      <Text fontSize="sm" fontWeight="medium">
                                        {request.company || "Not provided"}
                                      </Text>
                                    </Box>
                                    <Box>
                                      <Text fontSize="sm" color="gray.600">
                                        Phone:
                                      </Text>
                                      <Text fontSize="sm">
                                        {request.phone || "Not provided"}
                                      </Text>
                                    </Box>
                                    <Box>
                                      <Text fontSize="sm" color="gray.600">
                                        Address:
                                      </Text>
                                      <VStack align="start" spacing={0}>
                                        {request.company_address_1 && (
                                          <Text fontSize="sm">
                                            {request.company_address_1}
                                          </Text>
                                        )}
                                        {request.company_address_2 && (
                                          <Text fontSize="sm">
                                            {request.company_address_2}
                                          </Text>
                                        )}
                                        {request.company_address_3 && (
                                          <Text fontSize="sm">
                                            {request.company_address_3}
                                          </Text>
                                        )}
                                        {request.city &&
                                          request.state &&
                                          request.zip_code && (
                                            <Text fontSize="sm">
                                              {request.city}, {request.state}{" "}
                                              {request.zip_code}
                                            </Text>
                                          )}
                                        {!request.company_address_1 &&
                                          !request.company_address_2 &&
                                          !request.company_address_3 && (
                                            <Text
                                              fontSize="sm"
                                              color="gray.500"
                                            >
                                              Not provided
                                            </Text>
                                          )}
                                      </VStack>
                                    </Box>
                                    <Box>
                                      <Text fontSize="sm" color="gray.600">
                                        CA Resale:
                                      </Text>
                                      <Text fontSize="sm">
                                        {request.california_resale ||
                                          "Not provided"}
                                      </Text>
                                    </Box>
                                  </Grid>
                                </Box>

                                {/* Documents Section */}
                                <Box>
                                  <Text fontWeight="bold" mb={2}>
                                    Uploaded Documents:
                                  </Text>
                                  {loadingDocuments[request.email] ? (
                                    <Center py={4}>
                                      <Spinner size="sm" />
                                      <Text ml={2} fontSize="sm">
                                        Loading documents...
                                      </Text>
                                    </Center>
                                  ) : userDocuments[request.email]?.length >
                                    0 ? (
                                    <Grid
                                      templateColumns="repeat(auto-fit, minmax(250px, 1fr))"
                                      gap={3}
                                    >
                                      {userDocuments[request.email].map(
                                        (doc) => (
                                          <Box
                                            key={doc.id}
                                            border="1px solid"
                                            borderColor="gray.200"
                                            borderRadius="md"
                                            p={3}
                                            bg="white"
                                          >
                                            <VStack align="stretch" spacing={2}>
                                              <Text
                                                fontSize="sm"
                                                fontWeight="bold"
                                                color="blue.600"
                                              >
                                                {doc.documentType
                                                  .replace(/-/g, " ")
                                                  .replace(/\b\w/g, (l) =>
                                                    l.toUpperCase()
                                                  )}
                                              </Text>
                                              <Text
                                                fontSize="xs"
                                                color="gray.600"
                                              >
                                                {doc.originalFilename}
                                              </Text>
                                              <Text
                                                fontSize="xs"
                                                color="gray.500"
                                              >
                                                Size:{" "}
                                                {(doc.fileSize / 1024).toFixed(
                                                  1
                                                )}{" "}
                                                KB
                                              </Text>
                                              <Text
                                                fontSize="xs"
                                                color="gray.500"
                                              >
                                                Uploaded:{" "}
                                                {new Date(
                                                  doc.uploadedAt
                                                ).toLocaleDateString()}
                                              </Text>
                                              <HStack spacing={2}>
                                                <Button
                                                  size="xs"
                                                  colorScheme="green"
                                                  variant="outline"
                                                  onClick={() =>
                                                    viewDocument(
                                                      request.email,
                                                      doc.id,
                                                      doc.originalFilename,
                                                      doc.documentType
                                                    )
                                                  }
                                                  isLoading={loadingView}
                                                  loadingText="Loading..."
                                                >
                                                  View
                                                </Button>
                                                <Button
                                                  size="xs"
                                                  colorScheme="blue"
                                                  variant="outline"
                                                  onClick={() =>
                                                    downloadDocument(
                                                      request.email,
                                                      doc.id,
                                                      doc.originalFilename
                                                    )
                                                  }
                                                >
                                                  Download
                                                </Button>
                                              </HStack>
                                            </VStack>
                                          </Box>
                                        )
                                      )}
                                    </Grid>
                                  ) : (
                                    <Text fontSize="sm" color="gray.500">
                                      No documents uploaded
                                    </Text>
                                  )}
                                </Box>
                              </VStack>
                            </Box>
                          </Collapse>
                        </Td>
                      </Tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <Tr>
                  <Td colSpan={7} textAlign="center" py={8}>
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
