// import React, { useState } from "react";
// import girlIllustrationUrl from "../../../assets/login.svg";
// import logo from "../../../assets/logo3.svg";
// import {
//   PageBackground,
//   PageWrapper,
//   LeftPanel,
//   Logo,
//   HeroText,
//   AccentDivider,
//   IllustrationArea,
//   RightPanel,
//   FormCard,
//   Welcome,
//   FieldGroup,
//   InputWrapper,
//   Input,
//   ToggleVisibility,
//   ForgotPassword,
//   RememberRow,
//   LoginButton,
//   ErrorText,
// } from "./LoginScreen.styles";
// import { PiEye, PiEyeSlash } from "react-icons/pi";

// const Loginscreen = ({ onLogin, isLoading, error }) => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onLogin?.({ username, password, rememberMe });
//   };

//   return (
//     <PageBackground>
//       <PageWrapper>
//         <LeftPanel>
//           <Logo>
//             <img src={logo} alt="Logo" />
//           </Logo>

//           <HeroText>
//             <h1>
//               Manage People.
//               <br />
//               Drive Productivity.
//             </h1>

//             <p>
//               Make everyday HR management faster, easier, and more efficient.
//             </p>
//           </HeroText>

//           <IllustrationArea>
//             <div className="dot-grid" />
//             <img
//               src={girlIllustrationUrl}
//               className="girl-illustration"
//               alt=""
//             />
//           </IllustrationArea>
//         </LeftPanel>

//         {/* ---------- RIGHT: login form ---------- */}
//         <RightPanel>
//           <FormCard onSubmit={handleSubmit}>
//             <Welcome>
//               <h2>Welcome back!</h2>
//               <p>Please log in to your account</p>
//             </Welcome>

//             {error && <ErrorText>{error}</ErrorText>}

//             <FieldGroup>
//               <label htmlFor="username">Username</label>
//               <InputWrapper>
//                 <Input
//                   id="username"
//                   type="text"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   autoComplete="username"
//                   required
//                 />
//               </InputWrapper>
//             </FieldGroup>

//             <FieldGroup>
//               <label htmlFor="password">Password</label>
//               <InputWrapper>
//                 <Input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   autoComplete="current-password"
//                   required
//                 />
//                 <ToggleVisibility
//                   type="button"
//                   onClick={() => setShowPassword((s) => !s)}
//                   aria-label={showPassword ? "Hide password" : "Show password"}
//                 >
//                   {showPassword ? <PiEyeSlash /> : <PiEye />}
//                 </ToggleVisibility>
//               </InputWrapper>
//               <ForgotPassword to="/forget-screen">
//                 Forgot password?
//               </ForgotPassword>
//             </FieldGroup>

//             <RememberRow>
//               <input
//                 type="checkbox"
//                 checked={rememberMe}
//                 onChange={(e) => setRememberMe(e.target.checked)}
//               />
//               Remember me
//             </RememberRow>

//             <LoginButton type="submit" disabled={isLoading}>
//               {isLoading ? "LOGGING IN..." : "LOG IN"}
//             </LoginButton>
//           </FormCard>
//         </RightPanel>
//       </PageWrapper>
//     </PageBackground>
//   );
// };

// export default Loginscreen;


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
  ForgotPassword,
  RememberRow,
  LoginButton,
  ErrorText,
} from "./LoginScreen.styles";

import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../../../Redux/authSlice";
import { useNavigate } from "react-router-dom";
import { PiEye, PiEyeSlash } from "react-icons/pi";
import { BASE_URL } from "../../../services/api";

