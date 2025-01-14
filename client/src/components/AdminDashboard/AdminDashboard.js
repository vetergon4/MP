// AdminDashboard.js
import React, { useState } from 'react';
import { Flex, Box } from '@chakra-ui/react';


//Import components
import Sidebar from '../Sidebar/Sidebar';
import NavbarAdmin from '../NavbarAdmin/NavbarAdmin';
import AdminHomeInfo from '../AdminHomeInfo/AdminHomeInfo';
import AdminBuoysInfo from '../AdminBuoysInfo/AdminBuoysInfo';
import AdminUsersInfo from '../AdminUsersInfo/AdminUsersInfo';
import AdminStatisticsInfo from '../AdminStatisticsInfo/AdminStatisticsInfo';
import AdminPaymentsInfo from '../AdminPaymentsInfo/AdminPaymentsInfo';
import AdminWeatherInfo from '../AdminWeatherInfo/AdminWeatherInfo';
import AdminServicesInfo from '../AdminServicesInfo/AdminServicesInfo';
import AdminMapInfo from '../AdminMapInfo/AdminMapInfo';
import AdminWindInfo from '../AdminWindInfo/AdminWindInfo';



const AdminDashboard = () => {
    const [selectedSection, setSelectedSection] = useState('home');

    const handleButtonClick = (section) => {
        setSelectedSection(section);
    };

    return (
        <Flex display="flex" >
            {/* Pass selectedSection as a prop to Sidebar */}
            <Sidebar selectedSection={selectedSection} onButtonClick={handleButtonClick} />
            <Flex flexDirection="column" flex="1">
                {/* Main Content */}
                <Box flex="1" p={4}>
                    {/* Render different components based on the selectedSection */}
                    {selectedSection === 'home' && <AdminHomeInfo />}
                    {selectedSection === 'map' && <AdminMapInfo />}
                    {selectedSection === 'buoys' && <AdminBuoysInfo />}
                    {selectedSection === 'services' && <AdminServicesInfo />}
                    {selectedSection === 'users' && <AdminUsersInfo />}
                    {selectedSection === 'statistics' && <AdminStatisticsInfo />}
                    {selectedSection === 'payments' && <AdminPaymentsInfo />}
                    {selectedSection === 'wind' && <AdminWindInfo />}
                    {selectedSection === 'weather' && <AdminWeatherInfo />}
                </Box>
            </Flex>
        </Flex>
    );
};

export default AdminDashboard;
