import styled from "styled-components";

export const MainWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;

  /* Large screens up to 4K */
  @media (min-width: 1920px) {
    grid-template-columns: 2.2fr 1fr;
    gap: 30px;
  }

  @media (max-width: 1600px) {
    grid-template-columns: 2fr 1fr;
    gap: 25px;
  }

  @media (max-width: 1200px) {
    grid-template-columns: 1.5fr 1fr;
  }

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

export const LeftChart = styled.div`
  background: #fff;
  padding: 25px;
  border-radius: 14px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);

  @media (max-width: 992px) {
    padding: 20px;
  }

  @media (max-width: 600px) {
    padding: 15px;
  }
`;

export const RightCards = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 992px) {
    justify-content: stretch;
  }
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 100%;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const CardBox = styled.div`
  border-radius: 14px;
  padding: 22px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
  border: 1px solid #eaeaea;
  transition: 0.3s ease;
  border-top: 6px solid #3352BA;
  height: 175px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #3352BA;
  background: white;

  @media (max-width: 768px) {
    height: auto;
    padding: 18px;
  }

  @media (min-width: 2560px) {
    height: 220px;
    padding: 28px;
  }
`;

export const Title = styled.h4`
  font-size: 15px;
  color: #3352BA;
  margin-bottom: 8px;

  @media (min-width: 2560px) {
    font-size: 18px;
  }
`;

export const Count = styled.h2`
  font-size: 34px;
  font-weight: 700;
  margin: 0;
  color: #3352BA;

  @media (min-width: 2560px) {
    font-size: 42px;
  }
`;

export const Subtext = styled.p`
  font-size: 13px;
  color: #3352BA;
  margin-top: 10px;

  @media (min-width: 2560px) {
    font-size: 16px;
  }
`;

export const Heading = styled.h3`
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;

  @media (min-width: 2560px) {
    font-size: 22px;
  }
`;

export const ChartWrapper = styled.div`
  width: 100%;
`;

export const ChartTitle = styled.h3`
  text-align: left;
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;

  @media (min-width: 2560px) {
    font-size: 22px;
  }
`;
