import React, { useState, useEffect } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from "@chakra-ui/react";
import CustomModal from '../../CustomModal';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { MarkerF } from '@react-google-maps/api'
import { useDisclosure } from '@chakra-ui/react';
import { Button } from "@chakra-ui/react"
import { Text } from "@chakra-ui/react"

//components
import PageContainer from "../Layout/PageContainer/PageContainer";
import PageContent from "../Layout/PageContent/PageContent";
import Card from "../Layout/Card/Card";
import Nav from "../Layout/Nav/Nav";
import Footer from "../Layout/Footer/Footer";

import { getBuoys, getBuoyByQrData } from '../../services/dataServiceBuoys';


export default function AdminDashboard() {
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [buoys, setBuoys] = useState([]);

    const apiKey = process.env.REACT_APP_GOOGLEMAPS_API_KEY;

    console.log(apiKey + " api key");

    const { isOpen, onOpen, onClose } = useDisclosure()
    useEffect(() => {

        console.log("use effect");
        console.log(getBuoys());

        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

        axios.get(`${apiUrl}/buoys`)
            .then((response) => {
                const data = response.data; // Assuming response.data is a JSON object
                const buoysArray = Array.isArray(data) ? data : [data]; // Ensure data is an array
                setBuoys(buoysArray);
            })
            .catch((error) => console.error(error));
    }, []);

    // Function to handle marker click
    const handleMarkerClick = (buoy) => {
        setSelectedMarker(buoy);
        onOpen(); // Open the modal
    };

    const formatPrice = (price) => {
        // Use Intl.NumberFormat for currency formatting
        const formatter = new Intl.NumberFormat('en-EU', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
        });

        return formatter.format(price);
    };

    const getMarkerColor = (isPaid) => {
        return isPaid ? 'red' : 'green'; // You can customize the colors based on your requirement
    };

    return (
        <PageContainer isFixedNav>
            <Nav />
            <PageContent
                title="Dashboard"
                primaryAction={{
                    content: "Create report",
                    onClick: () => {
                        alert("ok");
                    }
                }}
                secondaryActions={[
                    {
                        content: "Second action",
                        onClick: () => {
                            alert("ok");
                        }
                    },
                    {
                        content: "Third action",
                        onClick: () => {
                            alert("ok");
                        }
                    }
                ]}
            >
                <Card
                    title="Buoys"
                    bg="main.500"
                    color="white"
                    filterActions={[
                        {
                            default: "2_weeks",
                            items: {
                                "1_week": "Last week",
                                "2_weeks": "Last 14 days",
                                "30_days": "30 Days"
                            },

                            onChange: () => {
                                alert("ok");
                            }
                        }
                    ]}
                >
                    <div style={{ width: '100%', height: '600px' }}>
                        <LoadScript
                        >
                            <GoogleMap
                                mapContainerStyle={{ width: '100%', height: '100%' }}
                                center={{ lat: 43.6864586, lng: 15.7091269 }}
                                zoom={17.41}
                            >
                                {buoys.map((buoy, index) => (
                                    <Marker
                                        key={index}
                                        position={{ lat: buoy.lat, lng: buoy.lng }}
                                        icon={{
                                            path: 'M10 0C4.48 0 0 4.48 0 10s10 22 10 22 10-17.92 10-22S15.52 0 10 0zm0 15c-2.75 0-5-2.25-5-5s2.25-5 5-5 5 2.25 5 5-2.25 5-5 5z',
                                            fillColor: getMarkerColor(buoy.isPaid), // Set the marker color based on isPaid attribute
                                            fillOpacity: 1,
                                            strokeWeight: 0,
                                            scale: 1.3,
                                        }}
                                        onClick={() => handleMarkerClick(buoy)}
                                    />
                                ))}

                            </GoogleMap>
                        </LoadScript>
                    </div>
                </Card>
            </PageContent>
            <Footer />

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Buoy</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {/* Display information about the selected buoy */}
                        {selectedMarker && (
                            <div>
                                <Text>
                                    <strong>Latitude:</strong> {selectedMarker.lat}
                                </Text>
                                <Text>
                                    <strong>Longitude:</strong> {selectedMarker.lng}
                                </Text>
                                <Text>
                                    <strong>Is paid:</strong> {selectedMarker.isPaid ? 'Yes' : 'No'}
                                </Text>
                                <Text>
                                    <strong>Price:</strong> {formatPrice(selectedMarker.price)}
                                </Text>
                                <Text>
                                    <strong>Vessel:</strong> {selectedMarker.vessel || 'N/A'}
                                </Text>
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost">See details</Button>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </PageContainer>
    );
}