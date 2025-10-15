import styled from "styled-components";

export const TableContainer = styled.div`
  width: 100%;
  background: #fff;
  border-radius: 8px;
  overflow-x: auto;
  font-family: "Satoshi", sans-serif;
`;

export const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  gap: 10px;
  padding: 0px 10px;

  .time-section {
    flex: 2;

    .time-box {
      background-color: #304eb0;
      color: white;
      /* padding: 10px 24px; */
      font-weight: 600;
      /* font-size: 14px; */
      border-radius: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-transform: capitalize;
      text-align: center;
      width: 100%;
    }
  }

  .location-section {
    flex: 1;

    div {
      background-color: #304eb0;
      color: white;
      padding: 10px 24px;
      font-weight: 600;
      font-size: 14px;
      border-radius: 6px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 6px;
      text-transform: capitalize;
      text-align: center;
      width: 100%;
    }
  }

  /* =============== RESPONSIVE BREAKPOINTS =============== */

  /* Small laptops (≤1020px) */
  @media (max-width: 1020px) {
    .time-box,
    .location-section div {
      font-size: 13px;
      padding: 8px 20px;
      border-radius: 5px;
    }
  }

  /* 1021px–1440px (standard desktop) */
  @media (min-width: 1021px) and (max-width: 1440px) {
    .time-box,
    .location-section div {
      font-size: 15px;
      padding: 10px 28px;
    }
  }

  /* 1441px–1940px (large desktop) */
  @media (min-width: 1441px) and (max-width: 1940px) {
    .time-box,
    .location-section div {
      font-size: 16px;
      padding: 12px 34px;
    }
  }

  /* 1941px–2560px (2K monitors) */
  @media (min-width: 1941px) and (max-width: 2560px) {
    .time-box,
    .location-section div {
      font-size: 18px;
      padding: 14px 42px;
      border-radius: 8px;
    }
  }

  /* 2561px–3840px (4K screens) */
  @media (min-width: 2561px) and (max-width: 3840px) {
    .time-box,
    .location-section div {
      font-size: 22px;
      padding: 18px 56px;
      border-radius: 10px;
    }
  }

  /* Mobile (≤768px) */
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;

    .time-section,
    .location-section {
      width: 100%;
    }

    .time-box,
    .location-section div {
      justify-content: center;
      font-size: 12px;
      padding: 8px 12px;
    }
  }
`;


/* TABLE ROW */
export const TableRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  gap: 10px;
  /* border-bottom: 1px solid #eaeaea; */
  padding: 8px 10px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

/* TIME SECTION (matches header) */
export const TimeSection = styled.div`
  flex: 2;
  background: #ffffff;
  box-shadow: 0px 0px 2.7px 0px #00000047;
  border-radius: 6px;
  padding: 8px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .time-in {
    font-size: 13px;
    background-color: #304eb0;
    color: white;
    padding: 8px 14px;
    border-radius: 4px;
    font-weight: 600;
    white-space: nowrap;
    min-width: 80px;
    text-align: center;
  }

  .time-out {
    font-size: 13px;
    background-color: #fd907b;
    color: black;
    padding: 8px 14px;
    border-radius: 4px;
    font-weight: 600;
    white-space: nowrap;
    min-width: 80px;
    text-align: center;
  }

  .time-separator {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0 8px;
    position: relative;

    &::before {
      content: "";
      flex: 1;
      border-bottom: 2px dotted #ccc;
    }

    .to-text {
      flex: none;
      padding: 0 8px;
      font-size: 13px;
      font-weight: 600;
      color: #555;
    }

    &::after {
      content: "";
      flex: 1;
      border-bottom: 2px dotted #ccc;
    }
  }

  /* ================= RESPONSIVE BREAKPOINTS ================= */

  /* Small Laptop (≤1020px) */
  @media (max-width: 1020px) {
    padding: 8px 12px;
    .time-in,
    .time-out {
      font-size: 12px;
      /* padding: 6px 12px; */
      border-radius: 4px;
    }

    .time-separator .to-text {
      font-size: 12px;
    }
  }

  /* Standard Desktop (1021px–1440px) */
  @media (min-width: 1021px) and (max-width: 1440px) {
    padding: 10px 18px;
    .time-in,
    .time-out {
      font-size: 14px;
      /* padding: 8px 16px; */
    }

    .time-separator .to-text {
      font-size: 13px;
    }
  }

  /* Large Desktop (1441px–1940px) */
  @media (min-width: 1441px) and (max-width: 1940px) {
    padding: 14px 22px;
    .time-in,
    .time-out {
      font-size: 16px;
      /* padding: 10px 20px; */
      border-radius: 6px;
    }

    .time-separator .to-text {
      font-size: 15px;
    }
  }

  /* 2K Monitors (1941px–2560px) */
  @media (min-width: 1941px) and (max-width: 2560px) {
    /* padding: 18px 28px; */
    border-radius: 8px;

    .time-in,
    .time-out {
      font-size: 18px;
      /* padding: 12px 24px; */
      border-radius: 8px;
    }

    .time-separator .to-text {
      font-size: 16px;
    }
  }

  /* 4K Monitors (2561px–3840px) */
  @media (min-width: 2561px) and (max-width: 3840px) {
    padding: 24px 40px;
    border-radius: 10px;

    .time-in,
    .time-out {
      font-size: 22px;
      padding: 16px 30px;
      border-radius: 10px;
    }

    .time-separator .to-text {
      font-size: 20px;
    }
  }

  /* Mobile (≤768px) */
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 6px;
    padding: 8px 10px;

    .time-in,
    .time-out {
      width: 100%;
      text-align: center;
      font-size: 12px;
      padding: 6px 10px;
    }

    .time-separator {
      flex-direction: column;
      margin: 6px 0;
      &::before,
      &::after {
        display: none;
      }
    }

    .time-separator .to-text {
      font-size: 12px;
      margin: 4px 0;
    }
  }
`;

/* LOCATION SECTION */
export const LocationSection = styled.div`
  flex: 1;
  background: #ffffff;
  box-shadow: 0px 0px 2.7px 0px #00000047;
  border-radius: 4px;
  padding: 8px 14px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  transition: all 0.3s ease;

  svg {
    color: #304eb0;
    flex-shrink: 0;
    margin-top: 4px;
    font-size: 16px;
  }

  p {
    margin: 0;
    color: #304eb0;
    font-weight: 400;
    line-height: 1.4;
  }

  .note {
    margin-top: 4px;
    color: #555;
    font-weight: 400;
  }

  /* ✅ Mobile First Responsive Breakpoints */

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 4px;
    font-size: 12px;
    padding: 6px 10px;

    svg {
      font-size: 14px;
      margin-top: 0;
    }
  }

  @media (min-width: 769px) and (max-width: 1020px) {
    font-size: 12.5px;
    padding: 7px 12px;

    svg {
      font-size: 15px;
    }
  }

  @media (min-width: 1021px) and (max-width: 1440px) {
    font-size: 13px;
    padding: 8px 14px;
  }

  @media (min-width: 1441px) and (max-width: 1940px) {
    font-size: 14px;
    padding: 10px 18px;

    svg {
      font-size: 18px;
    }
  }

  @media (min-width: 1941px) and (max-width: 2560px) {
    font-size: 15px;
    padding: 12px 20px;

    svg {
      font-size: 20px;
    }
  }

  @media (min-width: 2561px) and (max-width: 3840px) {
    font-size: 1.8rem;
    padding: 14px 28px;

    svg {
      font-size: 22px;
    }
  }
`;

