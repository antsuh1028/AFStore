import React, { useState, useEffect, useMemo } from "react";
import { Box, Image, Text, Skeleton } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuth";

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
  discounted_price,
}) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState("/images/gray.avif");
  const [imageError, setImageError] = useState(false);
  const { isAuthenticated } = useAuthContext();

  const specs = {
    "30 lb - 5 lb x 6 packs": "/ 30 lb box",
    "20 lb - 10 lb x 2 packs": "/ 20 lb box",
    "50 lb - 50 lb x 1 box": "/ 50 lb box",
    "C.W. (Catch Weights)": "/ ~ 35 lb box",
    
  };

  // Generate image paths for this product
  const imagePaths = useMemo(() => {
    if (!name || !style) {
      return { avif: "/images/gray.avif", jpg: "/images/gray.avif" };
    }

    const basePath = `/products/${style}/${name}`;
    return {
      avif: `${basePath}/01.avif`,
      jpg: `${basePath}/01.jpg`,
    };
  }, [name, style]);

  // Smart image loading with fallback
  useEffect(() => {
    if (!name || !style) {
      setImageSrc("/images/gray.avif");
      setImageLoaded(true);
      return;
    }

    setImageLoaded(false);
    setImageError(false);

    const loadImage = () => {
      // Try AVIF first
      const avifImg = document.createElement("img");

      avifImg.onload = () => {
        setImageSrc(imagePaths.avif);
        setImageLoaded(true);
      };

      avifImg.onerror = () => {
        // AVIF failed, try JPG
        const jpgImg = document.createElement("img");

        jpgImg.onload = () => {
          setImageSrc(imagePaths.jpg);
          setImageLoaded(true);
        };

        jpgImg.onerror = () => {
          // Both failed, use gray placeholder
          setImageSrc("/images/gray.avif");
          setImageError(true);
          setImageLoaded(true);
        };

        jpgImg.src = imagePaths.jpg;
      };

      avifImg.src = imagePaths.avif;
    };

    loadImage();
  }, [imagePaths]);

  const handleCardClick = () => {
    navigate(`/wholesale/product/${id}`);
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
      <Box position="relative" height="180px" bg="gray.100" borderRadius="md">
        {!imageLoaded && (
          <Skeleton
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            borderRadius="md"
          />
        )}

        <Image
          src={imageSrc}
          alt={name}
          borderRadius="md"
          boxSize="180px"
          objectFit="cover"
          loading="lazy"
          opacity={imageLoaded ? 1 : 0}
          transition="opacity 0.3s ease"
          fallbackSrc="/images/gray.avif"
          onLoad={() => setImageLoaded(true)}
        />

        {/* Image status indicator */}
        {imageError && imageLoaded && (
          <Box
            position="absolute"
            top="2"
            right="2"
            bg="blackAlpha.600"
            color="white"
            px={2}
            py={1}
            borderRadius="md"
            fontSize="xs"
          >
            📷
          </Box>
        )}
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
          {isAuthenticated ? (
            <Text fontWeight="bold" fontSize="sm">
              ${discounted_price}{specs[spec]}
            </Text>
          ) : (
            <Text fontWeight="bold" fontSize="sm">
              ${price}{specs[spec]}
            </Text>
          )}
        </Box>
      </Box>
    </Box>
  );
};
