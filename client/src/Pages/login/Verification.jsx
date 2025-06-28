// src/pages/VerifyCodePage.jsx
import React, { useRef, useState } from 'react';
import {
  Container,
  LeftPanel,
  RightPanel,
  FormBox,
  Label,
  Input,
  Button,
  LeftHeader,
  Logo,CustomLink,
  CodeInputWrapper,
  CodeInputBox,
} from '../login/Login.styles';

import axios from 'axios';

const VerifyCodePage = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '']);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const inputsRef = useRef([]);

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next
    if (value && index < 4) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const fullCode = code.join('');
    if (fullCode.length !== 5) {
      setError("Please enter the full 5-digit code.");
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/verify-code/', {
        email,
        code: fullCode,
      });

      setMessage("Verification successful! You can now reset your password.");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid verification code.");
    }
  };

  return (
    <Container>
    <LeftPanel>
            <LeftHeader>
              <Logo src="/images/armetal.png" alt="ARMETAL Logo" />
              <h2 style={{ fontSize: 42 }}>Welcome back</h2>
              <p>
                Manage your employees with ease.<br />
                Log in to access your HR dashboard.
              </p>
              <p
                onClick={() => setView('login')}
                style={{ cursor: 'pointer', textDecoration: 'none', fontFamily: 'Raleway', fontSize: 22 }}
              >
                Get started →
              </p>
            
            </LeftHeader>
            <CustomLink onClick={() => setView('changePassword')}>
              {/* Change password */}
            </CustomLink>
          </LeftPanel>

      <RightPanel>
        <FormBox>
          <h2 style={{ fontSize: 41, fontFamily: 'Satoshi' }}>Verification</h2> 
             <p style={{ fontSize: 20, fontFamily: 'Raleway', color: "#686868",marginTop:"-25px" }}>
                We sent a code to <strong>{email}</strong></p>
          <form onSubmit={handleSubmit}>
            <CodeInputWrapper>
              {code.map((digit, idx) => (
                <CodeInputBox
                  key={idx}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  ref={(el) => (inputsRef.current[idx] = el)}
                />
              ))}
            </CodeInputWrapper>

            <Button type="submit">Continue</Button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
          </form>
        </FormBox>
      </RightPanel>
    </Container>
  );
};

export default VerifyCodePage;
