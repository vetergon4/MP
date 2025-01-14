import styled from '@emotion/styled';

export const CardServiceUserStyled = styled.div`
  background: linear-gradient(45deg, #ffffff, #f0f0f0); /* Corrected gradient syntax */
  padding: 16px;
  border-radius: 12px; /* Increased border-radius */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Shadow effect */
  margin-bottom: 16px;
  width: 100%; /* Full width for mobile, adjust in the component with media queries if needed */
  
  .buoy-info {
    display: flex;
    flex-direction: column; /* Stack the children vertically */
    gap: 8px; /* Spacing between items */
    
    align-items: flex-start; /* Align items to the start of the flex container */
    text-align: left; /* Align text to the left */
  }

  /* Styles for badges, titles, and other elements */
  .badge, .price, .vessel, .lat-lng, .qr-data {
    
    font-size: 14px; /* Consider making font size responsive as well */
    margin-top: 4px; /* Spacing for better readability */
  }

  /* Remove the .additional-info styles if not used, or adjust for responsiveness */
  
  /* Responsive adjustments */
  @media (min-width: 768px) { /* Adjust for tablet and desktop views */
    .buoy-info {
      flex-direction: row; /* Horizontal layout for larger screens */
      justify-content: space-between;
      align-items: center;
    }

    /* Adjustments for the grid if used in additional-info or similar elements */
    .user-vessel-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
  }
`;

export default CardServiceUserStyled;
