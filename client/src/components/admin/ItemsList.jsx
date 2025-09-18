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
  Switch,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@chakra-ui/icons";
import { API_CONFIG } from "../../constants";

export const ItemList = ({ items, setItems, token, toast }) => {
  const itemsArray = Object.values(items);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [editingItems, setEditingItems] = useState(new Set());
  const [editFormData, setEditFormData] = useState({});

  const UpdateItem = async (item) => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/items/${item.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("UpdateItem response:", data);
      if (data.success) {
        setItems((prevItems) => ({
          ...prevItems,
          [item.id]: data.data,
        }));

        toast({
          title: "Item Updated",
          description: "Product has been updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error("Error updating item:", err);
      toast({
        title: "Update Failed",
        description: "Failed to update product",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const toggleRow = (itemId) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(itemId)) {
      newExpandedRows.delete(itemId);
    } else {
      newExpandedRows.add(itemId);
    }
    setExpandedRows(newExpandedRows);
  };

  const startEditing = (item) => {
    const newEditingItems = new Set(editingItems);
    newEditingItems.add(item.id);
    setEditingItems(newEditingItems);

    // Initialize form data with current item data
    setEditFormData((prev) => ({
      ...prev,
      [item.id]: {
        ...item,
        allergens: Array.isArray(item.allergens)
          ? item.allergens.join(", ")
          : item.allergens || "",
        ingredients: Array.isArray(item.ingredients)
          ? item.ingredients.join(", ")
          : item.ingredients || "",
      },
    }));
  };

  const cancelEditing = (itemId) => {
    const newEditingItems = new Set(editingItems);
    newEditingItems.delete(itemId);
    setEditingItems(newEditingItems);

    // Remove form data for this item
    setEditFormData((prev) => {
      const newData = { ...prev };
      delete newData[itemId];
      return newData;
    });
  };

  const saveChanges = async (itemId) => {
    const formData = editFormData[itemId];
    if (!formData) return;

    // Process the form data
    const processedData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      avg_weight: parseFloat(formData.avg_weight) || 0,
      allergens: formData.allergens
        ? formData.allergens
            .split(",")
            .map((a) => a.trim())
            .filter(Boolean)
        : [],
      ingredients: formData.ingredients
        ? formData.ingredients
            .split(",")
            .map((i) => i.trim())
            .filter(Boolean)
        : [],
    };

    await UpdateItem(processedData);

    // Exit edit mode
    cancelEditing(itemId);
  };

  const updateFormField = (itemId, field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value,
      },
    }));
  };

  const renderEditableField = (item, field, type = "text", options = {}) => {
    const isEditing = editingItems.has(item.id);
    const value = isEditing ? editFormData[item.id]?.[field] : item[field];

    if (!isEditing) {
      if (field === "show") {
        return (
          <Badge
            colorScheme={item.show ? "green" : "red"}
            variant="subtle"
            borderRadius="full"
            px={3}
            py={1}
            fontSize="xs"
          >
            {item.show ? "Active" : "Hidden"}
          </Badge>
        );
      }

      // Format arrays with proper spacing
      if (field === "ingredients" || field === "allergens") {
        if (Array.isArray(value) && value.length > 0) {
          return (
            <Text fontSize="sm" color="gray.700" lineHeight="tall">
              {value.join(", ")}
            </Text>
          );
        }
        return (
          <Text fontSize="sm" color="gray.500">
            {field === "ingredients" ? "No ingredients listed" : "No allergens"}
          </Text>
        );
      }

      return (
        <Text
          fontSize="sm"
          textTransform={options.capitalize ? "capitalize" : "none"}
        >
          {field === "price" || field === "discounted_price" ? `$ ${value} / lb` : value || "N/A"}
        </Text>
      );
    }

    switch (type) {
      case "number":
        return (
          <NumberInput
            size="sm"
            value={value || ""}
            onChange={(val) => updateFormField(item.id, field, val)}
            min={0}
          >
            <NumberInputField />
          </NumberInput>
        );
      case "select":
        return (
          <Select
            size="sm"
            value={value || ""}
            onChange={(e) => updateFormField(item.id, field, e.target.value)}
          >
            {options.choices?.map((choice) => (
              <option key={choice} value={choice}>
                {choice}
              </option>
            ))}
          </Select>
        );
      case "textarea":
        return (
          <Textarea
            size="sm"
            value={value || ""}
            onChange={(e) => updateFormField(item.id, field, e.target.value)}
            rows={3}
          />
        );
      case "switch":
        return (
          <Switch
            isChecked={value}
            onChange={(e) => updateFormField(item.id, field, e.target.checked)}
          />
        );
      default:
        return (
          <Input
            size="sm"
            value={value || ""}
            onChange={(e) => updateFormField(item.id, field, e.target.value)}
          />
        );
    }
  };

  return (
    <Box
      bg="white"
      borderRadius="2xl"
      p={6}
      boxShadow="sm"
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      position="relative"
    >
      <Text fontWeight="bold" fontSize="lg" mb={4}>
        Items
      </Text>

      <Box
        maxH="60vh"
        overflowY="auto"
        w="100%"
        border="1px"
        borderColor="gray.200"
        borderRadius="md"
      >
        <Table variant="simple" size="sm">
          <Thead position="sticky" top={0} bg="white" zIndex={1}>
            <Tr>
              <Th fontSize="xs" color="gray.600" fontWeight="medium" py={2}>
                Product Name
              </Th>
              <Th fontSize="xs" color="gray.600" fontWeight="medium" py={2}>
                Discounted Price
              </Th>
              <Th fontSize="xs" color="gray.600" fontWeight="medium" py={2}>
                Price
              </Th>
              <Th fontSize="xs" color="gray.600" fontWeight="medium" py={2}>
                Brand
              </Th>
              <Th fontSize="xs" color="gray.600" fontWeight="medium" py={2}>
                Style
              </Th>
              <Th fontSize="xs" color="gray.600" fontWeight="medium" py={2}>
                Status
              </Th>
              <Th fontSize="xs" color="gray.600" fontWeight="medium" py={2}>
                Actions
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {itemsArray.length > 0 ? (
              itemsArray.map((item, index) => (
                <React.Fragment key={item.id || `item-${index}`}>
                  <Tr bg={editingItems.has(item.id) ? "blue.50" : "white"}>
                    <Td py={3} px={4} borderColor="gray.100">
                      <Text fontSize="md" fontWeight="bold">
                        {item.name}
                      </Text>
                    </Td>
                    <Td py={3} px={4} borderColor="gray.100">
                      {renderEditableField(item, "discounted_price", "number")}
                    </Td>
                    <Td py={3} px={4} borderColor="gray.100">
                      {renderEditableField(item, "price", "number")}
                    </Td>
                    <Td py={3} px={4} borderColor="gray.100">
                      {renderEditableField(item, "brand")}
                    </Td>
                    <Td py={3} px={4} borderColor="gray.100">
                      {renderEditableField(item, "style", "select", {
                        choices: ["marinated", "unprocessed", "processed", "premium"],
                      })}
                    </Td>
                    <Td py={3} px={4} borderColor="gray.100">
                      {renderEditableField(item, "show", "switch")}
                    </Td>
                    <Td py={3} px={4} borderColor="gray.100">
                      <HStack spacing={1}>
                        {editingItems.has(item.id) ? (
                          <>
                            <Button
                              size="xs"
                              colorScheme="green"
                              onClick={() => saveChanges(item.id)}
                            >
                              Save
                            </Button>
                            <Button
                              size="xs"
                              colorScheme="gray"
                              onClick={() => cancelEditing(item.id)}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="xs"
                            colorScheme="blue"
                            variant="outline"
                            onClick={() => {
                              if (!expandedRows.has(item.id)) {
                                toggleRow(item.id);
                              }
                              startEditing(item);
                            }}
                          >
                            Edit
                          </Button>
                        )}
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => toggleRow(item.id)}
                          border="none"
                          _hover={{ bg: "transparent" }}
                        >
                          {expandedRows.has(item.id) ? (
                            <ChevronUpIcon boxSize={4} />
                          ) : (
                            <ChevronDownIcon boxSize={4} />
                          )}
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>

                  {expandedRows.has(item.id) && (
                    <Tr>
                      <Td
                        colSpan={6}
                        p={6}
                        bg={editingItems.has(item.id) ? "blue.25" : "gray.50"}
                      >
                        <VStack align="stretch" spacing={4}>
                          {/* Product Details Grid */}
                          <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                            <GridItem>
                              <FormControl>
                                <FormLabel
                                  fontSize="sm"
                                  fontWeight="bold"
                                  mb={1}
                                >
                                  Species:
                                </FormLabel>
                                {renderEditableField(
                                  item,
                                  "species",
                                  "select",
                                  {
                                    choices: ["beef", "pork", "chicken"],
                                  }
                                )}
                              </FormControl>
                            </GridItem>
                            <GridItem>
                              <FormControl>
                                <FormLabel
                                  fontSize="sm"
                                  fontWeight="bold"
                                  mb={1}
                                >
                                  Origin:
                                </FormLabel>
                                {renderEditableField(item, "origin")}
                              </FormControl>
                            </GridItem>
                            <GridItem>
                              <FormControl>
                                <FormLabel
                                  fontSize="sm"
                                  fontWeight="bold"
                                  mb={1}
                                >
                                  Grade:
                                </FormLabel>
                                {renderEditableField(item, "grade")}
                              </FormControl>
                            </GridItem>
                            <GridItem>
                              <FormControl>
                                <FormLabel
                                  fontSize="sm"
                                  fontWeight="bold"
                                  mb={1}
                                >
                                  Avg Weight (lbs):
                                </FormLabel>
                                {renderEditableField(
                                  item,
                                  "avg_weight",
                                  "number"
                                )}
                              </FormControl>
                            </GridItem>
                            <GridItem>
                              <FormControl>
                                <FormLabel
                                  fontSize="sm"
                                  fontWeight="bold"
                                  mb={1}
                                >
                                  Specification:
                                </FormLabel>
                                {renderEditableField(item, "spec")}
                              </FormControl>
                            </GridItem>
                            <GridItem>
                              <FormControl>
                                <FormLabel
                                  fontSize="sm"
                                  fontWeight="bold"
                                  mb={1}
                                >
                                  Images Count:
                                </FormLabel>
                                {renderEditableField(item, "images", "number")}
                              </FormControl>
                            </GridItem>
                          </Grid>

                          {/* Description */}
                          <FormControl>
                            <FormLabel fontSize="sm" fontWeight="bold" mb={2}>
                              Description:
                            </FormLabel>
                            {renderEditableField(
                              item,
                              "description",
                              "textarea"
                            )}
                          </FormControl>

                          {/* Ingredients */}
                          <FormControl>
                            <FormLabel fontSize="sm" fontWeight="bold" mb={2}>
                              Ingredients (comma separated):
                            </FormLabel>
                            {renderEditableField(
                              item,
                              "ingredients",
                              "textarea"
                            )}
                          </FormControl>

                          {/* Allergens */}
                          <FormControl>
                            <FormLabel fontSize="sm" fontWeight="bold" mb={2}>
                              Allergens (comma separated):
                            </FormLabel>
                            {editingItems.has(item.id) ? (
                              renderEditableField(item, "allergens", "textarea")
                            ) : item.allergens && item.allergens.length > 0 ? (
                              <Wrap spacing={2}>
                                {(Array.isArray(item.allergens)
                                  ? item.allergens
                                  : [item.allergens]
                                ).map((allergen, idx) => (
                                  <WrapItem key={idx}>
                                    <Badge
                                      colorScheme="orange"
                                      variant="subtle"
                                      fontSize="xs"
                                      px={2}
                                      py={1}
                                      borderRadius="full"
                                    >
                                      {allergen}
                                    </Badge>
                                  </WrapItem>
                                ))}
                              </Wrap>
                            ) : (
                              <Text fontSize="sm" color="gray.500">
                                No allergens
                              </Text>
                            )}
                          </FormControl>
                          {!editingItems.has(item.id) && (
                            <HStack spacing={3} pt={2}>
                              <Button
                                size="sm"
                                colorScheme="blue"
                                variant="outline"
                                onClick={() => startEditing(item)}
                              >
                                Edit Product
                              </Button>
                              {/* <Button
                                size="sm"
                                colorScheme="gray"
                                variant="outline"
                              >
                                View Images ({item.images || 0})
                              </Button> */}
                              <Button
                                size="sm"
                                colorScheme={item.show ? "red" : "green"}
                                variant="outline"
                                onClick={() => {
                                  UpdateItem({ id: item.id, show: !item.show });
                                }}
                              >
                                {item.show ? "Hide Product" : "Show Product"}
                              </Button>
                            </HStack>
                          )}
                        </VStack>
                      </Td>
                    </Tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <Tr>
                <Td colSpan={6} py={8}>
                  <Center>
                    <Text color="gray.500">No products found</Text>
                  </Center>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};
