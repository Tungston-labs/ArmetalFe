import styled from "styled-components";

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0px;
  background: #fff;
  // border-bottom: 1px solid #eee;
`;

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  // gap: 15px;
`;

export const BackButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  color: #2d4ed8; /* blue */
  display: flex;
  align-items: center;
`;

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  // gap: 10px;
`;

export const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
`;

export const Icon = styled.img`
  width: 52px;
  height: 52px;
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

export const SearchBox = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #c7c7f7;
  border-radius: 8px;
  padding: 6px 10px;
  color: #6b6be3;
  background: #fff;
`;

export const SearchInput = styled.input`
  border: none;
  outline: none;
  margin-left: 6px;
  font-size: 14px;
  color: #333;

  &::placeholder {
    color: #a0a0d0;
  }
`;
export const EmployeeImage = styled.img`
  height: clamp(50px, 8vw, 120px); /* scales between 50px and 120px */
  width: auto; /* maintain aspect ratio */
  
  @media (min-width: 768px) {
    height: clamp(70px, 6vw, 150px);
  }

  @media (min-width: 1024px) {
    height: clamp(80px, 5vw, 180px);
  }

  @media (min-width: 1440px) {
    height: clamp(100px, 4vw, 220px);
  }

  @media (min-width: 2560px) {
    height: clamp(150px, 3vw, 300px);
  }

  @media (min-width: 3840px) {
    height: clamp(200px, 2vw, 400px);
  }
`;
