// components/PayrollDetailsStyles.js
import styled from 'styled-components';
import { HiArrowLeft } from 'react-icons/hi';
export const Container = styled.div`
  background-color: white;
  padding: 2rem;
  font-family: 'Arial', sans-serif;
  color: #111;

  @media (max-width: 768px) {
    padding: 1rem;
  }
  @media (min-width: 2560px) { /* 2K/QHD */
    padding: 4rem;
  }
  @media (min-width: 3840px) { /* 4K */
    padding: 5rem;
  }
  @media (min-width: 7680px) { /* 8K */
    padding: 6rem;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 1.25rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
`;

export const LeftHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const BackTitle = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 0.5rem;
`;

export const RightHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const BackIcon = styled(HiArrowLeft)`
  width: 20px;   /* default for small screens */
  height: 20px;

  @media (min-width: 2560px) { /* 2K / QHD */
    width: 35px;
    height: 35px;
  }

  @media (min-width: 3840px) { /* 4K */
    width: 40px;
    height: 40px;
  }

  @media (min-width: 7680px) { /* 8K */
    width: 45px;
    height: 45px;
  }
`;
export const Title = styled.h2`
  font-size: clamp(18px, 2vw, 32px);
  margin: 0;
  font-family: Satoshi;
  font-weight: 700;

  @media (min-width: 2560px) { /* 2K / QHD */
    font-size: 3.5rem;
  }

  @media (min-width: 3840px) { /* 4K */
    font-size: 4rem;
  }

  @media (min-width: 7680px) { /* 8K */
    font-size: 4.5rem;
  }
`;

export const Badge = styled.span`
  background: #28C80926;
  color: green;
  padding: 0.3rem 0.6rem;
  border: 1px solid green;
  border-radius: 6px;
  font-size: clamp(12px, 1vw, 16px);

  @media (min-width: 2560px) {
    font-size: 2rem;
  }
  @media (min-width: 3840px) {
    font-size: 3rem;
  }
  @media (min-width: 7680px) {
    font-size: 4rem;
  }
`;

export const PrintIcon = styled.span`
  font-size: clamp(18px, 2vw, 28px);
  cursor: pointer;
  display: flex;
  align-items: center;

  @media (min-width: 2560px) {
    font-size: 3rem;
  }
  @media (min-width: 3840px) {
    font-size: 4rem;
  }
  @media (min-width: 7680px) {
    font-size: 4.5rem;
  }
`;


export const GridLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  @media (min-width: 2560px) {
    gap: 3rem;
  }

  @media (min-width: 3840px) {
    gap: 4rem;
  }
`;

export const InfoTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  @media (min-width: 2560px) {
    gap: 0.6rem;
  }
  @media (min-width: 3840px) {
    gap: 0.8rem;
  }
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.2rem 0;
  border-bottom: 1px solid #ddd;
  cursor:pointer;
`;

export const Label = styled.div`
  font-family: Satoshi;
  font-weight: 400;
  line-height: 1.4;

  /* Small devices */
  @media (max-width: 480px) {
    font-size: 14px;
  }

  /* Tablets */
  @media (min-width: 481px) and (max-width: 1024px) {
    font-size: 16px;
  }

  /* Desktop Full HD */
  @media (min-width: 1025px) and (max-width: 2559px) {
    font-size: 1.5;
  }

  /* 2K/QHD */
  @media (min-width: 2560px) and (max-width: 3839px) {
    font-size: 2.5rem;
  }

  /* 4K */
  @media (min-width: 3840px) and (max-width: 7679px) {
    font-size: 3rem;
  }

  /* 8K */
  @media (min-width: 7680px) {
    font-size: 3.5rem;
  }
`;

export const Value = styled(Label)``


export const SectionTitle = styled.h3`
  font-size: clamp(16px, 1.5vw, 24px);
  margin-top: 2rem;
  padding-bottom: 0.5rem;
  font-family: Satoshi;
  font-weight: 700;
