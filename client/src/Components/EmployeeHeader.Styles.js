import styled from "styled-components";

export const Container = styled.div`
  font-family: "Poppins", sans-serif;
  color: #1e293b;
  padding: 20px;
  max-width: 100%;
  box-sizing: border-box;

  @media (min-width: 2560px) {
    padding: 3rem 6rem;
  }
`;

export const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1.2rem;
  flex-wrap: wrap;
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .back-icon {
    color: #2563eb;
    font-size: 1.2rem;
    cursor: pointer;
  }

  .user-icon {
    color: #2563eb;
    font-size: 1.8rem;
  }

  @media (min-width: 1440px) {
    .back-icon {
      font-size: 1.4rem;
    }
    .user-icon {
      font-size: 2rem;
    }
  }

  @media (min-width: 2560px) {
    .back-icon {
      font-size: 1.8rem;
    }
    .user-icon {
      font-size: 2.5rem;
    }
  }
`;

export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: #1d4ed8;

  @media (min-width: 1440px) {
    font-size: 1.5rem;
  }

  @media (min-width: 2560px) {
    font-size: 2rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 0.9rem;
  color: #64748b;

  @media (min-width: 1440px) {
    font-size: 1rem;
  }

  @media (min-width: 2560px) {
    font-size: 1.2rem;
  }
`;

export const InfoWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  border-top: 1px solid transparent;

    @media (min-width: 768px) and (max-width: 1024px) {
gap: 10px;
  }
`;

export const ProfileImage = styled.img`
  width: 95px;
  height: 95px;
  border-radius: 10px;
  object-fit: cover;
  border: 2px solid #e2e8f0;

@media (min-width: 768px) {
    width: 120px;
    height: 120px;
  }
  @media (min-width: 1440px) {
    width: 150px;
    height: 150px;
  }

  @media (min-width: 2560px) {
    width: 160px;
    height: 160px;
  }
   @media (min-width: 3840px) {
    width: 180px;
    height: 180px;
  }
`;

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  flex: 0 0 30%;
  min-width: 250px;

  /* 📱 Small screens (mobile): 20% width */
  @media (max-width: 768px) {
    flex: 0 0 20%;
    min-width: 150px;
  }

  /* 💻 Tablets (768px–1024px): 25% width */
  @media (min-width: 769px) and (max-width: 1024px) {
    flex: 0 0 25%;
     min-width: 150px;
  }

  /* 🖥️ Standard desktops (1025px–1919px): 30% width */
  @media (min-width: 1025px) and (max-width: 1919px) {
    flex: 0 0 30%;
  }

  /* 🖥️ Full HD–2K (1920px–2559px): 35% width */
  @media (min-width: 1920px) and (max-width: 2559px) {
    flex: 0 0 35%;
  }

  /* 🖥️ 2.5K–4K displays: 40% width */
  @media (min-width: 2560px) {
    flex: 0 0 40%;
  }
`;


export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  flex: 0 0 55%;
  min-width: 300px;

@media (max-width: 768px) {
    flex: 1 1 50%;
    min-width: 150px;
  }
  @media (max-width: 1024px) {
    flex: 1 1 100%;
  }

  @media (max-width: 1440px) {
    flex: 1 1 100%;
    min-width: 150px;
  }
    @media (max-width: 3840px) and (min-width: 2561px) {
    flex: 1 1 100%;
  }
    @media (max-width: 1920px) and (min-width: 2560px) {
    flex: 1 1 100%;
  }
`;

export const Row = styled.div`
  /* display: flex; */
  align-items: center;
  gap: 0.7rem;
  flex-wrap: wrap;
`;

export const Input = styled.input`
  flex: 1;
  border: 1px solid #052db4;
  border-radius: 6px;
  padding: 0.45rem 0.5rem;
  font-size: 0.9rem;
  color: #1e293b;
  background-color: #fff;
  outline: none;
  box-sizing: border-box;

  /* Half-width for DOB field */
  &.dob {
    width: 50%;
    flex: 0 0 50%;
  }

  /* Small devices (mobile) */
  @media (max-width: 767px) {
    font-size: 0.75rem;
    padding: 0.4rem 0.5rem;
    width: 100%;
  }

  /* Tablets */
  @media (min-width: 768px) and (max-width: 1024px) {
    font-size: 0.85rem;
    padding: 0.45rem 0.65rem;
  }

  /* Standard desktops */
  @media (min-width: 1025px) and (max-width: 1439px) {
    font-size: 0.95rem;
    padding: 0.5rem 0.7rem;
  }

  /* Full HD */
  @media (min-width: 1440px) and (max-width: 1919px) {
    font-size: 1rem;
    padding: 0.5rem 0.9rem;
  }

  /* 2K */
  @media (min-width: 1920px) and (max-width: 2559px) {
    font-size: 1.2rem;
    padding: 0.7rem 1rem;
  }

  /* 2.5K–3K */
  @media (min-width: 2560px) and (max-width: 3839px) {
    font-size: 1.35rem;
    padding: 0.8rem 1.1rem;
  }

  /* 4K+ */
  @media (min-width: 3840px) {
    font-size: 1.5rem;
    padding: 0.9rem 1.2rem;
  }
