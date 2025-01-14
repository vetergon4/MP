import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { QrReader } from "react-qr-reader";
import { useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";

import PageContainer from "../Layout/PageContainer/PageContainer";
import PageContent from "../Layout/PageContent/PageContent";
import Nav from "../Layout/Nav/Nav";
import Footer from "../Layout/Footer/Footer";
import ReservationStepper from "../ReservationStepper/ReservationStepper";

import { useToast, Button } from "@chakra-ui/react"; // Import from Chakra UI

import { getBuoyByQrData } from "../../services/dataServiceBuoys"; // Import your service to fetch buoy information

const MakeReservation = () => {
  const navigate = useNavigate();
  const toast = useToast(); // Toast for displaying error messages

  // State variables
  const [result, setResult] = useState("");
  const [decryptedData, setDecryptedData] = useState("");
  const [isBuoyValid, setIsBuoyValid] = useState(false); // state variable for valid buoy
  const [isStepperVisible, setIsStepperVisible] = useState(false); // State to manage stepper visibility
  const [currentStep, setCurrentStep] = useState(0); // State to manage current step in the stepper
  const [isScanning, setIsScanning] = useState(false); // State to control scanning state
  const [buoyInfo, setBuoyInfo] = useState(null);


  const handleScan = async (data) => {
    if (data) {
      console.log("Here is the QR code:", data);
      setResult(data.text);
      console.log("here is texct", data.text)
      // Check if scanned QR code is a valid buoy name
      const isValidBuoy = await checkBuoyName(data.text);
      setIsBuoyValid(isValidBuoy);

      if (isValidBuoy) {
        // Fetch buoy information and proceed to next step
        getBuoyByQrData(data.text)
          .then((buoyInfo) => {
            // Display buoy information obtained from the database in the first step of the stepper
            console.log("Buoy Information:", buoyInfo);

            setCurrentStep(1); // Move to the next step
            setIsStepperVisible(true); // Show the stepper
            setBuoyInfo(buoyInfo);
          })
          .catch((error) => {
            console.error("Error fetching buoy information:", error);
            toast({
              title: "Error",
              description: "Failed to fetch buoy information.",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          });
      } else {
        // Display error message if the scanned QR code is not a valid buoy name
        toast({
          title: "Error",
          description: "Invalid QR code for buoy.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const startScanning = () => {
    setIsScanning(true);
    setResult(""); // Reset the result when starting a new scan
  };

  const stopScanning = () => {
    setIsScanning(false);
    
  };

  const handleResultClick = () => {
    // Redirect logic (implement as needed)
    if (result) {
      console.log("Result clicked:", result);
    }
  };

  const handleReservation = () => {
    //if local storage buoy is not null, navigate to buoy service
    if (localStorage.getItem("buoy")) {
      navigate("/buoyservice");
    }
  };

  const buoyName = "Buoy14";

  //check if buoy name received from QR code contains either buoy1, buoy2, or buoy3, etc all the way to 20
  //if it does, then set the local storage item to that buoy name and use routerlink for redirect
  const checkBuoyName = (buoyDataQr) => {
    console.log("is checking valid buoy name");
    const validBuoys = Array.from({ length: 20 }, (_, index) => `Buoy${index + 1}`);

    // Loop through each valid buoy name and check if the result matches
    for (const validBuoy of validBuoys) {
      if (buoyDataQr === validBuoy) {
        localStorage.setItem("buoy", buoyDataQr);
        // Use router link or navigate to buoy service
        // For simplicity, let's just log the result
        console.log(`Buoy found: ${buoyDataQr}`);
        return true; // Exit the loop if a match is found
      }
    }

    // If no match is found, log a message
    console.log(`No matching buoy found for result: ${result}`);

    // If no match is found, reinitialize the local storage item
    localStorage.setItem("buoy", result);
    return false;
  };

  //use effect for checkBuoyName
  useEffect(() => {
    checkBuoyName();
  }, []);

  return (
    <PageContainer isFixedNav>
      <Nav />
      <PageContent
        title="Make reservation"
        primaryAction={{
          content: isScanning ? "Stop Scanning" : "Scan QR code",
          onClick: isScanning ? stopScanning : startScanning,
        }}
        style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        {isBuoyValid && isStepperVisible && buoyInfo ? (
          <ReservationStepper currentStep={currentStep} buoyInfo={buoyInfo} />
        ) : (
          <React.Fragment>
            {isScanning && (
              <QrReader
                delay={300}
                onError={handleError}
                onResult={handleScan}
                style={{ width: "100%" }}
              />
            )}
            <Form.Group controlId="formDecryptedData">
              <Form.Label>Decrypted QR Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Decrypted data will appear here"
                value={result}
                readOnly
              />
            </Form.Group>
          </React.Fragment>
        )}
      </PageContent>
      <Button colorScheme="blue" size="lg" fontSize="lg" onClick={handleReservation}>
        USE SERVICE
      </Button>
      <Footer />
    </PageContainer>
  );
  
};

MakeReservation.propTypes = {};

MakeReservation.defaultProps = {};

export default MakeReservation;


