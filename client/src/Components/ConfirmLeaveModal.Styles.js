import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

export const ModalContainer = styled.div`
  background: white;
  padding: 24px;
  border-radius: 10px;
  max-height: 80%;
  overflow-y: auto;
  z-index: 2001;
  pointer-events: auto;
`;

export const Message = styled.p`
  font-size: 16px;
  font-family: 'Satoshi', sans-serif;
  color: #000;
  margin-bottom: 24px;
`;

export const BoldText = styled.span`
  font-weight: 700;
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
`;

export const ModalButton = styled.button`
  flex: 1;
  min-width: 120px;
  height: 45px;
  border-radius: 10px;
  font-size: 16px;
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
`;