import { React} from "react";
import { Box, Button, Text, Image, VStack, HStack } from '@chakra-ui/react';
import { Link as RouterLink } from "react-router-dom";


import marineproLogo from './marinepro-logo.png';

const WelcomePage = () => {
  return (

    <Box
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="center"
      height="100vh"
      bg="white"
      paddingTop="50px"
      bgGradient="linear(to bottom, white, #a8d0e6, #4f98ca)"

    >
      <Image src={marineproLogo} alt="MarinePRO Logo" boxSize="80px" />

      <VStack spacing={4} mt={8}>
        <Text mt={50} fontSize="2xl" color="gray.600" fontWeight="bold" fontFamily="Georgia, serif">
          Welcome to MarinePRO
        </Text>
        <Text mb={50} fontSize="md" color="gray.600" fontWeight="bold" fontFamily="Georgia, serif">
          Your sea companion
        </Text>
        <HStack mt={100} spacing={4}>
          <Button mr={5} colorScheme="blue" variant="outline" size='sm' as={RouterLink}  to="/register">
            Get Started
          </Button>
          <Button colorScheme="blue" variant="outline" size='sm' as={RouterLink}  to="/login">
            Log In
          </Button>
        </HStack>
      </VStack>
      <Text mt={100} ml={0} fontSize="10px" color="gray.600" fontFamily="Georgia, serif">
          © 2024 MarinePRO
        </Text>
    </Box>

  );
};

export default WelcomePage;

