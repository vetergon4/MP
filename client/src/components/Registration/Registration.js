import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Flex,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Icon,
  Heading,
  Text,
  Image,
  Link,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaIdCard,
  FaMoneyBillWave,
  FaEnvelope,
  FaBirthdayCake,
  FaEye,
  FaKey,
  FaEyeSlash,
  FaHome,
} from "react-icons/fa";
import { checkRegistration } from "../../helpers/checkRegistration";
import { registerUser } from "../../services/dataService";

import marineproLogo from "./marinepro-logo.png";

const Registration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    pin: "",
    taxNumber: "",
    email: "",
    birthday: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "", // Clear the error message for the field
    });
  };

  const handleNextStep = () => {
    const fieldsToValidate =
      step === 1
        ? ["name", "surname"]
        : step === 2
          ? ["pin", "taxNumber", "email"]
          : ["birthday", "password", "confirmPassword"];
    const formValidation = checkRegistration(formData, fieldsToValidate);
  
    console.log("Form validation result:", formValidation);
  
    if (formValidation !== "ok") {
      const newErrors = {};
  
      formValidation.forEach((error) => {
        newErrors[error.field] = error.message;
      });
  
      setErrors(newErrors);
    } else {
      setErrors({});  // Clear any existing errors
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleRegister = async () => {
    try {
      const fieldsToValidate = Object.keys(formData);
      const formValidation = checkRegistration(formData, fieldsToValidate);

      if (formValidation !== "ok") {
        const newErrors = {};
        formValidation.forEach((error) => {
          newErrors[error.field] = error.message;
        });
        //console.log("Form is invalid. Please check the errors:", newErrors);
        setErrors(newErrors);
        return;
      }

      // console.log("Form is valid. Proceeding with registration...");

      const response = await registerUser(formData);
      if (response && response.token) {
        setFormData({
          name: "",
          surname: "",
          pin: "",
          taxNumber: "",
          email: "",
          birthday: "",
          vessel: "",
          password: "",
          confirmPassword: "",
        });
        navigate("/profile");
      }
    } catch (error) {
      console.error("Error registering user:", error.message);
      setErrors({ global: error.message });
    }
  };
  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      position="relative"
      minHeight="100vh"
    >
      <Box position="absolute" top={0} width="100%" display="flex" justifyContent="center" p={2} mt={5} mb={5}>
        <Image src={marineproLogo} alt="MarinePRO Logo" boxSize="75px" />
      </Box>


      <Stack
        spacing={4}
        borderWidth="1px"
        borderRadius="lg"
        width={"80%"}
        overflow="hidden"
        p={6}
        mt={5}
        boxShadow="lg"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
      >
        <Heading fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
          Register
        </Heading>
        {step === 1 && (
          <Stack
            spacing={4}
            pb={4}
            borderBottom="1px solid"
            borderColor="gray.300"
          >
            <FormControl id="name" isInvalid={errors.name}>
              <FormLabel>Name</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FaUser} color="gray.600" />}
                />
                <Input
                  type="text"
                  placeholder="John"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </InputGroup>
              {errors.name && <Text color="red.500">{errors.name}</Text>}
            </FormControl>

            <FormControl id="surname" isInvalid={errors.surname}>
              <FormLabel>Surname</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FaUser} color="gray.600" />}
                />
                <Input
                  type="text"
                  placeholder="Doe"
                  name="surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                />
              </InputGroup>
              {errors.surname && <Text color="red.500">{errors.surname}</Text>}
            </FormControl>
          </Stack>
        )}

        {step === 2 && (
          <>
            <FormControl id="pin" isInvalid={errors.pin}>
              <FormLabel>Personal identification number</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FaIdCard} color="gray.600" />}
                />
                <Input
                  type="number"
                  placeholder="13-digit PIN"
                  name="pin"
                  value={formData.pin}
                  onChange={handleInputChange}
                />
              </InputGroup>
              {errors.pin && <Text color="red.500">{errors.pin}</Text>}
            </FormControl>

            <FormControl id="taxNumber" isInvalid={errors.taxNumber}>
              <FormLabel>Tax number</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FaMoneyBillWave} color="gray.600" />}
                />
                <Input
                  type="number"
                  placeholder="8-digit Tax Number"
                  name="taxNumber"
                  value={formData.taxNumber}
                  onChange={handleInputChange}
                />
              </InputGroup>
              {errors.taxNumber && (
                <Text color="red.500">{errors.taxNumber}</Text>
              )}
            </FormControl>

            <FormControl id="email" isInvalid={errors.email}>
              <FormLabel>Email address</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FaEnvelope} color="gray.600" />}
                />
                <Input
                  type="email"
                  placeholder="john.doe@example.com"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </InputGroup>
              {errors.email && <Text color="red.500">{errors.email}</Text>}
            </FormControl>
          </>
        )}

        {step === 3 && (
          <>
            <FormControl id="birthday" isInvalid={errors.birthday}>
              <FormLabel>Birthday</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FaBirthdayCake} color="gray.600" />}
                />
                <Input
                  type="date"
                  placeholder="YYYY-MM-DD"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleInputChange}
                />
              </InputGroup>
              {errors.birthday && (
                <Text color="red.500">{errors.birthday}</Text>
              )}
            </FormControl>

            <FormControl id="password" isInvalid={errors.password}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FaKey} color="gray.600" />}
                />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <InputRightElement width="4.5rem">
                  <Icon
                    as={showPassword ? FaEyeSlash : FaEye}
                    onClick={handleTogglePasswordVisibility}
                    color="gray.600"
                    cursor="pointer"
                  />
                </InputRightElement>
              </InputGroup>
              {errors.password && (
                <Text color="red.500">{errors.password}</Text>
              )}
            </FormControl>

            <FormControl
              id="password-confirm"
              isInvalid={errors.confirmPassword}
            >
              <FormLabel>Confirm password</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FaKey} color="gray.600" />}
                />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <InputRightElement width="4.5rem">
                  <Icon
                    as={showPassword ? FaEyeSlash : FaEye}
                    onClick={handleTogglePasswordVisibility}
                    color="gray.600"
                    cursor="pointer"
                  />
                </InputRightElement>
              </InputGroup>
              {errors.confirmPassword && (
                <Text color="red.500">{errors.confirmPassword}</Text>
              )}
            </FormControl>
          </>
        )}

        <Flex justifyContent="space-between">
          {step > 1 && (
            <Button colorScheme="blue" onClick={handlePreviousStep} size="sm">
              Previous
            </Button>
          )}
          {step < 3 ? (
            <Button colorScheme="blue" onClick={handleNextStep} size="sm" ml="auto">
              Next
            </Button>
          ) : (
            <Button
              colorScheme="blue"
              size="md"
              fontSize="md"
              onClick={handleRegister}
            >
              Register
            </Button>
          )}
        </Flex>
        {errors.global && (
          <Text color="red.500" textAlign="center">
            {errors.global}
          </Text>
        )}
      </Stack>
      <Text mt={4} fontSize="md" color="gray.500">
        Already have an account?{" "}
        <Link as={RouterLink} to="/login" color="blue.500">
          Login
        </Link>
      </Text>
    </Flex>
  );
};

export default Registration;
