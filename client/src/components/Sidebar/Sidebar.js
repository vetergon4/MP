// Sidebar.js
import React, { useState } from 'react';
import { Flex, Button, Box, Text } from '@chakra-ui/react';
import { FaHouseDamage, FaAnchor, FaCog, FaUsers, FaChartBar, FaCoins, FaSun, FaWindowMaximize, FaMapMarked, FaWind } from 'react-icons/fa';
import styles from './Sidebar.styled';

const Sidebar = ({ onButtonClick, selectedSection }) => {

   const [minimized, setMinimized] = useState(false);

   const handleToggleMinimized = () => {
      setMinimized(!minimized);
   };

   return (
      <Flex
         direction="column"
         position="relative"
         minH="100vh"
         {...styles.baseStyle(minimized)}
         {...(minimized && styles.minimizedStyle)}
      >
         <Flex direction="row" justifyContent="space-between" mb={4} p={4}>
            <Box mb={4} position="absolute" right="0" top="0">
               <Button
                  onClick={handleToggleMinimized}
                  leftIcon={<FaWindowMaximize />}
                  {...styles.buttonStyle}
               />
            </Box>
            <Box mb={4}>
               <Text fontSize='2xl' display={minimized ? 'none' : 'block'}>
                  MarinePRO
               </Text>
            </Box>
         </Flex>
         <Box mb={4}>
         <Button
               onClick={() => onButtonClick('home')}
               leftIcon={<FaHouseDamage />}
               width="100%"
               {...styles.buttonStyle}
               color={selectedSection === 'home' ? 'white' : 'gray'}
            >
               {minimized ? null : 'Home'}
            </Button>
            <Button
               onClick={() => onButtonClick('map')}
               leftIcon={<FaMapMarked />}
               width="100%"
               {...styles.buttonStyle}
               color={selectedSection === 'map' ? 'white' : 'gray'}
            >
               {minimized ? null : 'Map'}
            </Button>
            <Button
               onClick={() => onButtonClick('buoys')}
               leftIcon={<FaAnchor />}
               width="100%"
               {...styles.buttonStyle}
               color={selectedSection === 'buoys' ? 'white' : 'gray'}
            >
               {minimized ? null : 'Buoys'}
            </Button>
         </Box>
         <Box mb={4}>
            <Button
               onClick={() => onButtonClick('services')}
               leftIcon={<FaCog />}
               width="100%"
               {...styles.buttonStyle}
               color={selectedSection === 'services' ? 'white' : 'gray'}
            >
               {minimized ? null : 'Services'}
            </Button>
         </Box>
         <Box mb={4}>
            <Button
               onClick={() => onButtonClick('users')}
               leftIcon={<FaUsers />}
               width="100%"
               {...styles.buttonStyle}
               color={selectedSection === 'users' ? 'white' : 'gray'}
            >
               {minimized ? null : 'Users'}
            </Button>
         </Box>
         <Box mb={4}>
            <Button
               onClick={() => onButtonClick('statistics')}
               leftIcon={<FaChartBar />}
               width="100%"
               {...styles.buttonStyle}
               color={selectedSection === 'statistics' ? 'white' : 'gray'}
            >
               {minimized ? null : 'Statistics'}
            </Button>
         </Box>
         <Box mb={4}>
            <Button
               onClick={() => onButtonClick('payments')}
               leftIcon={<FaCoins />}
               width="100%"
               {...styles.buttonStyle}
               color={selectedSection === 'payments' ? 'white' : 'gray'}
            >
               {minimized ? null : 'Payments'}
            </Button>
         </Box>
         <Box mb={4}>
            <Button
               onClick={() => onButtonClick('wind')}
               leftIcon={<FaWind />}
               width="100%"
               {...styles.buttonStyle}
               color={selectedSection === 'wind' ? 'white' : 'gray'}
            >
               {minimized ? null : 'Wind'}
            </Button>
         </Box>
         <Box mb={4}>
            <Button
               onClick={() => onButtonClick('weather')}
               leftIcon={<FaSun />}
               width="100%"
               {...styles.buttonStyle}
               color={selectedSection === 'weather' ? 'white' : 'gray'}
            >
               {minimized ? null : 'Weather'}
            </Button>
         </Box>
      </Flex>
   );
};

export default Sidebar;