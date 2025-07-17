import { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Input,
  Button,
  VStack,
  useToast,
  Container,
} from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";

const API_URL = import.meta.env.MODE === 'production' 
  ? import.meta.env.VITE_API_URL 
  : import.meta.env.VITE_API_URL_DEV;

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const toast = useToast();

  const handleSubmit = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/users/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, token, newPassword }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Password reset!", status: "success" });
      } else {
        toast({ title: "Error", description: data.message, status: "error" });
      }
    } catch (err) {
      toast({
        title: "Server error",
        description: err.message,
        status: "error",
      });
    }
  };

  return (
    <Container mt={10}>
      <VStack spacing={4} align="stretch">
        <Heading size="md">Reset Your Password</Heading>
        <Input
          placeholder="Enter new password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Button onClick={handleSubmit} colorScheme="blue">
          Submit
        </Button>
      </VStack>
    </Container>
  );
};

export default ResetPassword;
