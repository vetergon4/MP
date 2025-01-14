import React from "react";
import { Container, Stack, Link, Text, Icon } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <Container
      maxW="container.lg"
      marginTop="auto"
      paddingTop="1.5rem"
      paddingBottom="1.5rem"
    >
      <Stack
        flexDirection={["column", "row"]}
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack isInline fontWeight="500" fontSize="sm">
          <Text color="white">&copy; 2023</Text>
          <Link href="#" color="white" fontWeight="bold">
            MarinePRO
          </Link>
        </Stack>
        <Stack isInline fontWeight="500" fontSize="sm">
          <Link
            className="footer-nav-item"
            color="white"
            href="https://github.com/"
            isExternal
          >
            <Icon as={FaGithub} marginRight="0.2rem" verticalAlign="middle" />
            Github repository
          </Link>
          <Link
            className="footer-nav-item"
            color="white"
            href="https://github.com/vetergon4"
            isExternal
          >
            <Icon as={FaGithub} marginRight="0.2rem" verticalAlign="middle" />
            @vetergon4
          </Link>
        </Stack>
      </Stack>
    </Container>
  );
}