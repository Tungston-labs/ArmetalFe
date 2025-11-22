import styled from "styled-components";

export const ProfileContainer = styled.div`
  margin-bottom: 0px;
`;

export const ProfileCard = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  position: relative;
`;

export const BackArrowWrapper = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  cursor: pointer;
`;

export const ProfileImageWrapper = styled.div`
  position: relative;
  align-self: center;
  margin-bottom: 20px;
`;

export const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  cursor: ${({ editable }) => (editable ? "pointer" : "default")};
  border: 2px solid #1034ad;
`;

export const UserIconWrapper = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ editable }) => (editable ? "pointer" : "default")};
`;

export const PlusIconWrapper = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background: #1034ad;
  color: #fff;
  border-radius: 50%;
  padding: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ContentArea = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

export const LeftColumn = styled.div`
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const RightColumn = styled.div`
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const InputBox = styled.input`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 0.95rem;
  &:focus {
    outline: none;
    border-color: #1034ad;
    box-shadow: 0 0 0 2px rgba(16, 52, 173, 0.2);
  }
`;

export const BioBox = styled.textarea`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  min-height: 90px;
  resize: vertical;
  font-size: 0.95rem;
  &:focus {
    outline: none;
    border-color: #1034ad;
    box-shadow: 0 0 0 2px rgba(16, 52, 173, 0.2);
  }
`;

export const InfoRow = styled.div`
  display: flex;
  gap: 10px;
`;
