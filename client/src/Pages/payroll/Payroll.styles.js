// components/PayrollDetailsStyles.js
import styled from 'styled-components';

export const Container = styled.div`
  background-color: white;
  padding: 2rem;
  font-family: 'Arial', sans-serif;
  color: #111;
`;
// export const Header = styled.div`
//   display: flex;
//   align-items: center;
//   gap:5px;
// `;

export const Header = styled.div`
  display: flex;
  align-items: center;
  // justify-content: space-between;  
  width: 100%;
  gap:20px;
`;

export const LeftHeader = styled.div`
  display: flex;
  align-items: center;
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

export const Title = styled.h2`
  font-size: 1.4rem;
  margin: 0;
  font-family: Satoshi;
font-weight: 700;
font-style: Bold;
leading-trim: NONE;
line-height: 100%;
letter-spacing: 0%;

`;

export const Badge = styled.span`
  background: #28C80926;
  color: green;
  padding: 0.3rem 0.6rem;
  border: 1px solid green;
  border-radius: 6px;
  font-size: 0.75rem;
`;

export const PrintIcon = styled.span`
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
`;


export const GridLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 1rem;
`;

export const InfoTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.1rem 0;              /* spacing above and below */
  border-bottom: 1px solid #ddd;  /* underline */
`;

export const Label = styled.div`
  font-family: Satoshi;
font-weight: 400;
font-style: Regular;
font-size: 17px;
leading-trim: NONE;
line-height: 100%;
letter-spacing: 0%;

`;

export const Value = styled.div`
  font-family: Satoshi;
font-weight: 400;
font-style: Regular;
font-size: 17px;
leading-trim: NONE;
line-height: 100%;
letter-spacing: 0%;

`;

export const SectionTitle = styled.h3`
  // text-decoration:underline;
  font-size: 1.2rem;
  margin-top: 2rem;
  // border-bottom: 1px solid #ccc;
  padding-bottom: 0.5rem;
  font-family: Satoshi;
font-weight: 700;
font-style: Bold;
// font-size: 20px;
leading-trim: NONE;
line-height: 100%;
letter-spacing: 0%;

`;
export const SectionTitles = styled.h3`
  text-decoration:underline;
  font-size: 1.2rem;
  // margin-top: 2rem;
  // border-bottom: 1px solid #ccc;
  padding-bottom: 0.5rem;
 font-family: Satoshi;
font-weight: 700;
font-style: Bold;
font-size: 17px;
leading-trim: NONE;
line-height: 100%;
letter-spacing: 0%;

`;
export const TableWrapper = styled.div`
  width: 100%;
`;

// export const Table = styled.table`
//   width: 100%;
//   border-collapse: collapse;
//   margin-top: 1rem;

//   td, th {
//     border: 1px solid #999;
//     padding: 0.4rem;
//     text-align: left;
//   }
// `;

export const TableHeader = styled.th`
 margin-top:20px;
   border-bottom: 1px solid #ccc;
`;

export const TableData = styled.td`
  // font-size: 0.9rem;
  font-family: Satoshi;
font-weight: 400;
font-style: Regular;
font-size: 17px;
leading-trim: NONE;
line-height: 100%;
letter-spacing: 0%;
// 
`;

export const TotalRow = styled.tr`
  font-weight: bold;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  // background: #f3f3f3;
  padding: 1rem;
  margin-top: 2rem;
  font-weight: bold;
  border: 1px solid #999;
    // border-bottom: none;
  span {
    font-weight: bold;
  }
`;

// Salary Earnings heading (4 columns)
export const TableHeadingEarnings = styled.div`
  display: grid;
  grid-template-columns: 3fr 0.5fr 1fr 1fr;  /* match table column widths */
  font-weight: bold;
  // background: #f3f3f3;
  padding: 0.4rem;
  // border: 1px solid #999;
  // border-bottom: none; /* visually merges with the table */
  margin-top: 1rem;
  font-family: Satoshi;
font-weight: 700;
font-style: Bold;
font-size: 17px;
leading-trim: NONE;
line-height: 100%;
letter-spacing: 0%;

`;

// Salary Deductions heading (2 columns)
export const TableHeadingDeductions = styled.div`
  display: grid;
  grid-template-columns: 4fr 1fr; /* match table column widths */
  font-weight: bold;
  // background: #f3f3f3;
  padding: 0.4rem;
  // border: 1px solid #999;
  // border-bottom: none;
  margin-top: 1rem;
`;

// Adjust table to sit flush under heading
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 0;
  
  td {
    border: 1px solid #999;
    padding: 0.4rem;
    text-align: left;
  }
`;
