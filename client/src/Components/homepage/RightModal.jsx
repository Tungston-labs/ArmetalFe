// RightModal.jsx
import React from "react";
import { Panel } from "./RightModal.Styles";

const RightModal = ({ open, onClose }) => {
  return (
    <Panel className={open ? "open" : ""}>
      <button onClick={onClose}>Close</button>
    </Panel>
  );
};

export default RightModal;
