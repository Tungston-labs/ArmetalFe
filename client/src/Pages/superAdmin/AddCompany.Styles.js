import styled from 'styled-components';

export const Container = styled.div`
  font-family: 'Segoe UI', sans-serif;
  background-color: white;
  padding: 20px;
`;

export const HRManager = styled.div`
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
export const SearchInput = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;


export const Header = styled.div`
  // display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

export const Title = styled.h2`
  font-size: 22px;
  margin: 0;
`;

export const Subtitle = styled.p`
  font-size: 12px;
  color: #666;
  margin: 0;
`;

export const FormWrapper = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  margin-top: 30px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;


export const CheckboxGroup = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 30px;
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 14px;

  input {
    margin-right: 8px;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  flex-wrap: wrap;
`;

export const Button = styled.button`
  padding: 10px 25px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
  background-color: ${props => props.cancel ? '#FF230480' : '#5c5c8a'};

  &:hover {
    opacity: 0.9;
  }
`;
export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 30px;
`;


export const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  img {
    height: 51px;
  }

  div {
    display: flex;
    flex-direction: column;
  }
`;
export const BackHeader = styled.h3`
  display: flex;
  align-items: center;
  gap: 8px; /* space between icon and text */
  font-size: 20px;
  font-weight: 600;

  svg {
    font-size: 22px;
  }
`;
export const Hr = styled.hr`
  border: none;
  border-top: 1px solid #ccc;

`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

export const Label = styled.label`
  margin-bottom: 6px;
  font-size: 14px;
  color: #333;
  font-weight: 500;
`;
 

export const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  // width: 100%;
`;

export const Select = styled.select`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 14px;
`;
export const FormSection = styled.div`
  display: flex;
  gap: 40px;
  margin-bottom: 30px;

  > div {
    width: 50%;
    flex:1;
  }
`;


export const LogoUploadBox = styled.div`
  border: 2px dashed #a1a1a1;
  background-color: #f5f8fd;
  padding: 10px;
  text-align: center;
  border-radius: 10px;
  margin-bottom: 15px;
  margin-top: -35px;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  width:300px;
  height:100px;

  p {
    margin-top: 8px;
    line-height: 1.4;
  }

  &:hover {
    background-color: #eef3fb;
  }
`;

export const LogoPreview = styled.div`
  position: relative;
  display: inline-block;
  margin-bottom: 20px;

  img {
    width: 50px;
    height: 50px;
    object-fit: contain;
    border-radius: 4px;
    background: #f2f2f2;
  }

  button {
    position: absolute;
    top: -6px;
    right: -6px;
    background: white;
    border: 1px solid #ccc;
    border-radius: 50%;
    padding: 2px 5px;
    font-size: 10px;
    color: red;
    cursor: pointer;
    line-height: 1;
  }
`;

