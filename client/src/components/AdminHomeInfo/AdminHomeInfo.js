import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, Heading, Flex } from '@chakra-ui/react';

import CardBuoysHome from '../CardBuoysHome/CardBuoysHome';
import CardServicesHome from '../CardServicesHome/CardServicesHome';
import CardGraphBuoys from '../CardGraphBuoys/CardGraphBuoys';
import AdminMapInfo from '../AdminMapInfo/AdminMapInfo';

const AdminHomeInfo = () => {
   return (
      <Box height="100vh"> {/* Ensures the Box takes the full viewport height */}
               <Flex justify="center" align="center" borderBottom="1px solid #E2E8F0">
            <Heading as="h1" size="xl" fontWeight="bold">
               Overview of bay
            </Heading>
         </Flex>
         <Box mt="20px" />
         <Grid templateColumns="repeat(2, 1fr)" gap={2} height="100%">
            <Box>
               <CardBuoysHome />
               <Box mt={10} /> {/* Adds space between the cards */}
               <CardServicesHome />
            </Box>
            <AdminMapInfo style={{ gridColumn: 'span 2', height: '100%' }} />
         </Grid>
      </Box>
   );
};

export default AdminHomeInfo;
