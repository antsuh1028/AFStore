import { Box, Image, Text } from "@chakra-ui/react";

export const ProductCard = ({
  id,
  name,
  type,
  description,
  images,
  price,
  brand,
  grade,
  origin,
  spec,
  avg_weight,
  style,
}) => {
  const placeholderImage = "https://via.placeholder.com/200x150?text=No+Image";
  return (
    <Box
      borderRadius="xl"
      overflow="hidden"
      boxShadow="md"
      width="100%"
      bg="white"
      p={2}
    >
      {/* Product Image */}
      <Image
        src={images?.[0] || placeholderImage}
        alt={name}
        borderRadius="md"
        width="100%"
        height="auto"
        objectFit="cover"
      />

      {/* Product Name */}
      <Text mt={2} fontWeight="semibold" fontSize="sm" noOfLines={2}>
        {name}
      </Text>

      {/* Specs (e.g., "30 lb – 5 lb × 6 packs") */}
      <Text fontSize="xs" color="gray.600">
        {spec}
      </Text>

      {/* Price */}
      <Text mt={1} fontWeight="bold">
        ${price}
      </Text>
    </Box>
  );
};
