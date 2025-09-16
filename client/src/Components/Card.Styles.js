import styled from "styled-components";

export const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);  /* default for desktops */
  gap: 1rem;
  margin: 0.5rem;
  background: #f4f4f4;

  /* Small devices */
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }

  /* Tablets */
  @media (min-width: 601px) and (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  /* Standard desktops (HD & Full HD) */
  @media (min-width: 1025px) and (max-width: 1920px) {
    grid-template-columns: repeat(3, 1fr);
  }

  /* QHD (2K - 2560px) */
  @media (min-width: 1921px) and (max-width: 2560px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;  /* extra spacing */
  }

  /* 4K screens (3840px wide) */
  @media (min-width: 2561px) and (max-width: 3840px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }

  /* 8K screens (7680px wide) */
  @media (min-width: 3841px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 2.5rem;
  }
`;



export const Card = styled.div`
  position: relative;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.12);
  }

  /* Responsive padding */
  padding: 1rem;

  @media (max-width: 1024px) {
    padding: 0.8rem;
  }

  @media (max-width: 768px) {
    padding: 0.7rem;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    padding: 0.6rem;
    border-radius: 8px;
    font-size: 0.9rem;
  }

  /* Large screens (2K and above) */
  @media (min-width: 1921px) {
    padding: 1.5rem;
  }

  @media (min-width: 3841px) {
    padding: 2rem;
    border-radius: 16px;
  }
`;


export const CardHeader = styled.div`
  display: flex;
  // align-items: center;
`;

export const IconSection = styled.div`
  display: flex;
  // align-items: center;
  // justify-content: center;
  min-width: 35px;
  margin-left:10px;
  margin-top:10px;
  color:#304EB0;
`;

// export const Divider = styled.div`
//   width: 4px;
//   background: #3352ba;
//   border-radius: 4px;
//   align-self: stretch;   
//   margin: 0 1rem;
// `;

export const Divider = styled.div`
  position: absolute;             
  top: 0;
  bottom: 0;
  left: 60px;                    
  width: 3px;
  background: #3352ba;
  border-radius: 4px;

`;
export const CardContent = styled.div`
  flex: 1;
  padding:1rem;
`;

export const CardTitle = styled.h3`
  font-size: clamp(1rem, 1.2vw, 2.5rem);
  font-weight: 700;
  font-family: Satoshi, sans-serif;
  margin-left: 10px;

  /* Extra bump for 4K/8K */
  @media (min-width: 2561px) {
    font-size: 2.8rem;
  }
`;


export const CardCount = styled.span`
  font-size: clamp(1rem, 1.5vw, 2.5rem);
  font-weight: bold;

  @media (min-width: 2561px) {
    font-size: 3rem;
  }
`;

export const CardList = styled.div`
  margin-top: 0.8rem;
  display: flex;
  flex-direction: column;
  // gap: 0.4rem;
  position: relative;
`;

export const CardListItem = styled.div`
  display: grid;
  grid-template-columns: 20px 0.5fr 1fr 1fr;
  align-items: center;
  font-size: 0.7rem;
  padding: 0.2rem 15px;
  gap: 0.5rem;

  @media (max-width: 992px) {
    grid-template-columns: 40px 1fr 1fr; // Hide one column if needed
  }

  @media (max-width: 768px) {
    grid-template-columns: 40px 1fr;
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 30px 1fr;
    font-size: 0.75rem;
    gap: 0.3rem;

    img {
      width: 25px !important;
      height: 25px !important;
      margin-right: 5px !important;
    }
  }
`;

export const EmployeeAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #ccc;
`;

export const EmployeeName = styled.span`
  font-weight: 500;
  font-size: clamp(0.75rem, 0.9vw, 1.3rem);

  @media (min-width: 2561px) {
    font-size: 1.5rem;
  }
`;

export const EmployeeId = styled.div`
  font-size: clamp(0.75rem, 0.9vw, 1.3rem);
  color: #666;

  /* Default: show both dates */
  .from-date,
  .to-date {
    display: inline;
  }
  .continue-sign {
    display: none;
  }

  /* ✅ Between 1024px–1440px: show only from-date + continue sign */
  @media (min-width: 1024px) and (max-width: 1440px) {
    .to-date {
      display: none;
    }
    .continue-sign {
      display: inline;
    }
  }
`;




export const EmployeeDept = styled.span`
  color: #777;
    font-size: clamp(0.75rem, 0.9vw, 1.3rem);
`;

export const IconWrapper = styled.div`
  position: absolute;
  right:0px;          // add some spacing from the right edge
  bottom: -0px;         // move it slightly below the card
 color: #3352BA;
  cursor: pointer;
  transition: transform 0.3s ease;

    &:hover {
    transform: scale(1.3); /* Zoom in */
    color: #3352BA; /* Optional color change */
  }

  @media (max-width: 480px) {
    bottom: -3px;       // adjust for smaller screens
    right: 8px;
  }
`;

