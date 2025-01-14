// CardBuoy.js

import React, { useState, useEffect } from 'react';
import { Box, Badge, Collapse, IconButton, Spacer, SimpleGrid, Text, Icon } from '@chakra-ui/react';
import { FaChevronDown } from 'react-icons/fa';
import { GiSailboat } from 'react-icons/gi'; // Customized ship icon
import StyledCardBuoy from './CardBuoy.styled';

// Data service imports
import { getVessel } from '../../services/dataServiceVessels';
import { getUserInformation } from '../../services/dataService';

const CardBuoy = ({ qrData, lat, lng, isPaid, price, vessel }) => {
  const [isExpanded, setExpanded] = useState(false);
  const [vesselInfo, setVesselInfo] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const handleExpandToggle = async () => {
    setExpanded(!isExpanded);

    // Fetch specific vessel and user information when expanding
    const specificVesselInfo = await getSpecificVessel();
    setVesselInfo(specificVesselInfo);
    const specificUserInfo = await getSpecificUser();
    setUserInfo(specificUserInfo);
  };

  const getSpecificVessel = async () => {
    if (vessel === null) {
      return 'N/A';
    }
    return await getVessel(vessel);
  };

  const getSpecificUser = async () => {
    if (vessel === null) {
      return 'N/A';
    }
    return await getUserInformation(vesselInfo.captain);
  };

  useEffect(() => {
    // Fetch the specific vessel information when the component mounts
    const fetchData = async () => {
      const specificVesselInfo = await getSpecificVessel();
      setVesselInfo(specificVesselInfo);
    };

    fetchData();
  }, []);

  const roundToDecimal = (number, decimalPlaces) => {
    const factor = 10 ** decimalPlaces;
    return Math.round(number * factor) / factor;
  };

  return (
    <StyledCardBuoy>
      <div className="buoy-info">
        <div className="left-content">
          <IconButton
            onClick={handleExpandToggle}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
            icon={<FaChevronDown />}
            variant="ghost"
            size="sm"
            className="expand-icon"
            colorScheme="blue" // Update button color
          />
          <Text fontSize="md" className="qr-data">
            {qrData}
          </Text>
        </div>
        <Text fontSize="md" className="lat-lng">
          {roundToDecimal(lat, 3)}
        </Text>
        <Text fontSize="md" className="lat-lng">
          {roundToDecimal(lng, 3)}
        </Text>
        <Badge colorScheme={isPaid ? 'green' : 'red'} className="badge">
          {isPaid ? 'Paid' : 'Empty'}
        </Badge>
        <Text fontSize="md" className="price">
          {price}
        </Text>
        <div className="vessel">
          <Spacer />
          {vessel > 0 ? (
            <Icon as={GiSailboat} boxSize={6} color="blue.500" /> // Customized ship icon
          ) : (
            <Text fontSize="md">N/A</Text>
          )}
        </div>
      </div>
      <Collapse in={isExpanded} animateOpacity>
        {vessel > 0 ? (
          <div className="additional-info">
            <SimpleGrid columns={2} spacing={4} className="user-vessel-grid">
              <div className="info-box">
                <Text fontWeight="bold" className="info-title">
                  User Information:
                </Text>
                <Text>{`Name: ${userInfo?.name || 'N/A'}`}</Text>
                <Text>{`Surname: ${userInfo?.surname || 'N/A'}`}</Text>
                <Text>{`Email: ${userInfo?.email || 'N/A'}`}</Text>
              </div>

              <div className="info-box">
                <Text fontWeight="bold" className="info-title">
                  Vessel Information:
                </Text>
                <Text>{`Type: ${vesselInfo?.type || 'N/A'}`}</Text>
                <Text>{`Length: ${vesselInfo?.length || 'N/A'}`}</Text>
                <Text>{`Name: ${vesselInfo?.nameOfVessel || 'N/A'}`}</Text>
                <Text>{`Register Number: ${vesselInfo?.registernumber || 'N/A'}`}</Text>
                <Text>{`Number of Persons on Board: ${vesselInfo?.numberofPersonOnboard || 'N/A'}`}</Text>
              </div>
            </SimpleGrid>
          </div>
        ) : (
          <Text textAlign="center" fontWeight="bold" fontSize="md" mt="5px">
            There is no vessel parked here.
          </Text>
        )}
      </Collapse>
    </StyledCardBuoy>
  );
};

export default CardBuoy;
