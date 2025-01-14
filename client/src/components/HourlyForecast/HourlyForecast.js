import React from 'react';
import { Box, Text, Grid, GridItem, Flex, HStack, Button, Badge, Icon } from '@chakra-ui/react';
import { convertWindSpeedToKnots } from '../../helpers/convertWindSpeedToKnots';
import { FaTemperatureHigh, FaWind, FaWater } from 'react-icons/fa';

const HourlyForecast = ({ hourly, hourIndex, setHourIndex }) => {
   if (!hourly || !hourly.time) {
      return null;
   }

   const startIndex = hourIndex * 6;
   const endIndex = startIndex + 6;

   const hourlyData = hourly.time || [];
   const hourlyTemperature = hourly.temperature_2m || [];
   const hourlyWindSpeed = hourly.wind_speed_10m || [];
   const hourlyPrecipitation = hourly.precipitation || [];

   return (
      <Box>
         <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            {hourlyData.slice(startIndex, endIndex).map((time, index) => (
               <GridItem key={index} p={4} borderWidth="1px" borderRadius="lg">
                  <Flex mb={5} align="center">
                     
                     <Badge colorScheme="blue" variant="outline">
                        <Text>{new Date(time).toLocaleTimeString()}, {new Date(time).toLocaleDateString()}</Text>
                     </Badge>
                  </Flex>
                  <Text>
                  <Icon as={FaTemperatureHigh} /> : {hourlyTemperature[startIndex + index]}°C</Text>
                  <HStack>
                     <Text> <Icon as={FaWind} /> : {convertWindSpeedToKnots(hourlyWindSpeed[startIndex + index])} kt</Text>
                  </HStack>
                  <HStack>
                     <Text><Icon as={FaWater} /> : {hourlyPrecipitation[startIndex + index]} mm</Text>
                  </HStack>
               </GridItem>
            ))}
         </Grid>
         <HStack justifyContent="space-between" mt={4}>
            <Button onClick={() => setHourIndex(hourIndex - 1)} isDisabled={hourIndex === 0}>
               Previous
            </Button>
            <Button onClick={() => setHourIndex(hourIndex + 1)} isDisabled={endIndex >= hourlyData.length}>
               Next
            </Button>
         </HStack>
      </Box>
   );
};

export default HourlyForecast;
