import React, { useState } from "react";
import {
  LoginPage,
  LeftSection,
  RightSection,
  LogoSection,
  Logo,
  BrandName,
  MainHeading,
  Description,
  IllustrationWrapper,
  Illustration,
  LoginCard,
  WelcomeTitle,
  WelcomeText,
  Form,
  FormGroup,
  Label,
  Input,
  PasswordWrapper,
  PasswordInput,
  EyeButton,
  ForgotPassword,
  RememberRow,
  Checkbox,
  RememberText,
  LoginButton,
} from "./LoginScreen.styles";

import { FiEye, FiEyeOff } from "react-icons/fi";


import LoginIllustration from "../../assets/login.svg";
import RekoryLogo from "../../assets/logo3.svg";

const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Login Data:", formData);
  };

  return (
    <LoginPage>
      {/* ================= LEFT SECTION ================= */}
      <LeftSection>
        <LogoSection>
          <Logo src={RekoryLogo} alt="Rekory Logo" />
        </LogoSection>

        <MainHeading>
          Manage People.
          <br />
          Drive Productivity.
        </MainHeading>

        <Description>
          Make everyday HR management faster,
          <br />
          easier, and more efficient.
        </Description>

        <IllustrationWrapper>
          <Illustration
            src={LoginIllustration}
            alt="HR Management Illustration"
          />
        </IllustrationWrapper>
      </LeftSection>

      {/* ================= RIGHT SECTION ================= */}
      <RightSection>
        <LoginCard>
          <WelcomeTitle>Welcome back!</WelcomeTitle>

          <WelcomeText>Please log in to your account</WelcomeText>

          <Form onSubmit={handleSubmit}>
            {/* Username */}
            <FormGroup>
              <Label htmlFor="username">Username</Label>

              <Input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </FormGroup>

            {/* Password */}
            <FormGroup>
              <Label htmlFor="password">Password</Label>

              <PasswordWrapper>
                <PasswordInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />

                <EyeButton
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </EyeButton>
              </PasswordWrapper>
            </FormGroup>

            {/* Forgot Password */}
            <ForgotPassword href="#">
              Forgot password?
            </ForgotPassword>

            {/* Remember Me */}
            <RememberRow>
              <Checkbox
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />

              <RememberText>Remember me</RememberText>
            </RememberRow>

            {/* Login Button */}
            <LoginButton type="submit">
              LOG IN
            </LoginButton>
          </Form>
        </LoginCard>
      </RightSection>
    </LoginPage>
  );
};

export default LoginScreen;