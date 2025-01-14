import React from 'react';
import { Box, Text, VStack, HStack, Select } from '@chakra-ui/react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const DailyForecast = ({ daily, selectedDay, setSelectedDay }) => {
  if (!daily || !daily.time) {
    return null;
  }

  const dailyData = daily.time || [];
  const dailySunrise = daily.sunrise || [];
  const dailySunset = daily.sunset || [];
  const dayIndex = dailyData.indexOf(selectedDay);

  return (
    <Box>
      <Select placeholder="Select a day" value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} mt={4}>
        {dailyData.map((day, index) => (
          <option key={index} value={day}>
            {new Date(day).toLocaleDateString()}
          </option>
        ))}
      </Select>
      {selectedDay && dayIndex !== -1 && (
        <Box p={4} mt={4} borderWidth="1px" borderRadius="lg">
          <Text>{new Date(selectedDay).toLocaleDateString()}</Text>
          <HStack>
            <FaArrowUp />
            <Text>Sunrise: {new Date(dailySunrise[dayIndex]).toLocaleTimeString()}</Text>
          </HStack>
          <HStack>
            <FaArrowDown />
            <Text>Sunset: {new Date(dailySunset[dayIndex]).toLocaleTimeString()}</Text>
          </HStack>
        </Box>
      )}
    </Box>
  );
};

export default DailyForecast;
