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
  padding: 30px;
  border-radius: 10px;
  max-height: 80%;
  overflow-y: auto;
  z-index: 2001; /* must be higher than overlay */
  pointer-events: auto;
`;


export const Message = styled.p`
  font-size: 24px;
  font-family: Satoshi;
  color: #000;
  margin-bottom: 2rem;
`;

export const BoldText = styled.span`
  font-weight: 700;
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
`;

export const ModalButton = styled.button`
  flex: 1;
  height: 50px;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 700;
  font-family: 'Satoshi', sans-serif;
  border: 2px solid transparent;
  color: white;
  background-color: ${({ variant }) =>
    variant === 'cancel' ? '#FF5C4C' : '#172554'};

  &:hover {
    opacity: 0.9;
  }
`;
