import { Container } from "@chakra-ui/react";

export const ViewContainer = ({ children, contentRef }) => {
  return (
    <Container
      ref={contentRef}
      maxW={{ base: "100%", lg: "33%" }}
      p={0}
      bg="white"
      boxShadow="xl"
      ml={{ base: 0, lg: "40%" }}
    >
      {children}
    </Container>
  );
};
