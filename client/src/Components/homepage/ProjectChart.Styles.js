import styled from "styled-components";

export const ChartCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);

  @media (max-width: 992px) {
    padding: 18px;
    border-radius: 14px;
  }

  @media (max-width: 600px) {
    padding: 14px;
    border-radius: 12px;
  }

  @media (min-width: 1920px) {
    padding: 28px;
    border-radius: 20px;
  }

  @media (min-width: 2560px) {
    padding: 58px;
    border-radius: 24px;
  }
`;

export const ChartTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;

  @media (max-width: 992px) {
    font-size: 16px;
  }

  @media (max-width: 600px) {
    font-size: 14px;
  }

  @media (min-width: 1920px) {
    font-size: 22px;
  }

  @media (min-width: 2560px) {
    font-size: 26px;
  }
`;

export const TooltipBox = styled.div`
  background: white;
  padding: 10px 14px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border: 1px solid #e2e8f0;

  .label {
    margin: 0;
    font-weight: 600;
    color: #1e293b;
    font-size: 14px;

    @media (max-width: 600px) {
      font-size: 12px;
    }

    @media (min-width: 1920px) {
      font-size: 16px;
    }

    @media (min-width: 2560px) {
      font-size: 18px;
    }
  }

  .value {
    margin: 0;
    margin-top: 4px;
    color: #3b5bff;
    font-weight: 500;
    font-size: 14px;

    @media (max-width: 600px) {
      font-size: 12px;
    }

    @media (min-width: 1920px) {
      font-size: 16px;
    }

    @media (min-width: 2560px) {
      font-size: 18px;
    }
  }

  @media (max-width: 600px) {
    padding: 8px 10px;
  }

  @media (min-width: 1920px) {
    padding: 12px 16px;
  }

  @media (min-width: 2560px) {
    padding: 16px 20px;
  }
`;
