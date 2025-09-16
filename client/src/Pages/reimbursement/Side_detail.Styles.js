import styled, { keyframes } from "styled-components";

// Slide-in animation from the right
const slideIn = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: flex-end; /* push content to right */
  z-index: 2000;
`;

export const ModalContent = styled.div`
  // background: white;
  width: 80%;
  max-width: 700px;
  height: 100%;
  overflow-y: auto;
  padding: 1.5rem;
  box-shadow: -2px 0 6px rgba(0,0,0,0.2);

  animation: ${slideIn} 0.3s ease-out; /* smooth slide in */
`;

/* existing styles */
export const PageWrapper = styled.div`
  background: #f5f5f5;
  min-height: 100%;
  padding: 1rem;
  border-radius: 8px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const Title = styled.h2`
  color: #1a2f87;
  font-size: 1.5rem;
`;

export const CloseButton = styled.button`
  background: #2f52e0;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
`;

export const DateHeading = styled.h4`
  font-weight: 600;
  margin: 1.5rem 0 0.8rem 0;
`;

export const Card = styled.div`
  display: flex;
  align-items: center;
  background: white;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 0.8rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

export const ProfileImage = styled.img`
  width: 55px;
  height: 55px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
`;

export const Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

export const Label = styled.div`
  font-size: 0.7rem;
  color: gray;
`;

export const Value = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  // border-bottom: 1px solid #eee;
`;

export const RightSection = styled.div`
  display: flex;
  // align-items: center;
  gap: 2rem;
  //  border-bottom: 1px solid #eee;
`;

export const Amount = styled.div`
  font-size: 1rem;
  font-weight: bold;
  color: #2f52e0;
`;
