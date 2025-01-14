import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Flex, Card, CardHeader, Heading, CardBody, Text, CardFooter, Badge } from '@chakra-ui/react';

import {getNumberOfPaidBuoys} from '../../services/dataServiceBuoys';

const CardBuoysHome = () => {
   const [takenBuoys, setTakenBuoys] = useState(null); // Change initial state to null

   useEffect(() => {
      getNumberOfPaidBuoys()
         .then((response) => {
            console.log(response)
            setTakenBuoys(response);
         })
         .catch((error) => {
            console.error(error);
         });
   }, []);

   // If takenBuoys is still null, show loading indicator
   if (takenBuoys === null) {
      return (
         <Card>
            <CardBody>
               <Text>Loading...</Text>
            </CardBody>
         </Card>
      );
   }

   // Once the API call completes, render the card with actual data
   return (
      <Card>
         <CardHeader>
            <Heading size="md" fontWeight="bold" textAlign="center">Buoys taken</Heading>
            {/* Add some horizontal line */}
            <hr />
         </CardHeader>
         <CardBody>
            <Flex align="center" justify="center" direction="column" height="100%">
               <Text fontWeight="bold" fontSize="4xl" textAlign="center">{takenBuoys} / 20</Text>
            </Flex>
         </CardBody>
         <CardFooter>
            <Flex align="center" justify="flex-end">
               <Badge variant='subtle' colorScheme='green'>
                  {new Date().toLocaleDateString()}
               </Badge>
            </Flex>
         </CardFooter>
      </Card>
   );
};

export default CardBuoysHome;
