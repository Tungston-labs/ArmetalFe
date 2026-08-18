import React, { useState } from "react";
import RightSideModal from "./RightSideModal";

const DemoPage = () => {
  const [open, setOpen] = useState(false);

  const employee = {
    profileImage: "https://via.placeholder.com/150",
    name: "John Doe",
    position: "Software Engineer",
    joiningDate: "2023-02-15",
    email: "john@example.com",
    employeeType: "Full-Time",
    department: "Development",
    employeeId: "EMP12345",
    role: "Employee ",
    workingProject: "Rekory",
  };

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Employee Modal</button>

      <RightSideModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onEdit={() => alert("Edit clicked")}
        employee={employee}
      />
    </>
  );
};

export default DemoPage;
