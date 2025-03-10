import {
  Box,
  Flex,
  Text,
  Stack,
  Link,
  Button,
  useColorModeValue,
  Heading,
  HStack,
  Image,
  IconButton,
} from "@chakra-ui/react";
import { Menu, ShoppingBag, Search, Bell, Mail, User } from "lucide-react";

const Navbar = () => {
  const bg = useColorModeValue("white", "gray.800");

  return (
    <Box as="nav" py={4} px={6} bg={bg} boxShadow="sm" width="100%">
      <Flex
        justify="space-between"
        align="center"
        maxW="container.xl"
        mx="auto"
      >
        <Button variant="ghost" leftIcon={<Menu />}>
          Menu
        </Button>

        <Image
          h={{ base: "30px", sm: "40px", md: "50px", lg: "55px" }}
          maxW={{ base: "140px", sm: "150px", md: "180px", lg: "200px" }}
          w="auto"
          objectFit="contain"
          src="AdamsWings.png"
          alt="Adams Wings"
          transition="all 0.2s ease-in-out"
          _hover={{ transform: "scale(1.02)" }}
        />
        <HStack spacing={4}>
          <IconButton variant="ghost" icon={<Search />} />
          <IconButton variant="ghost" icon={<ShoppingBag />} />
          <IconButton variant="ghost" icon={<User />} />
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
