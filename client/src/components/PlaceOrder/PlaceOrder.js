import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {
   Box, Button, Text, Stack, Icon, VStack, HStack, Checkbox, CheckboxGroup, Radio, RadioGroup, Divider, Alert, AlertDescription, AlertIcon,
   Step, Stepper, StepIndicator, StepStatus, StepIcon, StepNumber, StepTitle, StepDescription, StepSeparator, useSteps, IconButton
} from '@chakra-ui/react';
//import faicons
import { FaUser, FaEnvelope, FaIdCard, FaMoneyBillWave, FaHouseDamage } from "react-icons/fa";
import { currentUser } from '../../services/dataService';
import { addService, getBerthService } from '../../services/dataServiceServices';

const PlaceOrder = () => {

   const navigate = useNavigate();

   const [userInfo, setUserInfo] = useState(null);
   const [activeStep, setActiveStep] = useState(0);
   const [selectedServices, setSelectedServices] = useState([]);
   const [paymentMethod, setPaymentMethod] = useState('');
   const [missingInfo, setMissingInfo] = useState(false);
   const [orderConfirmed, setOrderConfirmed] = useState(false);

   const steps = [
      { title: 'User Info' },
      { title: 'Service Selection' },
      { title: 'Payment Method' },
      { title: 'Confirm Order' }
   ];

   const handleNext = () => {

      //if active step is 2 you can't go to three if there is no payment method selected, show some error message on UI
      if (activeStep === 1 && selectedServices.length === 0) {
         setMissingInfo(true);
         /*  console.log('No services selected');
          console.log("Active step: ", activeStep);
          console.log("Info is missing: ", missingInfo);
  */
      } else if (activeStep === 2 && paymentMethod === '') {
         setMissingInfo(true);
      } else {
         setMissingInfo(false);

         setActiveStep((prevStep) => prevStep + 1);
      }
   };

   const handlePrev = () => {
      setMissingInfo(false);

      setActiveStep((prevStep) => prevStep - 1);
   };

   const confirmOrder = async () => {
      //alert('Order confirmed');
      //when confirming order lets get service of user of type berth, gather the buoy attribute from it and with it and all the other data create a new service (for each selected service)
      //if type is fuel or trashwaste, status is PENDING and price is 0
      //we need to wait for getBerthService to finish before we can add the services

      //console.log("User info: ", userInfo);
      const berthService = await getBerthService(userInfo.id);
      //console.log("Berth service: ", berthService);
      const buoyNumber = berthService.buoy;
      //console.log("Buoy number: ", buoyNumber);
      selectedServices.forEach(service => {
         addService(userInfo.id, service, buoyNumber);
      });

      //set orderConfirmed and after 3 seconds navigate to profile and in sidebar select services
      //setOrderConfirmed(true);
      //setTimeout(() => {
      navigate("/profile");
      //}, 3000);
   };

   const getUserInfo = () => {
      return currentUser();
   };


   const handleServiceToggle = (service) => {
      setSelectedServices((prev) => {
         if (prev.includes(service)) {
            return prev.filter(s => s !== service);
         } else {
            return [...prev, service];
         }
      });
   };

   useEffect(() => {
      const fetchUserInfo = async () => {
         try {
            const user = await currentUser();
            setUserInfo(user && user !== "null" ? user : null);
         } catch (error) {
            console.error("Failed to fetch user info:", error);
         }

      };

      fetchUserInfo();
   }, []);



   return (
      <Box mt={50} margin="0 auto">
         <IconButton
            icon={<FaHouseDamage />}
            aria-label="Home"
            onClick={() => navigate('/profile')}
            mb={4}
         />
         <Stepper orientation='vertical' mt={5} ml={5} size='md' index={activeStep}>
            {steps.map((step, index) => (
               <Step key={index}>
                  <StepIndicator>
                     <StepStatus
                        complete={<StepIcon />}
                        incomplete={<StepNumber />}
                        active={<StepNumber />}
                     />
                  </StepIndicator>

                  <Box flexShrink='0'>
                     <StepTitle>{step.title}</StepTitle>
                  </Box>

                  <StepSeparator />
               </Step>
            ))}
         </Stepper>

         <Stack
            spacing={4}
            borderWidth="1px"
            borderRadius="lg"
            width={"90%"}
            overflow="hidden"
            boxShadow="lg"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
            margin="0 auto"
            mt={5}
         >
            {/* Content for each step */}
            {
               activeStep === 0 && userInfo && (
                  <Box mt={5} mb={10} display='flex' justifyContent='center' >
                     <VStack spacing={4} align="stretch" alignItems="flex-start">
                        <Text fontSize="md" d="flex" alignItems="center">
                           <Icon as={FaUser} color="gray.600" mr={2} />
                           <Text as="span" color="gray.500" mr={2}>Name:</Text>
                           <Text as="span" fontWeight="bold">{userInfo.name} {userInfo.surname}</Text>
                        </Text>
                        <Text fontSize="md" d="flex" alignItems="center">
                           <Icon as={FaEnvelope} color="gray.600" mr={2} />
                           <Text as="span" color="gray.500" mr={2}>Email:</Text>
                           <Text as="span" fontWeight="bold">{userInfo.email}</Text>
                        </Text>
                        <Text fontSize="md" d="flex" alignItems="center">
                           <Icon as={FaIdCard} color="gray.600" mr={2} />
                           <Text as="span" color="gray.500" mr={2}>PIN:</Text>
                           <Text as="span" fontWeight="bold">{userInfo.personalIdentificationNumber}</Text>
                        </Text>
                        <Text fontSize="md" d="flex" alignItems="center">
                           <Icon as={FaMoneyBillWave} color="gray.600" mr={2} />
                           <Text as="span" color="gray.500" mr={2}>Tax number:</Text>
                           <Text as="span" fontWeight="bold">{userInfo.taxNumber}</Text>
                        </Text>
                     </VStack>
                  </Box>
               )
            }
            {
               activeStep === 1 && (
                  <Box mt={5} mb={10} display='flex' justifyContent='center' >
                     <VStack spacing={4}>
                        <Text fontSize="lg" fontWeight="semibold">
                           Please select the services you require:
                        </Text>
                        <CheckboxGroup colorScheme="green" defaultValue={selectedServices} onChange={setSelectedServices}>
                           <Stack direction="column" spacing={2}>
                              <Checkbox value="fuel">Fuel</Checkbox>
                              <Checkbox value="trashwaste">Trash</Checkbox>
                           </Stack>
                        </CheckboxGroup>
                     </VStack>

                  </Box>

               )
            }
            {
               activeStep === 2 && (
                  <Box mt={5} mb={10} display='flex' justifyContent='center' >
                     <VStack spacing={4}>
                        <Text fontSize="lg" fontWeight="semibold">
                           Choose your payment method:
                        </Text>
                        <RadioGroup onChange={setPaymentMethod} value={paymentMethod}>
                           <Stack direction="column" spacing={2}>
                              <Radio value="Credit Card">Credit Card</Radio>
                              <Radio value="PayPal">PayPal</Radio>
                              <Radio value="Cash">Cash</Radio>
                           </Stack>
                        </RadioGroup>
                     </VStack>
                  </Box>
               )
            }
            {
               activeStep === 3 && (
                  <Box mt={5} mb={10} display='flex' justifyContent='center' >
                     <VStack spacing={4} align="stretch">
                        <Text fontSize="lg" fontWeight="semibold" mb={2}>
                           Review and Confirm Your Details
                        </Text>
                        <Divider />
                        <VStack spacing={2} align="stretch">
                           <Text fontSize="md"><strong>Name:</strong> {userInfo.name} {userInfo.surname}</Text>
                           <Text fontSize="md"><strong>Email:</strong> {userInfo.email}</Text>
                           <Text fontSize="md"><strong>PIN:</strong> {userInfo.personalIdentificationNumber}</Text>
                           <Text fontSize="md"><strong>Tax Number:</strong> {userInfo.taxNumber}</Text>
                           <Text fontSize="md"><strong>Selected Services:</strong> {selectedServices.join(', ')}</Text>
                           <Text fontSize="md"><strong>Payment Method:</strong> {paymentMethod}</Text>
                        </VStack>
                     </VStack>
                  </Box>
               )
            }

            {missingInfo && (
               <Box display='flex' justifyContent='center'>
                  <Alert width="75%" status="error" mt={5} mb={5}>
                     <AlertIcon />
                     <AlertDescription>Please fill in all the required fields.</AlertDescription>
                  </Alert>
               </Box>
            )}

            {/*align in the center */}
            <Box display='flex' justifyContent='center'>
               {activeStep > 0 && (
                  <Button colorScheme="blue" mr={5} onClick={handlePrev}>
                     Previous
                  </Button>
               )}

               {activeStep < 3 && (
                  <Button mb={5} colorScheme="blue" onClick={handleNext}>
                     Next
                  </Button>
               )}
            </Box>
            {activeStep === 3 && (
               <Box mt={1} mb={3} display='flex' justifyContent='center'>
                  <Button colorScheme="green" onClick={confirmOrder}>
                     Confirm Order
                  </Button>
               </Box>
            )}
         </Stack>
      </Box >
   )
};

export default PlaceOrder;
