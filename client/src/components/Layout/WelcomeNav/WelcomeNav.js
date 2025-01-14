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

export default function WelcomeNav() {
  const navigate = useNavigate();


  return (
    <Flex
      position={{ md: "fixed" }}
      //  bg="#ffffff"
      minH="4rem"
      w="100%"
      marginTop={{ md: "-3rem" }}
      zIndex="99" // This sets the initial z-index value
      style={{ zIndex: "99" }} // This is added for inline styling
    >
      <Container maxW="container.lg" paddingTop="5px">
        <Stack
          direction={["column", "row"]}
          alignItems={["flex-end", "center"]}
          style={{ backgroundColor: "secondary.card" }}
        >
          <Image boxSize="54px" fallbackSrc="/sailboat_marinePRO.png" />
          <Text fontSize="3xl" fontWeight="bold">
            MarinePRO
          </Text>
        </Stack>
      </Container>
    </Flex>
  );
}