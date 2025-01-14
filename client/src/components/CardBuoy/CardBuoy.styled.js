// CardBuoy.styled.js

import styled from '@emotion/styled';

export const StyledCardBuoy = styled.div`
  background: linear-gradient(45deg, #ffffff, #f0f0f0); /* Gradient background */
  padding: 16px;
  border: none; /* Remove border */
  border-radius: 12px; /* Increased border-radius */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Shadow effect */
  margin-bottom: 16px;

  & .buoy-info {
    display: flex;
    justify-content: space-between;
    align-items: center;

    & .left-content {
      display: flex;
      align-items: center;

      & .expand-icon {
        margin-right: 8px;
      }

      & .qr-data {
        font-size: 14px;
        margin-left: 8px;
      }
    }

    & .lat-lng {
        font-size: 14px;
    }

    & .badge {
        font-size: 14px;
    }

    & .price {
        font-size: 14px;
    }

    & .vessel {
        font-size: 14px;
    }
  }

  & .additional-info {
    margin-top: 16px;

    & .user-vessel-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;

      & .info-box {
        font-size: 14px;

        & .info-title {
          font-weight: bold;
        }
      }
    }
  }
`;

export default StyledCardBuoy;
