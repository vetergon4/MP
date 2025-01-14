import React, { useEffect, useState } from 'react';
import { Box, Text, Badge, IconButton, SkeletonText, Button
} from '@chakra-ui/react';
import StyledCardReceipt from '../CardService/CardService.styled';

//import icons
import { FaDownload } from 'react-icons/fa';

//import functions from services
import { getUserInformation } from '../../services/dataService';
import { getVessel } from '../../services/dataServiceVessels';
import { generatePDF } from '../../helpers/generatePDF';

const CardReceipt = ({ receipt }) => {

  const [user, setUser] = useState({});
  const [vessel, setVessel] = useState({});

  const getUser = async (idUser) => {
    try {
      const userData = await getUserInformation(idUser);
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }

  const getVesselInfo = async (idVessel) => {
    try {
      const vesselData = await getVessel(idVessel);
      setVessel(vesselData);
    } catch (error) {
      console.error('Error fetching vessel:', error);
    }
  }

  const createPDF = () => {
    generatePDF(receipt, user, vessel); // Call the PDF generation function with necessary data
  };


  useEffect(() => {

    setUser(getUser(receipt.user));
    setVessel(getVesselInfo(receipt.vessel));

  }, []);

  return (
    <StyledCardReceipt>
      <div className="buoy-info">
        <Text fontSize="md" className="service-info">
          Berth
        </Text>
        <Text fontSize="md" className="date-time">
          {receipt.totalPrice}
        </Text>
        <Text fontSize="md" className="buoy-info">
          {receipt.date}
        </Text>
        <Badge className="vessel-register">
          {user.name} {user.surname}
        </Badge>
        <Badge className="vessel-register">
          {vessel.nameOfVessel}, {vessel.registernumber}
        </Badge>
        <Button colorScheme="green" variant="outline" size="sm" onClick={createPDF}>
          <FaDownload /> {/* Place the icon inside the Button component */}
        </Button>
      </div>
    </StyledCardReceipt>
  );
};

export default CardReceipt;
