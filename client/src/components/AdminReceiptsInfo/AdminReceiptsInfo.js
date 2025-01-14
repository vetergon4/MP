import React, { useEffect, useState } from 'react';
import CardReceipt from '../CardReceipt/CardReceipt';
import { getReceipts } from '../../services/dataServiceReceipts';
import { Flex, Text, Button, Stack } from '@chakra-ui/react';

const AdminReceiptsInfo = () => {
  const [receipts, setReceipts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const receiptsPerPage = 10;
  const indexOfLastReceipt = currentPage * receiptsPerPage;
  const indexOfFirstReceipt = indexOfLastReceipt - receiptsPerPage;
  const currentReceipts = receipts.slice(indexOfFirstReceipt, indexOfLastReceipt);

  const getAllReceipts = async () => {
    try {
      const receiptsData = await getReceipts();
      setReceipts(receiptsData);
    } catch (error) {
      console.error('Error fetching receipts:', error);
    }
  };

  useEffect(() => {
    getAllReceipts();
  }, []);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <Flex
        bg="gray.200"
        p="2"
        justifyContent="space-between"
        fontWeight="bold"
        borderBottomWidth="1px"
        mb="2"
      >
        <Text fontSize="md">Service</Text>
        <Text fontSize="md">Total Price</Text>
        <Text fontSize="md">Date</Text>
        <Text fontSize="md">User</Text>
        <Text fontSize="md">Vessel</Text>
        <Text fontSize="md">Download</Text>
        {/* Add PDF column header here if needed */}
      </Flex>
      {currentReceipts.map((receipt) => (
        <CardReceipt key={receipt.id} receipt={receipt} />
      ))}
      <Stack direction="row" spacing={2} mt={1}>
        {Array.from({ length: Math.ceil(receipts.length / receiptsPerPage) }).map((_, index) => (
          <Button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            colorScheme={currentPage === index + 1 ? 'blue' : 'gray'}
            size="sm"
          >
            {index + 1}
          </Button>
        ))}
      </Stack>
    </div>
  );
};

export default AdminReceiptsInfo;
