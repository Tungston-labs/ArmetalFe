// src/pages/VerifyCodePage.jsx
import React, { useRef, useState, useEffect } from 'react';
import {
  Container,
  LeftPanel,
  RightPanel,
  FormBox,
  Label,
  Button,
  LeftHeader,
  Logo,
  CodeInputWrapper,
  CodeInputBox,
} from '../login/Login.styles';

import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import PunchLoader from '../../Components/Loader'; // ✅ adjust path if needed

const VerifyCodePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [code, setCode] = useState(['', '', '', '', '', '']); // 6 digits
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false); // ⏳ loader state

  const inputsRef = useRef([]);

  useEffect(() => {
    if (!email) {
      setError('Email not found. Please go back.');
    }
  }, [email]);

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
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
    if (fullCode.length !== 6) {
      setError('Please enter the full 6-digit OTP.');
      return;
    }

    setLoading(true); // show loader
    try {
      await axios.post('http://178.248.112.16:8001/api/forgot-password/verify-otp/', {
        email,
        otp: fullCode,
      });

      setMessage('OTP verified successfully. Redirecting...');
      setTimeout(() => {
        navigate('/new-password', { state: { email } });
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid or expired OTP.');
    } finally {
      setLoading(false); // hide loader
    }
  };

  return (
    <>
      {loading && <PunchLoader text="Verifying OTP..." />} {/* ✅ Loader on top */}

      <Container>
        <LeftPanel>
          <LeftHeader>
            <Logo src="/images/armetal.png" alt="ARMETAL Logo" />
            <h2 style={{ fontSize: 42 }}>Welcome back</h2>
            <p>
              Manage your employees with ease.<br />
              Reset your password to access your HR dashboard.
            </p>
          </LeftHeader>
        </LeftPanel>

        <RightPanel>
          <FormBox>
            <h2 style={{ fontSize: 41, fontFamily: 'Satoshi' }}>Verification</h2>
            <p style={{ fontSize: 20, fontFamily: 'Raleway', color: '#686868', marginTop: '-25px' }}>
              We sent a code to <strong>{email}</strong>
            </p>

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
              {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
              {message && <p style={{ color: 'green', marginTop: 10 }}>{message}</p>}
            </form>
          </FormBox>
        </RightPanel>
      </Container>
    </>
  );
};

export default VerifyCodePage;
