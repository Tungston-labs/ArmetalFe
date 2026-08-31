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
    ForgotPassword as BackToLoginLink,
    LoginButton,
    ErrorText,
} from "./LoginScreen.styles";

const ForgotPasswordScreen = ({ onSubmit, isLoading, error, success }) => {
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit?.({ email });
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

                        {!success && (
                            <>
                                <FieldGroup>
                                    <label htmlFor="email">Email</label>
                                    <InputWrapper>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            autoComplete="email"
                                            required
                                        />
                                    </InputWrapper>
                                </FieldGroup>

                                <LoginButton type="submit" disabled={isLoading}>
                                    {isLoading ? "SENDING..." : "SEND RESET LINK"}
                                </LoginButton>
                            </>
                        )}

                        <BackToLoginLink to="/log" style={{ textAlign: "center", marginTop: "1rem" }}>
                            Back to log in
                        </BackToLoginLink>
                    </FormCard>
                </RightPanel>
            </PageWrapper>
        </PageBackground>
    );
};

export default ForgotPasswordScreen;