import React, { useState, useEffect } from "react";
import { Box, Image, IconButton } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const images = [
    { avif: "/Final_pic/main_banner_2.avif", fallback: "/Final_pic/main_banner_2.png" },
    { avif: "/Final_pic/main_banner_3.avif", fallback: "/Final_pic/main_banner_3.jpg" },
    { avif: "/Final_pic/main_banner_1.avif", fallback: "/Final_pic/main_banner_1.jpg" },
  ];

  const minSwipeDistance = 50;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  return (
    <Box px={4}>
      <Box
        bg="tan.100"
        borderRadius="lg"
        overflow="hidden"
        position="relative"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <Image
          src={images[currentIndex].avif}
          alt="Various Meat Cuts"
          height="80%"
          width="100%"
          objectFit="contain"
          transition="opacity 0.5s ease-in-out"
          fallbackSrc={images[currentIndex].fallback}
        />

        {/* Navigation Arrows */}
        <IconButton
          icon={<ChevronLeftIcon />}
          position="absolute"
          left="10px"
          top="50%"
          transform="translateY(-50%)"
          bg="blackAlpha.600"
          color="white"
          size="sm"
          borderRadius="full"
          _hover={{ bg: "blackAlpha.800" }}
          onClick={goToPrevious}
          aria-label="Previous image"
        />

        <IconButton
          icon={<ChevronRightIcon />}
          position="absolute"
          right="10px"
          top="50%"
          transform="translateY(-50%)"
          bg="blackAlpha.600"
          color="white"
          size="sm"
          borderRadius="full"
          _hover={{ bg: "blackAlpha.800" }}
          onClick={goToNext}
          aria-label="Next image"
        />

        {/* Dots Indicator */}
        <Box
          position="absolute"
          bottom="15px"
          left="50%"
          transform="translateX(-50%)"
          display="flex"
          gap="8px"
        >
          {images.map((_, index) => (
            <Box
              key={index}
              width="8px"
              height="8px"
              borderRadius="full"
              bg={index === currentIndex ? "white" : "whiteAlpha.500"}
              cursor="pointer"
              onClick={() => setCurrentIndex(index)}
              transition="background 0.3s"
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ImageCarousel;