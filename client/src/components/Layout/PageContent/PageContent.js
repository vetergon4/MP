import React from "react";
import { Container, Stack, Heading, Button } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";

export default function PageContent({
  title = "",
  primaryAction = null,
  secondaryActions = null,
  centerContent = false,
  children,
}) {
  const actions = [
    primaryAction ? (
      <Button
        key="0"
        onClick={primaryAction.onClick}
        colorScheme="main"
        size="sm"
      >
        {primaryAction.content}
      </Button>
    ) : (
      ""
    ),
    secondaryActions
      ? secondaryActions.map((action, i) => (
          <Button
            key={i}
            onClick={action.onClick}
            colorScheme="main"
            variant="outline"
            size="sm"
          >
            {action.content}
          </Button>
        ))
      : "",
  ];

  const header =
  title || actions ? (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      marginBottom="1.5rem"
    >
      <Heading size="lg">{title}</Heading>
      <Stack direction={["column", "row"]} mt={2}>
        {actions}
      </Stack>
    </Flex>
    ) : (
      ""
    );
  return (
    <Container
      maxW="container.lg"
      centerContent={centerContent}
      paddingTop="1.5rem"
    >
      {header}
      {children}
    </Container>
  );
}