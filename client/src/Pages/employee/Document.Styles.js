// DocumentUploadForm.styles.js
import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  background: white;
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
  padding: 0.5rem 1rem;
  // border: 1px solid #ccc;
  // border-radius: 12px;
  background-color: #fff;
  font-size: 0.95rem;
  color: #333;
  // box-shadow: 0 0 4px rgba(0, 0, 0, 0.05);

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
  margin-bottom: 1rem;
  font-family: Satoshi, sans-serif;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  color: #030303;

  /* Responsive font size */
  font-size: clamp(1rem, 1.5vw, 1.8rem); /* min 1rem, max 1.8rem, scales with viewport */

  /* Extra-large screen adjustments */
  @media (min-width: 3840px) { /* 4K */
    font-size: 2.5rem;
  }

  @media (min-width: 7680px) { /* 8K */
    font-size: 3.5rem;
  }
`;


export const UploadSection = styled.div`
  margin-bottom: 1.5rem;
  background: #F1F1F1;
  padding: clamp(0.8rem, 1vw, 2rem);
  border-radius: 8px;

  @media (min-width: 1440px) {
    padding: 2rem;
    border-radius: 10px;
  }
  @media (min-width: 1960px) {
    padding: 2.5rem;
    border-radius: 12px;
  }
  @media (min-width: 2560px) {
    padding: 2rem;
    border-radius: 14px;
     margin-bottom:2rem;
  }
  @media (min-width: 3840px) {
    padding: 3rem;
    border-radius: 16px;
       margin-bottom:2.5rem;
  }
  @media (min-width: 7680px) {
    padding: 4rem;
    border-radius: 18px;
  }
`;

export const LabelRow = styled.div`
  font-size: clamp(0.9rem, 1vw, 1.2rem);
  font-weight: 500;
  margin-bottom: clamp(0.5rem, 1vw, 1rem);
  background: white;
  color: #999999;
  padding: clamp(0.2rem, 0.5vw, 0.5rem);

  @media (min-width: 1440px) { font-size: 1.3rem; padding: 0.6rem; }
  @media (min-width: 1960px) { font-size: 1.8rem; padding: 0.7rem; }
  @media (min-width: 2560px) { font-size: 2rem; padding: 0.9rem; }
  @media (min-width: 3840px) { font-size: 2.2rem; padding: 1rem; }
  @media (min-width: 7680px) { font-size: 2.5rem; padding: 1.2rem; }
`;

export const UploadButton = styled.button`
  background-color: #1e40af;
  color: #fff;
  padding: clamp(0.5rem, 0.8vw, 1rem) clamp(0.8rem, 1vw, 2rem);
  border: none;
  width: clamp(80px, 15%, 200px);
  height: clamp(50px, 10vw, 120px);
  font-size: clamp(0.9rem, 1vw, 1.2rem);
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #1c3aa9;
  }

  @media (min-width: 1440px) { font-size: 1.3rem; width: 150px; height: 70px; }
  @media (min-width: 1960px) { font-size: 1.5rem; width: 170px; height: 80px; }
  @media (min-width: 2560px) { font-size: 1.9rem; width: 220px; height: 150px; }
  @media (min-width: 3840px) { font-size: 2.2rem; width: 240px; height: 180px; }
  @media (min-width: 7680px) { font-size: 2.5rem; width: 260px; height: 200px; }
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
export const Subtitle = styled.p`
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
