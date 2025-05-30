import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { ChevronLeft, ShoppingCart, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onOpen }) => {
  const navigate = useNavigate();
  return (
    <Box>
      <Flex p={4} justify="space-between" align="center">
        <IconButton
          aria-label="Back"
          icon={<ChevronLeft size={24} />}
          variant="ghost"
          size="lg"
          colorScheme="gray"
          onClick={() => {
            navigate("/");
          }}
        />
        <Flex>
          <IconButton
            aria-label="Menu"
            icon={<UserRound size={24} />}
            variant="ghost"
          />
          <IconButton
            aria-label="Menu"
            icon={<ShoppingCart size={24} />}
            variant="ghost"
          />
          <IconButton
            aria-label="Menu"
            icon={<Text>☰</Text>}
            variant="ghost"
            onClick={onOpen}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
