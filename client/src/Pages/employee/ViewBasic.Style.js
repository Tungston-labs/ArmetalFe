import styled from "styled-components";

export const Container = styled.div`
  padding: 2rem;
  background: white;
  font-family: Satoshi;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h2 {
    margin: 0;
  }

  p {
    margin: 0.2rem 0 0;
    font-size: 0.9rem;
    color: #333;
  }
`;
export const EmployeeImage = styled.img`
  height: clamp(50px, 8vw, 120px); /* scales between 50px and 120px */
  width: auto; /* maintain aspect ratio */

  @media (min-width: 768px) {
    height: clamp(20px, 6vw, 20px);
  }

  @media (min-width: 1024px) {
    height: clamp(20px, 4vw, 50px);
  }

  @media (min-width: 1440px) {
    height: clamp(50px, 1vw, 80px);
  }

  @media (min-width: 2560px) {
    height: clamp(80px, 1vw, 100px);
  }

  @media (min-width: 3840px) {
    height: clamp(100px, 3vw, 200px);
  }
`;

export const EditButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center; /* ✅ Center content horizontally */
  padding: 0.5rem;
  border: none;
  background: linear-gradient(
    180deg,
    rgba(23, 37, 84, 1) 50%,
    rgba(51, 82, 186, 1) 100%
  );
  color: white;
  border-radius: 8px;
  width: 100px;
  height: 42px;
  font-size: 0.9rem;
  cursor: pointer;
  gap: 0.5rem; /* ✅ Add space between icon and text */

  svg {
    font-size: 1rem;
  }
`;

export const Row = styled.div`
  display: flex;
  gap: 2.5rem;
  width: 100%;
  flex-wrap: wrap;
  align-items: flex-start;
`;

export const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  // gap: 1rem;
  flex: 1;
  min-width: 250px;
`;

export const RightSection = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  min-width: 300px;
`;

export const Input = styled.input`
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  width: 100%;
  border-radius: 7px;
  border: 1px solid #052db4;
  background: #fff;
`;

export const Textarea = styled.textarea`
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  width: 100%;
  resize: none;
  height: 95px;
  border-radius: 7px;
  border: 1px solid #052db4;
  background: #fff;
`;
export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
`;
export const FieldWrappers = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
`;
export const Label = styled.label`
  font-weight: 500;
  margin-bottom: 0.3rem;
  color: #052db4;
`;

export const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
`;

export const Section = styled.div`
  //   padding: 2rem;
  background: white;
  font-family: sans-serif;
`;

export const Tabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
`;

export const Tab = styled.button`
  background: ${({ active }) => (active ? "#002ea3" : "transparent")};
  color: ${({ active }) => (active ? "#fff" : "#000")};
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  border: ${({ active }) => (active ? "none" : "1px solid #ccc")};
`;

export const GroupLabel = styled.h4`
  margin-bottom: 1rem;
  font-family: "Satoshi", sans-serif;
  font-weight: 700;
  line-height: 100%;
  letter-spacing: 0%;

  /* 🔹 Fluid font-size with clamp */
  font-size: clamp(14px, 1.2vw, 22px);

  /* 📱 Small phones */
  @media (max-width: 480px) {
    font-size: 14px;
  }

  /* 📲 Tablets */
  @media (min-width: 481px) and (max-width: 768px) {
    font-size: 16px;
  }

  /* 💻 Laptops & desktops */
  @media (min-width: 769px) and (max-width: 1920px) {
    font-size: 18px;
  }

  /* 🖥 4K screens */
  @media (min-width: 1921px) and (max-width: 3839px) {
    font-size: 22px;
  }

  /* 🖥 8K screens */
  @media (min-width: 3840px) {
    font-size: 26px;
  }
`;

export const Rows = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: flex-start;
  background-color: #fff;
`;

export const Select = styled.select`
  flex: 1;
  padding: 0.6rem 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #fff;
  border-radius: 7px;
  border: 1px solid #052db4;
  background: #fff;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem; /* adds vertical spacing */
`;

export const Button = styled.button`
  display: block; /* makes margin: auto work */
  margin: 1rem auto 0 auto; /* top: 1rem, auto on left/right to center */
  background: #172554;
  color: white;
  border: none;
  padding: 0.6rem 2rem;
  border-radius: 6px;
  cursor: pointer;
  text-align: center;
`;

export const Rowes = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  width: 100%;

  > input,
  > select {
    flex: 1;
    padding: 0.6rem 1rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    min-width: 0;
    border-radius: 7px;
    border: 1px solid #052db4;
    background: #fff;
  }
`;
export const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

export const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h2`
  font-size: 1.4rem;
  margin: 0;
  color: #304eb0;
  font-family: Satoshi;
  font-weight: 700;
  // font-style: Bold;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;
`;

export const Subtitle = styled.p`
  // color:#304EB0;
  margin: 0;
  font-family: Raleway;
  font-weight: 300;
  font-style: Light;
  font-size: 1rem;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;
`;
export const HRManager = styled.div`
  display: flex;
  height: 30px;

  align-items: center;
  padding: 0.3rem;
  // border: 1px solid #ccc;
  // border-radius: 8px;
  background-color: #fff;
  font-size: 0.95rem;
  color: #333;
  // box-shadow: 0 0 4px rgba(0, 0, 0, 0.05);

  span {
    font-weight: 500;
  }

  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

export const Rightside = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* aligns children to the right */
  gap: 0.5rem;
  margin-left: auto; /* pushes Rightside itself to the right if in a flex row */
`;

export const FormWrapper = styled.div`
  display: flex;
  gap: 2rem;
  align-items: flex-start;
`;
export const ProfileImage = styled.img`
  width: 10px;
  height: 10px;
  border-radius: 10%;
  object-fit: cover;
  /* style={{ width: 150, height: 150, borderRadius: "10%", objectFit: "cover" }} */
  @media (max-width: 768px) {
    width: 50px;
    height: 60px;
  }

  @media (max-width: 480px) {
    width: 20px;
    height: 30px;
  }
`;
export const ImageColumn = styled.div`
  flex: 0 0 auto;

  img {
    width: 150px;
    height: 210px;
    border-radius: 10px;
    object-fit: cover;

    @media (min-width: 2000px) {
      width: 150px;
      height: 240px;
    }
       @media (min-width: 3500px) {
      width: 150px;
      height: 250px;
    }
  }
`;
export const Hr = styled.hr`
  border: none;
  border-top: 1px solid #ccc;
`;

export const FullPageLoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export const TitleSection = styled.div`
  display: flex;
  align-items: center;
`;
export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
