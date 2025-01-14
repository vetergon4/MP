import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { getServicesByType } from "../../services/dataServiceServices";
import RevenueGraph from '../RevenueGraph/RevenueGraph';
import ServicesGraph from '../ServicesGraph/ServicesGraph';
import { Box, Spinner, Select } from '@chakra-ui/react';

const AdminStatisticsInfo = () => {
   const [allBerthServices, setAllBerthServices] = useState([]);
   const [allFuelServices, setAllFuelServices] = useState([]);
   const [allTrashServices, setAllTrashServices] = useState([]);
   const [loading, setLoading] = useState(true);
   const [selectedGraph, setSelectedGraph] = useState('revenue');
 
   useEffect(() => {
     const fetchData = async () => {
       try {
         const berthServices = await getServicesByType('berth');
         setAllBerthServices(berthServices);
 
         const fuelServices = await getServicesByType('fuel');
         setAllFuelServices(fuelServices);
 
         const trashServices = await getServicesByType('trashwaste');
         setAllTrashServices(trashServices);
 
         setLoading(false);
       } catch (error) {
         console.error('Error fetching services: ', error);
         setLoading(false);
       }
     };
 
     fetchData();
   }, []);
 
   if (loading) {
     return <Spinner />;
   }
 
   const renderGraph = () => {
     switch (selectedGraph) {
       case 'revenue':
         return (
           <RevenueGraph
             berthServices={allBerthServices}
             fuelServices={allFuelServices}
             trashServices={allTrashServices}
           />
         );
       case 'services':
         return (
           <ServicesGraph
             berthServices={allBerthServices}
             fuelServices={allFuelServices}
             trashServices={allTrashServices}
           />
         );
     {/* case 'revenueByMethod':
         return <RevenueByPaymentMethodGraph />; */} 
       default:
         return null;
     }
   };
 
   return (
     <Box p={5}>
       <h1>Select statistics you want to see</h1>
       <Select
         placeholder="Select graph"
         onChange={(e) => setSelectedGraph(e.target.value)}
         value={selectedGraph}
         mb={4}
       >
         <option value="revenue">Total Revenue</option>
         <option value="services">All services trends</option>
        {/*<option value="revenueByMethod">Revenue by Payment Method</option> */ }
       </Select>
       {renderGraph()}
     </Box>
   );
 };
 
 export default AdminStatisticsInfo;