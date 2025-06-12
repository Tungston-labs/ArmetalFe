// DocumentUploadForm.styles.js
import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  background: #f9fbe9;
   font-family: Satoshi;
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
   display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  background-color: #fff;
  font-size: 0.95rem;
  color: #333;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.05);

  span {
    font-weight: 500;
  }

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
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
  // margin-top: 2rem;
  margin-bottom: 1rem;
  font-size:18px;
  // color: #333;
`;

export const UploadSection = styled.div`
  // margin-bottom: 1.5rem;
  // background: #fff;
  padding: 1rem;
  border-radius: 8px;
`;

export const LabelRow = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 0.8rem;
  background:white;
  color:#999999;
`;

export const UploadButton = styled.button`
  background-color: #1e40af;
  color: #fff;
  padding: 0.6rem 1rem;
  border: none;
  width:15%;
  font-size:18px;
  height:80px;
  border-radius: 6px;
  // margin-bottom: 1rem;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #1c3aa9;
  }
`;

// export const ImagePreviewRow = styled.div`
//   display: flex;
//   gap: 0.8rem;
// `;

// export const ImageBox = styled.div`
//   width: 117px;
//   height: 80px;
//   background: #f0f0f0;
//   border-radius: 4px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

export const InlineUploadRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap; /* makes it responsive */
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;

export const Button = styled.button`
  background: ${({ secondary }) => (secondary ? '#9EABD8' : '#172554')};
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
export const Title = styled.h2`
  font-size: 24px;
  margin: 0;
  margin-left:10px;
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: #555;
  margin-left:10px;
  margin-top:-1px;
`;

export const Hr = styled.hr`
  border: none;
  border-top: 1px solid #ccc;

`;
export const ImagePreviewRow = styled.div`
  display: flex;
  gap: 0.8rem;
`;

export const ImageBox = styled.div`
 width: 117px;
//   height: 80px;
//   border-radius: 10px;
//   border: 1px solid #ccc;
  overflow: hidden;
//   background-color: #f8f8f8;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
