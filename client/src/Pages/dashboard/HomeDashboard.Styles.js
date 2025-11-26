import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  background: #f4f8ff;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 10px;
  }
`;

export const ContentWrapper = styled.div`
  flex: 1;
  transition: all 0.3s ease;

  &.shrink {
    margin-right: 300px;
    transform: scale(0.97);

    @media (max-width: 1024px) {
      margin-right: 0;
      transform: scale(1);
    }
  }

  @media (min-width: 1920px) {
    max-width: 1600px;
    margin: 0 auto;
  }

  @media (min-width: 2560px) {
    max-width: 2000px;
    margin: 0 auto;
  }

  @media (min-width: 3840px) {
    max-width: 3200px;
    margin: 0 auto;
  }
`;

export const TwoColumn = styled.div`
  display: flex;
  gap: 20px;
  margin: 20px 0;
  align-items: stretch; 

  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

export const LeftBox = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  height: 100%; 
`;

export const RightBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%; 
`;


export const ThreeColumnRow = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap;

  @media (max-width: 992px) {
    flex-direction: column;
  }


  @media (min-width: 1920px) {
    max-width: 1600px;
    margin: 0 auto;
  }

  @media (min-width: 2560px) {
    max-width: 2000px;
    margin: 0 auto;
  }

  @media (min-width: 3840px) {
    max-width: 3200px;
    margin: 0 auto;
  }
`;

export const ThreeBox = styled.div`
  flex: 1;
  min-width: 280px;
  background: white;
  padding: 16px;
  border-radius: 14px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100%;
  }

  @media (min-width: 1920px) {
    padding: 20px;
  }

  @media (min-width: 2560px) {
    padding: 24px;
  }

  @media (min-width: 3840px) {
    padding: 32px;
  }
`;
