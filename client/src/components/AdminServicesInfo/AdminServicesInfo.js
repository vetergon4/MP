import React, { useEffect, useState, useMemo } from 'react';
import { Box, Flex, Input, InputGroup, InputRightElement, Button, Text, useBreakpointValue, Stack, Spinner } from '@chakra-ui/react';
import { FaSearch, FaSortAlphaDown, FaSortAlphaUp, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import CardService from '../CardService/CardService';
import { getAllServices, updateServiceStatus } from '../../services/dataServiceServices';

const AdminServicesInfo = () => {
   const [allServices, setAllServices] = useState([]);
   const [sortCriteria, setSortCriteria] = useState('date');
   const [sortOrder, setSortOrder] = useState('asc');
   const [searchTerm, setSearchTerm] = useState('');
   const [currentPage, setCurrentPage] = useState(1);
   const [loading, setLoading] = useState(false);

   const servicesPerPage = useBreakpointValue({ base: 3, sm: 3, md: 6, lg: 7, xl: 8 });

   const indexOfLastService = currentPage * servicesPerPage;
   const indexOfFirstService = indexOfLastService - servicesPerPage;
   const currentServices = allServices.slice(indexOfFirstService, indexOfLastService);

   const getServices = async () => {
      setLoading(true);
      try {
         const services = await getAllServices();
         const filteredServices = services.map(service => {
            if (service.vessel <= 0 || service.user <= 0) {
               return {
                  ...service,
                  vesselRegisterNumber: 'No vessel',
                  vesselDeleted: true,
               };
            }
            return service;
         });
         setAllServices(filteredServices);
      } finally {
         setLoading(false);
      }
   };

   const handleStatusUpdate = async (idService, newStatus) => {
      setLoading(true);
      try {
         await updateServiceStatus(idService, newStatus);
         getServices();
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      getServices();
   }, [currentPage]);

   useEffect(() => {
      sortServices(allServices, sortCriteria, sortOrder);
   }, [sortCriteria, sortOrder]);

   const handleSort = (criteria) => {
      if (criteria === sortCriteria) {
         setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      } else {
         setSortCriteria(criteria);
         setSortOrder('asc');
      }
      sortServices(allServices, criteria, sortOrder);
   };

   const sortServices = (data, criteria, order) => {
      const sortedData = [...data];
      sortedData.sort((a, b) => {
         if (criteria === 'date') {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return order === 'asc' ? dateA - dateB : dateB - dateA;
         } else {
            if (order === 'asc') {
               return a[criteria] > b[criteria] ? 1 : -1;
            } else {
               return a[criteria] < b[criteria] ? 1 : -1;
            }
         }
      });
      setAllServices(sortedData);
   };

   const handleSearch = (event) => {
      setSearchTerm(event.target.value);
   };

   const getSortIcon = (criteria) => {
      if (criteria === sortCriteria) {
         return sortOrder === 'asc' ? <FaSortAlphaDown /> : <FaSortAlphaUp />;
      }
      return null;
   };

   const paginate = (pageNumber) => {
      setCurrentPage(pageNumber);
   };

   return (
      <div>
         <Box mb="16px">
            <InputGroup>
               <Input placeholder="Search" value={searchTerm} onChange={handleSearch} />
               <InputRightElement children={<FaSearch />} />
            </InputGroup>
         </Box>
         <Flex
            bg="linear-gradient(45deg, #ffffff, #f0f0f0)"
            p="16px"
            borderRadius="12px"
            boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
            justifyContent="space-between"
            alignItems="center"
            borderBottomWidth="1px"
            mb="16px"
         >
            <Button variant="unstyled" onClick={() => handleSort('type')}>
               <Flex alignItems="center">
                  <Text fontSize="md" fontWeight="bold" color="gray.800" marginRight="12px">Service type</Text>
                  {getSortIcon('type')}
               </Flex>
            </Button>
            <Button variant="unstyled" onClick={() => handleSort('user')}>
               <Flex alignItems="center">
                  <Text fontSize="md" fontWeight="bold" color="gray.800" marginRight="12px">User</Text>
                  {getSortIcon('user')}
               </Flex>
            </Button>
            <Button variant="unstyled" onClick={() => handleSort('vesselId')}>
               <Flex alignItems="center">
                  <Text fontSize="md" fontWeight="bold" color="gray.800" marginRight="12px">Vessel register number</Text>
                  {getSortIcon('vesselId')}
               </Flex>
            </Button>
            <Button variant="unstyled" onClick={() => handleSort('buoyId')}>
               <Flex alignItems="center">
                  <Text fontSize="md" fontWeight="bold" color="gray.800" marginRight="12px">Buoy</Text>
                  {getSortIcon('buoyId')}
               </Flex>
            </Button>
            <Button variant="unstyled" onClick={() => handleSort('date')}>
               <Flex alignItems="center">
                  <Text fontSize="md" fontWeight="bold" color="gray.800" marginRight="12px">Time</Text>
                  {getSortIcon('date')}
               </Flex>
            </Button>
            <Button variant="unstyled" onClick={() => handleSort('status')}>
               <Flex alignItems="center">
                  <Text fontSize="md" fontWeight="bold" color="gray.800" marginRight="12px">Status</Text>
                  {getSortIcon('status')}
               </Flex>
            </Button>
         </Flex>
         {loading ? (
            <Flex justifyContent="center" alignItems="center" minHeight="60vh">
               <Spinner size="xl" />
            </Flex>
         ) : (
            <>
               {currentServices.map((service) => (
                  <CardService
                     key={service.id}
                     idService={service.id}
                     type={service.type}
                     vesselId={service.vessel}
                     buoyId={service.buoy}
                     userId={service.user}
                     status={service.status}
                     date={service.createdAt}
                     vesselRegisterNumber={service.vesselRegisterNumber}
                     buoyQRData={service.buoyQRData}
                     searchTerm={searchTerm}
                     onUpdateStatus={handleStatusUpdate}
                  />
               ))}
            </>
         )}
         <Flex justifyContent="center" mt={4} >
            <Stack direction="row" spacing={2}>
               <Button
                  onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                  colorScheme="gray"
                  size="sm"
                  leftIcon={<FaArrowLeft />}
                  disabled={currentPage === 1}
               >
                  Previous
               </Button>
               {Array.from({ length: Math.ceil(allServices.length / servicesPerPage) }).map((_, index) => (
                  <Button
                     key={index + 1}
                     onClick={() => paginate(index + 1)}
                     colorScheme={currentPage === index + 1 ? 'blue' : 'gray'}
                     size="sm"
                  >
                     {index + 1}
                  </Button>
               ))}
               <Button
                  onClick={() => setCurrentPage(currentPage < Math.ceil(allServices.length / servicesPerPage) ? currentPage + 1 : currentPage)}
                  colorScheme="gray"
                  size="sm"
                  rightIcon={<FaArrowRight />}
                  disabled={currentPage === Math.ceil(allServices.length / servicesPerPage)}
               >
                  Next
               </Button>
            </Stack>
         </Flex>
      </div>
   );
};

export default AdminServicesInfo;
