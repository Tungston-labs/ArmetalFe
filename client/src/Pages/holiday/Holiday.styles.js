// src/Pages/holiday/Holiday.styles.js
import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
  font-family: sans-serif;
`;
export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 30px;
`;


export const HRManager = styled.div`
  display: flex;
  height:30px;
 
  align-items: center;
  padding: 0.3rem ;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  font-size: 0.95rem;
  color: #333;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.05);

  span {
    font-weight: 500;
  }

  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
  }
`;
export const Header = styled.div`
  // display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;
export const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top:20px;

  img {
    height: 51px;
  }

  div {
    display: flex;
    flex-direction: column;
  }
`;


export const Title = styled.h2`
  font-size: 22px;
  margin: 0;
    font-family: Satoshi;
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
  margin-left: 2px;
  font-family:raleway;
`;
// export const Title = styled.h1`
//   font-size: 2rem;
//   margin: 0;
//   text-transform: capitalize;
// `;

// export const Subtitle = styled.p`
//   font-size: 1rem;
//   color: #666;
// `;

export const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

// export const FormSection = styled.div`
//   display: flex;
//   gap: 27px;
//   // margin-bottom: 30px;

// `;

// export const Input = styled.input`
//   padding: 8px 12px;
//   border: 1px solid #ccc;
//   border-radius: 7px;
//   width:40%;
//     background-color:white;
// `;

// export const Select = styled.select`
//   padding: 8px 12px;
//   border: 1px solid #ccc;
//   border-radius: 7px;
//   width:25%;
//     background-color:white;
// `;

// FormStyles.js


export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 200px;
  flex: 1;

  /* ✅ On 4K, expand width for readability */
  @media (min-width: 2560px) {
    min-width: 320px;
  }

  /* ✅ On tablets, make narrower */
  @media (max-width: 1023px) {
    min-width: 160px;
  }

  /* ✅ On mobile, full width */
  @media (max-width: 767px) {
    min-width: 100%;
  }
`;

export const Label = styled.label`
  font-family: Satoshi;
  font-weight: 400;
  line-height: 120%;

  /* ✅ Responsive font scaling */
  font-size: clamp(0.8rem, 1vw, 1rem);

  @media (min-width: 1920px) and (max-width: 2559px) {
    font-size: 1.1rem;
  }

  @media (min-width: 2560px) {
    font-size: 1.3rem;
  }
`;

export const FormSection = styled.div`
  display: flex;
  gap: 27px;
  flex-wrap: wrap;

  /* ✅ Larger gaps for big screens */
  @media (min-width: 1920px) {
    gap: 36px;
  }

  @media (min-width: 2560px) {
    gap: 48px;
  }

  /* ✅ Stack fields vertically on small screens */
  @media (max-width: 767px) {
    flex-direction: column;
    gap: 16px;
  }
`;

export const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 7px;
  width: 100%;
  background-color: white;

  /* ✅ Responsive font */
  font-size: clamp(0.85rem, 1vw, 1rem);

  @media (min-width: 1920px) and (max-width: 2559px) {
    font-size: 1.1rem;
    padding: 12px 16px;
  }

  @media (min-width: 2560px) {
    font-size: 1.3rem;
    padding: 14px 20px;
  }
`;

export const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 7px;
  width: 100%;
  background-color: white;

  /* ✅ Responsive font */
  font-size: clamp(0.85rem, 1vw, 1rem);

  @media (min-width: 1920px) and (max-width: 2559px) {
    font-size: 1.1rem;
    padding: 12px 16px;
  }

  @media (min-width: 2560px) {
    font-size: 1.3rem;
    padding: 14px 20px;
  }
`;

// export const DateWrapper = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 8px;
//   border: 1px solid #ccc;
//   border-radius: 7px;
//   padding: 4px 8px;
//   background-color: white;
// `;

// export const DateInput = styled.input`
//   border: none;
//   outline: none;
//   flex: 1;
// `;

export const Hr = styled.hr`
  border: none;
  border-top: 1px solid #ccc;

`;
export const DateInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 7px;
  background-color: #fff;
  width: 100%;
`;

export const DateWrapper = styled.div`
  display: flex;
  align-items: center;
  gap:10px;
`;



export const AddButton = styled.button`
  background-color: #3352BA;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 7px;
  cursor: pointer;
  font-size: 16px;
  height: 42px;
  align-self: flex-end; 
  margin-left: auto;   