const Loginscreen = ({ onLogin, isLoading, error }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [view, setView] = useState("login");

  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
  });

  const [internalError, setInternalError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setInternalError(null);
    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/api/token/`, {
        username,
        password,
      });

      const { access, refresh, user } = response.data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch(
        login({
          userName: user.username,
          accessToken: access,
          user,
        }),
      );

      if (user.is_superadmin) {
        navigate("/dashboard");
      } else {
        navigate("/");
      }

      // Keep existing onLogin functionality if it is supplied by the parent.
      onLogin?.({
        username,
        password,
        rememberMe,
      });
    } catch (err) {
      console.log(err);

      setInternalError(
        err.response?.data?.detail || "Login failed. Check credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forget-screen");
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    setInternalError(null);
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
        },
      );

      alert("Password changed successfully");

      setFormData({
        old_password: "",
        new_password: "",
      });

      setView("login");
    } catch (err) {
      console.log(err);

      setInternalError(err.response?.data?.detail || "Password change failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleOldPasswordChange = (e) => {
    setFormData({
      ...formData,
      old_password: e.target.value,
    });
  };

  const handleNewPasswordChange = (e) => {
    setFormData({
      ...formData,
      new_password: e.target.value,
    });
  };

  const displayError = internalError || error;
  const displayLoading = loading || isLoading;

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

        {/* ---------- RIGHT: login form ---------- */}
        <RightPanel>
          {view === "login" ? (
            <FormCard onSubmit={handleSubmit}>
              <Welcome>
                <h2>Welcome back!</h2>
                <p>Please log in to your account</p>
              </Welcome>

              {displayError && <ErrorText>{displayError}</ErrorText>}

              <FieldGroup>
                <label htmlFor="username">Username</label>

                <InputWrapper>
                  <Input
                    id="username"
                    type="text"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </InputWrapper>
              </FieldGroup>

              <FieldGroup>
                <label htmlFor="password">Password</label>

                <InputWrapper>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />

                  <ToggleVisibility
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <PiEyeSlash /> : <PiEye />}
                  </ToggleVisibility>
                </InputWrapper>

                <ForgotPassword
                  to="/forget-screen"
                  onClick={(e) => {
                    e.preventDefault();
                    handleForgotPassword();
                  }}
                >
                  Forgot password?
                </ForgotPassword>
              </FieldGroup>

              <RememberRow>
                <input
                  type="checkbox"
                  name="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </RememberRow>

              <LoginButton type="submit" disabled={displayLoading}>
                {displayLoading ? "LOGGING IN..." : "LOG IN"}
              </LoginButton>
            </FormCard>
          ) : (
            <FormCard onSubmit={handlePasswordChange}>
              <Welcome>
                <h2>Change Password</h2>
                <p>Please enter your old and new password</p>
              </Welcome>

              {displayError && <ErrorText>{displayError}</ErrorText>}

              <FieldGroup>
                <label htmlFor="old_password">Old Password</label>

                <InputWrapper>
                  <Input
                    id="old_password"
                    type={showOldPassword ? "text" : "password"}
                    name="old_password"
                    value={formData.old_password}
                    onChange={handleOldPasswordChange}
                    required
                  />

                  <ToggleVisibility
                    type="button"
                    onClick={() => setShowOldPassword((s) => !s)}
                    aria-label={
                      showOldPassword
                        ? "Hide old password"
                        : "Show old password"
                    }
                  >
                    {showOldPassword ? <PiEyeSlash /> : <PiEye />}
                  </ToggleVisibility>
                </InputWrapper>
              </FieldGroup>

              <FieldGroup>
                <label htmlFor="new_password">New Password</label>

                <InputWrapper>
                  <Input
                    id="new_password"
                    type={showNewPassword ? "text" : "password"}
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleNewPasswordChange}
                    required
                  />

                  <ToggleVisibility
                    type="button"
                    onClick={() => setShowNewPassword((s) => !s)}
                    aria-label={
                      showNewPassword
                        ? "Hide new password"
                        : "Show new password"
                    }
                  >
                    {showNewPassword ? <PiEyeSlash /> : <PiEye />}
                  </ToggleVisibility>
                </InputWrapper>
              </FieldGroup>

              <LoginButton type="submit" disabled={displayLoading}>
                {displayLoading ? "CHANGING PASSWORD..." : "CHANGE PASSWORD"}
              </LoginButton>

              <ForgotPassword
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  setInternalError(null);
                  setView("login");
                }}
              >
                Back to login
              </ForgotPassword>
            </FormCard>
          )}
        </RightPanel>
      </PageWrapper>
    </PageBackground>
  );
};

export default Loginscreen;
