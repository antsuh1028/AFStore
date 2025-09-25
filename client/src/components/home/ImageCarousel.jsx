import React, { useState, useEffect } from "react";
import { Box, Image, IconButton } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useLanguage } from "../../hooks/LanguageContext";

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { selectedLanguage } = useLanguage();

  const images =
    selectedLanguage.code === "ko"
      ? [
          {
            avif: "/banners/01.avif",
            fallback: "/banners/01.jpg",
          },
          {
            avif: "/banners/02.avif",
            fallback: "/banners/02.jpg",
          },
          {
            avif: "/banners/03.avif",
            fallback: "/banners/03.jpg",
          },
          {
            avif: "/banners/04.avif",
            fallback: "/banners/04.jpg",
          },
          {
            avif: "/banners/05.avif",
            fallback: "/banners/05.jpg",
          },
          {
            avif: "/banners/06.avif",
            fallback: "/banners/06.jpg",
          },
        ]
      : [
          {
            avif: "/banners/07.avif",
            fallback: "/banners/07.jpg",
          },
          {
            avif: "/banners/08.avif",
            fallback: "/banners/08.jpg",
          },
          {
            avif: "/banners/09.avif",
            fallback: "/banners/09.jpg",
          },
          {
            avif: "/banners/10.avif",
            fallback: "/banners/10.jpg",
          },
          {
            avif: "/banners/11.avif",
            fallback: "/banners/11.jpg",
          },
          {
            avif: "/banners/12.avif",
            fallback: "/banners/12.jpg",
          },
        ];

  const minSwipeDistance = 50;

  useEffect(() => {
    if (isPaused || isAnimating) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setTimeout(() => setIsAnimating(false), 300);
    }, 2500);

    return () => clearInterval(interval);
  }, [isPaused, isAnimating, images.length]);

  const goToPrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsAnimating(false), 300);
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

  const handleDotClick = (index) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <Box>
      <Box
        bg="tan.100"
        overflow="hidden"
        position="relative"
        borderRadius="0"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Box
          display="flex"
          width={`${images.length * 100}%`}
          transform={`translateX(-${(currentIndex * 100) / images.length}%)`}
          transition="transform 0.3s ease-in-out"
        >
          {images.map((image, index) => (
            <Box key={index} width={`${100 / images.length}%`} flexShrink={0}>
              <Image
                src={image.avif}
                alt={`Banner ${index + 1}`}
                width="100%"
                fallbackSrc={image.fallback}
              />
            </Box>
          ))}
        </Box>

        {/* Navigation Arrows */}
        {/* <IconButton
          icon={<ChevronLeftIcon />}
          position="absolute"
          left="10px"
          top="50%"
          transform="translateY(-50%)"
          bg="blackAlpha.600"
          color="white"
          size="xs"
          borderRadius="full"
          _hover={{ bg: "blackAlpha.800" }}
          onClick={goToPrevious}
          aria-label="Previous image"
          disabled={isAnimating}
        /> */}

        {/* <IconButton
          icon={<ChevronRightIcon />}
          position="absolute"
          right="10px"
          top="50%"
          transform="translateY(-50%)"
          bg="blackAlpha.600"
          color="white"
          size="xs"
          borderRadius="full"
          _hover={{ bg: "blackAlpha.800" }}
          onClick={goToNext}
          aria-label="Next image"
          disabled={isAnimating}
        /> */}

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
              bg={index === currentIndex ? "white" : "whiteAlpha.500"}
              cursor="pointer"
              onClick={() => handleDotClick(index)}
              transition="background 0.3s"
              borderRadius="full"
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ImageCarousel;
