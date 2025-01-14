import React from 'react';
import { Flex, Text } from '@chakra-ui/react';

const StyledFlexHeader = () => {
  return (
    <Flex
      bg="linear-gradient(45deg, #ffffff, #f0f0f0)"
      p="16px"
      borderRadius="12px"
      boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
      justifyContent="space-between"
      alignItems="center"
      borderBottomWidth="1px"
      mb="16px"
    >
      <Text fontSize="md" fontWeight="bold" color="gray.800" marginRight="12px">QR Data</Text>
      <Text fontSize="md" fontWeight="bold" color="gray.800" marginRight="12px">Lat</Text>
      <Text fontSize="md" fontWeight="bold" color="gray.800" marginRight="12px">Lng</Text>
      <Text fontSize="md" fontWeight="bold" color="gray.800" marginRight="12px">Paid</Text>
      <Text fontSize="md" fontWeight="bold" color="gray.800" marginRight="12px">Price</Text>
      <Text fontSize="md" fontWeight="bold" color="gray.800" marginRight="12px">Vessel</Text>
    </Flex>
  );
};

export default StyledFlexHeader;
