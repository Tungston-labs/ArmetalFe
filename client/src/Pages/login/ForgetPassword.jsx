import React, { useState } from 'react';
import {
  Container,
  LeftPanel,
  RightPanel,
  FormBox,
  Label,
  Input,
  Button,
  LeftHeader,
  Logo,
} from '../login/Login.styles';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [formData, setFormData] = useState({ email: '' });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ email: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      await axios.post("http://178.248.112.16:8000/api/forgot-password/send-otp/", {
        email: formData.email,
      });

      setMessage("OTP sent to your email successfully.");
      
      // Navigate to verification page with email
      setTimeout(() => {
        navigate('/verification', { state: { email: formData.email } });
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to send OTP. Please try again.");
    }
  };

  return (
    <Container>
      <LeftPanel>
        <LeftHeader>
          <Logo src="/images/armetal.png" alt="ARMETAL Logo" />
          <h2 style={{ fontSize: 42 }}>Welcome Back</h2>
          <p>
            Manage your employees with ease.<br />
            Reset your password to access your HR dashboard.
          </p>
        </LeftHeader>
      </LeftPanel>

      <RightPanel>
        <FormBox>
          <h2 style={{ fontSize: 40, fontFamily: 'Satoshi' }}>Forgot Password?</h2>
          <p style={{ fontSize: 20, fontFamily: 'Raleway', color: "#686868" }}>
            No worries, we’ll send you reset instructions.
          </p>
          <form onSubmit={handleSubmit}>
            <Label>Email Address</Label>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Button type="submit" style={{ marginTop: 20 }}>
              Send Reset Link
            </Button>
            {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
            {message && <p style={{ color: 'green', marginTop: 10 }}>{message}</p>}
          </form>
        </FormBox>
      </RightPanel>
    </Container>
  );
};

export default ForgotPasswordPage;
