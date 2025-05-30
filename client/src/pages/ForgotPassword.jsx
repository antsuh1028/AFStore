import { useState } from "react";
import {
  Box, Input, Button, VStack, Heading, useToast, Container,
} from "@chakra-ui/react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const toast = useToast();

  const handleRequest = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Check your inbox!", status: "success" });
      } else {
        toast({ title: "Error", description: data.message, status: "error" });
      }
    } catch (err) {
      toast({ title: "Server error", description: err.message, status: "error" });
    }
  };

  return (
    <Container mt={10}>
      <VStack spacing={4}>
        <Heading size="md">Forgot Password</Heading>
        <Input
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={handleRequest} colorScheme="blue">
          Send Reset Link
        </Button>
      </VStack>
    </Container>
  );
};

export default ForgotPassword;
