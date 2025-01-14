import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const Message = ({ content, isUser }) => {
  return (
    <Box
      alignSelf={isUser ? 'flex-end' : 'flex-start'}
      bg={isUser ? 'blue.500' : 'gray.200'}
      color={isUser ? 'white' : 'black'}
      p={2}
      borderRadius="md"
      maxW="70%"
      my={2}
    >
      <Text>{content}</Text>
    </Box>
  );
};

export default Message;
