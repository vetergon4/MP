import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
   Box,
   Button,
   Card,
   Stack,
   Text,
   Step,
   StepDescription,
   StepIcon,
   StepIndicator,
   StepNumber,
   StepSeparator,
   StepStatus,
   StepTitle,
   Stepper,
   useSteps,
   useToast,
   Select   
} from "@chakra-ui/react";

//Services and functions
import generateInvoice from '../../services/generateInvoice';
import { getBuoys, getBuoyByQrData, updateBuoy } from '../../services/dataServiceBuoys';
import { getVessel } from '../../services/dataServiceVessels';
import { currentUser } from '../../services/dataService';
import { addReceipt, getReceiptById } from '../../services/dataServiceReceipts';
import { addService } from '../../services/dataServiceServices';



const ReservationStepper = ({ currentStep, buoyInfo }) => {

   const navigate = useNavigate();

   const steps = [
      { title: 'Buoy information' },
      { title: 'Buyer information' },
      { title: 'Vessel information'},
      { title: 'Payment information' },
      { title: 'Confirm Reservation' },
   ];

   const [activeStep, setActiveStep] = useState(0);

   const handleNext = () => {
      setActiveStep((prevStep) => prevStep + 1);
   };

   const handlePrev = () => {
      setActiveStep((prevStep) => prevStep - 1);
   };



   const [selectedBuoy, setBuoy] = useState(null);
   const [buyer, setBuyer] = useState(null);
   const [vessel, setVessel] = useState(null);
   const [isLoading, setLoading] = useState(true);
   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

   // Dropdown options for payment methods
   const paymentMethods = ['Credit Card', 'PayPal'];

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
      const pdf = generatePDF(selectedBuoy, buyer, "", selectedPaymentMethod);


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

   const handlePaymentMethodSelect = (paymentMethod) => {
      setSelectedPaymentMethod(paymentMethod);
   };


   //When component mounts - execute this
   useEffect(() => {
      const fetchData = async () => {
         try {
            const buoyInfo = await getBuoyInfo(localStorage.getItem("buoy"));
            const userInfo = await getUserInfo();

            // Set selectedBuoy based on the condition
            setBuoy(buoyInfo && buoyInfo !== "null" ? buoyInfo : null);
            setBuyer(userInfo && userInfo !== "null" ? userInfo : null);

            // Fetch vessel info if buyer exists
            if (userInfo && userInfo !== "null") {
               const vesselInfo = await getVesselInfo(userInfo.vessel);
               setVessel(vesselInfo && vesselInfo !== "null" ? vesselInfo : null);
            }
         } catch (error) {
            console.error("Error fetching data:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchData();
   }, []);
   return (
      <Card>
        <Box>
          <Stepper size="lg" index={activeStep}>
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
                  <StepDescription>{step.description}</StepDescription>
                </Box>
    
                <StepSeparator />
              </Step>
            ))}
          </Stepper>
    
          {/* Content for each step */}
          {activeStep === 0 && buoyInfo && (
            <Box mt={4}>
              <Stack>
                <Text>Buoy name: {buoyInfo.qrData}</Text>
                <Text>Price: {buoyInfo.price}</Text>
              </Stack>
            </Box>
          )}
          {activeStep === 1 && buyer && (
            <Box mt={4}>
              <Text> Buyer: {buyer.name} {buyer.surname}</Text>
              <Text> Email: {buyer.email}</Text>
              <Text> PIN: {buyer.personalIdentificationNumber}</Text>
              <Text> Tax number: {buyer.taxNumber}</Text>
            </Box>
          )}
          {activeStep === 2 && vessel && (
            <Box mt={4}>
              <Text> Vessel name: {vessel.nameOfVessel}</Text>
              <Text> Vessel type: {vessel.type}</Text>
              <Text> Vessel register number: {vessel.registernumber}</Text>
              <Text> Number of person on board: {vessel.numberofPersonOnboard}</Text>
            </Box>
          )}
           {activeStep === 3 && (
            // Content for step 4 (Payment information)
            <Box mt={4}>
              <Text>Select Payment Method:</Text>
              <Select value={selectedPaymentMethod} onChange={handlePaymentMethodSelect}>
                {paymentMethods.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </Select>
            </Box>
          )}
          {/* for active step 4 add confirmation button for handleConfirmReservation */}
            {activeStep === 4 && (
               <Box mt={4}>
               <Button onClick={handleConfirmReservation}>Confirm Reservation</Button>
               </Box>
            )}

          <Button onClick={handlePrev} disabled={activeStep === 0}>
            Previous
          </Button>
          <Button onClick={handleNext} disabled={activeStep === steps.length - 1}>
            Next
          </Button>
        </Box>
      </Card>
    );
    
    
};

export default ReservationStepper;
