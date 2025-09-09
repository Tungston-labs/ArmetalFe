import React, { useState, useEffect } from 'react';
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
  CustomLink
} from '../login/Login.styles';

import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const ChangePasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!email) {
      setError("Email not found. Please restart the reset process.");
    }
  }, [email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const { newPassword, confirmPassword } = formData;

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await axios.post('http://178.248.112.16:8001/api/forgot-password/reset/', {
        email,
        new_password: newPassword,
        confirm_password: confirmPassword
      });

      setMessage('Password changed successfully. Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
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
        </LeftHeader>
        <CustomLink />
      </LeftPanel>

      <RightPanel>
        <FormBox>
          <h2 style={{ fontSize: 40, fontFamily: 'Satoshi' }}>Set New Password</h2>
          <p style={{ fontSize: 20, fontFamily: 'Raleway', color: "#686868", marginTop: "-25px" }}>
            You're resetting for <strong>{email}</strong>
          </p>

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
            <Button type="submit">Continue</Button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
          </form>
        </FormBox>
      </RightPanel>
    </Container>
  );
};

export default ChangePasswordPage;
