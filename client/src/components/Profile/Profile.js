import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Box, useBreakpointValue, useDisclosure } from "@chakra-ui/react";

//Components
import Navbar from "../Navbar/Navbar";
import ProfileSidebar from "../ProfileSidebar/ProfileSidebar";
import ProfileUserInfo from "../ProfileUserInfo/ProfileUserInfo";
import ProfileVesselInfo from "../ProfileVesselInfo/ProfileVesselInfo";
import ProfileServicesInfo from "../ProfileServicesInfo/ProfileServicesInfo";
import ProfileInvoicesInfo from "../ProfileInvoicesInfo/ProfileInvoicesInfo";
import ProfileChatRoom from "../ProfileChatRoom/ProfileChatRoom";

//Services
import { currentUser } from "../../services/dataService";
import { getVessel } from "../../services/dataServiceVessels";
import { getReceiptOfUser } from "../../services/dataServiceReceipts";

const Profile = () => {
  const [selectedSection, setSelectedSection] = useState("userinfo");
  const [userData, setUserData] = useState(null);
  const [vesselData, setVesselData] = useState(null);
  const [invoicesData, setInvoicesData] = useState(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const navigate = useNavigate();

  // Handle button click and toggle sidebar on mobile
  const handleButtonClick = (section) => {
    console.log("section", section);
    setSelectedSection(section);
    if (isMobile) {
      setIsSidebarExpanded(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  // Function to fetch user information
  const getUserInformation = async () => {
    return await currentUser();
  };

  // Function to fetch vessel information
  const getVesselInfo = async (id) => {
    return await getVessel(id);
  };

  // Function to fetch invoices information
  const getInvoicesInfo = async (id) => {
    return await getReceiptOfUser(id);
  };

  // Fetch user data, vessel data, and invoices
  const fetchUserData = async () => {
    try {
      const userInformation = await getUserInformation();
      if (!userInformation) {
        throw new Error("User information fetch failed");
      }
      setUserData(userInformation);

      if (userInformation.vessel > 0) {
        const vesselInformation = await getVesselInfo(userInformation.vessel);
        setVesselData(vesselInformation);
      } else {
        setVesselData(null);
      }

      const invoicesInformation = await getInvoicesInfo(userInformation.id);
      setInvoicesData(invoicesInformation);
    } catch (error) {
      console.error("Error loading data:", error);
      navigate('/oops');
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchUserData();
  }, []);
  return (
    <Flex direction="column" minH="100vh" height="100vh" overflow="hidden">
      <ProfileSidebar
        isExpanded={isSidebarExpanded}
        onToggle={toggleSidebar}
        username={userData?.name}
        onButtonClick={handleButtonClick}
        selectedSection={selectedSection}
      />
      <Flex direction="column" flex="1" position="relative">
        <Box flex="1" p={2} height="100%">
          {selectedSection && userData && (
            <>
              {selectedSection === "userinfo" && (
                <ProfileUserInfo
                  userId={userData.id}
                  initialUserData={userData}
                />
              )}
              {selectedSection === "vesselinfo" && (
                <ProfileVesselInfo
                  userId={userData.id}
                  userVesselId={userData.vessel}
                />
              )}
              {selectedSection === "servicesinfo" && (
                <ProfileServicesInfo userId={userData.id} />
              )}
              {selectedSection === "invoicesinfo" && (
                <ProfileInvoicesInfo invoicesData={invoicesData} />
              )}
              {selectedSection === "messagesinfo" && (
                <ProfileChatRoom userId={userData.id} />
              )}
            </>
          )}
        </Box>
      </Flex>
    </Flex>
  );
  
};

export default Profile;
