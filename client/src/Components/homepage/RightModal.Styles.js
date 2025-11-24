// RightModal.Styles.js
import styled from "styled-components";

export const Panel = styled.div`
  width: 300px;
  height: 100vh;
  position: fixed;
  right: -300px;
  top: 0;
  background: #fff;
  box-shadow: -2px 0px 10px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  z-index: 20;
  padding: 20px;

  &.open {
    right: 0;
  }
`;
