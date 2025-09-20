import styled from 'styled-components';

export const Container = styled.div`
  padding: clamp(1rem, 2vw, 3rem);
  background-color: #fff;
  border-radius: clamp(8px, 1vw, 12px);
  /* max-width: 900px; */
  margin: 0 auto;
  box-sizing: border-box;

  @media (min-width: 2560px) { /* 4K */
    /* max-width: 1200px; */
    padding: 3rem 4rem;
  }

  @media (min-width: 3840px) { /* 8K */
    /* max-width: 1600px; */
    padding: 4rem 6rem;
  }
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(8px, 1vw, 15px);
  margin-bottom: clamp(1rem, 2vw, 2rem);
`;

export const BackArrow = styled.div`
  font-size: clamp(16px, 1.5vw, 28px);
  cursor: pointer;
  color: rgb(64, 101, 220);
`;

export const Title = styled.h2`
  font-size: clamp(20px, 2vw, 36px);
  margin: 0;
  font-family: satoshi;
  color: rgb(64, 101, 220);
`;

export const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: clamp(1rem, 2vw, 2rem);
`;

export const FormGroup = styled.div`
  flex: ${({ fullWidth }) => (fullWidth ? '1 1 100%' : '1 1 45%')};
  display: flex;
  flex-direction: column;
  margin-bottom: clamp(1rem, 2vw, 2rem);

  @media (max-width: 768px) {
    flex: 1 1 100%;
  }
`;

export const Label = styled.label`
  margin-bottom: clamp(0.3rem, 0.8vw, 1rem);   /* scales spacing */
  font-weight: 500;
  font-size: clamp(14px, 1vw, 36px);          /* max 36px for 8K screens */
  color: #333;

  @media (max-width: 480px) {                 /* mobile */
    font-size: clamp(12px, 3vw, 16px);
    margin-bottom: clamp(0.2rem, 2vw, 0.5rem);
  }

  @media (min-width: 2560px) {                /* 4K screens */
    font-size: clamp(18px, 1vw, 32px);
  }

  @media (min-width: 3840px) {                /* 8K screens */
    font-size: clamp(24px, 1vw, 36px);
  }
`;


export const Input = styled.input`
  padding: clamp(0.5rem, 1vw, 1.5rem);
  border: 1px solid #ccc;
  border-radius: clamp(6px, 1vw, 10px);
  font-size: clamp(14px, 1vw, 22px);
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: #304eb0;
    box-shadow: 0 0 0 2px rgba(48, 78, 176, 0.15);
  }
`;

export const Select = styled.select`
  padding: clamp(0.5rem, 1vw, 1.2rem);
  border: 1px solid #ccc;
  border-radius: clamp(6px, 1vw, 10px);
  font-size: clamp(14px, 1vw, 20px);
  outline: none;
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: clamp(0.5rem, 1vw, 2rem); /* scales for large screens */
  flex: 1 1 100%;
  margin-top: clamp(1rem, 2vw, 3rem);
  flex-wrap: wrap;
`;

export const CancelButton = styled.button`
  padding: clamp(0.5rem, 1vw, 1.2rem) clamp(1rem, 2vw, 2rem);
  background-color: #ff7a6b;
  border: none;
  border-radius: clamp(6px, 1vw, 12px);
  color: white;
  font-weight: bold;
  cursor: pointer;
  font-size: clamp(14px, 1vw, 28px); /* scales up to 4K/8K */

  &:hover {
    background-color: #e85f54;
  }

  @media (max-width: 480px) { /* mobile adjustments */
    font-size: clamp(12px, 3vw, 16px);
    padding: clamp(0.4rem, 2vw, 0.8rem) clamp(0.8rem, 3vw, 1.2rem);
  }

  @media (min-width: 2560px) { /* 4K screens */
    font-size: clamp(18px, 1vw, 32px);
    padding: clamp(0.8rem, 1vw, 1.5rem) clamp(1.5rem, 2vw, 2.5rem);
  }

  @media (min-width: 3840px) { /* 8K screens */
    font-size: clamp(24px, 1vw, 36px);
    padding: clamp(1rem, 1vw, 2rem) clamp(2rem, 2vw, 3rem);
  }
`;

export const SaveButton = styled(CancelButton)`
  background-color: #304EB0;

  &:hover {
    background-color: #3f60cbff;
  }
`;

