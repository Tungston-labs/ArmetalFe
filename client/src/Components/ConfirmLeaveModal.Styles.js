import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000; /* higher than OnLeaveModal */
`;

export const ModalContainer = styled.div`
  background: white;
  padding: clamp(16px, 2vw, 30px);
  border-radius: 10px;
  max-height: 80%;
  width: clamp(280px, 60%, 600px); /* ✅ responsive width */
  overflow-y: auto;
  z-index: 2001; /* must be higher than overlay */
  pointer-events: auto;
`;

export const Message = styled.p`
  font-size: clamp(1rem, 2vw, 1.5rem);
  font-family: 'Satoshi', sans-serif;
  color: #000;
  margin-bottom: 2rem;

  @media (min-width: 3840px) { /* 4K */
    font-size: 2rem;
  }

  @media (min-width: 7680px) { /* 8K */
    font-size: 3rem;
  }
`;

export const BoldText = styled.span`
  font-weight: 700;
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap; /* ✅ prevents buttons from breaking on small screens */
`;

export const ModalButton = styled.button`
  flex: 1;
  min-width: 120px;
  height: clamp(40px, 5vh, 50px);
  border-radius: 10px;
  font-size: clamp(0.9rem, 1.2vw, 1.1rem);
  font-weight: 700;
  font-family: 'Satoshi', sans-serif;
  border: 2px solid transparent;
  color: white;
  background-color: ${({ variant }) =>
    variant === 'cancel' ? '#FF5C4C' : '#172554'};
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: scale(1.05);
  }

  @media (min-width: 3840px) { /* 4K */
    font-size: 1.4rem;
    height: 70px;
  }

  @media (min-width: 7680px) { /* 8K */
    font-size: 2rem;
    height: 90px;
  }
`;
