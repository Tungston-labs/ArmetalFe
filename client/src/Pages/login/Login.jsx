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
  const [formData, setFormData] = useState({ username: '', password: '', remember: false });
  const [view, setView] = useState('login');
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", {
        username: formData.username,
        password: formData.password,
      });
  
      const { access, refresh, user } = response.data;
  
      // Store in localStorage
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("user", JSON.stringify(user)); // store user role info
  
      // Dispatch to Redux store
      dispatch(
        login({
          userName: user.username,
          accessToken: access,
          user: {
            id: user.id,
            email: user.email,
            is_superadmin: user.is_superadmin,
            is_hr_admin: user.is_hr_admin,
            is_employee: user.is_employee,
          },
        })
      );
  
      // Redirect based on role
      if (user.is_superadmin) {
        navigate("/superadmin"); // or show a message
      } else {
        navigate("/"); // dashboard
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.detail || "Login failed. Check credentials.");
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
          Change password
        </CustomLink>
      </LeftPanel>

      <RightPanel>
        {view === 'login' ? (
          <FormBox>
            <h2 style={{ fontSize: 41, fontFamily: 'Satoshi' }}>Log in</h2>
            <p style={{ fontSize: 20, fontFamily: 'Raleway' }}>
              Welcome back!<br />
              Please log in to your account
            </p>
            <form onSubmit={handleSubmit}>
              <Label>Username</Label>
              <Input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <Label>Password</Label>
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                marginBottom="10px"
              />
              <SmallLink>Forgot password?</SmallLink>
              <CheckboxContainer>
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />
                Remember me
              </CheckboxContainer>
              <Button type="submit">Log in</Button>
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
          </FormBox>
        ) : (
          <FormBox>
            <h2 style={{ fontSize: 41, fontFamily: 'Satoshi', whiteSpace: 'nowrap' }}>Change your password</h2>
            <p style={{ fontFamily: "raleway", fontSize: 20 }}>
              Enter a new password<br />
              Below to change your password
            </p>
            <Label>New password</Label>
            <Input type="text" placeholder="New password" />
            <Label>Confirm Password</Label>
            <Input type="password" placeholder="Confirm Password" />
            <Button>Change Password</Button>
          </FormBox>
        )}
      </RightPanel>
    </Container>
  );
};

export default LoginForm;
