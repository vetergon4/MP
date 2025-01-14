import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Box, ButtonGroup, Button, CheckboxGroup, Checkbox, VStack, Spinner } from '@chakra-ui/react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register the required components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ServicesGraph = ({ berthServices, fuelServices, trashServices }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [timeFilter, setTimeFilter] = useState('month'); // Default to month
  const [selectedServices, setSelectedServices] = useState(['berth', 'fuel', 'trashwaste']);

  useEffect(() => {
    const calculateDailyTrends = (services) => {
      const dailyTrends = services.reduce((acc, service) => {
        const date = new Date(service.createdAt).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date] += 1;
        return acc;
      }, {});
      return dailyTrends;
    };

    const dailyBerthTrends = calculateDailyTrends(berthServices);
    const dailyFuelTrends = calculateDailyTrends(fuelServices);
    const dailyTrashTrends = calculateDailyTrends(trashServices);

    const generateDateRange = (startDate, endDate) => {
      const dates = [];
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dates;
    };

    const filterData = () => {
      const now = new Date();
      let startDate;

      if (timeFilter === 'day') {
        startDate = new Date(now);
      } else if (timeFilter === 'week') {
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 6);
      } else {
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
      }

      const allDates = generateDateRange(startDate, now);

      const filteredBerthData = allDates.map(date => ({
        date,
        count: dailyBerthTrends[date] || 0,
      }));
      const filteredFuelData = allDates.map(date => ({
        date,
        count: dailyFuelTrends[date] || 0,
      }));
      const filteredTrashData = allDates.map(date => ({
        date,
        count: dailyTrashTrends[date] || 0,
      }));

      setFilteredData({ filteredBerthData, filteredFuelData, filteredTrashData });
    };

    filterData();
  }, [berthServices, fuelServices, trashServices, timeFilter, selectedServices]);

  const chartData = {
    labels: filteredData.filteredBerthData ? filteredData.filteredBerthData.map(data => data.date) : [],
    datasets: [
      selectedServices.includes('berth') && {
        label: 'Berth Services',
        data: filteredData.filteredBerthData ? filteredData.filteredBerthData.map(data => data.count) : [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
      },
      selectedServices.includes('fuel') && {
        label: 'Fuel Services',
        data: filteredData.filteredFuelData ? filteredData.filteredFuelData.map(data => data.count) : [],
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: false,
      },
      selectedServices.includes('trashwaste') && {
        label: 'Trashwaste Services',
        data: filteredData.filteredTrashData ? filteredData.filteredTrashData.map(data => data.count) : [],
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        fill: false,
      }
    ].filter(Boolean)
  };

  return (
    <Box>
      <ButtonGroup mb={4}>
        <Button onClick={() => setTimeFilter('day')} colorScheme={timeFilter === 'day' ? 'teal' : 'gray'}>Day</Button>
        <Button onClick={() => setTimeFilter('week')} colorScheme={timeFilter === 'week' ? 'teal' : 'gray'}>Week</Button>
        <Button onClick={() => setTimeFilter('month')} colorScheme={timeFilter === 'month' ? 'teal' : 'gray'}>Month</Button>
      </ButtonGroup>
      <CheckboxGroup
        colorScheme="teal"
        defaultValue={['berth', 'fuel', 'trashwaste']}
        onChange={(values) => setSelectedServices(values)}
      >
        <VStack align="start">
          <Checkbox value="berth">Berth Services</Checkbox>
          <Checkbox value="fuel">Fuel Services</Checkbox>
          <Checkbox value="trashwaste">Trashwaste Services</Checkbox>
        </VStack>
      </CheckboxGroup>
      {filteredData.filteredBerthData ? <Line data={chartData} /> : <Spinner />}
    </Box>
  );
};

export default ServicesGraph;
