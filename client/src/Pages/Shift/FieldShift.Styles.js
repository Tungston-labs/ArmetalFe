import styled from "styled-components";
import { FiSearch } from "react-icons/fi";

export const PageWrapper = styled.div`
  font-family: "Satoshi", sans-serif;
  color: #1a1a1a;
  padding: 2rem 3rem;
  background: #fff;
  min-height: 100vh;

  @media (max-width: 1200px) {
    padding: 1.5rem 3rem;
  }

  @media (max-width: 768px) {
    padding: 0.1rem 1.9rem;
  }

  @media (max-width: 480px) {
    padding: 0.8rem 1rem;
  }
`;

export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;


export const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem; 
`;
export const IconWrapper = styled.div`

  height: clamp(50px, 8vw, 120px); 
  width: auto; 

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
  }
`;


export const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
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

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    font-size: 14px;
  }

  @media (min-width: 1025px) and (max-width: 1440px) {
    font-size: 14px;
  }
  @media (min-width: 1441px) and (max-width: 1700px) {
    font-size: 16px;
  }

  @media (min-width: 1701px) and (max-width: 2060px) {
    font-size: 18px;
  }
  @media (min-width: 2060px) and (max-width: 2600px) {
    font-size: 20px;
  }
  @media (min-width: 2561px) and (max-width: 3840px) {
    font-size: 24px;
  }

  @media (min-width: 3841px) {
    font-size: 32px;
  }
`;

export const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 90%;
  max-width: 250px;
  margin: 1.5rem 0;

  @media (max-width: 480px) {
    max-width: 100%;
  }
`;

export const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 12px;
  color: #5f53a5;
  font-size: 1rem;
  pointer-events: none; /* allows clicking through to the input */
`;

export const SearchBar = styled.input`
  width: 100%;
  padding: 0.8rem 1.2rem 0.8rem 2.5rem; /* extra left padding for icon */
  border: 1px solid #5f53a5;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #333;
  background: #fff;

  &::placeholder {
    color: #aaa;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
    padding: 0.6rem 1rem 0.6rem 2.2rem;
  }
`;
export const AddFieldButton = styled.button`
   background: #1e3a8a;
  color: white;
  border: none;
  padding: clamp(0.5rem, 1vw, 1rem) clamp(1rem, 2vw, 2rem);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: clamp(0.3rem, 0.5vw, 1rem);
  font-size: clamp(0.9rem, 1vw, 1rem);
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #2744a3;
  }

  @media (min-width: 1440px) {
    font-size: clamp(0.9rem, 0.8vw, 1rem);
    padding: clamp(0.8rem, 1vw, 1rem) clamp(1.5rem, 2vw, 2rem);
  }

  @media (min-width: 2560px) {
    font-size: 1.5rem;
    padding: 1rem 3rem;
    gap: 1rem;
  }

  @media (min-width: 3840px) {
    font-size: 2.5rem;
    padding: 1.3rem 4.5rem;
    gap: 1.2rem;
  }
`;

export const CardsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(2, 1fr);

  @media (min-width: 1940px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: 1440px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  aspect-ratio: 1.7 / 1;
  border-radius: 10px;
  overflow: hidden; 
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2rem;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }

  .employee-count {
    font-weight: 600;
    font-size: 1rem;

    @media (max-width: 480px) {
      font-size: 0.85rem;
    }
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;
export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .menu-icon {
    font-size: 1.3rem;
    color: #555;
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
      color: #3f64d7;
    }
  }
`;
export const CardTitle = styled.h2`
  font-size: 1.1rem;
  color: #172554;
  margin: 0;
font-family: Raleway;
font-weight: 800;
font-style: ExtraBold;
font-size: 22px;
line-height: 100%;
letter-spacing: 0%;
margin-bottom: 0.2rem;
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;
export const Divider = styled.div`
  height: 1px;
  width: 40px;
  background-color: #ccc;

  @media (max-width: 480px) {
    width: 25px;
  }
`;
export const CardTitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
border-bottom:1px solid gray;
`;
export const CardText = styled.p`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.2rem 0;
  color: #172554;
  font-size: 0.9rem;
margin-top: 1rem;
  .employee-count {
    font-weight: 600;
    color: #172554;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;
export const CardFooter = styled.div`
  margin-top: auto;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

export const Tag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  background-color: #b4c5ff;
  color: #172554;
  font-size: 0.75rem;
  border-radius: 6px;
  padding: 0.3rem 0.6rem;
  font-weight: 500;
  /* backdrop-filter: blur(2px); */
font-family: Trispace;
font-weight: 400;
font-style: Regular;
font-size: 12px;
line-height: 100%;
letter-spacing: 0%;

  img {
    width: 20px;
    height: 20px;
    background-color: #172554;
    border-radius: 50%;
  }

  @media (max-width: 480px) {
    font-size: 0.7rem;
    padding: 0.25rem 0.5rem;

    img {
      width: 12px;
      height: 12px;
    }
  }
`;
