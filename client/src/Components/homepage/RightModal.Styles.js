import styled from "styled-components";

export const Panel = styled.div`
  position: fixed;
  top: 0;
  right: -400px;
  width: 320px;
  height: 100vh;
  background: #f4f8ffff;
  box-shadow: -2px 0 10px rgba(0,0,0,0.3);
  transition: right 0.3s ease;
  padding: 20px;
  z-index: 2000;
  border-top-left-radius: 20px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  &.open {
    right: 0;
  }

  @media (min-width: 1920px) {
    width: 350px;
  }
  @media (min-width: 2560px) {
    width: 350px;
  }  @media (min-width: 3840px) {
    width: 420px;
  }
  /* Tablets */
  @media (max-width: 992px) {
    width: 300px;
  }

  /* Mobile screens */
  @media (max-width: 600px) {
    width: 100%; 
    right: -100%;
    border-radius: 0;

    &.open {
      right: 0;
    }
  }
`;

export const CloseIcon = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 28px;
  cursor: pointer;
  color: #444;
  font-weight: bold;
  line-height: 1;

  &:hover {
    color: #000;
  }

  /* Larger close icon on mobile for easier touch */
  @media (max-width: 600px) {
    font-size: 32px;
    top: 16px;
    right: 16px;
  }
`;

export const Columns = styled.div`
  margin: 20px 0;

  /* Add spacing adjustments for mobile */
  @media (max-width: 600px) {
    margin: 15px 0;
  }
`;
