import styled from "styled-components";

export const LoginPage = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  background: #3250B5;
  overflow: hidden;
`;

/* =====================================================
   LEFT SECTION
===================================================== */

export const LeftSection = styled.section`
  width: 50%;
  min-height: 100vh;
  position: relative;
  overflow: hidden;

  display: flex;
  flex-direction: column;

  padding: 48px 55px;

background:
  radial-gradient(
    circle at 58% 15%,
    rgba(82, 111, 211, 0.35) 0%,
    rgba(82, 111, 211, 0.12) 15%,
    transparent 30%
  ),
  #ffffff;

  /* Small dotted pattern similar to the design */
&::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 200px;
  height: 100%;

  background-image: radial-gradient(
    #eeeeee 2px,
    transparent 2px
  );

  background-size: 18px 18px;

  /* Fade only from the top */
  mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 15%,
    black 100%
  );

  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 15%,
    black 100%
  );

  opacity: 0.7;
  pointer-events: none;
}

  @media (max-width: 900px) {
    width: 45%;
    padding: 35px;
  }

  @media (max-width: 700px) {
    display: none;
  }
`;

/* =====================================================
   LOGO
===================================================== */

export const LogoSection = styled.div`
  position: relative;
  z-index: 2;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const Logo = styled.img`
  width: 92px;
  height: 92px;
  object-fit: contain;
`;

export const BrandName = styled.span`
  margin-top: 2px;

  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.4px;
  color: #151515;
`;

/* =====================================================
   LEFT CONTENT
===================================================== */

export const MainHeading = styled.h1`
  position: relative;
  z-index: 2;
  margin: 17px 0 8px;
  font-size: 17px;
  line-height: 1.35;
  font-weight: 700;
  color: #101010;
  font-family: "Poppins";
font-weight: 600;
font-style: SemiBold;
font-size: 24px;
line-height: 34px;
letter-spacing: 0%;

`;

export const Description = styled.p`
  position: relative;
  z-index: 2;
  margin: 0;
  font-size: 10px;
  line-height: 1.65;
  color: #555555;
  font-family: "Poppins";
font-weight: 400;
font-style: Regular;
font-size: 16px;
line-height: 26px;
letter-spacing: 3%;

`;

/* =====================================================
   SVG ILLUSTRATION
===================================================== */

export const IllustrationWrapper = styled.div`
  position: absolute;
  left: 7%;
  right: 4%;
  bottom: -5px;
  height: 40%;
  display: flex;
  align-items: flex-end;
  justify-content: center;

  z-index: 2;

  pointer-events: none;
`;

export const Illustration = styled.img`
  width: 100%;
  height: 100%;

  object-fit: contain;
  object-position: center bottom;

  display: block;
`;

/* =====================================================
   RIGHT SECTION
===================================================== */

export const RightSection = styled.section`
  width: 50%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3856b8;
  padding: 40px;

  @media (max-width: 900px) {
    width: 55%;
    padding: 30px;
  }

  @media (max-width: 700px) {
    width: 100%;
    min-height: 100vh;
  }
`;

/* =====================================================
   LOGIN CARD
===================================================== */

export const LoginCard = styled.div`
  width: 100%;
  max-width: 450px;

  padding: 25px;

  background: rgba(53, 82, 178, 0.35);

  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.03);

  border-radius: 2px;
`;

/* =====================================================
   LOGIN TITLE
===================================================== */

export const WelcomeTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  font-family: "Poppins";
font-weight: 600;
font-style: SemiBold;
font-size: 24px;
line-height: 18px;
letter-spacing: 0%;
margin-bottom: 20px;
`;

export const WelcomeText = styled.p`
  margin: 5px 0 24px;
  font-size: 10px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
  font-family: "Poppins";
font-weight: 400;
font-style: Regular;
font-size: 16px;
leading-trim: NONE;
line-height: 18px;
letter-spacing: 0%;

`;

/* =====================================================
   FORM
===================================================== */

export const Form = styled.form`
  width: 100%;
`;

export const FormGroup = styled.div`
  width: 100%;
  margin-bottom: 10px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 9px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
  font-family: "Poppins";
font-weight: 300;
font-style: Light;
font-size: 16px;
line-height: 100%;
letter-spacing: 0%;

`;

/* =====================================================
   INPUT
===================================================== */

export const Input = styled.input`
  width: 100%;
  height: 45px;
  padding: 0 10px;
border: 1px solid #FFFFFF1A;
  border-radius: 5px;
  outline: none;
  background: #3250B5;
  color: #ffffff;
  font-size: 10px;
  transition: all 0.2s ease;
margin-bottom: 10px;
  &:focus {
    border-color: rgba(255, 255, 255, 0.55);
    background: rgba(49, 77, 168, 0.5);
  }
`;

export const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const PasswordInput = styled(Input)`
  padding-right: 35px;
`;

export const EyeButton = styled.button`
  position: absolute;

  right: 8px;
  top: 50%;

  transform: translateY(-50%);

  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: none;
  outline: none;

  background: transparent;

  color: rgba(255, 255, 255, 0.85);

  cursor: pointer;

  font-size: 12px;

  padding: 0;
`;

/* =====================================================
   FORGOT PASSWORD
===================================================== */

export const ForgotPassword = styled.a`
  display: inline-block;
  margin-top: -1px;
  font-size: 8px;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
font-family: "Urbanist";
font-weight: 400;
font-style: Regular;
font-size: 14px;
line-height: 100%;
letter-spacing: 0%;

  &:hover {
    text-decoration: underline;
  }
`;

/* =====================================================
   REMEMBER ME
===================================================== */

export const RememberRow = styled.div`
  display: flex;
  align-items: center;

  margin-top: 17px;
`;

export const Checkbox = styled.input`
  width: 14px;
  height: 14px;

  margin: 0 8px 0 0;

  appearance: none;

  border: 1px solid rgba(255, 255, 255, 0.8);

  border-radius: 0;

  background: transparent;

  cursor: pointer;

  position: relative;

  &:checked {
    background: #ffffff;
  }

  &:checked::after {
    content: "✓";

    position: absolute;

    left: 2px;
    top: -1px;

    font-size: 10px;
    font-weight: 700;

    color: #3856b8;
  }
`;

export const RememberText = styled.span`
  font-size: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-family: "Urbanist";
font-weight: 400;
font-style: Regular;
font-size: 16px;
line-height: 100%;
letter-spacing: 0%;

`;

/* =====================================================
   LOGIN BUTTON
===================================================== */

export const LoginButton = styled.button`
  width: 100%;
  height: 45px;
  margin-top: 20px;
  border: none;
  border-radius: 5px;
  background: #ffffff;
  color: #111111;
  font-size: 9px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
font-family: "Poppins";
font-weight: 500;
font-style: Medium;
font-size: 16px;
leading-trim: NONE;
line-height: 20px;
letter-spacing: 0px;
text-align: center;

  &:hover {
    background: #f2f2f2;
  }

  &:active {
    transform: scale(0.99);
  }
`;