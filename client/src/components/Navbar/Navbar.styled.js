import styled from 'styled-components';
import { Flex, Button } from '@chakra-ui/react';
import { theme } from '@chakra-ui/react';

// Styled container for the Navbar
export const NavbarContainer = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  width: 100vw;
  min-width: 100vw; // Ensures it covers horizontal scroll extent
  padding: 0.5rem; // Default padding
  background-color: ${theme.colors.blue[500]};
  color: white;
  position: relative; // Added to maintain position during horizontal scroll
  left: 0; // Aligns navbar to the left edge
  right: 0; // Ensures navbar stretches to right edge

  @media (min-width: 768px) { // Adjusts padding for non-mobile devices
    padding: 1rem;
  }
`;

// Responsive Button styled for visibility control
export const NavbarButton = styled(Button)`
  display: none; // Hidden by default on mobile

  @media (min-width: 768px) { // Shows on non-mobile devices
    display: inline-flex;
    margin-right: 2px;
  }

  &:last-child {
    margin-right: 0; // No right margin on the last button
  }
`;
