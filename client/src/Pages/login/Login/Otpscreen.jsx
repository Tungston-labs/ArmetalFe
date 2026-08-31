// import React, { useState, useRef, useEffect } from "react";
// import styled from "styled-components";
// import girlIllustrationUrl from "../../../assets/login.svg";
// import logo from "../../../assets/logo3.svg";
// import {
//     PageBackground,
//     PageWrapper,
//     LeftPanel,
//     Logo,
//     HeroText,
//     AccentDivider,
//     IllustrationArea,
//     RightPanel,
//     FormCard,
//     Welcome,
//     FieldGroup,
//     InputWrapper,
//     Input,
//     ForgotPassword as BackToLoginLink,
//     LoginButton,
//     ErrorText,
// } from "./LoginScreen.styles";

// const ResendButton = styled.button`
//     background: none;
//     border: none;
//     padding: 0;
//     font-size: 13px;
//     color: rgba(255, 255, 255, 0.9);
//     text-decoration: underline;
//     cursor: pointer;

//     &:hover {
//         color: #ffffff;
//     }

//     &:focus {
//         outline: none;
//     }
// `;

// const OTP_LENGTH = 6;
// const RESEND_SECONDS = 30;

// const OTPScreen = ({ email, onVerify, onResend, isLoading, error }) => {
//     const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
//     const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
//     const inputsRef = useRef([]);

//     useEffect(() => {
//         if (secondsLeft <= 0) return;
//         const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
//         return () => clearInterval(timer);
//     }, [secondsLeft]);

//     const focusInput = (index) => {
//         inputsRef.current[index]?.focus();
//     };

//     const handleChange = (index, value) => {
//         const digit = value.replace(/\D/g, "").slice(-1);
//         const next = [...otp];
//         next[index] = digit;
//         setOtp(next);

//         if (digit && index < OTP_LENGTH - 1) {
//             focusInput(index + 1);
//         }
//     };

//     const handleKeyDown = (index, e) => {
//         if (e.key === "Backspace" && !otp[index] && index > 0) {
//             focusInput(index - 1);
//         }
//     };

//     const handlePaste = (e) => {
//         const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
//         if (!pasted) return;
//         e.preventDefault();
//         const next = Array(OTP_LENGTH).fill("");
//         pasted.split("").forEach((char, i) => (next[i] = char));
//         setOtp(next);
//         focusInput(Math.min(pasted.length, OTP_LENGTH - 1));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         onVerify?.({ code: otp.join("") });
//     };

//     const handleResend = () => {
//         if (secondsLeft > 0) return;
//         onResend?.();
//         setSecondsLeft(RESEND_SECONDS);
//     };

//     const isComplete = otp.every((d) => d !== "");

//     return (
//         <PageBackground>
//             <PageWrapper>

//                 <LeftPanel>
//                     <Logo>
//                         <img src={logo} alt="Logo" />
//                     </Logo>

//                     <HeroText>
//                         <h1>
//                             Manage People.
//                             <br />
//                             Drive Productivity.
//                         </h1>

//                         <p>
//                             Make everyday HR management faster, easier, and more efficient.
//                         </p>
//                     </HeroText>

//                     <IllustrationArea>
//                         <div className="dot-grid" />
//                         <img
//                             src={girlIllustrationUrl}
//                             className="girl-illustration"
//                             alt=""
//                         />
//                     </IllustrationArea>
//                 </LeftPanel>

//                 {/* ---------- RIGHT: OTP verification form ---------- */}
//                 <RightPanel>
//                     <FormCard onSubmit={handleSubmit}>
//                         <Welcome>
//                             <h2>Verify your email</h2>
//                             <p>
//                                 Enter the {OTP_LENGTH}-digit code sent to{" "}
//                                 {email ? <strong>{email}</strong> : "your email"}
//                             </p>
//                         </Welcome>

//                         {error && <ErrorText>{error}</ErrorText>}

//                         <FieldGroup>
//                             <InputWrapper
//                                 style={{
//                                     display: "flex",
//                                     gap: "0.5rem",
//                                     justifyContent: "space-between",
//                                 }}
//                                 onPaste={handlePaste}
//                             >
//                                 {otp.map((digit, index) => (
//                                     <Input
//                                         key={index}
//                                         ref={(el) => (inputsRef.current[index] = el)}
//                                         type="text"
//                                         inputMode="numeric"
//                                         maxLength={1}
//                                         value={digit}
//                                         onChange={(e) => handleChange(index, e.target.value)}
//                                         onKeyDown={(e) => handleKeyDown(index, e)}
//                                         style={{
//                                             textAlign: "center",
//                                             width: "3rem",
//                                             padding: "0.75rem 0",
//                                         }}
//                                     />
//                                 ))}
//                             </InputWrapper>
//                         </FieldGroup>

//                         <LoginButton type="submit" disabled={isLoading || !isComplete}>
//                             {isLoading ? "VERIFYING..." : "VERIFY CODE"}
//                         </LoginButton>

