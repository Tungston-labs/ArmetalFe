import React, { useState, useEffect } from "react";
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
  CustomLink,
  Title,
  Subtitle,
  WelcomeTitle,
  Description,
  PasswordWrapper,
  EyeIcon,
  ErrorText,
  SuccessText,
} from "../login/Login.styles";

import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BASE_URL } from "../../services/api";
const ChangePasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
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
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/api/forgot-password/reset/`,
        {
          email,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }
      );

      setMessage("Password changed successfully. Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to change password.");
    }
  };

  return (
    <Container>
      <LeftPanel>
        <LeftHeader>
          <Logo src="/images/logos.png" alt="ARMETAL Logo" />
          <WelcomeTitle>Welcome Back</WelcomeTitle>
          <Description>
            Manage your employees with ease.
            <br />
            Log in to access your HR dashboard.
          </Description>
        </LeftHeader>
        <CustomLink />
      </LeftPanel>

      <RightPanel>
        <FormBox>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
              cursor: "pointer",
              marginLeft: "-40px",
            }}
            onClick={() => navigate(-1)}
          >
            <FaChevronLeft size={28} />
            <Title>Set New Password</Title>
          </div>

        <Subtitle>
  You're resetting for <strong>{email}</strong>
</Subtitle>

{error && <ErrorText>{error}</ErrorText>}
{message && <SuccessText>{message}</SuccessText>}

   <form noValidate onSubmit={handleChangePasswordSubmit}>
  <Label>New Password</Label>

  <PasswordWrapper>
    <Input
      type={showPassword ? "text" : "password"}
      name="newPassword"
      placeholder="New password"
      value={formData.newPassword}
      onChange={handleChange}
      required
    />
<EyeIcon
  data-testid="toggle-password"
  onClick={() => setShowPassword(!showPassword)}
>
      {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
    </EyeIcon>
  </PasswordWrapper>

  <Label>Confirm Password</Label>

  <PasswordWrapper>
    <Input
      type={showConfirmPassword ? "text" : "password"}
      name="confirmPassword"
      placeholder="Confirm password"
      value={formData.confirmPassword}
      onChange={handleChange}
      required
    />
<EyeIcon
  data-testid="toggle-confirm-password"
  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
>
      {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
    </EyeIcon>
  </PasswordWrapper>

  <Button type="submit">Continue</Button>

</form>

        </FormBox>
      </RightPanel>
    </Container>
  );
};

export default ChangePasswordPage;
