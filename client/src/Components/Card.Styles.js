import styled from "styled-components";

export const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
//   padding:20px;
    background: #f4f4f4;
`;

export const Card = styled.div`
  position: relative;              // ✅ so Divider can be positioned
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.08);
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
`;

export const EmployeeDept = styled.span`
  color: #777;
`;

export const IconWrapper = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  color: #3352ba;
  cursor: pointer;
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-2px);
  }
`;
