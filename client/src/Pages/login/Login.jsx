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
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false,
    old_password: '',
    new_password: ''
  });
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
      const response = await axios.post("http://178.248.112.16:8000/api/token/", {
        username: formData.username,
        password: formData.password,
      });

      const { access, refresh, user } = response.data;

      // Store tokens
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("user", JSON.stringify(user));

      // Redux
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

      // Redirect
      if (user.is_superadmin) {
        navigate("/superadmin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.detail || "Login failed. Check credentials.");
    }
  };

  const handleForgotPassword = () => {
    navigate('/forget-password');
  };
  

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const token = localStorage.getItem("accessToken");

      await axios.post("http://178.248.112.16:8000/api/change-password/", {
        old_password: formData.old_password,
        new_password: formData.new_password
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Password changed successfully");
      setFormData({ ...formData, old_password: '', new_password: '' });
      setView('login');
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.detail || "Password change failed.");
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
              />
              <SmallLink onClick={handleForgotPassword} style={{ cursor: 'pointer' }}>
  Forgot password?
</SmallLink>

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
            <form onSubmit={handlePasswordChange}>
              <Label>Old password</Label>
              <Input
                type="password"
                name="old_password"
                placeholder="Old password"
                value={formData.old_password}
                onChange={handleChange}
                required
              />
              <Label>New Password</Label>
              <Input
                type="password"
                name="new_password"
                placeholder="New Password"
                value={formData.new_password}
                onChange={handleChange}
                required
              />
              <Button type="submit">Change Password</Button>
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
          </FormBox>
        )}
      </RightPanel>
    </Container>
  );
};

export default LoginForm;
