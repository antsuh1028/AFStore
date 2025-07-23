import { Box, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Function to get all images for a product based on exact folder name match
const getProductImages = (productName, productStyle, maxImages = 10) => {
  if (!productName || !productStyle) {
    return ["/images/gray.avif"];
  }

  const images = [];
  const basePath = `/products/${productStyle}/${productName}`;

  // Try numbered images starting from 01, 02, 03, etc. (only .jpg)
  for (let i = 1; i <= maxImages; i++) {
    const imageNumber = String(i).padStart(2, "0"); // 01, 02, 03, etc.
    const imagePath = `${basePath}/${imageNumber}.jpg`;
    images.push(imagePath);
  }

  return images.length > 0 ? images : ["/images/gray.avif"];
};

// Function to get the primary (first) image for a product
const getPrimaryProductImage = (productName, productStyle) => {
  if (!productName || !productStyle) {
    return "/images/gray.avif";
  }

  const basePath = `/products/${productStyle}/${productName}`;
  return `${basePath}/01.jpg`;
};

export const ProductCard = ({
  id,
  name,
  type,
  description,
  price,
  brand,
  grade,
  origin,
  spec,
  avg_weight,
  style,
}) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get all possible images for this product
  const productImages = getProductImages(name, style, 5); // Try up to 5 images
  const currentImage = productImages[currentImageIndex] || "/images/gray.avif";

  const handleCardClick = () => {
    navigate(`/wholesale/product/${id}`);
  };

  const handleImageError = () => {
    // Try the next image in the list
    if (currentImageIndex < productImages.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    } else {
      setImageError(true);
    }
  };

  return (
    <Box
      borderRadius="xl"
      overflow="hidden"
      width="100%"
      bg="white"
      p={2}
      cursor="pointer"
      transition="all 0.2s ease"
      _hover={{
        transform: "translateY(-2px)",
        boxShadow: "lg",
        bg: "gray.50",
      }}
      _active={{
        transform: "translateY(0)",
        boxShadow: "md",
      }}
      onClick={handleCardClick}
      maxW="180px"
      mx="auto"
    >
      {/* Product Image */}
      <Box position="relative" height="180px">
        <Image
          src={imageError ? "/images/gray.avif" : currentImage}
          alt={name}
          borderRadius="md"
          boxSize="180px"
          objectFit="cover"
          loading="lazy"
          fallbackSrc="/images/gray.avif"
          onError={handleImageError}
        />
      </Box>
      <Box
        p={2}
        display="flex"
        flexDirection="column"
        height="calc(100% - 180px)"
      >
        {/* Product Name */}
        <Text mt={2} fontWeight="semibold" fontSize="sm" lineHeight="1.2">
          {name}
        </Text>

        <Box flex="1" />

        <Box>
          <Text fontSize="xs" color="gray.600" noOfLines={1} mt={1}>
            {spec}
          </Text>
          <Text fontWeight="bold" fontSize="sm">
            ${price}/lb
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
