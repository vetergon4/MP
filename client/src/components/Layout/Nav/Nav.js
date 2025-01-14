import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {
  Flex,
  Container,
  Image,
  Stack,
  Link,
  Text,
  Icon,
  Button,
  Menu,
  MenuItem,
  MenuDivider,
  MenuGroup,
  MenuList,
  MenuButton,
} from "@chakra-ui/react";
import { FaCog, FaChevronDown } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import { logout } from "../../../services/dataService";
import { checkIfLoggedIn } from "../../../services/dataService";

export default function Nav() {

  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(checkIfLoggedIn());

  useEffect(() => {
    // Update login status when the component mounts
    setIsLoggedIn(checkIfLoggedIn());
  }, []);

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      // Redirect to "/" after logout with   Rotuer's navigate function
      // https://reactrouter.com/web/api/Navigate
      navigate("/");

    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <Flex
      position={{ md: "fixed" }}
      //  bg="#ffffff"
      minH="4rem"
      w="100%"
      marginTop={{ md: "-4rem" }}
      zIndex="99" // This sets the initial z-index value
      style={{ zIndex: "99" }} // This is added for inline styling
      
    >
      <Container maxW="container.lg" paddingTop="5px">
        <Stack
          direction={["column", "row"]}
          alignItems={["flex-end", "center"]}
          style={{backgroundColor:"secondary.card"}}
        >
          <Image boxSize="54px" fallbackSrc="/sailboat_marinePRO.png" />
          <Text fontSize="xl" fontWeight="500">
            MarinePRO
          </Text>
      
          <Stack direction={["column", "row"]} style={{ marginLeft: "auto" }}>

            <Menu>
              <Button
                as={RouterLink}
                to="/profile"
                colorScheme="navItem"
                variant="ghost"
              >
                My profile
              </Button>
            </Menu>
            <Button
              onClick={handleLogout}
              colorScheme="navItem"
              variant="ghost"
            >
              Logout
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Flex>
  );
}