import React from "react";
import { Flex } from "@chakra-ui/react";
import "./LayoutStyle.css";

export default function PageContainer(props) {
  return (
    <Flex
      minHeight="100vh"
      width="100%"
      alignItems="center"
      justifyContent="top"
      flexDirection="column"
      className="background"
      position="relative"
      paddingTop={props.isFixedNav ? { md: "4rem" } : "0"}
    >
      {props.children}
    </Flex>
  );
}
