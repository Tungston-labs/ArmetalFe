import styled from 'styled-components';

export const Container = styled.div`
  padding: 1.5rem;
  background-color: #fff;
  border-radius: 8px;
  margin: 0 auto;
  box-sizing: border-box;

  @media (min-width: 1440px) {
    padding: 2rem 3rem;
  }

  @media (min-width: 2560px) {
    padding: 3rem 4rem;
  }

  @media (min-width: 3840px) {
    padding: 4rem 6rem;
  }
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1.5rem;

  @media (min-width: 1440px) {
    gap: 15px;
    margin-bottom: 2rem;
  }

  @media (min-width: 2560px) {
    gap: 20px;
  }
`;

export const BackArrow = styled.div`
  font-size: 20px;
  cursor: pointer;
  color: rgb(64, 101, 220);

  @media (min-width: 1440px) {
    font-size: 24px;
  }

  @media (min-width: 2560px) {
    font-size: 28px;
  }

  @media (min-width: 3840px) {
    font-size: 32px;
  }
`;

export const Title = styled.h2`
  font-size: 24px;
  margin: 0;
  font-family: satoshi;
  color: rgb(64, 101, 220);

  @media (min-width: 1440px) {
    font-size: 28px;
  }

  @media (min-width: 2560px) {
    font-size: 32px;
  }

  @media (min-width: 3840px) {
    font-size: 36px;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;

 
`;

export const FormGroup = styled.div`
  flex: ${({ fullWidth }) => (fullWidth ? '1 1 100%' : '1 1 45%')};
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex: 1 1 100%;
    margin-bottom: 1rem;
  }
`;

export const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 16px;
  color: #333;

  @media (max-width: 480px) {
    font-size: 14px;
    margin-bottom: 0.3rem;
  }

  @media (min-width: 1440px) {
    font-size: 18px;
  }

  @media (min-width: 2560px) {
    font-size: 24px;
  }

  @media (min-width: 3840px) {
    font-size: 2.5rem;
  }
`;

export const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: #304eb0;
    box-shadow: 0 0 0 2px rgba(48, 78, 176, 0.15);
  }

  @media (max-width: 480px) {
    padding: 8px;
    font-size: 14px;
  }

  @media (min-width: 1440px) {
    padding: 12px;
    font-size: 18px;
  }

  @media (min-width: 2560px) {
    padding: 14px;
    font-size: 22px;
  }

  @media (min-width: 3840px) {
    padding: 16px;
    font-size: 2rem;
  }
`;

export const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  outline: none;

  @media (max-width: 480px) {
    padding: 8px;
    font-size: 14px;
  }

  @media (min-width: 1440px) {
    padding: 12px;
    font-size: 18px;
  }

  @media (min-width: 2560px) {
    padding: 14px;
    font-size: 20px;
  }

  @media (min-width: 3840px) {
    padding: 16px;
    font-size: 2rem;
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex: 1 1 100%;
  margin-top: 1.5rem;
  flex-wrap: wrap;

  @media (min-width: 1440px) {
    gap: 15px;
    margin-top: 2rem;
  }

  @media (min-width: 2560px) {
    gap: 20px;
  }
`;

export const CancelButton = styled.button`
  padding: 10px 20px;
  background-color: #ff7a6b;
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #e85f54;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 8px 12px;
  }

  @media (min-width: 1440px) {
    font-size: 18px;
    padding: 12px 24px;
  }

  @media (min-width: 2560px) {
    font-size: 22px;
    padding: 14px 28px;
  }

  @media (min-width: 3840px) {
    font-size: 28px;
    padding: 16px 32px;
  }
`;

export const SaveButton = styled(CancelButton)`
  background-color: #304EB0;

  &:hover {
    background-color: #3f60cbff;
  }
`;
