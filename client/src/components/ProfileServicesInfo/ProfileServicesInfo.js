import React, { useState, useEffect } from "react";
import { Stack, Flex, Box, Text, Button, IconButton, useBreakpointValue, VStack, HStack, useToast } from "@chakra-ui/react";
import { FaCamera, FaPlus, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

import { useNavigate } from "react-router-dom";

import { getServicesByUser } from "../../services/dataServiceServices";
import {getUserInformation} from "../../services/dataService";

import CardServiceUser from "../CardServiceUser/CardServiceUser";


const ProfileServicesInfo = ({ userId }) => {
    const [services, setServices] = useState([]);
    const [user, setUser] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const servicesPerPage = useBreakpointValue({ base: 3, sm: 3, md: 6, lg: 8, xl: 10 });
  
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const indexOfLastService = currentPage * servicesPerPage;
    const indexOfFirstService = indexOfLastService - servicesPerPage;
    const currentServices = services.slice(indexOfFirstService, indexOfLastService);
  
    const toast = useToast();
    const navigate = useNavigate();
  
    const addServiceRequest = () => {
      if (user.vessel > 0) {
        navigate("/order");
      } else {
        toast({
          description: "You need to add a vessel to add a service.",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
      }
    };
  
    const navigateToQRScanner = () => {
      if (user.vessel > 0) {
        navigate("/reservation");
      } else {
        toast({
          description: "You need to add a vessel to scan a QR code.",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
      }
    };
  
    useEffect(() => {
      console.log("userId : ", userId);
      getServicesByUser(userId).then(data => {
        setServices(data);
      }).catch(error => {
        console.error("Failed to fetch services:", error);
      });
  
      getUserInformation(userId).then(data => {
        setUser(data);
      }).catch(error => {
        console.error("Failed to fetch user information:", error);
      });
  
    }, [userId]);
  
    return (
      <Flex
        bg="linear-gradient(45deg, #ffffff, #f0f0f0)"
        borderRadius="12px"
        boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
      >
        <VStack spacing={2} alignItems="center" w="100%" justify="center" pl={1} pr={1}>
          <HStack width="100%" p={2}>
            <IconButton
              icon={<FaPlus />}
              colorScheme="blue"
              onClick={addServiceRequest}
              aria-label="Add Service"
            />
            <IconButton
              icon={<FaCamera />}
              colorScheme="teal"
              onClick={navigateToQRScanner}
              aria-label="Scan QR Code"
            />
          </HStack>
          <Text fontSize="xl" fontWeight="bold">Your Services:</Text>
          {services.length > 0 ? (
            <>
              {currentServices.map(service => (
                <CardServiceUser
                  key={service.id}
                  type={service.type}
                  date={service.createdAt}
                  status={service.status}
                  buyer={user}
                  buoy={service.buoy}
                  selectedPaymentMethod={service.paymentMethod}
                />
              ))}
              <Flex justifyContent="center" mt={4} mb={4}>
                <Stack direction="row" spacing={2}>
                  <Button
                    onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                    colorScheme="gray"
                    size="sm"
                    leftIcon={<FaArrowLeft />}
                    disabled={currentPage === 1}
                  >
                  </Button>
                  {Array.from({ length: Math.ceil(services.length / servicesPerPage) }).map((_, index) => (
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
                    onClick={() => setCurrentPage(currentPage < Math.ceil(services.length / servicesPerPage) ? currentPage + 1 : currentPage)}
                    colorScheme="gray"
                    size="sm"
                    rightIcon={<FaArrowRight />}
                    disabled={currentPage === Math.ceil(services.length / servicesPerPage)}
                  >
                  </Button>
                </Stack>
              </Flex>
            </>
          ) : (
            <Text fontSize="md" color="gray.500">No services</Text>
          )}
        </VStack>
      </Flex>
    );
  };
  
  export default ProfileServicesInfo;