`;

export const SectionTitles = styled.h3`
  text-decoration: underline;
  font-family: Satoshi;
  font-weight: 700;
  padding-bottom: 0.5rem;
  cursor:pointer;
  /* Base font size for small screens */
  font-size: 16px;

  /* Medium screens (tablets / desktops) */
  @media (min-width: 768px) {
    font-size: 20px;
  }

  /* Large screens (full HD) */
  @media (min-width: 1920px) {
    font-size: 26px;
  }

  /* 2K / QHD */
  @media (min-width: 2560px) {
    font-size: 30px;
  }

  /* 4K screens */
  @media (min-width: 3840px) {
    font-size: 3rem;
  }

  /* 8K screens */
  @media (min-width: 7680px) {
    font-size: 48px;
  }
`;


export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

export const Table = styled.table`
  width: 100%;
  min-width: 600px;
  border-collapse: collapse;
  cursor:pointer;
  td, th {
    border: 1px solid #999;
    padding: 0.4rem;
    text-align: left;
    font-size: 14px; 
    @media (min-width: 768px) {
      font-size: 16px;
    }
    @media (min-width: 1200px) {
      font-size: 16px;
    }
    @media (min-width: 2560px) {
      font-size: 2rem;
         padding: 0.8rem;
    }
    @media (min-width: 3840px) { 
      font-size: 2.5rem;
        padding: 1rem;
    }
    @media (min-width: 7680px) { 
      font-size: 32px;
    }
  }
`;


export const TableHeader = styled.th`
  margin-top: 20px;
  border-bottom: 1px solid #ccc;
`;

export const TableData = styled.td`
  font-family: Satoshi;
  font-weight: 400;
  font-size: clamp(14px, 1vw, 18px);
`;

export const TotalRow = styled.tr`
  font-weight: bold;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  margin-top: 2rem;
  font-weight: bold;
  border: 1px solid #999;
  cursor:pointer;
  span {
    font-weight: bold;
  }

  /* Small screens (mobile) */
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.8rem;
    font-size: 14px;
  }

  /* Medium screens (tablets/desktops) */
  @media (min-width: 769px) and (max-width: 1920px) {
    padding: 1rem;
    font-size: 16px;
  }

  /* Large screens (2K / QHD) */
  @media (min-width: 2560px) {
    padding: 1.5rem;
    font-size: 20px;
  }

  /* 4K screens */
  @media (min-width: 3840px) {
    padding: 2.5rem;
    font-size: 3rem;
  }

  /* 8K screens */
  @media (min-width: 7680px) {
    padding: 3rem;
    font-size: 32px;
  }
`;


export const TableHeadingEarnings = styled.div`
  display: grid;
  grid-template-columns: 3fr 0.5fr 1fr 1fr;
  font-weight: bold;
  padding: 0.4rem;
  margin-top: 1rem;
  font-size: 14px; /* default for small screens */
  cursor:pointer;
  @media (min-width: 768px) {
    font-size: 16px;
  }
  @media (min-width: 1200px) {
    font-size: 18px;
  }
  @media (min-width: 2560px) { /* 2K/QHD */
    font-size: 2.5rem;
    padding: 0.5rem;
  }
  @media (min-width: 3840px) { /* 4K */
    font-size: 2rem;
    padding: 0.8rem;
  }
  @media (min-width: 7680px) { /* 8K */
    font-size: 4rem;
  }
`;


export const TableHeadingDeductions = styled.div`
  display: grid;
  grid-template-columns: 4fr 1fr;
  font-weight: bold;
  padding: 0.4rem;
  margin-top: 1rem;
  font-size: clamp(14px, 1vw, 20px);
`;

export const SectionHeading = styled.h3`
  font-family: Satoshi;
  font-weight: 700;
  font-size: 18px; /* default for small screens */

  @media (min-width: 768px) {
    font-size: 20px;
  }

  @media (min-width: 1200px) {
    font-size: 22px;
  }

  @media (min-width: 1920px) {
    font-size: 26px;
  }

  @media (min-width: 2560px) {
    font-size: 30px;
  }

  @media (min-width: 3840px) {
    font-size: 3rem;
    padding: 1rem;
  }

  @media (min-width: 7680px) {
    font-size: 48px;
  }
`;