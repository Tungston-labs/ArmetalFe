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


export const FormSection = styled.div`
  display: flex;
  gap: clamp(12px, 2vw, 27px);
  flex-wrap: wrap;

  /* ✅ Larger gaps for bigger screens */
  @media (min-width: 1920px) {
    gap: clamp(20px, 2vw, 36px);
  }

  @media (min-width: 2560px) {
    gap: clamp(24px, 2vw, 48px);
  }

  /* ✅ Stack vertically on small screens */
  @media (max-width: 767px) {
    flex-direction: column;
    gap: 16px;
  }
`;

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: clamp(160px, 20vw, 200px);

  @media (min-width: 2560px) {
    min-width: 320px; /* Wider on 4K */
  }

  @media (max-width: 767px) {
    min-width: 100%; /* Full width on mobile */
  }
`;

export const Label = styled.label`
  font-family: Satoshi;
  font-weight: 400;
  line-height: 120%;
  font-size: clamp(0.8rem, 1vw, 1rem);

  @media (min-width: 1920px) {
    font-size: clamp(1rem, 0.9vw, 1.2rem);
  }

  @media (min-width: 2560px) {
    font-size: 1.3rem;
  }

  @media (min-width: 3840px) {
    font-size: 1.8rem;
  }
`;

export const Input = styled.input`
  padding: clamp(6px, 1vw, 12px) clamp(10px, 1vw, 16px);
  border: 1px solid #ccc;
  border-radius: 7px;
  width: 100%;
  background-color: #fff;
  font-size: clamp(0.85rem, 1vw, 1rem);

  @media (min-width: 2560px) {
    font-size: 1.3rem;
    padding: 14px 20px;
  }

  @media (min-width: 3840px) {
    font-size: 1.6rem;
    padding: 18px 24px;
  }
`;

export const Select = styled.select`
  padding: clamp(6px, 1vw, 12px) clamp(10px, 1vw, 16px);
  border: 1px solid #ccc;
  border-radius: 7px;
  width: 100%;
  background-color: #fff;
  font-size: clamp(0.85rem, 1vw, 1rem);

  @media (min-width: 2560px) {
    font-size: 1.3rem;
    padding: 14px 20px;
  }

  @media (min-width: 3840px) {
    font-size: 1.6rem;
    padding: 18px 24px;
  }
`;

export const DateWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(6px, 1vw, 12px);
  width: 100%;
`;

export const DateInput = styled.input`
  padding: clamp(6px, 1vw, 12px) clamp(10px, 1vw, 16px);
  border: 1px solid #ccc;
  border-radius: 7px;
  width: 100%;
  background-color: #fff;
  font-size: clamp(0.85rem, 1vw, 1rem);

  @media (min-width: 2560px) {
    font-size: 1.3rem;
    padding: 14px 20px;
  }

  @media (min-width: 3840px) {
    font-size: 1.6rem;
    padding: 18px 24px;
  }
`;

export const Hr = styled.hr`
  border: none;
  border-top: 1px solid #ccc;
  margin: clamp(12px, 2vw, 24px) 0;
`;


export const AddButton = styled.button`
  background-color: #3352BA;
  color: white;
  padding: clamp(6px, 0.8vw, 20px) clamp(12px, 1.5vw, 36px);
  border: none;
  border-radius: clamp(5px, 0.5vw, 16px);
  cursor: pointer;
  font-size: clamp(0.9rem, 1vw, 1.6rem);
  height: clamp(36px, 4vh, 64px);
  align-self: flex-end;
  margin-left: auto;
  transition: all 0.3s ease;
  max-width: 260px; /* keeps it from exploding on wide screens */

  &:hover {
    background-color: #26408B;
  }

  /* Mobile (small phones) */
  @media (max-width: 480px) {
    width: 100%;
    align-self: center;
    margin-left: 0;
    max-width: none;
  }

  /* Tablets */
  @media (min-width: 481px) and (max-width: 768px) {
    width: 80%;
    align-self: center;
    margin-left: 0;
  }

  /* Laptops */
  @media (min-width: 769px) and (max-width: 1200px) {
    width: auto;
    max-width: 280px;
  }

  /* Desktops */
  @media (min-width: 1201px) and (max-width: 2560px) {
    font-size: clamp(1rem, 0.9vw, 1.6rem);
    padding: clamp(12px, 0.8vw, 20px) clamp(16px, 1.2vw, 36px);
    max-width: 300px;
  }

  /* 4K screens */
  @media (min-width: 2561px) and (max-width: 3840px) {
    font-size: clamp(1.2rem, 0.8vw, 2rem);
    padding: 20px 48px;
    max-width: 340px;
  }

  /* 8K screens */
  @media (min-width: 3841px) {
    font-size: clamp(1.4rem, 0.7vw, 2rem);
    padding: 24px 48px;
    max-width: 400px;
    display: flex;
    align-items: center;
    justify-content:center;

  }
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
  margin-top: 1rem;
 text-align: left;
  font-family: 'Satoshi';

  /* Scroll on small screens */
  // display: block;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  td {
    text-align: left;
    padding: clamp(4px, 0.5vw, 12px); /* responsive padding */
    white-space: nowrap;
    background-color: white;
    border: none;
    font-size: clamp(0.8rem, 1vw, 1.5rem); /* responsive font */
  }

  th {
 text-align: left;
    background-color: #304EB0;
    color: white;
    font-family: Raleway;
    padding: clamp(6px, 0.5vw, 16px); /* responsive padding */
    font-size: clamp(0.9rem, 1vw, 1.8rem); /* responsive font */
  }

  tbody tr {
    box-shadow: 0px 0px 2.7px 0px rgba(0, 0, 0, 0.28);
  }

  /* Background color for even rows */
  tbody tr:nth-child(even) td {
    background-color: #E6ECFF;
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

  @media (min-width: 2560px) {
    td, th {
      font-size: clamp(1.2rem, 1.5vw, 1.8rem); /* large screens like 2K/4K */
      padding: clamp(8px, 1vw, 24px);
    }
  }

  @media (min-width: 3840px) {
    td, th {
      font-size: clamp(1.5rem, 2vw, 2rem); /* ultra-large screens like 8K */
      padding: clamp(10px, 2vw, 32px);
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

     @media (min-width: 3500px) {
      padding: 0.8rem 1.5;
      font-size: 2.5rem;
    }
    @media (min-width: 2000px) {
      padding: 0.6rem 0.8rem;
      font-size: 1.8rem;
    }
  }
  @media (min-width: 2560px) {
    span{
      font-size: 2rem;
    padding: 0.5rem 1.5rem;
    }
    gap: 0.5rem;
  }
  @media (min-width: 3840px) {
    span{
      font-size: 2.5rem;
    }
    gap: 1rem;
  }
    .active {
    background: #1e3a8a;
    color: white;
    border-color: #1e3a8a;
  }
  }
`;
export const ErrorMessage = styled.p`
  color: red;
  margin-top: 8px;
  font-size: 14px;
`;
