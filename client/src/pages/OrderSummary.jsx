import React from "react";
import NavDrawer from "../components/NavDrawer";
import Navbar from "../components/Navbar";
import {
  Circle,
  Flex,
  Box,
  useDisclosure,
  Divider,
  VStack,
  Heading,
  Container,
  Text,
  HStack,
  Button,
} from "@chakra-ui/react";
import Sidebar from "../components/SideBar";
import { useState } from "react";

const StyledCheckbox = ({ isChecked, onChange, children }) => {
  return (
    <HStack spacing={3} align="flex-start">
      <Box
        as="input"
        type="checkbox"
        checked={isChecked}
        onChange={(e) => onChange(e.target.checked)}
        sx={{
          appearance: "none",
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          border: "2px solid #A0AEC0",
          backgroundColor: isChecked ? "black" : "white",
          cursor: "pointer",
          flexShrink: 0,
          marginTop: "2px",
          position: "relative",
          "&:checked": {
            backgroundColor: "black",
            borderColor: "black",
          },
          "&:checked::after": {
            content: '""',
            position: "absolute",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: "white",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          },
          "&:hover": {
            borderColor: "#4A5568",
          },
        }}
      />
      <Text fontSize="sm" color="gray.700" lineHeight="tall">
        {children}
      </Text>
    </HStack>
  );
};

const OrderPayment = () => {
    
  const [isAgreed, setIsAgreed] = useState(false);
  return (
    <Box
      p={10}
      bg="white"
      borderRadius="md"
      maxW="400px"
      border="1px solid"
      borderColor="gray.200"
    >
      <VStack spacing={4} align="stretch">
        <Box>
          <Text fontSize="xs" color="gray.700" lineHeight="tall">
            Once you place an order, a confirmation email will be sent to you.
          </Text>
          <Text fontSize="xs" color="gray.700" lineHeight="tall">
            After you confirm the order, we will notify you of the available
            pickup time.
          </Text>
        </Box>

        <Box>
          <Text fontSize="xs" color="gray.700" lineHeight="tall">
            For delivery orders, full prepayment is required.
          </Text>
          <Text fontSize="xs" color="gray.700" lineHeight="tall">
            For pickup orders, a 50% prepayment is required, and the remaining
            balance must be paid at pickup.
          </Text>
          <Text fontSize="xs" color="gray.700" lineHeight="tall">
            You can receive a 5% discount on the remaining balance if you pay in
            cash at the time of pickup.
          </Text>
          <Text fontSize="xs" color="gray.700" lineHeight="tall">
            Credit card payments are subject to applicable sales tax.
          </Text>
        </Box>

        <Text fontSize="xs" color="gray.700" lineHeight="tall">
          We accept cash and credit card only.
        </Text>

        <Box>
          <Text fontSize="xs" color="gray.800" mb={1}>
            No-Show Policy
          </Text>
          <Text fontSize="xs" color="gray.700" lineHeight="tall">
            If you fail to show up for your scheduled pickup two times or more
            without prior notice, your account may be suspended.
          </Text>
          <Text fontSize="xs" color="gray.700" lineHeight="tall">
            Refunds for prepaid orders may be limited based on our policy, and a
            deposit may be required for future orders to prevent repeated
            no-shows.
          </Text>
        </Box>
        <Divider borderColor="gray.300" />

        <StyledCheckbox 
  isChecked={isAgreed}
  onChange={() => setIsAgreed(!isAgreed)}
>
  I have read and agree to the Payment & No-Show Policy.
</StyledCheckbox>

        <Button bg="#b6a595" textColor="white" borderRadius="full" mt={16}>
          {" "}
          PLACE YOUR ORDER
        </Button>
      </VStack>
    </Box>
  );
};

const OrderSummaryPage = () => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const contentRef = React.useRef(null);
  return (
    <Sidebar>
      <NavDrawer isOpen={isOpen} onClose={onClose} containerRef={contentRef} />

      <Container
        ref={contentRef}
        maxW={{ base: "100%", lg: "30%" }}
        p={0}
        bg="white"
        border={{ base: "none", lg: "1px" }}
        ml={{ base: 0, lg: "40%" }}
      >
        <Navbar onOpen={onOpen} />
        <Heading
          textAlign="center"
          fontWeight="semibold"
          mt={12}
          fontSize="32px"
        >
          Payment
        </Heading>
        <Box h="80px" w="100%">
          <Flex h="100%" w="100%" align="center" justify="center" p={4}>
            <Circle size="16px" border="1px" bg="white" />
            <Divider borderWidth="1px" w="70px" borderColor="black" />
            <Circle size="16px" border="1px" bg="white" />
            <Divider borderWidth="1px" w="70px" borderColor="black" />
            <Circle size="16px" border="1px" bg="white" />
          </Flex>
        </Box>

        <OrderPayment />
      </Container>
    </Sidebar>
  );
};

export default OrderSummaryPage;
