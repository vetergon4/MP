import React, { useState, useEffect, useMemo } from 'react';
import {
   Box, Badge, Collapse, IconButton, SimpleGrid, Text, SkeletonText, Flex,
   Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverArrow, PopoverCloseButton, ButtonGroup, PopoverBody, PopoverFooter,
   Button, useDisclosure
} from '@chakra-ui/react';
import { FaChevronDown } from 'react-icons/fa';
import StyledCardService from './CardService.styled';

import { getVessel } from '../../services/dataServiceVessels';
import { getBuoyById } from '../../services/dataServiceBuoys';
import { getUserInformation } from '../../services/dataService';
import { updateServiceStatus } from '../../services/dataServiceServices';

const formatDate = (dateString) => {
   const date = new Date(dateString);
   const options = { year: 'numeric', month: 'long', day: 'numeric'};
   return date.toLocaleDateString('en-US', options);
};

const CardService = ({ idService, type, vesselId, buoyId, userId, status, date, searchTerm, onUpdateStatus }) => {

   const [isExpanded, setExpanded] = useState(false);
   const [buoyInfo, setBuoyInfo] = useState(null);
   const [vesselInfo, setVesselInfo] = useState(null);
   const [userInfo, setUserInfo] = useState(null);
   const { isOpen, onToggle, onClose } = useDisclosure();
   const [isPopoverOpen, setIsPopoverOpen] = useState(false);

   const togglePopover = () => {
      setIsPopoverOpen(!isPopoverOpen);
   };

   const handleExpandToggle = async () => {
      setExpanded(!isExpanded);
   };

   const getSpecificVessel = async () => {
      if (vesselId === null) {
         return 'N/A';
      }
      return await getVessel(vesselId);
   };

   const getSpecificBuoy = async () => {
      if (buoyId === null) {
         return 'N/A';
      }
      return await getBuoyById(buoyId);
   };

   const getSpecificUser = async () => {
      if (userId === null) {
         return 'N/A';
      }
      return await getUserInformation(userId);
   };

   const changeStatus = async () => {
      const newStatus = status === 'DONE' ? 'PENDING' : 'DONE';
      await onUpdateStatus(idService, newStatus);
   };

   const handleDelete = () => {
      console.log('Delete button clicked');
   };

   useEffect(() => {
      const fetchData = async () => {
         try {
            const [specificVesselInfo, specificBuoyInfo, specificUserInfo] = await Promise.all([
               getSpecificVessel().catch(() => ({ registernumber: 'No vessel' })),
               getSpecificBuoy().catch(() => ({ qrData: 'No buoy' })),
               getSpecificUser().catch(() => ({ email: 'No user' }))
            ]);
   
            setVesselInfo(specificVesselInfo);
            setBuoyInfo(specificBuoyInfo);
            setUserInfo(specificUserInfo);
         } catch (error) {
            console.error('Error fetching data:', error);
         }
      };
   
      fetchData();
   }, [vesselId, buoyId, userId]);
   

   const shouldDisplay = useMemo(() => {
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      const lowercaseType = type.toLowerCase();
      const lowercaseUser = userInfo ? userInfo.email.toLowerCase() : '';
      const lowercaseVesselRegisterNumber = vesselInfo ? vesselInfo.registernumber.toLowerCase() : 'no vessel';
      const lowercaseBuoyQRData = buoyInfo ? buoyInfo.qrData.toLowerCase() : '';
      const lowercaseStatus = status.toLowerCase();
      const lowercaseDate = formatDate(date).toLowerCase();
   
      return (
         lowercaseType.includes(lowercaseSearchTerm) ||
         lowercaseUser.includes(lowercaseSearchTerm) ||
         lowercaseVesselRegisterNumber.includes(lowercaseSearchTerm) ||
         lowercaseBuoyQRData.includes(lowercaseSearchTerm) ||
         lowercaseStatus.includes(lowercaseSearchTerm) ||
         lowercaseDate.includes(lowercaseSearchTerm)
      );
   }, [searchTerm, type, userInfo, vesselInfo, buoyInfo, status, date]);
   
   

   if (!shouldDisplay) {
      return null;
   }

   return (
      <StyledCardService>
         <div className="buoy-info">
            <div className="left-content">
               <IconButton
                  onClick={handleExpandToggle}
                  aria-label={isExpanded ? 'Collapse' : 'Expand'}
                  icon={<FaChevronDown />}
                  variant="ghost"
                  size="sm"
                  className="expand-icon"
                  colorScheme="blue"
               />
               <Text fontSize="lg" as='b' className="date-time">
                  {type ? type.toUpperCase() : <SkeletonText />}
               </Text>
            </div>
            <Text fontSize="md" className="buoy-info">
               {userInfo ? userInfo.email : <SkeletonText />}
            </Text>
            <Text fontSize="md" className="date-time" color={vesselInfo && vesselInfo.registernumber === 'No vessel' ? 'red.500' : 'gray.800'}>
               {vesselInfo ? vesselInfo.registernumber : <SkeletonText />}
            </Text>
            <Text fontSize="md" className="buoy-info">
               {buoyInfo ? buoyInfo.qrData : <SkeletonText />}
            </Text>
            <Badge className="vessel-register">
               {formatDate(date)}
            </Badge>
            <Badge colorScheme={status === 'DONE' ? 'green' : 'yellow'} className="vessel-register">
               {status}
            </Badge>
         </div>
   
         <Collapse in={isExpanded} animateOpacity>
            <Box mt="4" />
            <Box borderBottom="1px solid" borderColor="gray.300" mb="4" />
            <div className="additional-info">
               <SimpleGrid columns={2} spacing={4} className="user-vessel-grid">
                  {status === 'DONE' && (
                     <div className="info-box">
                        <Popover
                           returnFocusOnClose={false}
                           isOpen={isOpen}
                           onClose={onClose}
                           placement='right'
                           closeOnBlur={false}
                        >
                           <Text fontWeight="bold" className="info-title">
                              Be sure of your actions.
                           </Text>
                           <Box mt="4" />
                           <PopoverTrigger>
                              <Button mr={5} onClick={onToggle}>
                                 Change to pending
                              </Button>
                           </PopoverTrigger>
                           <PopoverContent>
                              <PopoverHeader fontWeight='semibold'>Confirmation</PopoverHeader>
                              <PopoverArrow />
                              <PopoverCloseButton />
                              <PopoverBody>
                                 Are you sure?
                              </PopoverBody>
                              <PopoverFooter display='flex' justifyContent='flex-end'>
                                 <ButtonGroup size='sm'>
                                    <Button variant='outline'>No</Button>
                                    <Button colorScheme='red' onClick={changeStatus}>Yes</Button>
                                 </ButtonGroup>
                              </PopoverFooter>
                           </PopoverContent>
                        </Popover>
                     </div>
                  )}
                  {status === 'PENDING' && (
                     <div className="info-box">
                        <Popover
                           returnFocusOnClose={false}
                           isOpen={isOpen}
                           onClose={onClose}
                           placement='right'
                           closeOnBlur={false}
                        >
                           <Text fontWeight="bold" className="info-title">
                              Make sure to complete the service before pressing done.
                           </Text>
                           <Box mt="4" />
                           <PopoverTrigger>
                              <Button mr={5} onClick={onToggle}>
                                 Done
                              </Button>
                           </PopoverTrigger>
                           <PopoverContent>
                              <PopoverHeader fontWeight='semibold'>Confirmation</PopoverHeader>
                              <PopoverArrow />
                              <PopoverCloseButton />
                              <PopoverBody>
                                 Are you sure service is done?
                              </PopoverBody>
                              <PopoverFooter display='flex' justifyContent='flex-end'>
                                 <ButtonGroup size='sm'>
                                    <Button variant='outline'>No</Button>
                                    <Button colorScheme='red' onClick={changeStatus}>Yes</Button>
                                 </ButtonGroup>
                              </PopoverFooter>
                           </PopoverContent>
                        </Popover>
                     </div>
                  )}
               </SimpleGrid>
               <Popover isOpen={isPopoverOpen} onClose={() => setIsPopoverOpen(false)} placement="left">
                  <Flex justifyContent="flex-end" mt="4">
                     <PopoverTrigger>
                        <Button colorScheme="red" onClick={togglePopover}>Delete service</Button>
                     </PopoverTrigger>
                  </Flex>
                  <PopoverContent>
                     <PopoverArrow />
                     <PopoverCloseButton />
                     <PopoverHeader>Confirmation</PopoverHeader>
                     <PopoverBody>Are you sure you want to delete this service?</PopoverBody>
                     <PopoverFooter>
                        <ButtonGroup>
                           <Button variant="outline" onClick={() => setIsPopoverOpen(false)}>Cancel</Button>
                           <Button colorScheme="red" onClick={handleDelete}>Delete</Button>
                        </ButtonGroup>
                     </PopoverFooter>
                  </PopoverContent>
               </Popover>
            </div>
         </Collapse>
      </StyledCardService>
   );
   
};

export default CardService;
