import React from 'react';
import { Box, Text, VStack, HStack } from '@chakra-ui/react';
import { convertWindSpeedToKnots } from '../../helpers/convertWindSpeedToKnots';

const CurrentWeather = ({ weather }) => {
  if (!weather || !weather.hourly || !weather.hourly.time.length) {
    return null;
  }

  // Use the first hour's data as current weather summary
  const currentHour = 0;

  return (
    <Box p={6} borderWidth="1px" borderRadius="lg" textAlign="center">
      <VStack spacing={4}>
        <Text fontSize="4xl">{weather.hourly.temperature_2m[currentHour]}°C</Text>
        <Text fontSize="xl">Current Weather</Text>
        <HStack spacing={4}>
          <HStack>
            <Text>{convertWindSpeedToKnots(weather.hourly.wind_speed_10m[currentHour])} knots</Text>
          </HStack>
          <HStack>
            <Text>{weather.hourly.precipitation[currentHour]} mm</Text>
          </HStack>
        </HStack>
      </VStack>
    </Box>
  );
};

export default CurrentWeather;
