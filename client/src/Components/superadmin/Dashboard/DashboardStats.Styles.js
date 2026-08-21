import styled from "styled-components";

export const StatsContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));

  background: #ffffff;
  border-radius: 6px;

  padding: 10px 0;
  margin-bottom: 15px;

  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);

  box-sizing: border-box;
  overflow: hidden;

  /* Large Desktop */
  @media (min-width: 1920px) {
    padding: 14px 0;
  }

  /* Desktop / Laptop */
  @media (max-width: 1400px) {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  /* Small Laptop / Tablet Landscape */
  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  /* Tablet */
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding: 8px 0;
  }

  /* Mobile */
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    padding: 0;
  }
`;

export const StatItem = styled.div`
  min-width: 0;
  min-height: 72px;

  padding: 8px 20px;

  display: flex;
  flex-direction: column;
  justify-content: center;

  position: relative;

  box-sizing: border-box;

  /* Desktop separators */
  &:not(:last-child)::after {
    content: "";

    position: absolute;

    right: 0;
    top: 8px;

    width: 1px;
    height: calc(100% - 16px);

    border-right: 1px dotted #d9d9d9;
  }

  /* 3-column layout */
  @media (max-width: 1100px) {
    &:nth-child(3n)::after {
      display: none;
    }
  }

  /* 2-column layout */
  @media (max-width: 768px) {
    min-height: 70px;
    padding: 8px 16px;

    &:nth-child(3n)::after {
      display: block;
    }

    &:nth-child(2n)::after {
      display: none;
    }
  }

  /* Mobile */
  @media (max-width: 480px) {
    min-height: 68px;

    padding: 10px 16px;

    &:not(:last-child)::after {
      display: none;
    }

    &:not(:last-child) {
      border-bottom: 1px dotted #d9d9d9;
    }
  }

  /* Very small phones */
  @media (max-width: 360px) {
    min-height: 62px;
    padding: 8px 14px;
  }
`;

export const StatIcon = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 6px;

  svg {
    width: 18px;
    height: 18px;

    color: #171717;
  }

  @media (max-width: 768px) {
    svg {
      width: 17px;
      height: 17px;
    }
  }

  @media (max-width: 480px) {
    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

export const StatValue = styled.div`
  width: 100%;
  font-size: 12px;
  color: #171717;
  line-height: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: "Poppins";
font-weight: 500;
font-style: Medium;
line-height: 18px;
letter-spacing: 0%;
vertical-align: bottom;
margin-bottom: 4px;


  @media (min-width: 1920px) {
    font-size: 14px;
  }

  @media (max-width: 768px) {
    font-size: 12px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
  }

  @media (max-width: 360px) {
    font-size: 12px;
  }
`;

export const StatLabel = styled.div`
  width: 100%;

  font-size: 14px;
  font-weight: 400;

  color: #171717;

  line-height: 17px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (min-width: 1920px) {
    font-size: 12px;
  }

  @media (max-width: 768px) {
    font-size: 10px;
  }

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;