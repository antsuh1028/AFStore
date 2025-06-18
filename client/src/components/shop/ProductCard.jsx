import { Box, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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
  const navigate = useNavigate();
  const placeholderImage = "/gray.avif";
  const [displayImage, setDisplayImage] = useState(placeholderImage);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/s3/item/${id}/images`
        );
        const data = await res.json();
        console.log("Fetched images:", data);
        if (res.ok && data.images.length > 0) {
          setDisplayImage(data.images[0]);
        } else {
          setDisplayImage(placeholderImage);
        }
      } catch {
        setDisplayImage(placeholderImage);
      }
    };
    fetchImage();
  }, [id]);

  const handleCardClick = () => {
    navigate(`/wholesale/product/${id}`);
  };

  return (
    <Box
      borderRadius="xl"
      overflow="hidden"
      boxShadow="md"
      width="100%"
      bg="white"
      p={2}
      cursor="pointer"
      transition="all 0.2s ease"
      _hover={{
        transform: "translateY(-2px)",
        boxShadow: "lg",
        bg: "gray.50"
      }}
      _active={{
        transform: "translateY(0)",
        boxShadow: "md"
      }}
      onClick={handleCardClick}
      maxW="180px"
      mx="auto"
    >
      {/* Product Image */}
      <Image
        src={displayImage}
        alt={name}
        borderRadius="md"
        width="100%"
        height="auto"
        objectFit="cover"
        loading="lazy"
      />

      {/* Product Name */}
      <Text mt={2} fontWeight="semibold" fontSize="sm" noOfLines={2}>
        {name}
      </Text>

      {/* Specs */}
      <Text fontSize="xs" color="gray.600">
        {spec}
      </Text>

      {/* Price */}
      <Text mt={1} fontWeight="bold" color="green.600">
        ${price}
      </Text>
    </Box>
  );
};