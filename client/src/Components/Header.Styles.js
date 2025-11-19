import styled from "styled-components";

/* ---------- Main Wrappers ---------- */

export const ProfileContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  padding-bottom: 10px;
  // padding:20px;
  display: flex;
  flex-direction: column;
`;

export const ProfileCard = styled.div`
  width: 100%;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  padding: 25px;
  border-radius: 14px;
  display: flex;
  gap: 30px;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }
`;

export const BackArrowWrapper = styled.div`
  position: absolute;
  top: 20px;
  left: 15px;
  cursor: pointer;
  font-size: 1.8rem;
  color: #1034ad;
  z-index: 20;
`;

/* ---------- Profile Image ---------- */

export const ProfileImageWrapper = styled.div`
  position: relative;
  width: 180px;
  height: 180px;
  flex-shrink: 0;
`;

export const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 14px;
  object-fit: cover;
  border: 2px solid #dbe1f1;
  transition: 0.25s ease;
  cursor: ${(props) => (props.editable ? "pointer" : "default")};

  ${(props) =>
    props.editable &&
    `
    &:hover {
      opacity: 0.7;
    }
  `}
`;

export const UserIconWrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 14px;
  border: 2px dashed #9db2ff;
  background: #f3f6ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7b94ff;
  cursor: ${(props) => (props.editable ? "pointer" : "default")};
  transition: 0.25s ease;

  &:hover {
    opacity: ${(props) => (props.editable ? 0.7 : 1)};
  }
`;

export const PlusIconWrapper = styled.div`
  position: absolute;
  bottom: -5px;
  right: -5px;
  background: #0b3ad1;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

/* ---------- Content Section ---------- */

export const ContentArea = styled.div`
  width: 100%;
  display: flex;
  gap: 25px;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

export const LeftColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const RightColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

/* ---------- Inputs ---------- */

export const InputBox = styled.input`
  width: 100%;
  padding: 12px 14px;          /* default for mobile */
  border-radius: 10px;
  border: 1px solid #d7dce8;
  font-size: 15px;
  transition: 0.2s;

  &:focus {
    outline: none;
    background: #ffffff;
    border-color: #5472ff;
  }

  /* TABLET */
  @media (min-width: 768px) {
    padding: 13px 16px;
    font-size: 16px;
  }

  /* LAPTOP */
  @media (min-width: 1200px) {
    padding: 14px 18px;
    font-size: 16px;
  }

  /* LARGE DESKTOP (2K–4K) */
  @media (min-width: 1800px) {
    padding: 14px 20px;        
    font-size: 1.2rempx;
  }

  /* ULTRA 4K */
  @media (min-width: 2600px) {
    padding: 15px 22px;        
    font-size: 1.2rem;
  }
`;

export const BioBox = styled.textarea`
  width: 100%;
  height: 90px;                
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #d7dce8;
  font-size: 15px;
  resize: none;
  transition: 0.2s;

  &:focus {
    outline: none;
    background: #ffffff;
    border-color: #5472ff;
  }

  /* TABLET */
  @media (min-width: 768px) {
    padding: 13px 16px;
    font-size: 16px;
    height: 110px;
  }

  /* LAPTOP */
  @media (min-width: 1200px) {
    padding: 14px 18px;
    font-size: 16px;
    height: 120px;
  }

  /* LARGE DESKTOP (2K–4K) */
  @media (min-width: 1800px) {
    padding: 14px 20px;
    font-size: 1.2rem;
    height: 120px;
  }

  /* ULTRA 4K */
  @media (min-width: 2600px) {
    padding: 15px 22px;
    font-size: 1.5rem;
    height: 130px;
  }
`;


export const InfoRow = styled.div`
  display: flex;
  gap: 15px;

  & > input {
    flex: 1;
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
