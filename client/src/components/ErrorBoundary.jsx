import React from 'react';
import { Box, Heading, Text, Button, VStack, Image, } from '@chakra-ui/react';
import { COLORS } from '../constants';
import Logger from '../utils/logger';

class ErrorBoundary extends React.Component {
 constructor(props) {
   super(props);
   this.state = { hasError: false, error: null };
 }

 static getDerivedStateFromError(error) {
   return { hasError: true };
 }

 componentDidCatch(error, errorInfo) {
   Logger.error('Error Boundary caught an error:', { error, errorInfo });
   this.setState({ error: error });
 }

 render() {
   if (this.state.hasError) {
     return (
         <Box p={8} textAlign="center">
           <VStack spacing={6}>
             {/* Logo */}
             <Image
               src="/images/gray_adams.png"
               alt="AdamsFoods Logo"
               width="150px"
               opacity={0.8}
               mt={8}
             />

             {/* Error Message */}
             <VStack spacing={2}>
               <Heading size="lg" color={COLORS.PRIMARY}>
                 Something went wrong
               </Heading>
               <Text fontSize="sm" color="gray.600" maxW="300px">
                 We're experiencing a technical issue. Please try refreshing the page or return home.
               </Text>
             </VStack>

             {/* Action Buttons */}
             <VStack spacing={3} w="full" maxW="250px">
               <Button 
                 bg={COLORS.PRIMARY}
                 color="white"
                 borderRadius="full"
                 size="lg"
                 width="100%"
                 _hover={{ bg: COLORS.SECONDARY }}
                 onClick={() => window.location.reload()}
               >
                 Refresh Page
               </Button>
               
               <Button 
                 variant="outline"
                 borderColor={COLORS.PRIMARY}
                 color={COLORS.PRIMARY}
                 borderRadius="full"
                 size="lg"
                 width="100%"
                 _hover={{ bg: "gray.50" }}
                 onClick={() => window.location.href = '/'}
               >
                 Go Home
               </Button>
             </VStack>
           </VStack>
         </Box>
     );
   }

   return this.props.children;
 }
}

export default ErrorBoundary;