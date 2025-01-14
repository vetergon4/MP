// Nav.styled.js
import styled from "styled-components";

export const StyledFlex = styled.div`
  position: fixed;
  min-height: 4rem;
  width: 100%;
  margin-top: -4rem;
  z-index: 99;
    background-color: #142775;
    color: white;
`;

export const StyledStack = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
height: 10rem;
color:white;
  `;

export const StyledButtonWrapper = styled.div`
  display: flex;
  align-items: center;
    justify-content: space-between;
    color:white;    
    hover: {
        color: #142775;
        background-color: blue;
        }
`;

export const StyledImage = styled(Image)`
  margin-right: 0.5rem; /* Adjust margin to reduce space between logo and text */
  /* Po*/
`;

export const StyledText = styled(Text)`
  margin-left: 0.5rem; /* Adjust margin to reduce space between logo and text */
  color: white;
`;
