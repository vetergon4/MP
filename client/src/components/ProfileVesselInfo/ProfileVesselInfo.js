import React, { useState, useEffect } from 'react';
import {
    Box, Flex, VStack, HStack, Button, FormControl, FormLabel, Input, useToast, IconButton,
    Grid, GridItem, Text, useColorModeValue, Spinner, Modal, ModalOverlay, ModalContent,
    ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure
} from '@chakra-ui/react';
import { getVessel, updateVessel, deleteVessel, addVessel } from '../../services/dataServiceVessels';
import { FaPlus, FaTimes, FaPencilAlt } from 'react-icons/fa';

const ProfileVesselInfo = ({ userId, userVesselId }) => {
    const [vessel, setVessel] = useState(null);  // Initialize to null
    const [originalVessel, setOriginalVessel] = useState(null); // Store original vessel data
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);  // Track loading state
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Call useColorModeValue at the top level of your component
    const backgroundColor = useColorModeValue('gray.50', 'gray.800');

    useEffect(() => {
        if (userVesselId > 0) {
            setIsLoading(true);
            getVessel(userVesselId)
                .then(data => {
                    setVessel(data);
                    setIsEditing(false);  // Set editing false initially
                })
                .catch(error => {
                    toast({
                        title: 'Error',
                        description: 'Failed to fetch vessel information.',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                })
                .finally(() => setIsLoading(false));
        } else {
            setIsEditing(true);  // No vessel ID, set editing to true to add new vessel
            setIsLoading(false);
        }
    }, [userVesselId, toast]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVessel(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData();
        Object.entries(vessel || {}).forEach(([key, value]) => formData.append(key, value));

        try {
            const response = userVesselId > 0 ? await updateVessel(userVesselId, formData) : await addVessel(userId, formData);
            setVessel(response);
            setIsEditing(false);
            onClose();
            toast({
                title: 'Success',
                description: `Vessel ${userVesselId > 0 ? 'updated' : 'added'} successfully.`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update vessel information.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            await deleteVessel(userVesselId);
            setVessel(null);
            setIsEditing(true); // Allow adding a new vessel
            toast({
                title: 'Success',
                description: 'Vessel deleted successfully.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete vessel.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const openModalToAdd = () => {
        setVessel({
            nameOfVessel: '',
            registernumber: '',
            type: '',
            length: '',
            numberofPersonOnboard: ''
        });
        setOriginalVessel(null); // Clear original vessel data
        setIsEditing(true);
        onOpen();
    };

    const openModalToEdit = () => {
        setOriginalVessel(vessel); // Store the original vessel data
        setIsEditing(true);
        onOpen();
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isOpen]);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <Spinner size="xl" />
            </Box>
        );
    }

    const handleModalClose = () => {
        if (!userVesselId) {
            setVessel(null); // Reset vessel state to null if it was a new vessel
        } else if (isEditing) {
            setVessel(originalVessel); // Revert to original vessel data if editing
        }
        setIsEditing(false);
        onClose();
    };

    return (
        <Flex
            bg="linear-gradient(45deg, #ffffff, #f0f0f0)"
            p="16px"
            borderRadius="12px"
            boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
            justifyContent="space-between"
            alignItems="center"
            borderBottomWidth="1px"
            overflow="hidden"
        >
            <VStack spacing={4} width="full" align="center">
                {vessel ? (
                    <HStack width="100%" p={2}>
                        <IconButton
                            icon={<FaPencilAlt />}
                            colorScheme="blue"
                            onClick={openModalToEdit}
                            aria-label="Edit vessel"
                        />
                        <IconButton
                            icon={<FaTimes />}
                            colorScheme="red"
                            onClick={handleDelete}
                            aria-label="Delete vessel"
                        />
                    </HStack>
                ) : (
                    <HStack width="100%" p={2}>
                        <IconButton
                            icon={<FaPlus />}
                            colorScheme="green"
                            onClick={openModalToAdd}
                            aria-label="Add vessel"
                        />
                    </HStack>
                )}

                <Text fontSize="2xl" fontWeight="bold" textAlign="center">Vessel Information</Text>
                {vessel && !isEditing ? (
                    <>
                        <Text>Name of Vessel: {vessel.nameOfVessel}</Text>
                        <Text>Register Number: {vessel.registernumber}</Text>
                        <Text>Type: {vessel.type}</Text>
                        <Text>Length: {vessel.length}</Text>
                        <Text>Number of Person On Board: {vessel.numberofPersonOnboard}</Text>
                    </>
                ) : (
                    <>
                        <Text>No vessel information available.</Text>
                        <Text>Click the button to add a new vessel.</Text>
                    </>
                )}
            </VStack>

            <Modal isOpen={isOpen} onClose={handleModalClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{isEditing && vessel ? 'Edit Vessel' : 'Add Vessel'}</ModalHeader>
                    <ModalCloseButton onClick={handleModalClose} />
                    <ModalBody>
                        <form onSubmit={handleSubmit}>
                            <Grid templateColumns="repeat(1, 1fr)" gap={6}>
                                {['type', 'length', 'nameOfVessel', 'registernumber', 'numberofPersonOnboard'].map(field => (
                                    <GridItem key={field}>
                                        <FormControl isRequired>
                                            
                                            <Input 
                                                name={field}
                                                placeholder={field} // Add placeholder text
                                                value={vessel ? vessel[field] : ''}
                                                onChange={handleChange}
                                                _placeholder={{ color: 'gray.500' }} // Style placeholder text
                                                color="black" // Style input value text
                                            />
                                        </FormControl>
                                    </GridItem>
                                ))}
                            </Grid>
                            <Button mt={4} colorScheme="blue" isLoading={isLoading} type="submit">
                                {userVesselId > 0 ? 'Update Vessel' : 'Add Vessel'}
                            </Button>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" onClick={handleModalClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    );
};

export default ProfileVesselInfo;
