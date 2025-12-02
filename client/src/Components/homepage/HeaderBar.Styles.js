import styled from "styled-components";

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;


  @media (min-width: 1920px) {
     margin-bottom: 20px;
  }

  @media (min-width: 2560px) {
    margin-bottom: 20px;
  }
     @media (min-width: 3840px) {
     margin-bottom: 20px;
  }
`;

export const Title = styled.h2`
  font-size: 28px;
  color: #222;
  font-weight: 600;

   @media (max-width: 600px) {
    font-size: 14px;
  }

  @media (min-width: 1920px) {
    font-size: 20px;
  }

  @media (min-width: 2560px) {
    font-size: 2.2rem;
  }
     @media (min-width: 3840px) {
    font-size: 2.2rem;
  }
`;

export const SlideButton = styled.button`
  font-size: 20px;
  padding: 8px 14px;
  background: #3352BA;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
`;
