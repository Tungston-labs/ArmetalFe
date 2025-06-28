// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import {
  Container,
  LeftPanel,
  RightPanel,
  FormBox,
  Label,
  Input,
  CheckboxContainer,
  Button,
  SmallLink,
  LeftHeader,
  Logo,
  CustomLink
} from '../login/Login.styles';

import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../../Redux/authSlice';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '' });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ email: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      // Replace with your actual forgot password API
      await axios.post("http://localhost:8000/api/forgot-password/", {
        email: formData.email,
      });

      setMessage("Password reset instructions have been sent to your email.");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to send reset link.");
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
        
        </CustomLink>
      </LeftPanel>

       <RightPanel>
        <FormBox>
          <h2 style={{ fontSize: 40, fontFamily: 'Satoshi' }}>Forgot Password ?</h2>
          <p style={{ fontSize: 20, fontFamily: 'Raleway', color: "#686868" }}>
            No worries we will sent you reset instructions
          </p>
          <form onSubmit={handleSubmit}>
            <Label>Email Address</Label>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Button type="submit">Send Reset Link</Button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
          </form>
        </FormBox>
      </RightPanel>
    </Container>
  );
};

export default LoginForm;
