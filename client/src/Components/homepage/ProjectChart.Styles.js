import styled from "styled-components";

export const ChartCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  width: 100%;
  max-width: 100%;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);

  @media (max-width: 992px) {
    padding: 16px;
    border-radius: 14px;
  }

  @media (max-width: 600px) {
    padding: 12px;
    border-radius: 12px;
  }

  /* Large screen improvements */
  @media (min-width: 1920px) {
    padding: 28px;
  }

  @media (min-width: 2560px) {
    padding: 40px;
  }

  @media (min-width: 3840px) {
    padding: 60px;
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
    font-size: 28px;
  }

  @media (min-width: 3840px) {
    font-size: 34px;
  }
`;

export const TooltipBox = styled.div`
  background: white;
  padding: 10px 14px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);

  .label {
    margin: 0;
    font-weight: 600;
    color: #1e293b;
    font-size: 14px;

    @media (max-width: 600px) {
      font-size: 12px;
    }

    @media (min-width: 1920px) {
      font-size: 18px;
    }

    @media (min-width: 2560px) {
      font-size: 20px;
    }

    @media (min-width: 3840px) {
      font-size: 24px;
    }
  }

  .value {
    margin: 4px 0 0;
    color: #3b5bff;
    font-weight: 500;
    font-size: 14px;

    @media (max-width: 600px) {
      font-size: 12px;
    }

    @media (min-width: 1920px) {
      font-size: 18px;
    }

    @media (min-width: 2560px) {
      font-size: 20px;
    }

    @media (min-width: 3840px) {
      font-size: 24px;
    }
  }
`;
export const ChartWrapper = styled.div`
  width: 100%;
  height: 300px;     

  /* Tablets */
  @media (max-width: 1024px) {
    height: 300px;
  }



  /* Large screens (1920p) */
  @media (min-width: 1920px) {
    height: 280px;
  }


  @media (min-width: 2560px) {
    height: 335px;
  }

  /* 4K screens */
  @media (min-width: 3840px) {
    height: 26vh;
  }
`;