`;

export const Select = styled.select`
  flex: 1;
  border: 1px solid #052db4;
  border-radius: 6px;
  padding: 0.45rem 0.5rem;
  font-size: 0.9rem;
  color: #1e293b;
  background-color: #fff;
  outline: none;
  box-sizing: border-box;

  &.dob {
    width: 50%;
    flex: 0 0 50%;
  }

  /* Match Input’s responsive design exactly */
  @media (max-width: 767px) {
    font-size: 0.75rem;
    padding: 0.4rem 0.5rem;
    width: 100%;
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    font-size: 0.85rem;
    padding: 0.45rem 0.65rem;
  }

  @media (min-width: 1025px) and (max-width: 1439px) {
    font-size: 0.95rem;
    padding: 0.5rem 0.7rem;
  }

  @media (min-width: 1440px) and (max-width: 1919px) {
    font-size: 1rem;
    padding: 0.5rem 0.9rem;
  }

  @media (min-width: 1920px) and (max-width: 2559px) {
    font-size: 1.2rem;
    padding: 0.7rem 1rem;
  }

  @media (min-width: 2560px) and (max-width: 3839px) {
    font-size: 1.35rem;
    padding: 0.8rem 1.1rem;
  }

  @media (min-width: 3840px) {
    font-size: 1.5rem;
    padding: 0.9rem 1.2rem;
  }
`;

export const TextArea = styled.textarea`
  border: 1px solid #052db4;
  border-radius: 6px;
  padding: 0.45rem 0.75rem;
  font-size: 0.9rem;
  resize: none;
  color: #1e293b;
  background-color: #fff;
  outline: none;
  box-sizing: border-box;

  /* Height equivalent to two Inputs stacked */
  min-height: calc(2 * 2.4em);

  /* Small devices */
  @media (max-width: 767px) {
    font-size: 0.75rem;
    padding: 0.4rem 0.5rem;
    min-height: calc(2 * 2.2em);
  }

  /* Tablets */
  @media (min-width: 768px) and (max-width: 1024px) {
    font-size: 0.85rem;
    padding: 0.45rem 0.65rem;
    min-height: calc(2 * 3.3em);
  }

  /* Desktops */
  @media (min-width: 1025px) and (max-width: 1439px) {
    font-size: 0.95rem;
    padding: 0.5rem 0.7rem;
    min-height: calc(2 * 3.2em);
  }

  /* Full HD */
  @media (min-width: 1440px) and (max-width: 1919px) {
    font-size: 1rem;
    padding: 0.5rem 0.9rem;
    min-height: calc(3 * 2.1em);
  }

  /* 2K */
  @media (min-width: 1920px) and (max-width: 2559px) {
    font-size: 1.2rem;
    padding: 0.7rem 1rem;
    min-height: calc(2 * 3.3em);
  }

  /* 2.5K–3K */
  @media (min-width: 2560px) and (max-width: 3839px) {
    font-size: 1.35rem;
    padding: 0.8rem 1.1rem;
    min-height: calc(2 * 3.2em);
  }

  /* 4K+ */
  @media (min-width: 3840px) {
    font-size: 1.5rem;
    padding: 0.9rem 1.2rem;
    min-height: calc(2 * 3.3em);
  }
`;



export const UploadWrappers = styled.div`
  position: relative;
  display: inline-block;
`;

export const ProfileLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border: 2px dashed #052db4;
  border-radius: 10px;
  cursor: pointer;
  background-color: #f8fafc;
  overflow: hidden;
  transition: 0.3s ease;

  &:hover {
    background-color: #e0e7ff;
    transform: scale(1.02);
  }

  /* Small devices */
  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
  }

  /* Tablets */
  @media (min-width: 481px) and (max-width: 768px) {
    width: 100px;
    height: 150px;
  }

  /* Medium screens (laptops) */
  @media (min-width: 769px) and (max-width: 1024px) {
    width: 120px;
    height: 150px;
  }


  @media (min-width: 1025px) and (max-width: 1440px) {
    width: 120px;
    height: 180px;
  }


  /* Large screens (2K) */
  @media (min-width: 1441px) and (max-width: 1920px) {
    width: 150px;
    height: 180px;
  }
@media (min-width: 1921px) and (max-width: 2560px) {
    width: 200px;
    height: 230px;
  }
  @media (min-width: 2561px) and (max-width: 3840px) {
    width: 200px;
    height: 250px;
  }
  /* 4K screens */
  @media (min-width: 3841px) {
    width: 200px;
    height: 280px;
  }
`;
export const ProfileImages = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const IconWrappers = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #052db4;
`;

export const PlusButtons = styled.label`
  position: absolute;
  bottom: 5px;
  right: 5px;
  background: #052db4;
  color: white;
  border-radius: 50%;
  font-size: 1rem;
  padding: 2px 6px;
  cursor: pointer;
  border: 2px solid white;
  transition: 0.3s ease;

  &:hover {
    background: #1e3a8a;
    transform: scale(1.1);
  }

  /* Responsive adjustments */
  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 1px 5px;
  }

  @media (min-width: 1441px) {
    font-size: 1.3rem;
    padding: 3px 8px;
  }

  @media (min-width: 2561px) {
    font-size: 1.6rem;
    padding: 4px 10px;
  }
`;

export const HiddenFileInputs = styled.input`
  display: none;
`;
export const ErrorText = styled.p`
  color: red;
  font-size: clamp(0.7rem, 0.8vw, 1rem); 
  margin-bottom: 0.3rem;
  font-weight: 200;

  /* Larger screens (4K) */
  @media (min-width: 3840px) {
    font-size: 1.8rem;
  }

  /* Ultra large screens (8K) */
  @media (min-width: 7680px) {
    font-size: 2rem;
  }
`;
export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const FieldLabel = styled.label`
  font-size: clamp(0.85rem, 0.9vw, 1.1rem);
  font-weight: 500;
  color: #1e3a8a;

  @media (min-width: 1920px) {
    font-size: 1.2rem;
  }

  @media (min-width: 3840px) {
    font-size: 1.8rem;
  }
`;

