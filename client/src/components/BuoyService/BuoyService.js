import React from 'react';
import PropTypes from "prop-types";

import { MarkerF } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import download from 'downloadjs';
import { useStripe } from '@stripe/react-stripe-js';

import {
  FormControl,
  FormLabel,
  Input,
  Stack,
  HStack,
  Button,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  RadioGroup,
  Radio,
  Step, Stepper, StepIndicator, StepStatus, StepIcon, StepNumber, StepTitle, StepSeparator, IconButton,
} from "@chakra-ui/react";
import { FaHouseDamage } from 'react-icons/fa';


//for invoice
import generateInvoice from '../../services/generateInvoice';

import { getBuoys, getBuoyByQrData, updateBuoy } from '../../services/dataServiceBuoys';
import { getVessel } from '../../services/dataServiceVessels';
import { currentUser } from '../../services/dataService';
import { addReceipt, getReceiptById } from '../../services/dataServiceReceipts';
import { addService, stripePayment, stripeCheckoutSession } from '../../services/dataServiceServices';

const BuoyService = () => {

  const navigate = useNavigate();
  const stripe = useStripe();


  const [selectedBuoy, setBuoy] = useState(null);
  const [buyer, setBuyer] = useState(null);
  const [vessel, setVessel] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");


  const getBuoyInfo = async (qrData) => {
    return getBuoyByQrData(qrData);
  };

  const getUserInfo = () => {
    return currentUser();
  };

  const getVesselInfo = async (idVessel) => {
    return getVessel(idVessel);
  };

  const createReceipt = async (idUsera, idVessel, idBuoy, totalPrice, pdf) => {
    return addReceipt(idUsera, idVessel, idBuoy, totalPrice, pdf);
  };


  const createService = async (idUsera, type, buoy) => {
    return addService(idUsera, type, buoy);
  };

  const updateBuoyInfo = async () => {
    try {
      // Make sure the vessel is selected before updating the buoy
      if (!vessel) {
        console.error("Vessel information is missing.");
        return;
      }

      // Prepare the data for the update
      const formData = {
        isPaid: true,
        vessel: vessel.id, // assuming the vessel object has an 'id' property
      };

      // Get the buoy ID from the selectedBuoy object
      const buoyId = selectedBuoy ? selectedBuoy.id : null;

      if (!buoyId) {
        console.error("Buoy information is missing.");
        return;
      }

      // Call the updateBuoy function from your data service
      const updatedBuoy = await updateBuoy(buoyId, formData);

      // Check if the update was successful
      if (updatedBuoy) {
        // Handle any additional logic after updating the buoy
       // console.log("Buoy updated successfully:", updatedBuoy);
      } else {
        console.error("Failed to update buoy information.");
      }
    } catch (error) {
      console.error("Error updating buoy information:", error);
    }
  };

  const handleConfirmReservation = async () => {
    try {
      // Call the updateBuoyInfo function when confirming the reservation
      await updateBuoyInfo();
  
      // Generate PDF
      const pdf = generatePDF(selectedBuoy, buyer, selectedServices, selectedPaymentMethod);
      const pdfDataUri = URL.createObjectURL(pdf);
  
      // Ensure we have buyer, vessel, and buoy information
      if (buyer && vessel && selectedBuoy) {
        try {
          const service = await createService(buyer.id, "berth", selectedBuoy.id);
          if (service) {
            const receipt = await createReceipt(buyer.id, vessel.id, selectedBuoy.id, selectedBuoy.price, pdf);
            if (receipt) {
              const amount = selectedBuoy.price * 100;
      
              try {
                const { id } = await stripeCheckoutSession(amount);
                console.log('Checkout session ID:', id);
                const result = await stripe.redirectToCheckout({
                  sessionId: id,
                });
      
                if (result.error) {
                  setErrorMessage(result.error.message);
                  console.error('Stripe error:', result.error.message);
                }
              } catch (error) {
                setErrorMessage('Error creating checkout session. Please try again.');
                console.error('Error creating checkout session:', error);
              }
      
              setTimeout(() => {
                navigate('/profile');
              }, 3000);
            } else {
              setErrorMessage("Error adding receipt. Please try again.");
            }
          } else {
            setErrorMessage("Error adding service. Please try again.");
          }
        } catch (serviceError) {
          setErrorMessage(serviceError.message);
          console.error("Error adding service:", serviceError);
        }
      } else {
        setErrorMessage("Missing user, vessel, or buoy information.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      console.error("Error confirming reservation:", error);
    }
  };
  






  const generatePDF = (buoy, buyer, selectedServices) => {
 
    //we will get pdf back - so save it to the receipt we will make in db
    return generateInvoice(buoy, buyer, selectedServices);

  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const buoyInfo = await getBuoyInfo(localStorage.getItem("buoy"));
        const userInfo = await getUserInfo();

        // Set selectedBuoy based on the condition
        setBuoy(buoyInfo && buoyInfo !== "null" ? buoyInfo : null);
        setBuyer(userInfo && userInfo !== "null" ? userInfo : null);

      } catch (error) {
        console.error("Error fetching buoy info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchVesselInfo = async () => {
      if (buyer) {
        try {
          const vesselInfo = await getVesselInfo(buyer.vessel);
          setVessel(vesselInfo && vesselInfo !== "null" ? vesselInfo : null);
        } catch (error) {
          //console.error("Error fetching vessel info:", error);
         // console.log("here i will display alert")
        }
      }
    };

    fetchVesselInfo();
  }, [buyer]);


  const handleServiceToggle = (service) => {
    const updatedServices = selectedServices.includes(service)
      ? selectedServices.filter((selected) => selected !== service)
      : [...selectedServices, service];

    setSelectedServices(updatedServices);
  };

  const handlePaymentMethodSelect = (value) => {
    setSelectedPaymentMethod(value);
   // console.log('Selected Payment Method:', value);
  };

  // Handle step change
  const handleStepChange = (step) => {
    setActiveStep(step);
  };


  const steps = [
    { title: 'Buoy Information' },
    { title: 'User Information' },
    { title: 'Choose Payment' },
    { title: 'Summary & Confirm' },
  ];

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handlePrev = () => setActiveStep((prev) => prev - 1);

  return (
    <Box p={4} maxW="sm" mx="auto">
      <IconButton
        icon={<FaHouseDamage />}
        aria-label="Home"
        onClick={() => navigate('/profile')}
        mb={4}
      />
      {errorMessage && (
        <Alert status="error" mb={4}>
          <Stack>
            <HStack>
              <AlertIcon />
              <AlertTitle mr={2}>Error</AlertTitle>
            </HStack>
            <Box>

              <AlertDescription>{errorMessage}</AlertDescription>
            </Box>
          </Stack>

        </Alert>
      )}
      <Stepper index={activeStep} orientation="vertical" size="md">
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>
            <Box flexShrink="0">
              <StepTitle>{step.title}</StepTitle>
            </Box>
            <StepSeparator />
          </Step>
        ))}
      </Stepper>

      <Box mt={4}>
        {activeStep === 0 && (
          <div>
            <br />
            <FormControl id="buoyName" isRequired>
              <FormLabel>Buoy Name</FormLabel>
              <Input
                type="text"
                value={isLoading ? "/" : (selectedBuoy ? selectedBuoy.qrData : "/")}
                placeholder="Buoy Name"
                disabled
              />
            </FormControl>

            <FormControl id="buoyPrice" isRequired>
              <FormLabel>Buoy Price</FormLabel>
              <Input
                type="text"
                value={isLoading ? "/" : (selectedBuoy ? selectedBuoy.price : "/")}
                placeholder="Buoy Price"
                disabled
              />
            </FormControl>
            <br />
          </div>
        )}
        {activeStep === 1 && (
          <div>
            <FormControl id="buyerName" isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                value={buyer ? buyer.name : ""}
                placeholder="Enter your name"
                disabled
              />
            </FormControl>

            <FormControl id="buyerSurname" isRequired>
              <FormLabel>Surname</FormLabel>
              <Input
                type="text"
                value={buyer ? buyer.surname : ""}
                placeholder="Enter your surname"
                disabled
              />
            </FormControl>

            <FormControl id="buyerPersonalIdentificationNumber" isRequired>
              <FormLabel>Personal Identification Number</FormLabel>
              <Input
                type="text"
                value={buyer ? buyer.personalIdentificationNumber : ""}
                placeholder="Enter your personal identification number"
                disabled
              />
            </FormControl>

            <FormControl id="buyerTaxNumber" isRequired>
              <FormLabel>Tax Number</FormLabel>
              <Input
                type="text"
                value={buyer ? buyer.taxNumber : ""}
                placeholder="Enter your tax number"
                disabled
              />
            </FormControl>

            <br />

            <FormControl id="vesselType" isRequired>
              <FormLabel>Vessel Type</FormLabel>
              <Input
                type="text"
                value={vessel ? vessel.type : ""}
                placeholder="Enter vessel type"
                disabled
              />
            </FormControl>

            <FormControl id="vesselName" isRequired>
              <FormLabel>Vessel Name</FormLabel>
              <Input
                type="text"
                value={vessel ? vessel.nameOfVessel : ""}
                placeholder="Enter vessel name"
                disabled
              />
            </FormControl>

            <FormControl id="vesselLength" isRequired>
              <FormLabel>Vessel Length</FormLabel>
              <Input
                type="text"
                value={vessel ? vessel.length : ""}
                placeholder="Enter vessel length"
                disabled
              />
            </FormControl>

            <FormControl id="vesselRegisterNumber" isRequired>
              <FormLabel>Register Number</FormLabel>
              <Input
                type="text"
                value={vessel ? vessel.registernumber : ""}
                placeholder="Enter vessel register number"
                disabled
              />
            </FormControl>

            <FormControl id="numberofPersonOnboard" isRequired>
              <FormLabel>Number of Persons Onboard</FormLabel>
              <Input
                type="text"
                value={vessel ? vessel.numberofPersonOnboard : ""}
                placeholder="Enter number of persons onboard"
                disabled
              />
            </FormControl>
            <br />
          </div>
        )}
        {activeStep === 2 && (
          <div>
            <RadioGroup value={selectedPaymentMethod} onChange={handlePaymentMethodSelect}>
              <Stack>
                <Radio value="card">Credit Card</Radio>
                <Radio value="paypal">PayPal</Radio>
                <Radio value="cash">Cash</Radio>
              </Stack>
            </RadioGroup>
          </div>
        )}
        {activeStep === 3 && (
          <div>
            <Text>Payment Method: {selectedPaymentMethod}</Text>
            <br />
            <Button colorScheme="blue" onClick={handleConfirmReservation}>
              Confirm Reservation
            </Button>
            <br />
          </div>
        )}
      </Box>

      <Box mt={4} display="flex" justifyContent="space-between">
        <Button onClick={handlePrev} isDisabled={activeStep === 0}>
          Back
        </Button>
        <Button onClick={handleNext} isDisabled={activeStep === steps.length - 1}>
          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </Box>
    </Box>
  );

};


BuoyService.propTypes = {};

BuoyService.defaultProps = {};

export default BuoyService;