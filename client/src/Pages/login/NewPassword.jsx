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

const ChangePasswordPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const { email, newPassword, confirmPassword } = formData;

    if (!email || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/change-password/', {
        email,
        new_password: newPassword,
      });

      setMessage('Password changed successfully.');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to change password.');
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
          <h2 style={{ fontSize: 40, fontFamily: 'Satoshi' }}>Set new Password</h2>
           <p style={{ fontSize: 20, fontFamily: 'Raleway', color: "#686868",marginTop:"-25px" }}>
             Enter new password</p>
          <form onSubmit={handleChangePasswordSubmit}>
           
            <Label>New Password</Label>
            <Input
              type="password"
              name="newPassword"
              placeholder="New password"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
            <Label>Confirm Password</Label>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <Button type="submit">Continue </Button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
          </form>
        </FormBox>
      </RightPanel>
    </Container>
  );
};

export default ChangePasswordPage;
