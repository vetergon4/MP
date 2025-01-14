import React, { useState } from 'react';
import { FaUserAlt, FaEnvelope, FaIdCard, FaBirthdayCake, FaRegMoneyBillAlt } from 'react-icons/fa';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Box, Flex, VStack, Grid, GridItem, FormControl, FormLabel, Input, InputGroup, InputLeftElement,
  Icon, Button, FormErrorMessage, useColorModeValue, useToast, Text
} from '@chakra-ui/react';
import { updateUser } from '../../services/dataService';

const ProfileUserInfo = ({ userId, initialUserData }) => {
  const [user, setUser] = useState(initialUserData);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleDateChange = (date) => {
    setUser(prev => ({
      ...prev,
      birthday: date
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    Object.entries(user).forEach(([key, value]) => formData.append(key, value));

    const response = await updateUser(userId, formData); // You need to define/updateUser function
    setIsLoading(false);
    if (response.token) {
      toast({
        title: 'Profile Updated',
        description: "Your profile information has been updated successfully.",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Error',
        description: response.message || "Failed to update profile.",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      bg="linear-gradient(45deg, #ffffff, #f0f0f0)"
      p="16px"
      borderRadius="12px"
      boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
      justifyContent="space-between"
      alignItems="center"
      borderBottomWidth="1px"
      overflow="hidden"
      height="100%" // Ensure the flex container spans the parent height
    >
      <VStack spacing={6} width="full" align="center">
        <Text fontSize="2xl" fontWeight="bold">User Information</Text>
        <form onSubmit={handleSubmit}>
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            <GridItem colSpan={[2, 1]}>
              <FormControl isRequired isInvalid={errors.name}>
                <Input
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  placeholder="Name" // Add placeholder
                  _placeholder={{ color: 'gray.500' }} // Style placeholder text
                  color="black" // Style input value text
                />
                {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
              </FormControl>
            </GridItem>
            <GridItem colSpan={[2, 1]}>
              <FormControl isRequired isInvalid={errors.surname}>
                <Input
                  name="surname"
                  value={user.surname}
                  onChange={handleChange}
                  placeholder="Surname" // Add placeholder
                  _placeholder={{ color: 'gray.500' }} // Style placeholder text
                  color="black" // Style input value text
                />
                {errors.surname && <FormErrorMessage>{errors.surname}</FormErrorMessage>}
              </FormControl>
            </GridItem>
            <GridItem colSpan={[2, 1]}>
              <FormControl isRequired isInvalid={errors.email}>
                <Input
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  placeholder="Email" // Add placeholder
                  _placeholder={{ color: 'gray.500' }} // Style placeholder text
                  color="black" // Style input value text
                />
                {errors.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
              </FormControl>
            </GridItem>
            <GridItem colSpan={[2, 1]}>

              <FormControl isRequired isInvalid={errors.personalIdentificationNumber}>
                <Input
                  name="personalIdentificationNumber"
                  value={user.personalIdentificationNumber}
                  onChange={handleChange}
                  placeholder="Personal Identification Number" // Add placeholder
                  _placeholder={{ color: 'gray.500' }} // Style placeholder text
                  color="black" // Style input value text
                />
                {errors.personalIdentificationNumber && <FormErrorMessage>{errors.personalIdentificationNumber}</FormErrorMessage>}
              </FormControl>
            </GridItem>
            <GridItem colSpan={[2, 1]}>

              <FormControl isRequired isInvalid={errors.taxNumber}>
                <Input
                  name="taxNumber"
                  value={user.taxNumber}
                  onChange={handleChange}
                  placeholder="Tax Number" // Add placeholder
                  _placeholder={{ color: 'gray.500' }} // Style placeholder text
                  color="black" // Style input value text
                />
                {errors.taxNumber && <FormErrorMessage>{errors.taxNumber}</FormErrorMessage>}
              </FormControl>
            </GridItem>
            <GridItem colSpan={[2, 1]}>

              <FormControl isRequired isInvalid={errors.birthday}>
                
                <ReactDatePicker
                  selected={user.birthday ? new Date(user.birthday) : null}
                  onChange={handleDateChange}
                  dateFormat="yyyy-MM-dd"
                  wrapperClassName="date-picker"
                  placeholderText="Birthday" // Add placeholder text for the date picker
                  className="chakra-input css-1c6j008" // Apply Chakra input styles to the date picker
                />
                {errors.birthday && <FormErrorMessage>{errors.birthday}</FormErrorMessage>}
              </FormControl>
            </GridItem>
          </Grid>
          <Button display='flex' justifyContent='center' mt={4} type="submit" colorScheme="blue" size="lg" isLoading={isLoading}>
            Update Profile
          </Button>
        </form>
      </VStack>
    </Flex>
  );
};

export default ProfileUserInfo;