import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  VStack, HStack, Box, Spinner, Text, Button, Flex, useColorModeValue, useBreakpointValue,
} from '@chakra-ui/react';
import { format, parseISO, isAfter } from 'date-fns';
import { enUS } from 'date-fns/locale';

import cloudySunny from './cloudy-sunny.png';
import rainy from './rainy.png';
import cloudy from './cloudy.png';
import stormy from './stormy.png';
import sunny from './sunny.png';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';


const getWeatherIcon = (weatherCode) => {
  switch (weatherCode) {
    case 0: return sunny;
    case 1: return cloudySunny;
    case 2: return rainy;
    case 45: return cloudy; // Or another appropriate image for fog
    case 48: return cloudy; // Or another appropriate image for fog
    case 51: return rainy;
    case 61: return rainy;
    case 63: return rainy;
    case 65: return rainy;
    default: return cloudy;
  }
};

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('hourly');
  const bg = useColorModeValue('gray.100', 'gray.800');

  const fontSize = useBreakpointValue({ base: 'xl', md: '2xl' });
  const buttonSpacing = useBreakpointValue({ base: 4, md: 0 });
  const textSize = useBreakpointValue({ base: 'lg', md: '2xl' });
  const iconSize = useBreakpointValue({ base: '24px', md: '32px' });
  const tempSize = useBreakpointValue({ base: 'lg', md: '2xl' });
  const descSize = useBreakpointValue({ base: 'sm', md: 'md' });

  const latitude = 43.6864586;
  const longitude = 15.7091269;

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: { latitude, longitude },
      });
      console.log(response.data); // Log the data part of the response
      setWeather(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Error fetching weather data');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWeather();
  }, []);


  return (
    <VStack spacing={4} align="center" p={5} minH="100vh" bg={bg}>
      <Flex width="100%" justifyContent="space-between" alignItems="center" flexWrap="wrap">
        <Text fontSize={fontSize} fontWeight="bold">
          Weather Dashboard
        </Text>
        <HStack spacing={2} mt={buttonSpacing}>
          <Button colorScheme={view === 'hourly' ? 'teal' : 'gray'} onClick={() => setView('hourly')}>
            Hourly
          </Button>
          <Button colorScheme={view === 'daily' ? 'teal' : 'gray'} onClick={() => setView('daily')}>
            Daily
          </Button>
        </HStack>
      </Flex>
      {error && <Text color="red.500">{error}</Text>}
      {loading ? (
        <Spinner size="xl" />
      ) : (
        weather && (
          <Box width="100%" p={6} borderRadius="lg" boxShadow="xl">
            <HStack justifyContent="center" spacing={4}>
              <Box  textAlign="center">
                <WeatherCard
                  time="Now"
                  temp={weather.hourly.temperature_2m[0]} // Assuming first element for current
                  icon={getWeatherIcon(weather.hourly.weathercode[0])}
                  description={"Current Weather"}
                  windSpeed={weather.hourly.wind_speed_10m[0]}
                  windDirection={weather.hourly.winddirection_10m[0]}
                  precipitation={weather.hourly.precipitation[0]}
                  visibility={weather.hourly.visibility[0]}
                  iconSize={iconSize} // Adjust this as needed
                  tempSize={tempSize}
                  descSize={descSize}
                />
              </Box>
              {view === 'hourly' ? (
                <HourlyForecast hourly={weather.hourly} iconSize={iconSize * 0.8} tempSize={tempSize} descSize={descSize} />
              ) : (
                <DailyForecast daily={weather.daily} iconSize={iconSize * 0.8} tempSize={tempSize} descSize={descSize} />
              )}
            </HStack>
          </Box>
        )
      )}
    </VStack>
  );
};

const WeatherCard = ({ time, temp, icon, description, windSpeed, windDirection, precipitation, iconSize, tempSize, descSize }) => (
  <Box p={4} borderWidth={1} borderRadius="md" w="100%" textAlign="center" bg="blue.50" mb={4}>
    <Text fontSize={descSize} mb={2}>{time}</Text>
    <Text fontSize={tempSize} mb={2}>{temp}°C</Text>
    <Box as="img" src={icon} alt={description} width={iconSize * 1.2} height={iconSize * 1.2} mb={2} />
    <Text fontSize={descSize} mb={2}>Wind: {windSpeed} km/h {windDirection}°</Text>
    <Text fontSize={descSize}>Precipitation: {precipitation} mm</Text>
  </Box>
);




const HourlyForecast = ({ hourly, iconSize, tempSize, descSize }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const cardsPerRow = useBreakpointValue({ base: 2, md: 4, lg: 6 }) || 2; // Fallback to 2 if undefined
  const currentTime = new Date();

  const filteredTimes = hourly.time.filter((time) => isAfter(parseISO(time), currentTime));
  const totalPages = Math.ceil(filteredTimes.length / cardsPerRow);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startIndex = currentPage * cardsPerRow;
  const endIndex = startIndex + cardsPerRow;
  const displayedTimes = filteredTimes.slice(startIndex, endIndex);

  return (
    <Box mt={4} width="100%">
      <HStack justifyContent="center" spacing={4}>
        {displayedTimes.map((time, index) => (
          <WeatherCard
            key={index}
            time={format(parseISO(time), 'HH:mm', { locale: enUS })}
            temp={hourly.temperature_2m[startIndex + index]}
            icon={getWeatherIcon(hourly.weathercode[startIndex + index])}
            description={"Weather"}
            windSpeed={hourly.wind_speed_10m[startIndex + index]}
            windDirection={hourly.winddirection_10m[startIndex + index]}
            precipitation={hourly.precipitation[startIndex + index]}
            visibility={hourly.visibility[startIndex + index]}
            iconSize={iconSize}
            tempSize={tempSize}
            descSize={descSize}
          />
        ))}
      </HStack>
      <HStack justifyContent="space-between" width="100%" mb={4}>
        <Button onClick={handlePrevPage} disabled={currentPage === 0}>
          Previous
        </Button>
        <Button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
          Next
        </Button>
      </HStack>
    </Box>
  );
};

const DailyForecast = ({ daily, iconSize, tempSize, descSize }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const cardsPerRow = useBreakpointValue({ base: 2, md: 4, lg: 6 }) || 2; // Fallback to 2 if undefined

  if (!daily || !daily.time || !daily.temperature_2m_max) {
    console.error('Daily data is not available or not structured correctly');
    return <Text>Daily data is not available</Text>;
  }

  const totalPages = Math.ceil(daily.time.length / cardsPerRow);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startIndex = currentPage * cardsPerRow;
  const endIndex = startIndex + cardsPerRow;
  const displayedTimes = daily.time.slice(startIndex, endIndex);

  return (
    <Box mt={4} width="100%">
      <HStack justifyContent="center" spacing={4}>
        {displayedTimes.map((time, index) => (
          <WeatherCard
            key={index}
            time={format(parseISO(time), 'EEEE, MMM d', { locale: enUS })}
            temp={daily.temperature_2m_max[startIndex + index]}
            icon={getWeatherIcon(daily.weathercode ? daily.weathercode[startIndex + index] : 0)}
            description={"Weather"}
            windSpeed={daily.windspeed_10m_max[startIndex + index]}
            precipitation={daily.precipitation_sum[startIndex + index]}
            iconSize={iconSize}
            tempSize={tempSize}
            descSize={descSize}
          />
        ))}
      </HStack>
    </Box>
  );
};

export default Weather;
