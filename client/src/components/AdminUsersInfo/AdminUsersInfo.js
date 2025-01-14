import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, Stack, Button, useBreakpointValue, Spinner } from '@chakra-ui/react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import CardUser from '../CardUser/CardUser';
import { getUsers } from '../../services/dataService'; // Update the path as per your file structure

const AdminUsersInfo = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const usersPerPage = useBreakpointValue({ base: 3, sm: 3, md: 6, lg: 7, xl: 8 });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const getAllUsers = async () => {
    setLoading(true);
    try {
      const usersData = await getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, [currentPage]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <Flex
        bg="linear-gradient(45deg, #ffffff, #f0f0f0)"
        p="16px"
        borderRadius="12px"
        boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
        justifyContent="space-between"
        alignItems="center"
        borderBottomWidth="1px"
        mb="16px"
      >
        <Text fontSize="md" fontWeight="bold" color="gray.800" marginRight="12px">Name</Text>
        <Text fontSize="md" fontWeight="bold" color="gray.800" marginRight="12px">Surname</Text>
        <Text fontSize="md" fontWeight="bold" color="gray.800" marginRight="12px">Personal ID</Text>
        <Text fontSize="md" fontWeight="bold" color="gray.800" marginRight="12px">Tax Number</Text>
        <Text fontSize="md" fontWeight="bold" color="gray.800" marginRight="12px">Email</Text>
        <Text fontSize="md" fontWeight="bold" color="gray.800" marginRight="12px">Birthday</Text>
      </Flex>
      {loading ? (
        <Flex justifyContent="center" alignItems="center" minHeight="60vh">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <>
          {currentUsers.map((user) => (
            <CardUser key={user.id} user={user} />
          ))}
        </>
      )}
      <Flex justifyContent="center" mt={4}  bottom={0} >
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
          {Array.from({ length: Math.ceil(users.length / usersPerPage) }).map((_, index) => (
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
            onClick={() => setCurrentPage(currentPage < Math.ceil(users.length / usersPerPage) ? currentPage + 1 : currentPage)}
            colorScheme="gray"
            size="sm"
            rightIcon={<FaArrowRight />}
            disabled={currentPage === Math.ceil(users.length / usersPerPage)}
          >
            Next
          </Button>
        </Stack>
      </Flex>
    </div>
  );
};
export default AdminUsersInfo;
