import styled from 'styled-components';

// --- Layout Containers ---
export const ProfileContainer = styled.div`
  margin: 0 auto;
  padding: 20px;
  
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
  gap: 10px;
`;

export const BackArrow = styled.span`
  font-size: 24px;
  color: #333;
  cursor: pointer;
`;

export const IconGroup = styled.div`
  color: #5d5cff;
  font-size: 32px;
`;

export const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h1`
  font-size: 22px;
  color: #333;
  margin: 0;
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: #999;
  margin: 0;
`;

export const ProfileCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;


// --- Main Layout ---
export const ContentArea = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 20px;
 @media (min-width: 768px)and (max-width:1023px) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
  }
`;

export const LeftColumn = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;

  @media (min-width: 768px)and (max-width:1023px){
    width: 100%;
  }
   
`;

export const RightColumn = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;

  @media (min-width: 768px)and (max-width:1023px) {
    width: 100%;
  }
`;

// --- Fields ---
export const InputBox = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #052DB4;
  border-radius: 6px;
  font-size: 16px;
  background-color: #fff;
  box-sizing: border-box;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #021e82;
  }

  /* Tablet screens */
  @media (min-width: 768px)and (max-width:1021px) {
    font-size: 0.8rem;
    padding: 10px 8px;
  }

  /* Laptop screens */
  @media (min-width: 1024px) and (max-width:1439px) {
    font-size: 1rem;
    padding: 10px 15px;
  }

  /* Large desktops */
  @media (min-width: 1440px) and (max-width:1920px) {
    font-size: 1rem;
    padding: 10px 10px;
  }
@media (min-width: 1921px) and (max-width:2559px) {
    font-size: 1.3rem;
    padding: 14px 18px;
  }
  /* Ultra-wide / 4K screens */
  @media (min-width: 2560px) and (max-width:3839px) {
    font-size: 1.2rem;
    padding: 15px 20px;
  }

  /* 4K+ displays */
  @media (min-width: 3840px) {
    font-size: 1.7rem;
    padding: 15px 20px;
  }
`;

export const BioBox = styled.textarea`
  width: 100%;
  height: 95px;
  padding: 10px 12px;
  border: 1px solid #052DB4;
  border-radius: 6px;
  font-size: 16px;
  resize: none;
  background-color: #fff;
  box-sizing: border-box;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #021e82;
  }

  /* Tablet screens */
  @media (min-width: 768px)and (max-width:1023px) {
    font-size: 0.8rem;
    padding: 12px 14px;
    height: 50px;
  }

  /* Laptop screens */
  @media (min-width: 1024px) and (max-width:1440px){
    font-size: 1rem;
    padding: 15px 10px;
    height: 95px;
  }

  /* Large desktops */
  @media (min-width: 1440px)and (max-width:1920px) {
    font-size: 1.3rem;
    padding: 14px 18px;
    height: 95px;
  }
  @media (min-width: 1921px)and (max-width:2559px) {
    font-size: 1.3rem;
    padding: 14px 18px;
    height: 120px;
  }
  /* Ultra-wide / 4K screens */
  @media (min-width: 2560px)and (max-width:3839px) {
    font-size: 1.3rem;
    padding: 15px 20px;
    height: 125px;
  }

  /* 4K+ displays */
  @media (min-width: 3840px) {
    font-size: 1.7rem;
    padding: 18px 15px;
    height: 140px;
  }
`;


// --- Info Row Below Bio ---
export const InfoRow = styled.div`
  display: flex;
  gap: 15px;
  width: 100%;

  & > input {
    flex: 1 1 50%;
  }

  @media (max-width: 768px) {
    gap: 10px;

    & > input {
      flex: 1 1 100%;
    }
  }
`;

export const EditImageButton = styled.button`
  position: absolute;
  bottom: 5px;
  background: #304eb0;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: 0.2s ease;
  &:hover {
    background: #1e3a8a;
  }
`;
export const ProfileImageWrapper = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;
`;

export const ProfileImage = styled.img`
  width: 180px;
  height: 180px;
  border-radius: 10%;
  object-fit: cover;
  border: 3px solid #ddd;
  transition: 0.3s ease;
  ${(props) =>
    props.editable &&
    `
    &:hover {
      opacity: 0.7;
    }
  `}
`;

export const PlusIconWrapper = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: #007bff;
  color: white;
  border-radius: 50%;
  padding: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const BackArrowWrapper = styled.div`
  position: absolute;      
  z-index: 10;         
  margin-left: -35px;
  cursor: pointer;       
  display: flex;
  align-items: center;
  justify-content: center;
  font-size:2rem;

`;

export const UserIconWrapper = styled.div`
  width: 180px;
  height: 180px;
  border-radius: 10%;
  border: 1px solid #00177eff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
  transition: 0.3s ease;
  cursor: ${(props) => (props.editable ? "pointer" : "default")};

  &:hover {
    opacity: ${(props) => (props.editable ? 0.7 : 1)};
  }
`;

