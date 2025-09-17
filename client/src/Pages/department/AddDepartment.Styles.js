import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  background-color: #fff;
  border-radius: 10px;
  max-width: 900px;
  margin: 0 auto;
  // box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 2rem;
`;

export const BackArrow = styled.div`
  font-size: 1.2rem;
  cursor: pointer;
   color:rgb(64, 101, 220);
`;

export const Title = styled.h2`
  font-size: 22px;
  margin: 0;
  font-family:satoshi;
  color:rgb(64, 101, 220);
`;

export const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
`;

export const FormGroup = styled.div`
  flex: ${({ fullWidth }) => (fullWidth ? "1 1 100%" : "1 1 45%")};
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex: 1 1 100%; /* stack fields on small screens */
  }
`;

export const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: clamp(0.85rem, 0.9vw, 1rem); /* scales across screens */
  color: #333;
`;

export const Input = styled.input`
  padding: clamp(0.6rem, 0.8vw, 1rem); /* responsive padding */
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: clamp(0.9rem, 1vw, 1.1rem);
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: #304eb0;
    box-shadow: 0 0 0 2px rgba(48, 78, 176, 0.15);
  }

  @media (min-width: 1920px) {
    padding: 1rem;
    font-size: 1.1rem;
  }

  @media (min-width: 2560px) {
    padding: 1.2rem;
    font-size: 1.2rem;
  }

  @media (min-width: 3840px) {
    padding: 1.4rem;
    font-size: 1.3rem;
  }
`;


export const Select = styled.select`
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  flex: 1 1 100%;
  margin-top: 1.5rem;
`;

export const CancelButton = styled.button`
  padding: 0.7rem 1.5rem;
  background-color: #ff7a6b;
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #e85f54;
  }
`;

export const SaveButton = styled.button`
  padding: 0.7rem 1.5rem;
  background-color: #304EB0;
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #3f60cbff;
  }
`;