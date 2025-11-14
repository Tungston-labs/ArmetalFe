import styled from "styled-components";
import { LuArrowLeft } from "react-icons/lu";

export const Container = styled.div`
  padding: 20px;
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
  width: clamp(50px, 8vw, 200px);   /* min 50px, max 250px, scales with viewport */
  height: clamp(50px, 10vw, 250px);  /* keeps square shape */
  border-radius: 10%;                 /* rounded corners */
  object-fit: cover;

  /* Optional fine-tuning for very small screens */
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
  }

  /* Optional fine-tuning for tablets */
  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
  }

  /* Optional fine-tuning for large ultra-wide screens */
  @media (min-width: 3840px) { /* 4K */
    /* width: 300px; */
    height: 300px;
  }

  @media (min-width: 7680px) { /* 8K */
    width: 400px;
    height: 400px;
  }
`;


export const Input = styled.input`
  width: 100%;
  padding: 10px 14px;
  color: black;
  border-radius: 7px;
  border: 1px solid #052DB4;
  background: #FFF;
  box-sizing: border-box;

  /* Responsive refinements */
  @media (min-width: 768px) and (max-width: 1024px) {
    font-size: 0.7rem;
    padding: 8px 10px;
       margin-bottom: 0.5rem;
  }

  @media (min-width: 1025px) and (max-width: 1440px) {
    font-size: 0.8rem;
    padding: 14px 16px;
    margin-bottom: 0.5rem;
  }

  @media (min-width: 1441px) and (max-width: 1920px) {
    font-size: 0.9rem;
    padding: 10px 10px;
    margin-bottom: 0.5rem;
  }

  @media (min-width: 1921px) and (max-width: 2540px) {
    font-size: 1.2rem;
    padding: 14px 16px;
    margin-bottom: 0.5rem;
  }

  @media (min-width: 2541px) and (max-width: 3840px) {
    font-size: 1.125rem; /* 18px */
    padding: 14px 16px;
    margin-bottom: 0.5rem;
  }

  @media (min-width: 3841px) {
    font-size: 1.375rem; /* 22px */
    padding: 18px 22px;
    margin-bottom: 1rem;
  }

  @media (min-width: 7680px) {
    font-size: 1.625rem; /* 26px */
    padding: 22px 26px;
    margin-bottom: 1rem;
  }
`;



export const TextArea = styled.textarea`
  width: 99%;
  min-height: 100px;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  resize: vertical;
  margin-bottom: 2rem;
  border-radius: 7px;
border: 1px solid #3253C1;
background: #FFF;
  font-size: clamp(0.8rem, 1vw, 1.5rem);

  &:focus {
    outline: none;
    border-color: #002ea3;
    box-shadow: 0 0 5px rgba(50, 83, 193, 0.3);
  }
      @media (min-width: 1024px) {
    min-height: 50px;
    font-size: 0.8rem;
    padding: 1.5rem;
  }

    @media (min-width: 1440px) {
    min-height: 50px;
    font-size: 0.8rem;
    padding: 1.5rem;
  }
  @media (min-width: 1920px) {
    min-height: 200px;
    font-size: 1.8rem;
    padding: 1.5rem;
  }

  @media (min-width: 2560px) {
    min-height: 250px;
    font-size: 1.8rem;
    padding: 1.5rem;
  }
  @media (min-width: 3840px) {
    min-height: 250px;
    font-size: 1.8rem;
    padding: 1.5rem;
  }

  /* Ultra-large (8K) screens */
  @media (min-width: 7680px) {
    min-height: 350px;
    font-size: 2rem;
    padding: 2rem;
  }
`;


export const SectionTitle = styled.h4`
  color: #000;
  font-family: Satoshi;
  font-style: normal;
  font-weight: 700;
  line-height: 1.3;

  /* Responsive font sizing */
  font-size: clamp(1rem, 1.2vw, 2rem);

  /* Adjust for ultra-wide screens */
  @media (min-width: 3840px) {
    font-size: 2.5rem;
  }

  @media (min-width: 7680px) {
    font-size: 3rem;
  }
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
  font-size: clamp(0.9rem, 1vw, 1.1rem);
  padding: clamp(6px, 1vw, 12px) clamp(14px, 2vw, 24px);
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background-color: blue;
    transform: scale(1.05);
  }

  @media (min-width: 2560px) { /* 4K */
    font-size: 1.8rem;
    padding: 18px 36px;
  }

  @media (min-width: 3840px) { /* 4K */
    font-size: 2rem;
    padding: 18px 36px;
  }

  @media (min-width: 7680px) { /* 8K */
    font-size: 2.5rem;
    padding: 24px 48px;
  }
`;

