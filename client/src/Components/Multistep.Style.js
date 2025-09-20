import styled from "styled-components";

export const StepsWrapper = styled.div`
  .ant-steps-item-icon {
    position: relative; /* allow ::before to be placed behind */
    z-index: 1;
    width: clamp(24px, 2vw, 40px);
    height: clamp(24px, 2vw, 40px);

    .ant-steps-icon {
      font-size: clamp(12px, 1.5vw, 24px); /* responsive icon number inside circle */
    }
  }

  .ant-steps-item-title {
    font-size: clamp(12px, 1.2vw, 20px) !important;
    @media (min-width: 2560px) { /* 2K/QHD */
      font-size: 24px !important;
    }
    @media (min-width: 3840px) { /* 4K */
      font-size: 28px !important;
    }
    @media (min-width: 7680px) { /* 8K */
      font-size: 36px !important;
    }
  }

  .ant-steps-item-icon::before {
    content: "";
    position: absolute;
    top: -6px;
    left: -6px;
    width: calc(100% + 12px);
    height: calc(100% + 12px);
    border: 2px solid #6c7b8b; /* ring color */
    border-radius: 50%;
    z-index: -1; /* behind the circle */

    @media (min-width: 2560px) {
      top: -10px;
      left: -10px;
      width: calc(100% + 20px);
      height: calc(100% + 20px);
    }
    @media (min-width: 3840px) {
      top: -14px;
      left: -14px;
      width: calc(100% + 28px);
      height: calc(100% + 28px);
    }
    @media (min-width: 7680px) {
      top: -20px;
      left: -20px;
      width: calc(100% + 40px);
      height: calc(100% + 40px);
    }
  }
`;
