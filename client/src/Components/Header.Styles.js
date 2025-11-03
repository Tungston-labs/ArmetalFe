import styled from 'styled-components';

// --- Global Layout Styles ---

export const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
`;

export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
`;

export const BackArrow = styled.span`
  font-size: 24px;
  color: #333;
  cursor: pointer;
  margin-right: 15px;
  // Use a proper icon component in a real app (e.g., react-icons)
`;

export const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const IconGroup = styled.div`
  color: #5d5cff; /* Example primary color */
  font-size: 36px;
  margin-right: 15px;
  // In a real app, this would be an actual Icon component
`;

export const Title = styled.h1`
  font-size: 24px;
  color: #333;
  margin: 0;
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: #999;
  margin: 0;
`;

// --- Profile Card Styles ---

export const ProfileCard = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 8px;
  
  /* Mobile-first approach */
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

export const ProfileImageWrapper = styled.div`
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  
  @media (min-width: 768px) {
    width: 200px; /* Fixed width for image on tablet/desktop */
    margin-right: 30px;
    margin-bottom: 0;
    justify-content: flex-start;
  }
`;

export const ProfileImage = styled.img`
  width: 100%;
  max-width: 150px; /* Control size on mobile */
  height: auto;
  border-radius: 8px;
  object-fit: cover;
  background-color: #ffe066; /* Yellow background from the image */
  aspect-ratio: 1 / 1; /* Keep it square */

  @media (min-width: 768px) {
    max-width: 200px;
    height: 250px; /* Taller on desktop */
    border-radius: 8px;
  }
`;

export const ContentArea = styled.div`
  flex-grow: 1;
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr) 3fr; /* 2 small, 1 large column */
  }
`;

// --- Input/Text Styles ---

export const InputBox = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
  
  /* Style matching the image */
  border: 1px solid #d9d9d9; 
  background-color: #fff;
`;

export const BioBox = styled.textarea`
  grid-column: 1 / -1; /* Spans all columns */
  min-height: 100px;
  padding: 10px;
  border: 1px solid #d9d9d9; 
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
  resize: vertical;
`;

// --- Responsive Grid Adjustment for Mobile ---

export const FullRow = styled.div`
  grid-column: 1 / -1; /* Always spans full width on mobile */
  
  @media (min-width: 768px) {
    &:nth-child(1), /* Name */
    &:nth-child(2), /* Phone */
    &:nth-child(3) { /* Email */
      grid-column: span 1; /* Takes 1/3 of the space */
    }
    &:nth-child(4) { /* Bio */
      grid-column: 3 / -1; /* Starts at the 3rd column, spans to the end */
      grid-row: 1 / span 3; /* Spans across 3 rows */
    }
    &:nth-child(5), /* DOB */
    &:nth-child(6) { /* Gender */
      grid-column: span 1; /* Takes 1/3 of the space */
    }
  }
`;

export const BioRow = styled.div`
  grid-column: 1 / -1; /* Always full width */

  @media (min-width: 768px) {
    grid-column: 3 / -1; /* Starts at 3rd column, spans to the end */
    grid-row: 1 / span 3; /* Spans across 3 rows */
  }
`;

export const DataRow = styled.div`
  grid-column: 1 / -1;
  
  @media (min-width: 768px) {
    grid-column: span 1;
  }
`;