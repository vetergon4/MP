import React from 'react';
import { Box, Text, Circle } from '@chakra-ui/react';
import { FaUserAlt } from 'react-icons/fa';

const ChatBadge = ({ username, onClick, isActive, unreadCount }) => {
  const displayName = typeof username === 'string' ? username : 'User';

  return (
    <Box
      onClick={onClick}
      p={2}
      display="flex"
      flexDirection="column"
      alignItems="center"
      cursor="pointer"
      position="relative"
    >
      <Box position="relative">
        <Box
          borderRadius="full"
          boxSize="50px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="gray.200"
        >
          <FaUserAlt size="24px" />
        </Box>
        <Circle
          size="12px"
          bg={isActive ? 'green.500' : 'gray.500'}
          position="absolute"
          top="0"
          right="0"
          transform="translate(25%, -25%)"
        />
        {unreadCount > 0 && (
          <Circle
            size="20px"
            bg="red.500"
            color="white"
            fontSize="xs"
            fontWeight="bold"
            position="absolute"
            bottom="0"
            right="0"
            transform="translate(25%, 25%)"
          >
            {unreadCount}
          </Circle>
        )}
      </Box>
      <Text mt={2}>{displayName}</Text>
    </Box>
  );
};

export default ChatBadge;
