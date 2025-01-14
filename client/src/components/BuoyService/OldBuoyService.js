import React from 'react';
import PropTypes from "prop-types";

import { MarkerF } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


import {
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { Grid, Paper, Stepper, Step, StepLabel, Typography, makeStyles, Checkbox, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';


//for invoice
import generateInvoice from '../../services/generateInvoice';
import jsPDF from 'jspdf';

//components
import PageContainer from "../Layout/PageContainer/PageContainer";
import PageContent from "../Layout/PageContent/PageContent";
import Nav from "../Layout/Nav/Nav";
import Footer from "../Layout/Footer/Footer";
import Card from "../Layout/Card/Card";
import { Profile } from "../Profile/Profile";

import { getBuoys, getBuoyByQrData, updateBuoy } from '../../services/dataServiceBuoys';
import { getVessel } from '../../services/dataServiceVessels';
import { currentUser } from '../../services/dataService';
import { addReceipt, getReceiptById } from '../../services/dataServiceReceipts';
import { addService } from '../../services/dataServiceServices';

const BuoyService = () => {

  const navigate = useNavigate();


  const [selectedBuoy, setBuoy] = useState(null);
  const [buyer, setBuyer] = useState(null);
  const [vessel, setVessel] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isLoading, setLoading] = useState(true);


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
        console.log("Buoy updated successfully:", updatedBuoy);
      } else {
        console.error("Failed to update buoy information.");
      }
    } catch (error) {
      console.error("Error updating buoy information:", error);
    }
  };


  const handleConfirmReservation = () => {
    // Call the updateBuoyInfo function when confirming the reservation
    updateBuoyInfo();

    //we will get pdf back - so save it to the receipt we will make in db
    const pdf = generatePDF(selectedBuoy, buyer, selectedServices, selectedPaymentMethod);


    const pdfDataUri = URL.createObjectURL(pdf);

    // Open the PDF in a new tab/window
    window.open(pdfDataUri, '_blank');

    createReceipt(buyer.id, vessel.id, selectedBuoy.id, selectedBuoy.price, pdf);
    createService(buyer.id, "berth", selectedBuoy.id);

    //navigate to profile
    navigate('/profile');
  };

  const generatePDF = (buoy, buyer, selectedServices, selectedPaymentMethod) => {

    //we will get pdf back - so save it to the receipt we will make in db
    return generateInvoice(buoy, buyer, selectedServices, selectedPaymentMethod);

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
        setLoading(false);
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
          console.log("here i will display alert")
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

  const handlePaymentMethodSelect = (paymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
  };


  // Steps for the vertical stepper
  const steps = ['Buoy information', 'Buyer information', 'Payment information', 'Confirm Reservation'];

  // Active step state
  const [activeStep, setActiveStep] = React.useState(0);

  // Handle step change
  const handleStepChange = (step) => {
    setActiveStep(step);
  };


  return (
    <PageContainer isFixedNav>
      <Nav />
      <PageContent
        title="Buoy Reservation"
        primaryAction={{
          content: "Reserve Buoy",
          onClick: () => {
            // Implement reservation logic
            alert("Buoy reserved!");
          },
        }}
      >
        {vessel ? (
          <Card title="Buoy Reservation Details" width="50%" >
            <Paper style={{ padding: '16px' }}>
              {/* Material-UI Stepper component */}
              <Stepper activeStep={activeStep} orientation="horizontal">
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <div>
                {/* Content for each step */}
                {activeStep === 0 && (
                  <div>
                    <Typography variant="h6">Step 1 - Check buoy information</Typography>
                    <br></br>
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
                    <br></br>
                    {/* Additional content for Step 1 goes here */}
                    <Button colorScheme="blue" onClick={() => handleStepChange(1)}>
                      Next
                    </Button>
                  </div>
                )}
                {activeStep === 1 && (
                  <div>
                    <Typography variant="h6">Step 2 - Enter buyer information</Typography>
                    <br></br>
                    <Typography variant="body1">Buyer Information</Typography>

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

                    <br></br>

                    {/* Vessel Information - typografy with content and bold font*/}
                    <Typography variant="body1">Vessel Information</Typography>

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
                    <br></br>
                    {/* Additional content for Step 1 goes here */}
                    <Button colorScheme="blue" onClick={() => handleStepChange(2)}>
                      Next
                    </Button>
                  </div>
                )}


                {/* Content for Choose Payment step */}
                {activeStep === 2 && (
                  <div>
                    <Typography variant="h6">Step 3 - Choose Payment Method</Typography>
                    <RadioGroup
                      value={selectedPaymentMethod}
                      onChange={(e) => handlePaymentMethodSelect(e.target.value)}
                    >
                      <FormControlLabel value="card" control={<Radio />} label="Credit Card" />
                      <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
                      <FormControlLabel value="cash" control={<Radio />} label="Cash" />
                    </RadioGroup>
                    <Button colorScheme="blue" onClick={() => handleStepChange(3)}>
                      Next
                    </Button>
                  </div>
                )}

                {/* Content for Confirm Reservation step */}
                {activeStep === 3 && (
                  <div>
                    <Typography variant="h6">Step 4 - Confirm Reservation</Typography>
                    {/* Display selected services */}
                    <br></br>
                    <Typography variant="body1">Selected Services: {selectedServices.join(", ")}</Typography>
                    {/* Display selected payment method */}
                    <Typography variant="body1">Payment Method: {selectedPaymentMethod}</Typography>
                    <br></br>
                    <Button colorScheme="blue" onClick={handleConfirmReservation}>
                      Confirm Reservation
                    </Button>
                    <br></br>

                  </div>
                )}
              </div>
            </Paper>
          </Card>

        ) : (
          <Alert status='error'>
            <AlertIcon />
            <AlertTitle>Vessel mising!</AlertTitle>
            <AlertDescription>You don't have vessel registred, so you can't use this option.</AlertDescription>
            {/* lets add button to navigate back to  profile*/}
            <Button colorScheme="blue" onClick={() => navigate('/profile')}>
              Go to profile
            </Button>
          </Alert>
        )}
      </PageContent>
      <Footer />
    </PageContainer>
  );
};

BuoyService.propTypes = {};

BuoyService.defaultProps = {};

export default BuoyService;