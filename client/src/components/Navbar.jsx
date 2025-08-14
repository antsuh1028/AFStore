import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { ChevronLeft, ShoppingCart, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuth";
import { encodeUserId } from "../utils/urlEncryption";

const Navbar = ({ onOpen , home}) => {
  const navigate = useNavigate();

  const { isAuthenticated, userId, loading } = useAuthContext();
  const encryptedUserId = encodeUserId(userId);
  

  const handleUserIconClick = () => {

    if (loading) {
      return;
    }

    if (isAuthenticated && userId) {
      navigate(`/profile/user/${encryptedUserId}`);
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
          onClick={() => {console.log(home)
            home ? navigate("/"): navigate(-1);
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
          {isAuthenticated && (
            <IconButton
              aria-label="Cart"
              icon={<ShoppingCart size={24} />}
              variant="ghost"
              onClick={() => {
                navigate(`/profile/user/${encryptedUserId}`, {
                  state: { activeTab: 1 },
                });
              }}
              _hover={{ bg: "gray.100" }}
            />
          )}
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
