import React, { useRef, useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

import { useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";

import PageContainer from "../Layout/PageContainer/PageContainer";
import PageContent from "../Layout/PageContent/PageContent";
import Nav from "../Layout/Nav/Nav";
import Footer from "../Layout/Footer/Footer";
import ReservationStepper from "../ReservationStepper/ReservationStepper";
import Navbar from "../Navbar/Navbar";

import { useToast, Button, Flex, FormControl, FormLabel, Input, Box } from "@chakra-ui/react"; // Import from Chakra UI

import { getBuoyByQrData } from "../../services/dataServiceBuoys"; // Import your service to fetch buoy information

const MakeReservation = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [result, setResult] = useState("");
  const [isBuoyValid, setIsBuoyValid] = useState(false);
  const [isStepperVisible, setIsStepperVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [buoyInfo, setBuoyInfo] = useState(null);
  const qrRef = useRef(null);
  const scannerInitialized = useRef(false); // Ref to track if the scanner has been initialized

  const checkBuoyName = (buoyDataQr) => {
    //console.log("is checking valid buoy name");
    const validBuoys = Array.from({ length: 20 }, (_, index) => `Buoy${index + 1}`);

    for (const validBuoy of validBuoys) {
      if (buoyDataQr === validBuoy) {
        localStorage.setItem("buoy", buoyDataQr);
        //console.log(`Buoy found: ${buoyDataQr}`);
        return true;
      }
    }

    //console.log(`No matching buoy found for result: ${result}`);
    localStorage.setItem("buoy", result);
    return false;
  };

  const handleScan = async (data) => {
    setResult(data);

    const isValidBuoy = await checkBuoyName(data);
    setIsBuoyValid(isValidBuoy);

    if (isValidBuoy) {
      getBuoyByQrData(data)
        .then((buoyInfo) => {
          //console.log("Buoy Information:", buoyInfo);
          //navigate to
          navigate("/buoyservice");
          setCurrentStep(1);
          setIsStepperVisible(true);
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
      toast({
        title: "Error",
        description: "Invalid QR code for buoy.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (!scannerInitialized.current) { // Check if the scanner has already been initialized
      const qrScanner = new Html5QrcodeScanner(
        "qr-reader", { fps: 10, qrbox: 250 }, /* verbose= */ false
      );

      const onScanSuccess = (decodedText, decodedResult) => {
        console.log(`Code matched = ${decodedText}`, decodedResult);
        handleScan(decodedText);
      };

      const onScanFailure = (error) => {
        console.log(`Scanning failed. Error: ${error}`);
      };

      qrScanner.render(onScanSuccess, onScanFailure);
      scannerInitialized.current = true; // Set the ref to true after initialization

      return () => {
        qrScanner.clear(); // Cleanup after component unmount
        scannerInitialized.current = false; // Reset the ref on unmount
      };
    }
  }, []);

  return <div id="qr-reader" ref={qrRef}></div>;
};

export default MakeReservation;
