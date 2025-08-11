import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

export const ModalContainer = styled.div`
  background: white;
  padding: 2.5rem;
  width: 90%;
  max-width: 500px;
  border-radius: 15px;
  text-align: center;
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
