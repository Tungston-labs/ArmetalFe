// ReimbursementDetail.styles.js
import styled from "styled-components";

export const PageWrapper = styled.div`
  background: #fff;
  padding: 2rem;
  font-family: Arial, sans-serif;
  color: #222;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const HeaderIcon = styled.div`
  font-size: 2rem;
  color: #2f52e0;
`;

export const HeaderTitle = styled.h2`
  font-size: 1.4rem;
  margin: 0 0 5px 0;
  color: #3250b5;
  font-family: "Satoshi";
  font-weight: 700;
  line-height: 1.2;

  @media (min-width: 480px) { /* small tablet */
    font-size: 0.8rem;
  }

  @media (min-width: 768px) { /* tablet */
    font-size: 1rem;
  }

  @media (min-width: 1024px) { /* desktop */
    font-size: 1.5rem;
  }

  @media (min-width: 1440px) { /* large desktop / 2K */
    font-size: 2rem;
  }

  @media (min-width: 2560px) { /* 4K */
    font-size: 3em;
  }

  @media (min-width: 3840px) { /* 8K */
    font-size: 4rem;
  }
`;

export const HeaderSubtitle = styled.p`
  // font-size: 1rem;
  color: #3250b5;
  margin: 0;
  font-family: Raleway;
  font-weight: 300;
  line-height: 1.2;

  @media (min-width: 480px) {
    font-size: 0.5rem;
  }

  @media (min-width: 768px) {
    font-size: 0.9rem;
  }

  @media (min-width: 1024px) {
    font-size: 1rem;
  }

  @media (min-width: 1440px) {
    font-size: 0.9rem;
  }

  @media (min-width: 2560px) {
    font-size: 1.5rem;
  }

  @media (min-width: 3840px) {
    font-size: 2.5rem;
  }
`;

export const ProfileSection = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  // margin-bottom: 1.5rem;
`;

export const ProfileImage = styled.img`
  width: 10rem;
  height: 10rem;
//   border-radius: 12px;
  object-fit: cover;
`;

export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Row = styled.div`
//   display: flex;
  gap: 1rem;
`;

export const Label = styled.div`
  font-size: 1rem;
  color: #3352BA; 
  min-width: 100px;
margin-bottom:5px;
font-family: Satoshi;
font-weight: 700;
font-style: Bold;
leading-trim: NONE;
line-height: 100%;
letter-spacing: 0%;

`;

export const Value = styled.div`
  font-size: 1rem;
  font-weight: 500;
`;

export const DateSection = styled.div`
  margin: 1.5rem 0;
`;

export const DescriptionBox = styled.div`
  border: 1px solid ;
  padding: 1rem;
  border-radius: 7px;
  line-height: 1.4;
  margin-bottom: 1.5rem;

  /* Ensure text wraps and respects line breaks */
  white-space: pre-wrap;      /* preserves line breaks */
  word-wrap: break-word;      /* wraps long words */
  overflow-wrap: break-word;  /* ensures no overflow */

  /* Optional: make scrollable if too long */
  max-height: 300px;          /* adjust as needed */
  overflow-y: auto;
`;

export const BillsSection = styled.div`
  margin-top: 1.5rem;
`;

export const BillsGrid = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.8rem;
  flex-wrap: wrap;
`;

export const BillImage = styled.img`
  width: 120px;
  height: 150px;
  border: 1px solid #ddd;
  border-radius: 6px;
  object-fit: cover;
`;

export const SelectBox = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
`;
export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #ddd;
  // margin: 1.5rem 0;
`;