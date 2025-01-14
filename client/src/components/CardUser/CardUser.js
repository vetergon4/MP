import React, { useState, useEffect } from 'react';
import {
  Text, Flex, IconButton, Collapse, Box,
  SimpleGrid
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import StyledCardUser from './CardUser.styled';

import { FaChevronDown } from 'react-icons/fa';
import { Button } from 'react-bootstrap';

// Imports from data services
import { deleteUser } from '../../services/dataService';

const CardUser = ({ user }) => {

  const [isExpanded, setExpanded] = useState(false);


  const handleExpandToggle = async () => {
    setExpanded(!isExpanded);
  };

  return (
    <StyledCardUser>
      <div className='buoy-info'>
        <div className="left-content">
          <IconButton
            onClick={handleExpandToggle}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
            icon={<FaChevronDown />}
            variant="ghost"
            size="sm"
            className="expand-icon"
          />
          <Text fontSize="md" color="gray.800" marginRight="12px">{user.name}</Text>
        </div>
        <Text fontSize="md" color="gray.800" marginRight="12px">{user.surname}</Text>
        <Text fontSize="md" color="gray.800" marginRight="12px">{user.personalIdentificationNumber}</Text>
        <Text fontSize="md" color="gray.800" marginRight="12px">{user.taxNumber}</Text>
        <Text fontSize="md" color="gray.800" marginRight="12px">{user.email}</Text>
        <Text fontSize="md" color="gray.800" marginRight="12px">{user.birthday}</Text>

      </div>
      <Collapse in={isExpanded} animateOpacity>
        <Box mt="4" />
        <Box borderBottom="1px solid" borderColor="gray.300" mb="4" />
        <div>
          <SimpleGrid columns={3} spacing={4} >

            <Button variant="solid" size="lg" onClick={() => {}}>See user</Button>
            <Button variant="primary" size="lg" onClick={() => {}}>Edit user</Button>
            <Button variant="primary" colorScheme="red" size="lg" onClick={() => {}}>Delete user</Button>

          </SimpleGrid>
        </div>
      </Collapse>
    </StyledCardUser>
  );
};

export default CardUser;
