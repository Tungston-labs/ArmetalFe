import styled from "styled-components";

export const Panel = styled.div`
  position: fixed;
  top: 0;
  right: -400px;
  width: 320px;
  height: 100vh;
 background: #f4f8ffff;
  box-shadow: -2px 0 10px rgba(0,0,0,0.3);
  transition: 0.3s ease;
  padding: 20px;
  z-index: 2000;
  border-top-left-radius: 20px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  &.open {
    right: 0;
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
`;

export const Columns = styled.div`
 margin-bottom:20px;
margin:20px 0px;
`;
