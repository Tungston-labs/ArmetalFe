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
import { FiEye, FiEyeOff } from "react-icons/fi"; // 👁️ Eye icons
import { Link } from "react-router-dom";
import "@fontsource/anek-malayalam/400.css"; // Regular
import "@fontsource/anek-malayalam/700.css"; // Bold

const PoweredBy = ({ company = "REKORY" }) => (
  <p
    style={{
      marginTop: "220px",
      textAlign: "center",
      fontSize: "14px",
      color: "#3250B5",
      lineHeight: 1.4,
    }}
  >
    <span style={{ fontFamily: "Satoshi, sans-serif", fontWeight: 400 }}>
      Powered by {" "}
    </span>
    <span style={{ fontFamily: "Anek Malayalam, sans-serif", fontWeight: 700 }}>
      {company}
    </span>
  </p>
);


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
  const [loading, setLoading] = useState(false); // ⏳ Spinner state

  // Eye toggle states
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true); // ⏳ start spinner
    try {
      const response = await axios.post("http://178.248.112.16:8001/api/token/", {
        username: formData.username,
        password: formData.password,
      });

      const { access, refresh, user } = response.data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("user", JSON.stringify(user));

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
            company: user.company,   // <-- add this
          },
        })
      );


      if (user.is_superadmin) {
        navigate("/superadmin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.detail || "Login failed. Check credentials.");
    } finally {
      setLoading(false); // ⏹️ stop spinner
    }
  };

  const handleForgotPassword = () => {
    navigate('/forget-password');
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true); // ⏳ start spinner
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
    } finally {
      setLoading(false); // ⏹️ stop spinner
    }
  };

  return (
    <Container>
      <LeftPanel>
        <LeftHeader>
          <Logo src="/images/logos.png" alt="ARMETAL Logo" />
          <h2 style={{ fontSize: 42 }}>Welcome back</h2>
          <p>
            Manage your employees with ease.<br />
            Log in to access your HR dashboard.
          </p>
          <p
            onClick={() => setView('login')}
            style={{ cursor: 'pointer', textDecoration: 'none', fontFamily: 'Raleway', fontSize: 22 }}
          >
          
          </p>
        </LeftHeader>
        <CustomLink onClick={() => setView('changePassword')}>
          {/* Change password */}
        </CustomLink>
      </LeftPanel>

      <RightPanel>
        {view === 'login' ? (
          <FormBox>
    <h2 style={{ fontSize: 41, fontFamily: 'Satoshi', fontWeight: 'bold',}}>Log in</h2>
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
              <div style={{ position: "relative" }}>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{ paddingRight: "40px" }}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "40%",
                    transform: "translateY(-50%)",
                    cursor: "pointer"
                  }}
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </span>
              </div>



              <SmallLink
                as="button"
                type="button"
                onClick={handleForgotPassword}
                style={{
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  color: "black", // make it look like a link
                  fontSize: "14px",
                  marginTop: "8px",
                  fontFamily: 'Raleway',
                  textDecoration: "none",
                  fontSize: "14px",
                  marginTop: "-10px"
                }}
              >
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

              <Button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Log in"}
              </Button>
              {error && (
  <p style={{ 
    color: 'red', 
    textAlign: 'center', 
    fontFamily: 'Raleway', 
    marginTop: '10px' 
  }}>
    {error}
  </p>
)}


<PoweredBy text="REKORY" />

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
              <div style={{ position: "relative" }}>
                <Input
                  type={showOldPassword ? "text" : "password"}
                  name="old_password"
                  placeholder="Old password"
                  value={formData.old_password}
                  onChange={handleChange}
                  required
                  style={{ paddingRight: "40px" }}
                />
                <span
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer"
                  }}
                >
                  {showOldPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </span>
              </div>

              <Label>New Password</Label>
              <div style={{ position: "relative" }}>
                <Input
                  type={showNewPassword ? "text" : "password"}
                  name="new_password"
                  placeholder="New Password"
                  value={formData.new_password}
                  onChange={handleChange}
                  required
                  style={{ paddingRight: "40px" }}
                />
                <span
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer"
                  }}
                >
                  {showNewPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </span>
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? "Changing..." : "Change Password"}
              </Button>
              {error && (
  <p style={{ 
    color: 'red', 
    textAlign: 'center', 
    fontFamily: 'Raleway', 
    marginTop: '30px' 
  }}>
    {error}
  </p>
)}
            </form>
          </FormBox>
        )}
      </RightPanel>
    </Container>
  );
};

export default LoginForm;
