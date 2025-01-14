import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Flex, Text, Button, IconButton } from '@chakra-ui/react';
//Import icons
import { FaBars, FaTimes } from 'react-icons/fa';

import { logout } from '../../services/dataService';

const Navbar = ({ onToggle, isSidebarOpen }) => {

  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = async () => {
    try {
      logout();

      // Redirect to "/" after logout with   Rotuer's navigate function
      navigate("/");

    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      padding="1.5rem"
      bg="blue.500"
      color="white"
    >
      <Box display="flex" alignItems="center">
        {/* Sidebar Toggle Button */}

        <IconButton
          aria-label="Toggle sidebar"
          icon={isSidebarOpen ? <FaTimes /> : <FaBars />}
          onClick={onToggle}
          display={{ base: 'block', md: 'none' }}
          mr="4"
          bg="transparent"
        />
        {/* Logo and App Name */}
        <Box display="flex" alignItems="center">
         {/* Logo 
          <Box
            as="img"
            src="./logo.png"
            alt="MarinePRO Logo"
            mr="4"
          />*/}
          <Text fontWeight="bold">MarinePRO</Text>
        </Box>
      </Box>

      <Box display="flex" alignItems="center">
        <Button onClick={handleLogout} variant="ghost" colorScheme="whiteAlpha">Logout</Button>
      </Box>
    </Flex>
  );
};

export default Navbar;