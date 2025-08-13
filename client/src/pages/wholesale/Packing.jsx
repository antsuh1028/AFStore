import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  Box,
  Container,
  Heading,
  Image,
  Text,
  VStack,
  Divider,
  Grid,
  GridItem,
  useDisclosure,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import NavDrawer from "../../components/NavDrawer";
import Sidebar from "../../components/SideBar";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useLanguage } from "../../hooks/LanguageContext";

const PackingPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  const { selectedLanguage } = useLanguage();

  // Translation helper function
  const t = (englishText, koreanText) => {
    return selectedLanguage.code === "ko" ? koreanText : englishText;
  };

  const criticalImages = useMemo(
    () => [
      "/images/packing1.jpg",
      "/images/packing2.jpg",
      "/images/packing3.jpg",
      "/images/packing_pg_1.jpg",
      "/images/packing_pg_2.jpg",
      "/images/meat_browning_1.jpg",
      "/images/meat_browning_2.jpg",
    ],
    []
  );

  const preloadImages = async (imageUrls) => {
    const preloadPromises = imageUrls.map((url) => {
      return new Promise((resolve) => {
        const img = document.createElement("img");
        img.onload = () => resolve({ url, success: true });
        img.onerror = () => resolve({ url, success: false });
        img.src = url;
      });
    });

    return Promise.allSettled(preloadPromises);
  };

  useEffect(() => {
    const initializePage = async () => {
      const imagePreloading = preloadImages(criticalImages);

      const [, imageResults] = await Promise.all([
        new Promise((resolve) => setTimeout(resolve, 200)),
        imagePreloading,
      ]);

      setImagesPreloaded(true);
      setPageLoading(false);
    };

    initializePage();
  }, [criticalImages]);

  const OptimizedImage = ({ src, alt, ...props }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageSrc, setImageSrc] = useState(src);

    useEffect(() => {
      if (imagesPreloaded && criticalImages.includes(src)) {
        setImageLoaded(true);
        return;
      }

      const img = document.createElement("img");
      img.onload = () => {
        setImageSrc(src);
        setImageLoaded(true);
      };
      img.onerror = () => {
        setImageLoaded(true);
      };
      img.src = src;
    }, [src, imagesPreloaded]);

    return (
      <Image
        {...props}
        src={imageSrc}
        alt={alt}
        opacity={imageLoaded ? 1 : 0.7}
        transition="opacity 0.3s ease"
        onLoad={() => setImageLoaded(true)}
      />
    );
  };

  const sectionData = [
    {
      heading: t("40°F Full Cold Chain", "40°F 완전 콜드 체인"),
      text: t(
        "From production to delivery, we strictly control the temperature to stay at or below 6°C at all times, preserving the freshness, quality, and safety of our meat products.",
        "생산부터 배송까지 온도를 항상 6°C(40℉) 이하로 엄격히 관리해 고기의 신선도, 품질, 안전성을 유지합니다."
      ),
      images: ["/images/thermometer.jpg", "/images/packing1.jpg"],
    },
    {
      heading: t("Specialized Packaging for Safety", "안전한 전문 포장"),
      text: t(
        "We invest in advanced packaging to preserve freshness, extend shelf life, and ensure safety, while preventing contamination and maintaining quality during storage and transport.",
        "신선도 유지, 유통기한 연장, 안전성 확보를 위해 첨단 포장 기술에 투자하고 있으며, 보관과 운송 중 오염 방지와 품질 유지를 목표로 합니다."
      ),
      images: ["/images/packing2.jpg", "/images/packing3.jpg"],
    },
    {
      heading: t("Meat Browning", "고기 갈변 현상"),
      text: t(
        "The browning happens because myoglobin in the meat doesn't bind with oxygen. Once exposed to air, the meat will return to a reddish color within 15 to 30 minutes.",
        "고기의 갈변은 마이오글로빈이 산소와 결합하지 않아 발생하는 자연스러운 현상입니다. 공기와 접촉하면 15~30분 내에 고기가 다시 선홍색으로 돌아옵니다."
      ),
      note: t(
        "This is a natural process, and the meat is safe.",
        "이는 자연스러운 과정이며, 고기는 안전합니다."
      ),
      images: ["/images/meat_browning_1.jpg", "/images/meat_browning_2.jpg"],
    },
  ];

  const breadcrumbs = [
    { label: "Home", url: "/" },
    { label: "Wholesale", url: "/" },
    { label: "Packing", url: "/wholesale/packing" },
  ];

  if (pageLoading) {
    return (
      <Sidebar>
        <NavDrawer
          isOpen={isOpen}
          onClose={onClose}
          containerRef={contentRef}
        />
        <Container
          ref={contentRef}
          maxW={{ base: "100%", lg: "30%" }}
          p={0}
          bg="white"
          boxShadow="xl"
          ml={{ base: 0, lg: "40%" }}
        >
          <Center h="100vh">
            <VStack spacing={4}>
              <Spinner size="lg" color="gray.500" thickness="3px" />
              <Text fontSize="sm" color="gray.500">
                {imagesPreloaded 
                  ? "Almost ready..." 
                  : "Loading..."
                }
              </Text>
            </VStack>
          </Center>
        </Container>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <NavDrawer isOpen={isOpen} onClose={onClose} containerRef={contentRef} />
      <Container
        ref={contentRef}
        maxW={{ base: "100%", lg: "30%" }}
        p={0}
        bg="white"
        boxShadow="xl"
        ml={{ base: 0, lg: "40%" }}
      >
        <Navbar onOpen={onOpen} home={true} />

        <Box py={3} px={4} display="flex" justifyContent="center">
          <Breadcrumbs listOfBreadCrumbs={breadcrumbs} />
        </Box>

        <Box width="100%">
          {/* Header Section */}
          <Box py={4} px={6} borderColor="gray.200" bg="white" mb={4}>
            <Heading as="h1" size="md" fontWeight="semibold" textAlign="center">
              {t("Packing", "포장")}
            </Heading>
          </Box>
          <Divider mt={2} borderColor="gray.200" />
        </Box>

        <VStack spacing={8} px={8} py={4} align="start">
          {sectionData.map((section, index) => (
            <Box key={index}>
              <Heading size="md" mb={2}>
                {section.heading}
              </Heading>
              <Text fontSize="sm" color="gray.700">
                {section.text}
              </Text>
              {section.note && (
                <Text fontSize="sm" mt={2} color="#CA3836">
                  {section.note}
                </Text>
              )}
              <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={4}>
                {section.images.map((src, i) => (
                  <GridItem key={i}>
                    <OptimizedImage
                      src={src}
                      alt={`${section.heading} image ${i + 1}`}
                      borderRadius="md"
                      width="100%"
                      height="120px"
                      objectFit="cover"
                    />
                  </GridItem>
                ))}
              </Grid>
            </Box>
          ))}

          {/* Why We Use 20lb and 30lb Boxes Section */}
          <Box width="100%" mt={8}>
            <Heading size="md" mb={4}>
              {t(
                "Why We Use 20lb and 30lb Boxes",
                "20lb 및 30lb 박스 사용 이유"
              )}
            </Heading>

            <Text fontSize="sm" color="gray.700" mb={4}>
              {t(
                "At AdamsFoods, our packaging is designed with customer convenience in mind.",
                "AdamsFoods는 고객 편의를 최우선으로 고려하여 포장을 설계합니다."
              )}
            </Text>

            <VStack spacing={4} align="start">
              <Text fontSize="sm" color="gray.700">
                {t(
                  "Marinated meats are packed in 30lb boxes, while raw or trimmed cuts are offered in 20lb sizes. These optimal weights chosen to make handling easier and safer.",
                  "양념육은 30파운드 박스에, 원육 및 손질육은 20파운드 박스에 포장하여 취급을 더욱 쉽고 안전하게 하였습니다."
                )}
              </Text>

              <Text fontSize="sm" color="gray.700">
                {t(
                  "By considering both product type and ease of transport, we help reduce strain on the lower back and improve the overall user experience.",
                  "제품 종류와 운송의 용이성을 함께 고려해 허리 부담을 줄이고 전반적인 사용 경험을 향상시키고자 합니다."
                )}
              </Text>
            </VStack>

            <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={6} mb={4}>
              <GridItem>
                <Box textAlign="center">
                  <OptimizedImage
                    src="/images/packing_pg_1.jpg"
                    alt={t("20lb box", "20lb 박스")}
                    borderRadius="md"
                    width="100%"
                    height="120px"
                    objectFit="cover"
                    mb={2}
                  />
                </Box>
              </GridItem>
              <GridItem>
                <Box textAlign="center">
                  <OptimizedImage
                    src="/images/packing_pg_2.jpg"
                    alt={t("30lb box", "30lb 박스")}
                    borderRadius="md"
                    width="100%"
                    height="120px"
                    objectFit="cover"
                    mb={2}
                  />
                </Box>
              </GridItem>
            </Grid>
          </Box>
        </VStack>

        <Footer />
      </Container>
    </Sidebar>
  );
};

export default PackingPage;