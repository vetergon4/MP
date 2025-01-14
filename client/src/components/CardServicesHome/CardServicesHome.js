import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Flex, Card, CardHeader, Heading, CardBody, Text, CardFooter, Badge, Alert, AlertIcon } from '@chakra-ui/react';

import { getPendingServices } from '../../services/dataServiceServices';
import "./CardServicesHome.css";

const CardServicesHome = () => {

   const [pendingServices, setPendingServices] = useState(null); // Change initial state to null

   useEffect(() => {
      getPendingServices()
         .then((response) => {
            setPendingServices(response.length);
         })
         .catch((error) => {
            console.error(error);
         });
   }, []);

   return (
      <Card>
         <CardHeader>
            <Heading size="md" fontWeight="bold" textAlign="center">Pending requests</Heading>
            {/* Add some horizontal line */}
            <hr />
         </CardHeader>
         <CardBody>
            <Flex align="center" justify="center" direction="column" height="100%">
               <Text fontWeight="bold" fontSize="4xl" textAlign="center">{pendingServices}</Text>
               <br></br>

               {pendingServices > 0 && (
                  
                  <Alert status="warning" variant="subtle" mt={2} className="blink">
                     <AlertIcon />
                     <Text fontSize="sm">There are pending requests! Check them in Services section.</Text>
                  </Alert>
               )}
            </Flex>
         </CardBody>
         <CardFooter>
            <Flex align="center" justify="space-between"> {/* Align children to the left and right */}
               <Badge variant='subtle' colorScheme='green' mr={2}>
                  {new Date().toLocaleDateString()}
               </Badge>
               <Badge variant='subtle' colorScheme='blue' cursor='pointer'>
                  View all
               </Badge>
            </Flex>
         </CardFooter>
      </Card>
   );
};

CardServicesHome.propTypes = {};

CardServicesHome.defaultProps = {};

export default CardServicesHome;
