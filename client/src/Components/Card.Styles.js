import styled from "styled-components";

export const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);  /* ✅ exactly 3 per row */
  gap: 1rem;
  margin: 1rem 0;
  background: #f4f4f4;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr); /* ✅ 2 per row on tablets */
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr; /* ✅ 1 per row on mobile */
  }
`;


export const Card = styled.div`
  position: relative; /* ✅ so Divider or absolute elements can sit inside */
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  /* Smooth scaling */
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.12);
  }

  /* ✅ Responsive padding & font size */
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
`;


export const CardHeader = styled.div`
  display: flex;
  // align-items: center;
`;

export const IconSection = styled.div`
  display: flex;
  // align-items: center;
  // justify-content: center;
  min-width: 40px;
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
  left: 50px;                    
  width: 4px;
  background: #3352ba;
  border-radius: 4px;

`;
export const CardContent = styled.div`
  flex: 1;
  padding:10px;
`;

export const CardTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  font-family: Satoshi;
font-weight: 700;
font-style: Bold;
leading-trim: NONE;
line-height: 100%;
letter-spacing: 0%;

`;

export const CardCount = styled.span`
  font-size: 1.25rem;
  font-weight: bold;
`;

export const CardList = styled.div`
  margin-top: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  position: relative;
`;

export const CardListItem = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 1fr 1fr;
  align-items: center;
  font-size: 0.85rem;
  padding: 0.3rem 0;
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
`;

export const EmployeeId = styled.span`
  color: #555;

  &.leave-date {
    @media (max-width: 1040px) {
      grid-column: 2 / 3;   /* span the second column (with the name) */
      grid-row: 2 / 3;      /* move below the name */
      margin-top: 2px;
      font-size: 0.8rem;    /* optional smaller font */
      white-space: nowrap;   /* keep from_date – to_date in the same line */
    }
  }
`;



export const EmployeeDept = styled.span`
  color: #777;
`;

export const IconWrapper = styled.div`
  position: absolute;
  right: 10px;          // add some spacing from the right edge
  bottom: -10px;         // move it slightly below the card
 color: blue;
  cursor: pointer;
  transition: transform 0.3s ease;

    &:hover {
    transform: scale(1.3); /* Zoom in */
    color: darkblue; /* Optional color change */
  }

  @media (max-width: 480px) {
    bottom: -3px;       // adjust for smaller screens
    right: 8px;
  }
`;

