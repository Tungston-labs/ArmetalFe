import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  background: #fff;
  font-family: "Inter", sans-serif;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const LeftBlock = styled.div`
  display: flex;
  align-items: center;
`;

export const IconWrapper = styled.div`
  padding: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const Title = styled.h2`
  margin: 0;
  color: #3250B5;
  font-size: 1.25rem;
  font-family: "Satoshi";
font-weight: 700;
font-style: Bold;
font-size: 22px;
line-height: 100%;
letter-spacing: 0%;

`;

export const Subtitle = styled.span`
  font-size: 0.9rem;
  color: #3250B5;
  font-family: "Raleway";
font-weight: 300;
font-style: Light;
font-size: 16px;
line-height: 100%;
letter-spacing: 0%;

`;

export const RightBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: #304EB0;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  font-weight: 500;
  transition: 0.3s ease;

  &:hover {
    background: #1d4ed8;
  }
`;

export const SearchSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border: 1px solid #172554;
  border-radius: 6px;
  padding: 0.6rem 1rem;
  flex: 1;
  max-width: 500px;

  svg {
    color: #6b7280;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const Input = styled.input`
  border: none;
  outline: none;
  flex: 1;
  font-size: 0.9rem;
  color: #111827;
  background: transparent;
font-family: "Satoshi";
font-weight: 300;
font-style: Light Italic;
font-size: 17px;
line-height: 100%;
letter-spacing: 0%;

  &::placeholder {
    color: #9ca3af;
  }
`;

export const Dropdown = styled.select`
  border: 1px solid #172554;
  padding: 0.6rem 0.9rem;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #374151;
  background: #fff;
  cursor: pointer;
  min-width: 160px;

  &:focus {
    outline: none;
    border-color: #2563eb;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const TabsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.8rem;
  width: 100%;
  margin-top: 0.5rem;


 
  
`;

export const TabButton = styled.button`
  width: 100%;
  background: ${({ active }) => (active ? "#304EB0" : "#F2F2F2")};
  color: ${({ active }) => (active ? "#fff" : "black")};
  border: none;
  border-radius: 4px;
  padding: 0.7rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ active }) => (active ? "#8CA0E2" : "#8CA0E2")};
      color: ${({ active }) => (active ? "#fff" : "white")};
  }
`;

export const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: #e5e7eb;
  width: 100%;

  @media (max-width: 768px) {
    margin-top: 0.5rem;
  }
`;
export const BackArrow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  /* margin-right: 12px; */
  cursor: pointer;
  color: #3352BA;
  transition: 0.2s ease;

  &:hover {
    color: #172554;
    transform: translateX(-3px);
  }
`;