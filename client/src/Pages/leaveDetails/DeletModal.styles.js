import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  z-index: 1000;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export const ModalContainer = styled.div`
  background: #fff;
  padding: clamp(1.5rem, 2vw, 3rem);
  border-radius: clamp(8px, 1vw, 12px);
  text-align: center;
  max-width: 600px;
  min-width: 280px;
  width: 90%;
  box-sizing: border-box;
  animation: slideDown 0.3s ease;

  @media (min-width: 2560px) { max-width: 900px; }
  @media (min-width: 3840px) { max-width: 1200px; }

  @keyframes slideDown {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

export const ModalTitle = styled.h3`
  font-size: clamp(18px, 2vw, 36px); /* bigger max for 4K/8K */
  margin-bottom: clamp(0.5rem, 1vw, 1rem);
`;

export const ModalText = styled.p`
  font-size: clamp(14px, 1.2vw, 28px); /* increased max for large screens */
  line-height: 1.5;
  color: #333;

  @media (min-width: 2560px) { /* 4K screens */
    font-size: clamp(18px, 1.5vw, 32px);
  }

  @media (min-width: 3840px) { /* 8K screens */
    font-size: clamp(20px, 2vw, 36px);
  }
`;


export const ModalButtonWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: clamp(0.5rem, 1vw, 1rem);
  margin-top: clamp(0.8rem, 1vw, 1.5rem);
`;

export const ModalButton = styled.button`
  background-color: ${(props) => props.bg || "gray"};
  color: white;
  border: none;
  cursor: pointer;
  font-size: clamp(14px, 1vw, 28px); /* scale bigger on large screens */
  padding: clamp(0.5rem, 1vw, 1.5rem) clamp(1rem, 2vw, 2rem);
  border-radius: clamp(6px, 0.8vw, 12px);
  min-width: 100px;
  max-width: 300px; /* prevents huge buttons on 4K/8K */
  
  &:last-child {
    margin-right: 0;
  }

  @media (min-width: 2560px) { /* 4K screens */
    max-width: 350px;
    font-size: clamp(18px, 1.5vw, 32px);
    padding: clamp(0.7rem, 1.5vw, 2rem) clamp(1.5rem, 3vw, 2.5rem);
  }

  @media (min-width: 3840px) { /* 8K screens */
    max-width: 400px;
    font-size: clamp(20px, 2vw, 36px);
    padding: clamp(1rem, 2vw, 2.5rem) clamp(2rem, 4vw, 3rem);
  }
`;
