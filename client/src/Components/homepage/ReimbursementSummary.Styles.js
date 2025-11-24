import styled from "styled-components";

export const MainWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 25px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

export const LeftChart = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 14px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
`;

export const RightCards = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  width: 100%;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;


export const CardBox = styled.div`
  border-radius: 14px;
  padding: 22px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.1);
  border: 1px solid #eaeaea;
  transition: 0.3s ease;
  border-top: 6px solid #3352BA;
  height: 170px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color:#3352BA;
`;

  


export const Title = styled.h4`
  font-size: 15px;
  color: #3352BA;
  margin-bottom: 8px;
`;

export const Count = styled.h2`
  font-size: 34px;
  font-weight: 700;
  margin: 0;
  color: #3352BA;
`;

export const Subtext = styled.p`
  font-size: 13px;
  color: #3352BA;
  margin-top: 10px;
`;
