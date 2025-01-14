import { Box, HStack, Button, Spacer } from '@chakra-ui/react';
import { FaHouseDamage, FaShip, FaAnchor, FaCog, FaSignOutAlt, FaComments } from 'react-icons/fa';
import styles from './ProfileSidebar.styled';

import { logout } from '../../services/dataService';

const ProfileSidebar = ({ username, onButtonClick, selectedSection }) => {
  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <Box {...styles.baseStyle}>
      <HStack spacing={4} justifyContent="space-between" width="100%">
        <HStack spacing={4}>
          <Button
            onClick={() => onButtonClick('userinfo')}
            leftIcon={<FaHouseDamage />}
            {...styles.buttonStyle}
            color={selectedSection === 'userinfo' ? 'white' : 'gray'}
          >
          </Button>
          <Button
            onClick={() => onButtonClick('vesselinfo')}
            leftIcon={<FaShip />}
            {...styles.buttonStyle}
            color={selectedSection === 'vesselinfo' ? 'white' : 'gray'}
          >
          </Button>
          <Button
            onClick={() => onButtonClick('servicesinfo')}
            leftIcon={<FaAnchor />}
            {...styles.buttonStyle}
            color={selectedSection === 'servicesinfo' ? 'white' : 'gray'}
          >
          </Button>
          <Button
            onClick={() => onButtonClick('messagesinfo')}
            leftIcon={<FaComments />}
            {...styles.buttonStyle}
            color={selectedSection === 'messagesinfo' ? 'white' : 'gray'}
          >
          </Button>
        </HStack>
        <Spacer />
        <Button
          onClick={handleLogout}
          leftIcon={<FaSignOutAlt />}
          {...styles.buttonStyle}
          color={'gray'}
        >
        </Button>
      </HStack>
    </Box>
  );
};

export default ProfileSidebar;
