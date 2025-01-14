import React from 'react';
import { Line } from 'react-chartjs-2';
import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Tooltip,
   Legend
} from 'chart.js';

import { Card } from '@chakra-ui/react';

ChartJS.register(
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Tooltip,
   Legend
);


const CardGraphBuoys = () => {

   const data = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
         {
            label: 'Sales for 2023 (M)',
            data: [3, 2, 2, 1, 5, 4],
            fill: false,
            backgroundColor: 'rgb(75, 192, 192)',
            borderColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.5 // This adds some "curve" to the line
         },
      ],
   };

   const options = {
      responsive: true,
      plugins: {
         legend: {
            position: 'top',
         },
         title: {
            display: true,
            text: 'Sales Data',
         },
      },
   };


   return (
      <Card>
         <Line options={options} data={data} />
      </Card>

   )
};


export default CardGraphBuoys;
