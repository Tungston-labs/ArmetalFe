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
//   ForgotPassword as BackToLoginLink,
//   LoginButton,
//   ErrorText,
// } from "./LoginScreen.styles";

// const ForgotPasswordScreen = ({ onSubmit, isLoading, error, success }) => {
//   const [email, setEmail] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit?.({ email });
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

//         {/* ---------- RIGHT: forgot password form ---------- */}
//         <RightPanel>
//           <FormCard onSubmit={handleSubmit}>
//             <Welcome>
//               <h2>Forgot password?</h2>
//               <p>
//                 {success
//                   ? "Check your inbox for a reset link"
//                   : "Enter your email and we'll send you a reset link"}
//               </p>
//             </Welcome>

//             {error && <ErrorText>{error}</ErrorText>}

//             {!success && (
//               <>
//                 <FieldGroup>
//                   <label htmlFor="email">Email</label>
//                   <InputWrapper>
//                     <Input
//                       id="email"
//                       type="email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       autoComplete="email"
//                       required
//                     />
//                   </InputWrapper>
//                 </FieldGroup>

//                 <LoginButton type="submit" disabled={isLoading}>
//                   {isLoading ? "SENDING..." : "SEND RESET LINK"}
//                 </LoginButton>
//               </>
//             )}

//             <BackToLoginLink
//               to="/log"
//               style={{ textAlign: "center", marginTop: "1rem" }}
//             >
//               Back to log in
//             </BackToLoginLink>
//           </FormCard>
//         </RightPanel>
//       </PageWrapper>
//     </PageBackground>
//   );
// };

// export default ForgotPasswordScreen;

import React, { useState } from "react";
import girlIllustrationUrl from "../../../assets/login.svg";
import logo from "../../../assets/logo3.svg";

import {
  PageBackground,
  PageWrapper,
  LeftPanel,
  Logo,
  HeroText,
  IllustrationArea,
  RightPanel,
  FormCard,
  Welcome,
  FieldGroup,
  InputWrapper,
  Input,
  ForgotPassword as BackToLoginLink,
  LoginButton,
  ErrorText,
} from "./LoginScreen.styles";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import PunchLoader from "../../../Components/Loader/Loader";
import { BASE_URL } from "../../../services/api";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setMessage(null);
    setSuccess(false);
    setLoading(true);

    try {
      await axios.post(`${BASE_URL}/api/forgot-password/send-otp/`, {
        email,
      });

      setMessage("OTP sent to your email successfully.");
      setSuccess(true);

      setTimeout(() => {
        navigate("/otp", {
          state: {
            email,
          },
        });
      }, 1000);
    } catch (err) {
      console.log(err);

      setError(
        err.response?.data?.detail || "Failed to send OTP. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <PunchLoader text="Sending OTP..." />}

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

          {/* ---------- RIGHT: forgot password form ---------- */}
          <RightPanel>
            <FormCard onSubmit={handleSubmit}>
              <Welcome>
                <h2>Forgot password?</h2>

                <p>
                  {success
                    ? "Check your inbox for a reset link"
                    : "Enter your email and we'll send you a reset link"}
                </p>
              </Welcome>

              {error && <ErrorText>{error}</ErrorText>}

              {message && !error && (
                <ErrorText
                  style={{
                    color: "green",
                  }}
                >
                  {message}
                </ErrorText>
              )}

              {!success && (
                <>
                  <FieldGroup>
                    <label htmlFor="email">Email</label>

                    <InputWrapper>
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                      />
                    </InputWrapper>
                  </FieldGroup>

                  <LoginButton type="submit" disabled={loading}>
                    {loading ? "SENDING..." : "SEND RESET LINK"}
                  </LoginButton>
                </>
              )}

              <BackToLoginLink
                to="/log"
                style={{
                  textAlign: "center",
                  marginTop: "1rem",
                }}
              >
                Back to log in
              </BackToLoginLink>
            </FormCard>
          </RightPanel>
        </PageWrapper>
      </PageBackground>
    </>
  );
};

export default ForgotPasswordScreen;
