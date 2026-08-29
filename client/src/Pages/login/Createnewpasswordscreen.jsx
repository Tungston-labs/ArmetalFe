import React, { useState } from "react";
import girlIllustrationUrl from "../../../assets/login.svg";
import logo from "../../../assets/logo3.svg";
import {
  PageBackground,
  PageWrapper,
  LeftPanel,
  Logo,
  HeroText,
  AccentDivider,
  IllustrationArea,
  RightPanel,
  FormCard,
  Welcome,
  FieldGroup,
  InputWrapper,
  Input,
  ToggleVisibility,
  ForgotPassword as BackToLoginLink,
  LoginButton,
  ErrorText,
} from "./Login/LoginScreen.styles";
import { PiEye, PiEyeSlash } from "react-icons/pi";

const MIN_LENGTH = 8;

const CreateNewPasswordScreen = ({ onSubmit, isLoading, error }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState(false);

  const tooShort = password.length > 0 && password.length < MIN_LENGTH;
  const mismatch =
    touched && confirmPassword.length > 0 && password !== confirmPassword;
  const isValid =
    password.length >= MIN_LENGTH &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;
    onSubmit?.({ password });
  };

  return (
    <PageBackground>
      <PageWrapper>
        <LeftPanel>
          <Logo>
            <img src={logo} alt="Logo" />
          </Logo>

          <HeroText>
            <h1>
              Manage People.
              <br />
              Drive Productivity.
            </h1>

            <p>
              Make everyday HR management faster, easier, and more efficient.
            </p>
          </HeroText>

          <IllustrationArea>
            <div className="dot-grid" />
            <img
              src={girlIllustrationUrl}
              className="girl-illustration"
              alt=""
            />
          </IllustrationArea>
        </LeftPanel>

        {/* ---------- RIGHT: create new password form ---------- */}
        <RightPanel>
          <FormCard onSubmit={handleSubmit}>
            <Welcome>
              <h2>Create new password</h2>
              <p>
                Your new password must be different from previously used
                passwords
              </p>
            </Welcome>

            {error && <ErrorText>{error}</ErrorText>}

            <FieldGroup>
              <label htmlFor="password">New password</label>
              <InputWrapper>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <ToggleVisibility
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <PiEyeSlash /> : <PiEye />}
                </ToggleVisibility>
              </InputWrapper>
              {tooShort && (
                <ErrorText style={{ margin: "6px 0 0", fontSize: "12px" }}>
                  Must be at least {MIN_LENGTH} characters
                </ErrorText>
              )}
            </FieldGroup>

            <FieldGroup>
              <label htmlFor="confirmPassword">Confirm password</label>
              <InputWrapper>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => setTouched(true)}
                  autoComplete="new-password"
                  required
                />
                <ToggleVisibility
                  type="button"
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? <PiEyeSlash /> : <PiEye />}
                </ToggleVisibility>
              </InputWrapper>
              {mismatch && (
                <ErrorText style={{ margin: "6px 0 0", fontSize: "12px" }}>
                  Passwords do not match
                </ErrorText>
              )}
            </FieldGroup>

            <LoginButton type="submit" disabled={isLoading}>
              {isLoading ? "SAVING..." : "RESET PASSWORD"}
            </LoginButton>

            <BackToLoginLink
              to="/log"
              style={{ textAlign: "center", marginTop: "1rem" }}
            >
              Back to log in
            </BackToLoginLink>
          </FormCard>
        </RightPanel>
      </PageWrapper>
    </PageBackground>
  );
};

export default CreateNewPasswordScreen;
