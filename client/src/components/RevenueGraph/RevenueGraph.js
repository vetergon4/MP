import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Box, Button, ButtonGroup } from '@chakra-ui/react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register the required components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const RevenueGraph = ({ berthServices, fuelServices, trashServices }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [timeFilter, setTimeFilter] = useState('month'); // Default to month

  useEffect(() => {
    // Function to calculate daily revenue
    const calculateHourlyRevenue = () => {
      const allServices = [...berthServices, ...fuelServices, ...trashServices];
      const hourlyRevenue = allServices.reduce((acc, service) => {
        const date = new Date(service.createdAt);
        const hour = date.getHours();
        const dateKey = date.toISOString().split('T')[0];
        if (!acc[dateKey]) {
          acc[dateKey] = Array(24).fill(0);
        }
        acc[dateKey][hour] += service.price;
        return acc;
      }, {});
      return hourlyRevenue;
    };

    const hourlyRevenue = calculateHourlyRevenue();

    // Generate all hours for a given date
    const generateHourRange = (date) => {
      const hours = [];
      for (let i = 0; i < 24; i++) {
        hours.push(`${date}T${String(i).padStart(2, '0')}:00:00.000Z`);
      }
      return hours;
    };

    // Filter and sort data based on the selected time filter
    const filterData = () => {
      const now = new Date();
      let startDate;

      if (timeFilter === 'day') {
        startDate = new Date(now);
        const dateKey = startDate.toISOString().split('T')[0];
        const hours = generateHourRange(dateKey);

        const filteredRevenue = hours.map((hour, index) => ({
          hour,
          revenue: hourlyRevenue[dateKey] ? hourlyRevenue[dateKey][index] : 0,
        }));

        setFilteredData(filteredRevenue);
      } else if (timeFilter === 'week') {
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 6);
        const allDates = generateDateRange(startDate, now);

        const filteredRevenue = allDates.map(date => ({
          date,
          revenue: hourlyRevenue[date] ? hourlyRevenue[date].reduce((a, b) => a + b, 0) : 0,
        }));

        setFilteredData(filteredRevenue);
      } else {
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        const allDates = generateDateRange(startDate, now);

        const filteredRevenue = allDates.map(date => ({
          date,
          revenue: hourlyRevenue[date] ? hourlyRevenue[date].reduce((a, b) => a + b, 0) : 0,
        }));

        setFilteredData(filteredRevenue);
      }
    };

    const generateDateRange = (startDate, endDate) => {
      const dates = [];
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dates;
    };

    filterData();
  }, [berthServices, fuelServices, trashServices, timeFilter]);

  const chartData = {
    labels: filteredData.map(data => timeFilter === 'day' ? new Date(data.hour).toLocaleTimeString() : data.date),
    datasets: [
      {
        label: 'Revenue',
        data: filteredData.map(data => data.revenue),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
      }
    ]
  };

  return (
    <Box>
      <ButtonGroup mb={4}>
        <Button onClick={() => setTimeFilter('day')} colorScheme={timeFilter === 'day' ? 'teal' : 'gray'}>Day</Button>
        <Button onClick={() => setTimeFilter('week')} colorScheme={timeFilter === 'week' ? 'teal' : 'gray'}>Week</Button>
        <Button onClick={() => setTimeFilter('month')} colorScheme={timeFilter === 'month' ? 'teal' : 'gray'}>Month</Button>
      </ButtonGroup>
      <Line data={chartData} />
    </Box>
  );
};

export default RevenueGraph;
