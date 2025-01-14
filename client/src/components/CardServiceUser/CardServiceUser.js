import React, { useState, useEffect } from 'react';

import { CardServiceUserStyled } from './CardServiceUser.styled';
import { Badge, SkeletonText, Text, VStack, Flex, IconButton } from '@chakra-ui/react';
import { FaDownload } from "react-icons/fa";
import generateInvoice from "../../services/generateInvoice";
import { getBuoyById } from '../../services/dataServiceBuoys';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

const CardServiceUser = ({ type, date, status, buyer, buoy }) => {

  const [usedBuoy, setUsedBuoy] = useState(null);


  useEffect(() => {
    const fetchBuoy = async () => {
      try {
        const data = await getBuoyById(buoy);
        setUsedBuoy(data);
      } catch (error) {
        console.error('Error fetching buoy data:', error);
      }
    };

    fetchBuoy();
  }, [buoy]);

  //console.log("usedBuoy : ", usedBuoy);
  const handleDownloadReport = async () => {
    try {
      const pdfBlob = await generateInvoice(usedBuoy, buyer, [{ type, date, status }]);
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${type}-${new Date(date).toISOString()}.pdf`);
      document.body.appendChild(link);
  
      // For mobile compatibility, trigger the click event in a setTimeout
      setTimeout(() => {
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100); // Small delay to ensure smooth interaction
  
    } catch (error) {
      console.error('Failed to generate the report:', error);
    }
  };
  

  return (
    <CardServiceUserStyled>
      <VStack align="start" spacing={2} w="100%">
        {type ? (
          <Flex align="center" w="100%">
            <Text fontSize="lg" fontWeight="bold">
              {type.toUpperCase()}
            </Text>
            <IconButton
              icon={<FaDownload />}
              colorScheme="gray"
              size="xs"
              aria-label="Download Report"
              ml="auto"
              onClick={handleDownloadReport}
            />
          </Flex>
        ) : (
          <SkeletonText width="70%" />
        )}
  
        <Badge colorScheme="gray">
          {date ? formatDate(date) : <SkeletonText width="50%" />}
        </Badge>
  
        <Badge colorScheme={status === 'DONE' ? 'green' : 'yellow'}>
          {status || <SkeletonText width="30%" />}
        </Badge>
      </VStack>
    </CardServiceUserStyled>
  );
};

export default CardServiceUser;
