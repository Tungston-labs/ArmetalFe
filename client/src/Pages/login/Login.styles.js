import styled from "styled-components";
import loginpageimage from "../../assets/loginpage.svg";
export const device = {
  mobileS: "(max-width: 320px)",
  mobileM: "(max-width: 480px)",
  mobileL: "(max-width: 600px)",
  tablet: "(max-width: 768px)",
  laptop: "(max-width: 1024px)",
  desktop: "(max-width: 1440px)",
  wide: "(max-width: 1920px)",
};

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

export const LeftPanel = styled.div`
  position: relative;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 34%;
  height: 100vh;
  overflow: hidden;

  @media (max-width: 1024px) {
    width: 100%;
    height: 40vh;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(${loginpageimage});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center bottom;
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

export const RightPanel = styled.div`
  flex: 1;
  background: #fafcf5;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;

  @media (max-width: 1024px) {
    height: 60vh;
  }
`;

export const FormBox = styled.div`
  max-width: 400px;
  width: 100%;
  margin-top: 50px;
  @media (min-width: 3840px) {
    max-width: 35%;
  }
  // h2 {
  //   font-family: Satoshi, sans-serif;
  //   font-weight: 700;
  //   font-size: clamp(28px, 4vw, 41px); /* responsive font */
  //   line-height: 1.2;
  //   text-align: left;
  //   margin: 0 0 10px 0;
  // }

  // p {
  //   font-family: Raleway, sans-serif;
  //   font-size: clamp(14px, 2vw, 20px); /* responsive font */
  //   line-height: 1.4;
  //   margin: 5px 0 20px 0;
  // }

  // @media (max-width: 480px) {
  //   margin-top: 20px;
  // }
`;

export const Label = styled.label`
  font-weight: 400;
  display: block;
  font-family: "Raleway", sans-serif;
  margin-top: 5px;
  margin-bottom: 2px;
  font-size: clamp(13px, 1vw, 2rem); /* responsive base */

  @media ${device.mobileS} {
    font-size: 13px;
  }

  @media ${device.tablet} {
    font-size: 15px;
  }

  @media ${device.laptop} {
    font-size: 16px;
  }

  @media ${device.desktop} {
    font-size: 18px;
  }
  @media (min-width: 3840px) {
    font-size: 2.5rem;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: ${(props) => props.marginBottom || "23px"};
  border: none;
  background: #efefef;
  border-radius: 8px;
  font-family: "Raleway", sans-serif;
  font-size: clamp(14px, 1vw, 2rem);
  @media (min-width: 3840px) {
    padding: 2rem;
    margin-block: 1rem;
    font-size: 2rem;
    border-radius:1.25rem;
  }
`;

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 30px;
  font-size: clamp(14px, 1.5vw, 17px);
  font-family: "Raleway", sans-serif;
  margin-left: 3px;

  input[type="checkbox"] {
    appearance: none;
    width: clamp(16px, 2vw, 20px);
    height: clamp(16px, 2vw, 20px);
    background-color: white; /* default background */
    border-radius: 2px;
    border: 2px solid #000;
    margin-right: 16px;
    cursor: pointer;
    position: relative;
    transition: all 0.2s ease-in-out;
  }

  input[type="checkbox"]:checked {
    background-color: black; /* background turns black when checked */
  }

  input[type="checkbox"]:checked::after {
    content: "";
    position: absolute;
    top: 2px;
    left: 6px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  @media (min-width: 3840px) {
    input {
      padding: 1rem;
    }
    font-size: 2rem;
  }
`;


export const Button = styled.button`
  width: 100%;
  padding: clamp(10px, 1.2vw, 12px);
  background: linear-gradient(to right, #172554, #3352ba);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-family: "Raleway", sans-serif;
  font-weight: bold;
  font-size: clamp(14px, 1vw, 1.5rem);
  @media (min-width: 3840px) {
    padding: 1.5rem;
    font-size: 2.5rem;
    border-radius:1.25rem;
  }
`;

export const SmallLink = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-family: "Raleway", sans-serif;
  color: black;
  text-decoration: none;
  font-size: clamp(12px, 1vw, 1.5rem); /* responsive font size */
  margin-top: -8px;
  padding: 0;

  &:hover {
    text-decoration: underline;
    color: #1e3a8a; /* optional hover color */
  }
  @media (min-width: 3840px) {
    font-size: 2rem;
  }
`;

export const LeftHeader = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  padding: clamp(20px, 3vw, 40px);
  border-radius: 12px;

  h2 {
    font-size: clamp(20px, 3vw, 42px);
  }

  p {
    font-size: clamp(14px, 2vw, 22px);
  }
  @media (min-width: 3840px) {
    h2 {
      font-size: 7rem !important;
    }
    p{
      font-size: 3rem;
    }
  }
`;

export const Logo = styled.img`
  width: clamp(30%, 35vw, 40%);
  height: auto;
  margin-bottom: 1rem;
  margin-left: 4rem;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

export const CustomLink = styled.p`
  font-size: clamp(16px, 2vw, 22px);
  text-decoration: none;
  cursor: pointer;
`;

export const CodeInputWrapper = styled.div`
  display: flex;
  gap: 20px;
  margin: 20px 0;

  @media (max-width: 480px) {
    gap: 10px;
  }
`;

export const CodeInputBox = styled.input`
  width: clamp(40px, 6vw, 50px);
  height: clamp(50px, 8vw, 60px);
  font-size: clamp(16px, 2vw, 24px);
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 2px #007bff;
  }
`;
export const Heading = styled.h2`
  font-family: Satoshi, sans-serif;
  font-weight: 700;
  font-size: clamp(24px, 4vw, 42px); /* ✅ responsive heading */
  line-height: 1.2;
  margin: 0 0 10px 0;
`;

export const SubText = styled.p`
  font-family: Raleway, sans-serif;
  font-size: clamp(13px, 2vw, 20px); /* ✅ responsive subtext */
  color: ${(props) => props.color || "#686868"};
  margin: ${(props) => props.margin || "5px 0 20px 0"};
  line-height: 1.5;
  text-align: left;
`;

export const SmallNote = styled.p`
  font-size: clamp(10px, 1.5vw, 14px);
  font-family: Raleway, sans-serif;
  text-align: center;
  margin-top: ${(props) => props.marginTop || "20px"};
  color: ${(props) => props.color || "#3250B5"};
`;
export const Title = styled.h2`
  font-family: "Satoshi", sans-serif;
  font-weight: bold;
  margin: 0;
  font-size: clamp(24px, 2.5vw, 5rem); // responsive base

  @media ${device.mobileM} {
    font-size: 22px;
  }

  @media ${device.tablet} {
    font-size: 30px;
  }

  @media ${device.laptop} {
    font-size: 36px;
  }
  @media (min-width: 3840px) {
    font-size: 6rem;
    padding-block: 2rem;
  }
`;

export const Subtitle = styled.p`
  font-family: "Raleway", sans-serif;
  margin-top: 8px;
  font-size: clamp(14px, 1vw, 2.5rem); // responsive base

  @media ${device.mobileM} {
    font-size: 14px;
  }

  @media ${device.tablet} {
    font-size: 16px;
  }

  @media ${device.laptop} {
    font-size: 18px;
  }
  @media (min-width: 3840px) {
    font-size: 3rem;
  }
`;
