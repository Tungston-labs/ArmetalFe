// AddEmployeeForm.styles.js
import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  background: #FFFFFF;
  font-family: Satoshi;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
`;


export const RoleInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  background-color: #fff;
  font-size: 0.95rem;
  color: #333;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.05);

  span {
    font-weight: 500;
  }

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
`;
export const InfoGrid = styled.div`
  display: flex;
  gap: 10px;
  // margin-bottom: 2rem;
  width:100%;
      // justify-content: space-between;

`;

export const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 50px;
    height: 60px;
  }

  @media (max-width: 480px) {
    width: 20px;
    height: 30px;
  }
`;
export const Select = styled.select`
 width:100%;
 padding: 0.5rem;
 fontSize: 1rem;
 borderRadius: 6px;
 border: 1px solid #ccc;
 background:white;
 color:black;

 
`;

export const Input = styled.input`
  padding: 0.8rem 1rem;
  // border: 1px solid #ccc;
  // border-radius: 6px;
  width: 96%;
  // margin-bottom: 1rem;
  color:black;
  margin-top:10px;
  border-radius: 7px;
border: 1px solid #052DB4;
background: #FFF;
`;

export const TextArea = styled.textarea`
  width: 99%;
  min-height: 120px;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  resize: vertical;
  margin-bottom: 2rem;
  color:black;
  
`;

export const SectionTitle = styled.h4`
  // margin-top: 2rem;
  margin-bottom: 0.5rem;
  // color:#999999;
  color: #000;
font-family: Satoshi;
font-size: 18px;
font-style: normal;
font-weight: 700;
line-height: normal;

`;

export const TwoColumn = styled.div`
  // display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  width: 30%;
  margin-top:-7px;
  
`;

export const ThreeColumn = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;
  width: 90%;

`;

export const FlexRow = styled.div`
  display: flex;
  justify-content:center;
  gap: 1rem;
  margin-top:3%;
`;

export const ActionButton = styled.button`
  padding: 0.6rem 1.4rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
`;

export const ApproveButton = styled(ActionButton)`
  background-color:#172554;
  color: white;height:42px;
  width:8%;

`;


export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  // margin-bottom: 1.5rem;
`;

export const HRManager = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  background-color: #fff;
  font-size: 0.95rem;
  color: #333;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.05);

  span {
    font-weight: 500;
  }

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

export const Title = styled.h2`
  font-size: 24px;
  margin: 0;
  margin-left:10px;
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: #555;
  margin-left:10px;
  margin-top:-1px;
`;
export const TitleSection = styled.div`
  display: flex;
  align-items: center;
`;
export const Hr = styled.hr`
  border: none;
  border-top: 1px solid #ccc;

`;



export const InfoSection = styled.div`
  width: 60%;
  // padding: 1rem 0;
  margin-left:5%;
`;

export const FullWidthInput = styled.input`
  width: 95%;
  padding: 0.8rem 1rem;
  margin-bottom: 1rem;
  // border: 1px solid #ccc;
  // border-radius: 6px;
  height:40%;
  color: black;

  border-radius: 7px;
border: 1px solid #052DB4;
background: #FFF;
`;

export const TwoColumnRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  width:99%;
`;
export const TwoColumnRows= styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  width:98%;
`;

export const Stepper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 2rem 0;
  max-width: 500px;
`;

export const Step = styled.div`
  text-align: center;
  flex: 1;
  border-bottom: 2px solid ${({ active }) => (active ? '#003366' : '#ccc')};
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  padding: 0.5rem;
  font-size: 0.9rem;
  color: ${({ active }) => (active ? '#003366' : '#999')};
`;

export const FormSection = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);

  h3 {
    margin-bottom: 1rem;
  }

  h4 {
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: #333;
  }
`;

export const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const FormGroup = styled.div`
  flex: 1;
  min-width: 180px;
`;

// export const Input = styled.input`
//   width: 100%;
//   padding: 0.6rem;
//   border-radius: 8px;
//   border: 1px solid #ccc;
// `;

// export const TextArea = styled.textarea`
//   width: 100%;
//   padding: 0.6rem;
//   height: 60px;
//   border-radius: 8px;
//   border: 1px solid #ccc;
// `;


export const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
`;

export const Button = styled.button`
  background: #003366;
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  margin-top: 2rem;
  cursor: pointer;

  &:hover {
    background: #002244;
  }
`;
// export const Title = styled.h2`
//   font-size: 24px;
//   margin: 0;

// `;

// export const Subtitle = styled.p`
//   font-size: 14px;
//   color: #555;

//   margin-top:-1px;
// `;
export const IconWrapper = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 1px solid #ccc;
  background-color: #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
`;
export const ColumnRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  // gap: 50px;
   column-gap: 3rem;
  width:98%;
`;

