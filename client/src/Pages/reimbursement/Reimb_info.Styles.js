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
  margin: 0;
  color: #2f52e0;
`;

export const HeaderSubtitle = styled.div`
  font-size: 0.9rem;
  color: #2f52e0;
`;

export const ProfileSection = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  margin-bottom: 1.5rem;
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
  font-size: 0.9rem;
  color: gray;
  min-width: 100px;
margin-bottom:5px;
`;

export const Value = styled.div`
  font-size: 1rem;
  font-weight: 500;
`;

export const DateSection = styled.div`
  margin: 1.5rem 0;
`;

export const DescriptionBox = styled.div`
  border: 1px solid #ddd;
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
