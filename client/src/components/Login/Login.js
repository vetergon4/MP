import React, { useState } from 'react';
import {
  FormControl,
  Input,
  Stack,
  Text,
  Link,
  Button,
  Flex,
  InputGroup,
  InputLeftElement,
  Icon,
  Box,
  Image,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from "react-router-dom";
import { loginUser } from '../../services/dataService'; // Import loginUser function

//Logo
import marineproLogo from './marinepro-logo.png';

//import icons
import { FaEnvelope, FaKey } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async () => {
    try {
      const response = await loginUser(formData);

      if (response && response.token) {
        setFormData({
          email: '',
          password: '',
        });
        navigate('/profile');
      } else {
        toast({
          title: "Login failed",
          description: "Incorrect email or password.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while logging in.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      maxW="100%"
      position="relative"
      bg="white"
    >
      <Box position="absolute" top={0} width="100%" display="flex" justifyContent="center" p={5} mt={5} mb={5}>
        <Image src={marineproLogo} alt="MarinePRO Logo" boxSize="75px" />
      </Box>

      <Box
        borderRadius="lg"
        overflow="hidden"
        p={1}
        background="linear-gradient(145deg, rgba(255,255,1), rgba(0,204,255))"
      >
        <Stack
          spacing={5}
          borderWidth="1px"
          borderRadius="lg"
          borderColor={"gray.400"}
          overflow="hidden"
          p={6}
          background="white"
          boxShadow="lg"
        >
          <Heading fontSize="2xl" fontWeight="bold" mb={1} textAlign="center">
            Sign In
          </Heading>
          <FormControl id="email">
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<Icon as={FaEnvelope} color="blue.500" />}
              />
              <Input
                type="email"
                placeholder="E-mail"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </InputGroup>
          </FormControl>

          <FormControl id="password">
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<Icon as={FaKey} color="blue.500" />}
              />
              <Input
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </InputGroup>
          </FormControl>
          <Button
            colorScheme="blue"
            size="md"
            alignSelf="center"
            fontSize="md"
            onClick={handleLogin}
          >
            Login
          </Button>
        </Stack>
      </Box>
      <Text mt={4} fontSize="md" color="gray.700">
        Don't have an account?{" "}
        <Link as={RouterLink} to="/register" color="blue.500">
          Register
        </Link>
      </Text>
    </Flex>
  );
};

Login.propTypes = {};

Login.defaultProps = {};

export default Login;
