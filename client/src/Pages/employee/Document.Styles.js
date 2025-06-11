// DocumentUploadForm.styles.js
import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  background: #f9fbe9;
  font-family: 'Segoe UI', sans-serif;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
  }

  p {
    color: gray;
    font-size: 0.9rem;
  }
`;

export const RoleInfo = styled.div`
  background: #fff;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  box-shadow: 0 0 4px rgba(0,0,0,0.1);
`;

export const Stepper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 2rem 0;
  max-width: 600px;
`;

export const Step = styled.div`
  text-align: center;
  flex: 1;
  border-bottom: 2px solid ${({ active }) => (active ? '#003366' : '#ccc')};
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  padding: 0.5rem;
  font-size: 0.9rem;
  color: ${({ active }) => (active ? '#003366' : '#999')};
`;

export const SectionTitle = styled.h4`
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #333;
`;

export const UploadSection = styled.div`
  margin-bottom: 1.5rem;
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
`;

export const LabelRow = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 0.8rem;
`;

export const UploadButton = styled.button`
  background-color: #1e40af;
  color: #fff;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #1c3aa9;
  }
`;

export const ImagePreviewRow = styled.div`
  display: flex;
  gap: 0.8rem;
`;

export const ImageBox = styled.div`
  width: 60px;
  height: 60px;
  background: #ccc;
  border-radius: 4px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

export const Button = styled.button`
  background: ${({ secondary }) => (secondary ? '#c7ceec' : '#003366')};
  color: ${({ secondary }) => (secondary ? '#000' : '#fff')};
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background: ${({ secondary }) => (secondary ? '#aab3d0' : '#002244')};
  }
`;