export const DeclineButton = styled(ActionButton)`
  background-color: #f17070;
  color: white;
  font-size: clamp(0.9rem, 1vw, 1.1rem);
  padding: clamp(6px, 1vw, 12px) clamp(14px, 2vw, 24px);
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgb(240, 47, 40);
    opacity: 0.9;
    transform: scale(1.05);
  }

@media (min-width: 2560px) { /* 4K */
    font-size: 1.8rem;
    padding: 18px 36px;
  }

  @media (min-width: 3840px) { /* 4K */
    font-size: 2rem;
    padding: 18px 36px;
  }

  @media (min-width: 7680px) { /* 8K */
    font-size: 2.5rem;
    padding: 24px 48px;
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
  font-size: 1.4rem;
  margin: 0 0 5px 0;
  color: #3250b5;
  font-family: "Satoshi";
  font-weight: 700;
  line-height: 1.2;

  @media (min-width: 480px) { /* small tablet */
    font-size: 0.8rem;
  }

  @media (min-width: 768px) { /* tablet */
    font-size: 1rem;
  }

  @media (min-width: 1024px) { /* desktop */
    font-size: 1.5rem;
  }

  @media (min-width: 1440px) { /* large desktop / 2K */
    font-size: 2rem;
  }

  @media (min-width: 2560px) { /* 4K */
    font-size: 3em;
  }

  @media (min-width: 3840px) { /* 8K */
    font-size: 4rem;
  }
`;

export const Subtitle = styled.p`
  // font-size: 1rem;
  color: #3250b5;
  margin: 0;
  font-family: Raleway;
  font-weight: 300;
  line-height: 1.2;

  @media (min-width: 480px) {
    font-size: 0.5rem;
  }

  @media (min-width: 768px) {
    font-size: 0.9rem;
  }

  @media (min-width: 1024px) {
    font-size: 1rem;
  }

  @media (min-width: 1440px) {
    font-size: 0.9rem;
  }

  @media (min-width: 2560px) {
    font-size: 1.5rem;
  }

  @media (min-width: 3840px) {
    font-size: 2.5rem;
  }
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
  width: clamp(90%, 97%, 100%);             /* responsive width */
  padding: clamp(0.5rem, 1vw, 1rem);       /* responsive padding */
  margin-bottom: 1rem;
  border: 1px solid #3253C1;
  border-radius: 7px;
  height: clamp(35px, 5vw, 60px);          /* responsive height */
  background: #FFF;
  font-size: clamp(0.8rem, 1vw, 1rem);     /* responsive font size */

  &:focus {
    outline: none;
    border-color: #002ea3;
    box-shadow: 0 0 5px rgba(50, 83, 193, 0.3);
  }

  /* Ultra-large screens */
  @media (min-width: 3840px) { /* 4K */
    height: 10rem;
    padding: 1.5rem;
    font-size: 2rem;
  }

  @media (min-width: 7680px) { /* 8K */
    height: 120px;
    padding: 2rem;
    font-size: 2rem;
  }
`;


export const TwoColumnRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  width:97%;
`;
export const TwoColumnRows= styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  width:100%;
`;

export const FlexRows = styled.div`
  display: flex;
  justify-content: space-between; /* left and right sides spread out */
  align-items: flex-start; /* align at top */
  gap: 1rem;
  flex-wrap: nowrap; /* keep them on the same line */
  width: 100%;
`;

export const LeftSide = styled.div`
  flex: 1; /* take available space */
  min-width: 100px;

  input {
    width: 50%;
  }
`;

export const RightSide = styled.div`
  display: flex;
  gap: 1rem; /* space between From & To */
  min-width: 300px; /* make sure enough space for inputs */

  input {
    width: 120px; /* each input width */
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
  cursor: pointer;
  width: clamp(20px, 2vw, 50px);
  height: clamp(20px, 2vw, 50px);

  /* 2K / QHD */
  @media (min-width: 2560px) {
    width: 60px;
    height: 60px;
  }

  /* 4K */
  @media (min-width: 3840px) {
    width: 80px;
    height: 80px;
  }

  /* 8K */
  @media (min-width: 7680px) {
    width: 120px;
    height: 120px;
  }
`;
export const ProfileImageWrapper = styled.div`
  width: clamp(60px, 10%, 200px); /* min 60px, max 200px, scales with screen */
  height: clamp(60px, 10%, 200px);
  overflow: hidden;
  border-radius: 10%; /* square with rounded corners */
`;

// export const ProfileImage = styled.img`
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
// `;