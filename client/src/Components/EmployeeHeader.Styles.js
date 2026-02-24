import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  margin: auto;
  padding: 20px;
`;

export const ProfileWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
`;

export const UploadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ProfileLabel = styled.label`
  cursor: pointer;
`;

export const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
`;

export const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 120px;
  background: #F1F1F1;
  border-radius: 50%;
  margin-bottom: 10px;
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const InfoWrapper = styled.div`
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
`;

export const LeftColumn = styled.div`
  flex: 1 1 45%;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const RightColumn = styled.div`
  flex: 1 1 45%;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FieldLabel = styled.label`
  margin-bottom: 6px;
  font-weight: 500;
  color:#172554;
`;

export const Input = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid lightgray;
  font-size: 0.95em;

   &:focus {
    border-color: #3352BA;
    outline: none;
    box-shadow: 0 0 0 2px rgba(99,102,241,0.2);
  }
`;

export const TextArea = styled.textarea`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid lightgray;
  font-size: 0.95em;
  resize: vertical;
   &:focus {
    border-color: #3352BA;
    outline: none;
    box-shadow: 0 0 0 2px rgba(99,102,241,0.2);
  }
`;

export const Select = styled.select`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid lightgray;
  font-size: 0.95em;
  background:white;
   &:focus {
    border-color: #3352BA;
    outline: none;
    box-shadow: 0 0 0 2px rgba(99,102,241,0.2);
  }
`;

export const ErrorText = styled.div`
  color: red;
  font-size: 0.85em;
  margin-top: 4px;
`;