//                         <div style={{ textAlign: "center", marginTop: "1rem", fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>
//                             {secondsLeft > 0 ? (
//                                 <span>Resend code in {secondsLeft}s</span>
//                             ) : (
//                                 <ResendButton type="button" onClick={handleResend}>
//                                     Resend code
//                                 </ResendButton>
//                             )}
//                         </div>

//                         <BackToLoginLink to="/log" style={{ textAlign: "center", marginTop: "8px" }}>
//                             Back to log in
//                         </BackToLoginLink>
//                     </FormCard>
//                 </RightPanel>
//             </PageWrapper>
//         </PageBackground>
//     );
// };

// export default OTPScreen;

import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
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
  ForgotPassword as BackToLoginLink,
  LoginButton,
  ErrorText,
} from "./LoginScreen.styles";

const ResendButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: #ffffff;
  }

  &:focus {
    outline: none;
  }
`;

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

const OTPScreen = ({ email, onVerify, onResend, isLoading, error }) => {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));

  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  const inputsRef = useRef([]);

  // -----------------------------
  // Resend countdown
  // -----------------------------
  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  // -----------------------------
  // Focus first input on mount
  // -----------------------------
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // -----------------------------
  // Focus specific OTP input
  // -----------------------------
  const focusInput = (index) => {
    inputsRef.current[index]?.focus();
  };

  // -----------------------------
  // Handle OTP input
  // -----------------------------
  const handleChange = (index, rawValue) => {
    const value = rawValue.replace(/[^0-9]/g, "");

    // If input is cleared
    if (!value) {
      setOtp((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });

      return;
    }

    // Handle single digit or pasted multiple digits
    const chars = value.split("");

    setOtp((prev) => {
      const next = [...prev];

      chars.forEach((char, i) => {
        if (index + i < OTP_LENGTH) {
          next[index + i] = char;
        }
      });

      return next;
    });

    // Move focus to the next appropriate input
    const nextIndex = Math.min(index + chars.length, OTP_LENGTH - 1);

    focusInput(nextIndex);
  };

  // -----------------------------
  // Handle backspace
  // -----------------------------
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      focusInput(index - 1);
    }
  };

  // -----------------------------
  // Handle paste
  // -----------------------------
  const handlePaste = (e) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) return;

    e.preventDefault();

    const next = Array(OTP_LENGTH).fill("");

    pasted.split("").forEach((char, index) => {
      next[index] = char;
    });

    setOtp(next);

    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);

    focusInput(nextIndex);
  };

  // -----------------------------
  // Submit OTP
  // -----------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    const code = otp.join("");

    // Do not submit incomplete OTP
    if (code.length !== OTP_LENGTH) {
      return;
    }

    onVerify?.({
      code,
    });
  };

  // -----------------------------
  // Resend OTP
  // -----------------------------
  const handleResend = () => {
    if (secondsLeft > 0) {
      return;
    }

    // Clear existing OTP
    setOtp(Array(OTP_LENGTH).fill(""));

    // Reset countdown
    setSecondsLeft(RESEND_SECONDS);

    // Focus first input
    focusInput(0);

    // Call parent resend functionality
    onResend?.();
  };

  // -----------------------------
  // Check OTP completion
  // -----------------------------
  const code = otp.join("");

  const isComplete =
    code.length === OTP_LENGTH && otp.every((digit) => digit !== "");

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

        {/* ---------- RIGHT: OTP verification form ---------- */}
        <RightPanel>
          <FormCard onSubmit={handleSubmit}>
            <Welcome>
              <h2>Verify your email</h2>

              <p>
                Enter the {OTP_LENGTH}-digit code sent to{" "}
                {email ? <strong>{email}</strong> : "your email"}
              </p>
            </Welcome>

            {error && <ErrorText>{error}</ErrorText>}

            <FieldGroup>
              <InputWrapper
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  justifyContent: "space-between",
                }}
                onPaste={handlePaste}
              >
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    ref={(el) => (inputsRef.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    maxLength={OTP_LENGTH}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    style={{
                      textAlign: "center",
                      width: "3rem",
                      padding: "0.75rem 0",
                    }}
                  />
                ))}
              </InputWrapper>
            </FieldGroup>

            <LoginButton type="submit" disabled={!isComplete || isLoading}>
              {isLoading ? "VERIFYING..." : "VERIFY CODE"}
            </LoginButton>

            <div
              style={{
                textAlign: "center",
                marginTop: "1rem",
                fontSize: "13px",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {secondsLeft > 0 ? (
                <span>Resend code in {secondsLeft}s</span>
              ) : (
                <ResendButton type="button" onClick={handleResend}>
                  Resend code
                </ResendButton>
              )}
            </div>

            <BackToLoginLink
              to="/log"
              style={{
                textAlign: "center",
                marginTop: "8px",
              }}
            >
              Back to log in
            </BackToLoginLink>
          </FormCard>
        </RightPanel>
      </PageWrapper>
    </PageBackground>
  );
};

export default OTPScreen;
