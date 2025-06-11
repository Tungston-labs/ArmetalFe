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

const LoginForm = () => {
  const [formData, setFormData] = useState({ username: '', password: '', remember: false });
  const [view, setView] = useState('login');

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted:', formData);
    // You can add API call logic here
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
              please log in to your account
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
