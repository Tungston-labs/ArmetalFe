// src/pages/LoginPage.jsx
import React, { useState } from "react";
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
  CustomLink,
  Title,
  Subtitle,
  WelcomeTitle,
  Description,
  ActionText,
} from "../login/Login.styles";

import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../../Redux/authSlice";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link } from "react-router-dom";
import "@fontsource/anek-malayalam/400.css";
import "@fontsource/anek-malayalam/700.css";
import { BASE_URL } from "../../services/api";

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
      Powered by{" "}
    </span>
    <span style={{ fontFamily: "Anek Malayalam, sans-serif", fontWeight: 700 }}>
      {company}
    </span>
  </p>
);

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: false,
    old_password: "",
    new_password: "",
  });
  const [view, setView] = useState("login");
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
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  console.log("---", formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/token/`,
        {
          username: formData.username,
          password: formData.password,
        }
      );

      const { access, refresh, user } = response.data;

      // If "Remember me" checked -> use localStorage
      // Else -> use sessionStorage (clears on browser close)
      // const storage = formData.remember ? localStorage : sessionStorage;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch(
        login({
          userName: user.username,
          accessToken: access,
          user,
        })
      );

      if (user.is_superadmin) navigate("/superadmin-dashboard");
      else navigate("/");
    } catch (err) {
      console.log(err);
      setError(
        err.response?.data?.detail || "Login failed. Check credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forget-password");
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");

      await axios.post(
        `${BASE_URL}/api/change-password/`,
        {
          old_password: formData.old_password,
          new_password: formData.new_password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Password changed successfully");
      setFormData({ ...formData, old_password: "", new_password: "" });
      setView("login");
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.detail || "Password change failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LeftPanel>
        <LeftHeader>
          <Logo src="/images/logos.png" alt="ARMETAL Logo" />
          <WelcomeTitle>Welcome back</WelcomeTitle>
          <Description>
            Manage your employees with ease.
            <br />
            Log in to access your HR dashboard.
          </Description>
          <ActionText onClick={() => setView("login")}>
            {/* Add text here if needed */}
          </ActionText>
        </LeftHeader>
        <CustomLink onClick={() => setView("changePassword")}>
          {/* Change password */}
        </CustomLink>
      </LeftPanel>

      <RightPanel>
        {view === "login" ? (
          <FormBox>
            <div style={{ textAlign: "left" }}>
              <Title>Log in</Title>
              <Subtitle>
                Welcome back! <br />
                Please log in to your account
              </Subtitle>
            </div>
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
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </span>
              </div>

              <SmallLink type="button" onClick={handleForgotPassword}>
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
                <p
                  style={{
                    color: "red",
                    textAlign: "center",
                    fontFamily: "Raleway",
                    marginTop: "10px",
                  }}
                >
                  {error}
                </p>
              )}

              <PoweredBy text="REKORY" />
            </form>
          </FormBox>
        ) : (
          <FormBox>
          </FormBox>
        )}
      </RightPanel>
    </Container>
  );
};

export default LoginForm;
