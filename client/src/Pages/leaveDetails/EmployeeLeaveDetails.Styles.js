import styled from "styled-components";

// Breakpoints for responsiveness
const breakpoints = {
  xs: "480px",   // mobile
  sm: "768px",   // tablet
  md: "1024px",  // laptop
  lg: "1440px",  // large laptop
  xl: "2560px",  // 2K
  xxl: "3840px", // 4K
};

export const Container = styled.div`
  padding: 2rem;
  background: white;
  font-family: "Segoe UI", sans-serif;

  @media (max-width: ${breakpoints.sm}) {
    padding: 1rem;
  }
`;

export const Breadcrumb = styled.p`
  font-size: 0.95rem;
  margin: 1rem 0 2rem;
  color: #444;

  @media (max-width: ${breakpoints.sm}) {
    font-size: 0.85rem;
  }
`;

export const InfoGrid = styled.div`
  display: flex;
  gap: 2rem;
  width: 100%;

  @media (max-width: ${breakpoints.md}) {
    flex-direction: column;
  }
`;

export const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 10%;
  object-fit: cover;

  @media (max-width: ${breakpoints.lg}) {
    width: 120px;
    height: 120px;
  }

  @media (max-width: ${breakpoints.md}) {
    width: 80px;
    height: 80px;
  }

  @media (max-width: ${breakpoints.sm}) {
    width: 60px;
    height: 60px;
  }
`;

export const Input = styled.input`
  padding: 0.6rem 1rem;
  width: 100%;
  margin-bottom: 1rem;
  border-radius: 7px;
  border: 1px solid #3253C1;
  background: #fff;

  @media (max-width: ${breakpoints.sm}) {
    padding: 0.5rem;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 0.8rem;
  border-radius: 7px;
  border: 1px solid #3253C1;
  background: #fff;
  resize: vertical;
  margin-bottom: 2rem;

  @media (max-width: ${breakpoints.sm}) {
    min-height: 80px;
  }
`;

export const SectionTitle = styled.h4`
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 1rem;

  @media (max-width: ${breakpoints.sm}) {
    font-size: 0.9rem;
  }
`;

export const TwoColumn = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  width: 100%;

  @media (max-width: ${breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

export const ThreeColumn = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;
  width: 100%;

  @media (max-width: ${breakpoints.lg}) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: ${breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

export const FlexRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const ActionButton = styled.button`
  padding: 0.6rem 1.4rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;

  @media (max-width: ${breakpoints.sm}) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
`;

export const ApproveButton = styled(ActionButton)`
  background-color: rgba(51, 82, 186, 1);
  color: white;
  transition: all 0.3s ease;

  &:hover {
    background-color: blue;
  }
`;

export const DeclineButton = styled(ActionButton)`
  background-color: #f17070;
  color: white;

  &:hover {
    background-color: rgb(240, 47, 40);
    opacity: 0.9;
  }
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

export const HRManager = styled.div`
  display: flex;
  align-items: center;
  padding: 0.3rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  font-size: 0.95rem;
  color: #333;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.05);
  gap: 0.5rem;

  span {
    font-weight: 500;
  }

  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
  }

  @media (max-width: ${breakpoints.sm}) {
    font-size: 0.85rem;
    gap: 0.3rem;

    img {
      width: 25px;
      height: 25px;
    }
  }
`;

export const TitleSection = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

export const Title = styled.h2`
  font-size: 24px;
  margin: 0;
  margin-left: 10px;

  @media (max-width: ${breakpoints.sm}) {
    font-size: 20px;
  }
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: #555;
  margin-left: 10px;
  margin-top: -1px;

  @media (max-width: ${breakpoints.sm}) {
    font-size: 12px;
  }
`;

export const InfoSection = styled.div`
  width: 55%;

  @media (max-width: ${breakpoints.md}) {
    width: 100%;
    margin-top: 1rem;
  }
`;

export const FlexRows = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const LeftSide = styled.div`
  width: 30%;
  min-width: 150px;

  input {
    width: 100%;
  }

  @media (max-width: ${breakpoints.md}) {
    width: 100%;
  }
`;

export const RightSide = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 3rem;
  width: 20%;
  min-width: 150px;

  input {
    width: 40%;
    min-width: 70px;
  }

  @media (max-width: ${breakpoints.md}) {
    width: 100%;
    flex-direction: column;
    gap: 1rem;

    input {
      width: 100%;
    }
  }
`;

export const DateField = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 0.85rem;
  color: black;

  label {
    margin-bottom: 4px;
    font-weight: 500;
  }

  input {
    width: 90%;
  }

  @media (max-width: ${breakpoints.sm}) {
    font-size: 0.75rem;

    input {
      width: 100%;
    }
  }
`;
