import React, { useState } from "react";
import RightSideModal from "./RightSideModal";
const EmployeeDashboard = () => {
  const [open, setOpen] = useState(false);
  const handleEdit = () => {
    alert("Edit Mode Activated!");
  };
  return (
    <>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      <RightSideModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onEdit={handleEdit}
      >
        <h2>Employee Details</h2>
        <p>All employee info here …</p>
      </RightSideModal>
    </>
  );
};
export default EmployeeDashboard;
