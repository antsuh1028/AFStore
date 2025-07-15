import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { ChevronLeft, ShoppingCart, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuth"; // Import auth context

const Navbar = ({ onOpen }) => {
  const navigate = useNavigate();
  
  // Get auth state
  const { isAuthenticated, userId, loading } = useAuthContext();

  // Handle user icon click based on authentication
  const handleUserIconClick = () => {
    console.log("Navbar User icon clicked - Auth Status:", isAuthenticated);
    console.log("User ID:", userId);
    
    if (loading) {
      // Still loading auth state, don't do anything
      return;
    }
    
    if (isAuthenticated && userId) {
      navigate(`/profile/user/${userId}`);
    } else {
      navigate("/login");
    }
  };

  return (
    <Box>
      <Flex p={4} justify="space-between" align="center">
        <IconButton
          aria-label="Back"
          icon={<ChevronLeft size={24} />}
          variant="ghost"
          size="sm"
          colorScheme="gray"
          onClick={() => {
            navigate("/");
          }}
          _hover={{ bg: "gray.100" }}
        />
        <Flex>
          <IconButton
            aria-label="Profile"
            icon={<UserRound size={24} />}
            variant="ghost"
            onClick={handleUserIconClick}
            isLoading={loading}
            _hover={{ bg: "gray.100" }}
          />
          <IconButton
            aria-label="Cart"
            icon={<ShoppingCart size={24} />}
            variant="ghost"
            onClick={() => {
              navigate("/cart");
            }}
            _hover={{ bg: "gray.100" }}
          />
          <IconButton
            aria-label="Menu"
            icon={<Text fontSize="2xl">☰</Text>}
            variant="ghost"
            onClick={onOpen}
            _hover={{ bg: "gray.100" }}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;