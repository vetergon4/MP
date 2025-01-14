import React, { useEffect, useState } from 'react';
import CardBuoy from '../CardBuoy/CardBuoy';
import StyledFlexHeader from '../StyledFlexHeader/StyledFlexHeader';

import { getBuoys } from '../../services/dataServiceBuoys';
import { Flex, Button, Stack, useBreakpointValue } from '@chakra-ui/react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Icons for previous and next buttons

const AdminBuoysInfo = () => {
  const [buoys, setBuoys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const buoysPerPage = useBreakpointValue({ base: 3, sm: 3, md: 6, lg: 8, xl: 10});

  const indexOfLastBuoy = currentPage * buoysPerPage;
  const indexOfFirstBuoy = indexOfLastBuoy - buoysPerPage;
  const currentBuoys = buoys.slice(indexOfFirstBuoy, indexOfLastBuoy);

  const getAllBuoys = async () => {
    try {
      const buoysData = await getBuoys();
      setBuoys(buoysData);
    } catch (error) {
      console.error('Error fetching buoys:', error);
    }
  };

  useEffect(() => {
    getAllBuoys();
  }, []);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <StyledFlexHeader />

      {currentBuoys.map((buoy) => (
        <CardBuoy
          key={buoy.id}
          qrData={buoy.qrData}
          lat={buoy.lat}
          lng={buoy.lng}
          isPaid={buoy.isPaid}
          price={buoy.price}
          vessel={buoy.vessel}
        />
      ))}
      <Flex justifyContent="center" mt={4}>
        <Stack direction="row" spacing={2}>
          <Button
            onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
            colorScheme="gray"
            size="sm"
            leftIcon={<FaArrowLeft />}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {Array.from({ length: Math.ceil(buoys.length / buoysPerPage) }).map((_, index) => (
            <Button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              colorScheme={currentPage === index + 1 ? 'blue' : 'gray'}
              size="sm"
            >
              {index + 1}
            </Button>
          ))}
          <Button
            onClick={() => setCurrentPage(currentPage < Math.ceil(buoys.length / buoysPerPage) ? currentPage + 1 : currentPage)}
            colorScheme="gray"
            size="sm"
            rightIcon={<FaArrowRight />}
            disabled={currentPage === Math.ceil(buoys.length / buoysPerPage)}
          >
            Next
          </Button>
        </Stack>
      </Flex>
    </div>
  );
};

export default AdminBuoysInfo;
