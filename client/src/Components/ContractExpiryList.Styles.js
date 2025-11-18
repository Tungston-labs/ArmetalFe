import styled from "styled-components";

export const Container = styled.div`
  padding: 20px 25px;
  display: flex;
  flex-direction: column;
  gap: 25px;

  /* Important for responsive grid children: allow shrinking */
  min-width: 0;
  width: 100%;
`;

export const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
`;
export const DeptCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  flex: 1;
  display: flex;
  position: relative;
  gap: 20px;
  align-items: center;
  border: 1px solid #eee;

  .bigLetter {
    font-size: 70px;
    font-weight: 900;
    color: #e8effc;
  }

  .info {
    display: flex;
    flex-direction: column;

    h3 {
      margin: 0;
      font-size: 17px;
      font-weight: 600;
    }

    p {
      margin: 2px 0;
      color: #777;
      font-size: 13px;
    }

    .headRow {
      display: flex;
      align-items: center;
      gap: 6px;

      img {
        width: 28px;
        height: 28px;
        border-radius: 50%;
      }

      span {
        font-size: 14px;
      }
    }
  }

  .count {
    position: absolute;
    top: 20px;
    right: 20px;
    font-weight: 600;
  }
`;

/* Now it's safe to reference DeptCard here */
export const DeptWrapper = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;

  /* Enable scroll on small screens */
  @media (max-width: 768px) {
    overflow-x: auto;
    padding-bottom: 10px;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;

    /* Prevent cards from shrinking */
    ${DeptCard} {
      min-width: 250px;
      flex: 0 0 auto;
    }
  }
`;


export const PresenceWrapper = styled.div`
  display: flex;
  gap: 25px;
`;

export const ChartCard = styled.div`
  background: #fff;
  flex: 0.7;
  padding: 25px;
  border-radius: 12px;
  text-align: center;
  border: 1px solid #eee;

  .donut {
    width: 150px;
    height: 150px;
    margin: auto;
    border-radius: 50%;
    position: relative;
    overflow: hidden;
    transform: rotate(-35deg);

    .bluePart {
      width: 100%;
      height: 100%;
      background: #3449eb;
      position: absolute;
      clip-path: polygon(0 0, 100% 0, 100% 65%, 0 65%);
    }

    .redPart {
      width: 100%;
      height: 100%;
      background: #ff6f61;
      position: absolute;
      clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
    }
  }

  .total {
    font-size: 40px;
    font-weight: 700;
    margin-top: 10px;
  }

  .totalText {
    font-size: 15px;
    color: #444;
  }

  .legend {
    margin-top: 20px;

    .row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      font-size: 14px;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;

      &.blue {
        background: #3449eb;
      }
      &.red {
        background: #ff6f61;
      }
    }
  }
`;

export const ContractCard = styled.div`
  background: #fff;
  flex: 1.3;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #eee;

  h3 {
    margin-bottom: 15px;
    font-size: 16px;
    font-weight: 600;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .item {
      display: grid;
      grid-template-columns: 40px 1fr 1fr 2fr;
      align-items: center;
      gap: 10px;

      img {
        width: 38px;
        height: 38px;
        border-radius: 50%;
      }

      .name {
        font-weight: 500;
      }

      .id {
        font-size: 14px;
      }

      .email {
        font-size: 13px;
        color: #555;
      }
        span {
        overflow-wrap: anywhere;
        word-break: break-word;
      }
    }
  }
`;
