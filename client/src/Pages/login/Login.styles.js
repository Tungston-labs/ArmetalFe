// src/styles/LoginForm.styles.js
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
`;

export const LeftPanel = styled.div`
  position: relative;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 34%;
  height: 100vh;
  overflow: hidden;

  h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/images/side.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center bottom;
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

export const RightPanel = styled.div`
  flex: 1;
  background: #fafcf5;
  display: flex;
  justify-content: center;
  align-items: center;
  
`;

export const FormBox = styled.div`
  max-width: 400px;
  width: 100%;
`;

export const Label = styled.label`
  font-weight: 400;
  margin-bottom: 2px;
  display: block;
  font-size: 17px;
  font-family: 'Raleway';
  margin-top: 5px;

`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: ${(props) => props.marginBottom || '10px'};
  border: none;
  background: #efefef;
  border-radius: 8px;
`;

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 30px;
  font-size: 17px;

  input {
    margin-right: 8px;
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: 10px;
  background: linear-gradient(to right, #172554, #3352BA);
  color: white;
  border: none;
  border-radius:6px;
  cursor: pointer;
  font-family: 'Raleway';
`;

export const SmallLink = styled.p`
  font-size: 12px;
  float: right;
  text-decoration: none;
  cursor: pointer;
  margin-top:-5%;
`;

export const LeftHeader = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
   padding: 40px;
  border-radius: 12px;
`;

export const Logo = styled.img`
  width: 30%;
  height: auto;
  margin-bottom: 1rem;
`;

export const CustomLink = styled.p`
  font-size: 22px;
  text-decoration: none;
  cursor: pointer;
`;
export const CodeInputWrapper = styled.div`
  display: flex;
  gap: 20px;
  margin: 20px 0;
`;

export const CodeInputBox = styled.input`
  width: 50px;
  height: 60px;
  font-size: 24px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 2px #007bff;
  }
`;

