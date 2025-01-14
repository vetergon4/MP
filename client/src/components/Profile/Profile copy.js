import React, { useState, useEffect } from "react";
import {
  Flex,
  Stack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Button,
  Text,
  Grid,
  GridItem,
  Box,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure,
  Tabs, TabList, TabPanels, Tab, TabPanel
} from "@chakra-ui/react";
import {
  FaUser,
  FaIdCard,
  FaMoneyBillWave,
  FaEnvelope,
  FaBirthdayCake,
  FaShip,
  FaKey,
  FaArrowsAltH,
  FaSignature,
  FaRegistered,
  FaUsers,
  FaFileDownload,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Components
import PageContainer from "../Layout/PageContainer/PageContainer";
import PageContent from "../Layout/PageContent/PageContent";
import Nav from "../Layout/Nav/Nav";
import Footer from "../Layout/Footer/Footer";
import Oops from "../Oops/Oops";

import { currentUser, updateUser } from "../../services/dataService";
import { addVessel, getVessel, getVesselInformation, updateVessel, deleteVessel } from "../../services/dataServiceVessels";
import { getReceiptOfUser } from "../../services/dataServiceReceipts";

const Profile = () => {


  const [userData, setUserData] = useState(null);
  const [vesselData, setVesselData] = useState(null);
  const [servicesData, setServicesData] = useState(null);
  const [invoicesData, setInvoicesData] = useState(null);

  const [newVesselData, setNewVesselData] = useState({
    type: "",
    length: "",
    nameOfVessel: "",
    registernumber: "",
    numberofPersonOnboard: "",
  });

  const [isUserEditing, setIsUserEditing] = useState(false);
  const [isVesselEditing, setIsVesselEditing] = useState(false);

  //for modal windows
  const [isNewVesselModalOpen, setIsNewVesselModalOpen] = useState(false);
  const [isDeleteVesselModalOpen, setIsDeleteVesselModalOpen] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();


  const navigate = useNavigate();

  //Toast message for success
  const notifySuccess = (message) => {
    toast.success(message, {
      position: 'bottom-right',
      autoClose: 3000, // 3 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const getUserInformation = () => {
    // Assume currentUser() is a function that fetches user information
    return currentUser();
  };

  const saveNewVessel = () => {
    //  console.log("Saving new vessel:", newVesselData)
    return addVessel(userData.id, newVesselData); //!!
  };

  //const getVesselInformation that sends int of user.vessel to server and returns vessel information
  const getVesselId = () => {
    return getVesselInformation();
  };

  const getVesselInfo = (id) => {
    // Assuming id is available from somewhere in your component
    return getVessel(id);
  };

  const getInvoicesInfo = (id) => {
    return getReceiptOfUser(id);
  };

  const handleUserEditClick = () => {
    setIsUserEditing(true);
  };

  const handleVesselEditClick = () => {
    setIsVesselEditing(true);
  };

  const handleUserSaveClick = async () => {
    // Implement logic to save updated user information to the server
    try {
      const updatedUserData = await updateUser(userData.id, userData);
      notifySuccess('User information saved successfully!');

    } catch (error) {
      console.error("Error updating user:", error);
    }

    setIsUserEditing(false);
  };

  const handleVesselSaveClick = async () => {
    // Implement logic to save updated vessel information to the server
    try {
      const updatedVesselData = await updateVessel(vesselData.id, vesselData);
      //console.log(updatedVesselData);
      notifySuccess('Vessel information saved successfully!');
      setVesselData(updatedVesselData);  // Update the local state with the updated data
      onClose(); // Close the modal after successful update
    } catch (error) {
      console.error("Error updating vessel:", error);
    }

    setIsVesselEditing(false);
  };


  const handleVesselDeleteClick = async () => {
    setIsDeleteVesselModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteVessel(vesselData.id);
      // Optionally, update local state to clear vesselData
      setVesselData(null);
      notifySuccess('Vessel deleted successfully!');
    } catch (error) {
      console.error("Error deleting vessel:", error);
    } finally {
      setIsDeleteVesselModalOpen(false);
    }
  };

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleVesselInputChange = (e) => {
    const { name, value } = e.target;
    setVesselData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  //For adding new vessel
  const handleAddVesselClick = () => {
    setIsNewVesselModalOpen(true);
  };

  const handleNewVesselInputChange = (e) => {
    const { name, value } = e.target;
    setNewVesselData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveNewVessel = async () => {
    try {
      const updatedVesselData = await saveNewVessel(userData.id, newVesselData);
      //console.log(updatedVesselData);
      notifySuccess('Vessel information saved successfully!');
  
      setVesselData(updatedVesselData); // Always update with the new vessel data
  
      setIsNewVesselModalOpen(false); // Close the modal after successful update
    } catch (error) {
      console.error("Error adding new vessel:", error);
    }
  };
  
  //end of adding new vessel


  useEffect(() => {

    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/oops");
      } else {
        //lets fetch all information and save it
        const userInformation = getUserInformation();
        const vesselId = getVesselId();

        if (vesselId > 0) {
          try {
            const vesselInformation = await getVesselInfo(vesselId);

            setVesselData(vesselInformation);
          } catch (error) {
            console.error("Failed to fetch vessel information. Status:", error.response?.status);
            // Handle the case where vessel information no longer exists
            setVesselData(null);
          }
        }
        if (userInformation) {
          setUserData(userInformation);
          const invoicesInformation = await getInvoicesInfo(userInformation.id);
          //console.log(userInformation.id, "userInformation.id")

          //console.log(invoicesInformation, "invoicesInformation")
          if (invoicesInformation) {
            setInvoicesData(invoicesInformation);
          } else {
            console.error("Invoices information is missing or undefined.");
          }

        } else {
          console.error("User information is missing or undefined.");
        }

      }

    };

    fetchData();

  }, [navigate]);


  return (
    <PageContainer isFixedNav>
      <Nav />
      <div style={{ flex: 1, backgroundColor: "rgba(255, 255, 255, 0.5)", borderRadius: "50px" }}>
        <PageContent title="My Profile" >
          <ToastContainer />
          <Tabs isFitted variant="enclosed">
            <TabList mb="1em">
              <Tab>User Information</Tab>
              <Tab>Vessel Information</Tab>
              <Tab>Services</Tab>
              <Tab>Invoices</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Flex
                  direction={{ base: "column", md: "row" }}
                  alignItems="center"
                  justifyContent="center"
                  height="100%"
                >
                  <Stack
                    spacing={4}
                    borderRadius="lg"
                    overflow="hidden"
                    p={6}

                  >
                    {Object.entries(userData || {}).map(([key, value]) => {
                      if (["name", "surname", "email", "password"].includes(key)) {
                        return (
                          <FormControl id={key} key={key}>
                            <FormLabel>
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </FormLabel>
                            <InputGroup>
                              <InputLeftElement pointerEvents="none">
                                <Icon as={getIconForField(key)} color="gray.600" />
                              </InputLeftElement>
                              <Input
                                type="text"
                                name={key}
                                value={value}
                                onChange={handleUserInputChange}
                                isReadOnly={!isUserEditing}
                              />
                            </InputGroup>
                          </FormControl>
                        );
                      }
                      return null;
                    })}

                    {isUserEditing && (
                      <>
                        <Button
                          colorScheme="blue"
                          size="lg"
                          fontSize="md"
                          onClick={handleUserSaveClick}
                        >
                          Save User
                        </Button>
                      </>
                    )}

                    {!isUserEditing && (
                      <Button
                        colorScheme="blue"
                        size="lg"
                        fontSize="md"
                        onClick={handleUserEditClick}
                      >
                        Edit User
                      </Button>
                    )}
                  </Stack>
                </Flex>
              </TabPanel>
              <TabPanel>
                <Stack
                  spacing={4}
                  overflow="hidden"
                  p={6}

                >
                  {vesselData ? (
                    <>
                      {Object.entries(vesselData).map(([key, value]) => {
                        if (
                          ["type", "length", "nameOfVessel", "registernumber", "numberofPersonOnboard"].includes(key)
                        ) {
                          return (
                            <FormControl id={key} key={key}>
                              <FormLabel>
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                              </FormLabel>
                              <InputGroup>
                                <InputLeftElement pointerEvents="none">
                                  <Icon
                                    as={getIconForField(key)}
                                    color="gray.600"
                                  />
                                </InputLeftElement>
                                <Input
                                  type="text"
                                  name={key}
                                  value={value}
                                  onChange={handleVesselInputChange}
                                  isReadOnly={!isVesselEditing}
                                />
                              </InputGroup>
                            </FormControl>
                          );
                        }
                        return null;
                      })}

                      {isVesselEditing && (
                        <>
                          <Button
                            colorScheme="blue"
                            size="lg"
                            fontSize="md"
                            onClick={handleVesselSaveClick}
                          >
                            Save Vessel
                          </Button>
                          <Button
                            colorScheme="red"
                            size="sm"
                            fontSize="md"
                            onClick={handleVesselDeleteClick}
                          >
                            Delete Vessel
                          </Button>
                        </>
                      )}

                      {!isVesselEditing && (
                        <Button
                          colorScheme="blue"
                          size="lg"
                          fontSize="md"
                          onClick={handleVesselEditClick}
                        >
                          Edit Vessel
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button
                      colorScheme="green"
                      size="lg"
                      fontSize="md"
                      onClick={handleAddVesselClick}
                    >
                      Add Vessel
                    </Button>
                  )}
                </Stack>
              </TabPanel>
              <TabPanel>
                <p>jsnakdnaskjndkjadnjka</p>
              </TabPanel>

              <TabPanel>
                <Flex
                  bgGradient="linear(to-r, #ffffff, #f0f0f0)"
                  p="16px"
                  borderRadius="12px"
                  boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
                  justifyContent="space-between"
                  alignItems="center"
                  borderBottomWidth="1px"
                  mb="16px"
                >
                  <Text fontSize="md" fontWeight="bold" color="gray.800" marginRight="12px">Date</Text>
                  <Text fontSize="md" fontWeight="bold" color="gray.800" marginRight="12px">Total Price</Text>
                  <Text fontSize="md" fontWeight="bold" color="gray.800" marginRight="12px">Download</Text>
                </Flex>
                {invoicesData ? (/*  */
                  invoicesData.map((invoice, index) => (
                    <Box key={index} borderWidth="1px" borderRadius="lg" p="4" mb="4">
                      <Stack spacing="2" direction="row" alignItems="center">
                        <Text>Date: {invoice.date}</Text>
                        <Text>Total Price: {invoice.totalPrice}</Text>
                        <Button
                          aria-label="Download PDF"
                          icon={<FaFileDownload />}

                        />
                      </Stack>
                      <Stack spacing="2">
                        {Object.entries(invoice).map(([key, value], innerIndex) => (
                          (key !== 'date' && key !== 'totalPrice' && key !== 'pdf') && (
                            <Box key={innerIndex}>
                              <Text fontWeight="bold">{key}</Text>
                              <Text>{value}</Text>
                            </Box>
                          )
                        ))}
                      </Stack>
                    </Box>
                  ))
                ) : (
                  <p>No invoices found.</p>
                )}
              </TabPanel>


            </TabPanels>
          </Tabs>

          <Modal isOpen={isNewVesselModalOpen} onClose={() => setIsNewVesselModalOpen(false)}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add New Vessel</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl>
                  <FormLabel>Type</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaShip} color="gray.600" />
                    </InputLeftElement>
                    <Input
                      type="text"
                      name="type"
                      value={newVesselData.type}
                      onChange={handleNewVesselInputChange}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel>Length</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaArrowsAltH} color="gray.600" />
                    </InputLeftElement>
                    <Input
                      type="text"
                      name="length"
                      value={newVesselData.length}
                      onChange={handleNewVesselInputChange}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel>Name of Vessel</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaSignature} color="gray.600" />
                    </InputLeftElement>
                    <Input
                      type="text"
                      name="nameOfVessel"
                      value={newVesselData.nameOfVessel}
                      onChange={handleNewVesselInputChange}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel>Register Number</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaRegistered} color="gray.600" />
                    </InputLeftElement>
                    <Input
                      type="text"
                      name="registernumber"
                      value={newVesselData.registernumber}
                      onChange={handleNewVesselInputChange}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel>Number of Persons Onboard</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaUsers} color="gray.600" />
                    </InputLeftElement>
                    <Input
                      type="text"
                      name="numberofPersonOnboard"
                      value={newVesselData.numberofPersonOnboard}
                      onChange={handleNewVesselInputChange}
                    />
                  </InputGroup>
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" onClick={handleSaveNewVessel}>
                  Save
                </Button>
                <Button variant="ghost" onClick={() => setIsNewVesselModalOpen(false)}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <Modal isOpen={isDeleteVesselModalOpen} onClose={() => setIsDeleteVesselModalOpen(false)}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                Confirm Deletion
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <p>Are you sure you want to delete the vessel?</p>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="red" mr={3} onClick={handleConfirmDelete}>
                  Yes, Delete
                </Button>
                <Button variant="ghost" onClick={() => setIsDeleteVesselModalOpen(false)}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

        </PageContent>
      </div>
      <Footer />
    </PageContainer>


  )
};


const getIconForField = (fieldName) => {
  const iconMap = {
    name: FaUser,
    surname: FaUser,
    pin: FaIdCard,
    taxNumber: FaMoneyBillWave,
    email: FaEnvelope,
    birthday: FaBirthdayCake,
    vessel: FaShip,
    password: FaKey,
    type: FaShip,
    length: FaArrowsAltH,
    nameOfVessel: FaSignature,
    registernumber: FaRegistered,
    numberofPersonOnboard: FaUsers,
  };

  return iconMap[fieldName] || FaUser;
};

export default Profile;