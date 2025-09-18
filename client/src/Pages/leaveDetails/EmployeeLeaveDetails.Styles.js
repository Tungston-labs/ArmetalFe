import styled from "styled-components";
import { LuArrowLeft } from "react-icons/lu";

export const Container = styled.div`
  padding: 2rem;
  background: white;
  font-family: "Segoe UI", sans-serif;
`;

export const Breadcrumb = styled.p`
  font-size: 0.95rem;
  margin: 1rem 0 2rem;
  color: #444;
`;

export const InfoGrid = styled.div`
  display: flex;
  gap: 2rem;
  // margin-bottom: 2rem;
  width:100%;
      // justify-content: space-between;

`;

export const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 10%;
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


export const Input = styled.input`
  padding: 0.6rem 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  width: 99%;
  margin-bottom: 1rem;
  border-radius: 7px;
border: 1px solid #3253C1;
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
  border-radius: 7px;
border: 1px solid #3253C1;
background: #FFF;
`;

export const SectionTitle = styled.h4`
  // margin-top: 2rem;
  margin-bottom: 0.5rem;
  color: #333;

`;

export const TwoColumn = styled.div`
  // display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  width: 30%;
  margin-left:20px;
`;

export const ThreeColumn = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;
  width: 100%;
`;

export const FlexRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
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
  background-color: rgba(51, 82, 186, 1);
  color: white;
  transition: all 0.3s ease;

  &:hover {
    background-color:blue;
  }
`;


export const DeclineButton = styled(ActionButton)`
  background-color: #f17070;
  color: white;

  &:hover {
    background-color:rgb(240, 47, 40); /* darker red */
    opacity: 0.9;
  }
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  // margin-bottom: 1.5rem;
`;

export const HRManager = styled.div`
  display: flex;
  height:30px;
 
  align-items: center;
  padding: 0.3rem ;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  font-size: 0.95rem;
  color: #333;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.05);

  span {
    font-weight: 500;
  }

  img {
    width: 30px;
    height: 30px;
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
  width: 55%;
  // padding: 1rem 0;
  // margin-left:10%;
`;

export const FullWidthInput = styled.input`
  width: 97%;
  padding: 0.6rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  height:40%;
  border-radius: 7px;
border: 1px solid #3253C1;
background: #FFF;
`;

export const TwoColumnRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  width:97%;
`;
export const TwoColumnRows= styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  width:99%;
`;
// export const Input = styled.input`
//   width: 100%;
//   padding: 0.6rem 1rem;
//   border: 1px solid #ccc;
//   border-radius: 6px;
// `; make this as responsvie
export const FlexRows = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  width: 100%;
`;

export const LeftSide = styled.div`
  width: 30%;
  min-width: 150px;

  input {
    width: 100%;
  }
`;

export const RightSide = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 3rem;
  width: 20%;
  min-width: 150px;
  

  input {
    width: 40%; /* Split the 20% area between two inputs */
    min-width: 70px;
  }
`;
export const DateField = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 0.85rem;
  color: black;

  label {
    margin-bottom: 4px;
    font-weight: 500;
  }

  input {
    width: 90%;
  }
`;

export const EmployeeImage = styled.img`
  height: clamp(50px, 8vw, 120px); /* scales between 50px and 120px */
  width: auto; /* maintain aspect ratio */
  
  @media (min-width: 768px) {
    height: clamp(20px, 6vw, 20px);
  }

  @media (min-width: 1024px) {
    height: clamp(20px, 4vw, 50px);
  }

  @media (min-width: 1440px) {
    height: clamp(50px, 1vw, 80px);
  }

  @media (min-width: 2560px) {
    height: clamp(80px, 2vw, 100px);
  }

  @media (min-width: 3840px) {
    height: clamp(100px, 3vw, 200px);
  }`;

  export const BackArrow = styled(LuArrowLeft)`
  width: clamp(20px, 2vw, 35px);
  height: clamp(20px, 2vw, 35px);
  cursor: pointer;
  color: #3250B5;
  transition: color 0.2s ease;

  &:hover {
    color: #1e3a8a; /* darker shade on hover */
  }
`;