`;

export const TableWrapper = styled.div`
  // overflow-x: auto;
  margin-top:20px;
`;
export const Heading = styled.h2`
  margin: 0 0 12px 0;
  font-family: Raleway;
  font-weight: 600;
  line-height: 120%;
  letter-spacing: 0%;

  /* ✅ Responsive font size using clamp */
  font-size: clamp(0.9rem, 1.2vw, 1.2rem);

  /* ✅ Large desktops / laptops */
  @media (min-width: 1024px) and (max-width: 1919px) {
    font-size: 1.4rem;
  }

  /* ✅ QHD / 2K screens */
  @media (min-width: 1920px) and (max-width: 2559px) {
    font-size: 1.8rem;
  }

  /* ✅ 4K screens */
  @media (min-width: 2560px) {
    font-size: 2.2rem;
  }

  /* ✅ Tablets */
  @media (min-width: 768px) and (max-width: 1023px) {
    font-size: 1.1rem;
  }

  /* ✅ Mobiles */
  @media (max-width: 767px) {
    font-size: 1rem;
  }
`;


export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
  margin-top: -1rem;

  th, td {
    text-align: left;
    padding: 0.5rem;
    white-space: nowrap;
    background-color: white;
    border: none;
  }

  th {
    background-color: #3352BA;
    color: white;
    padding: 0.75rem;
    font-family: Raleway;
  }

  /* ✅ Background color for even rows */
  tbody tr:nth-child(even) td {
    background-color: #E6ECFF;
  }

  /* ✅ Shadow only for tbody rows */
  tbody tr {
    box-shadow: 0px 0px 2.7px 0px rgba(0, 0, 0, 0.28);
    font-family: Satoshi;
  }

  tbody tr td:first-child {
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
  }

  tbody tr td:last-child {
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
  }

  tbody tr:hover td {
    background-color: #f5f5f5;
  }

  /* ✅ Responsive breakpoints */
  /* 4K UHD (3840px and up) */
  @media (min-width: 2560px) {
    th, td {
      font-size: 22px;
      padding: 1.2rem;
    }
  }

  /* QHD / 2K screens (1920px–2559px) */
  @media (min-width: 1920px) and (max-width: 2559px) {
    th, td {
      font-size: 20px;
      padding: 1rem;
    }
  }

  /* Normal desktops & laptops (1024px–1919px) */
  @media (min-width: 1024px) and (max-width: 1919px) {
    th, td {
      font-size: 16px;
      padding: 0.7rem;
    }
  }

  /* Tablets (768px–1023px) */
  @media (min-width: 768px) and (max-width: 1023px) {
    th, td {
      font-size: 14px;
      padding: 0.5rem;
    }
    border-spacing: 0 6px;
  }

  /* Mobiles (≤767px) */
  @media (max-width: 767px) {
    display: block;
    overflow-x: auto;   /* horizontal scroll */
    white-space: nowrap;

    th, td {
      font-size: 12px;
      padding: 0.4rem;
    }
  }
`;

export const Th = styled.th`
  text-align: left;
  padding: 10px;
  background-color: #E1E8EC;

  @media (min-width: 2560px) {
    font-size: 22px;
  }
  @media (min-width: 1920px) and (max-width: 2559px) {
    font-size: 20px;
  }
  @media (max-width: 1023px) {
    font-size: 14px;
  }
  @media (max-width: 767px) {
    font-size: 12px;
  }
`;

export const Td = styled.td`
  padding: 10px;
  background: #fff;
  max-width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: default;

  @media (min-width: 2560px) {
    font-size: 20px;
    max-width: 400px;
  }
  @media (min-width: 1920px) and (max-width: 2559px) {
    font-size: 18px;
    max-width: 350px;
  }
  @media (max-width: 1023px) {
    font-size: 14px;
    max-width: 200px;
  }
  @media (max-width: 767px) {
    font-size: 12px;
    max-width: 150px;
  }
`;

export const Tr = styled.tr`
  overflow: hidden;
`;

export const TrashIcon = styled.span`
  cursor: pointer;
`;


export const Pagination = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 0.5rem;

  span {
    padding: 0.2rem 0.5rem;
    border: 1px solid #ccc;
    cursor: pointer;
    border-radius: 4px;

    &.active {
      background-color: #2f4cac;
      color: white;
    }
  }
`;
export const ErrorMessage = styled.p`
  color: red;
  margin-top: 8px;
  font-size: 14px;
`;
